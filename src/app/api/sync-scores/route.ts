import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WC_LEAGUE_ID = process.env.API_FOOTBALL_LEAGUE_ID ?? '1';
const WC_SEASON = '2026';

// Common name discrepancies between our data and api-football.com
const ALIASES: Record<string, string> = {
  'united states': 'usa',
  'us': 'usa',
  'korea republic': 'south korea',
  'republic of korea': 'south korea',
  "côte d'ivoire": 'ivory coast',
  "cote d'ivoire": 'ivory coast',
  'ir iran': 'iran',
  'trinidad & tobago': 'trinidad and tobago',
};

function normalize(name: string): string {
  const lower = name.toLowerCase().trim().replace(/\./g, '').replace(/&/g, 'and');
  return ALIASES[lower] ?? lower;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API_FOOTBALL_KEY not configured. Add it to Vercel environment variables.' },
      { status: 503 }
    );
  }

  // Fetch finished fixtures from api-football.com
  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?league=${WC_LEAGUE_ID}&season=${WC_SEASON}&status=FT`,
    {
      headers: { 'x-apisports-key': apiKey },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `API request failed: ${res.status}` }, { status: 502 });
  }

  const json = await res.json();
  const fixtures: ApiFixture[] = json.response ?? [];

  // Load our matches from Supabase
  const { data: matches } = await supabase
    .from('matches')
    .select('id, home_team, away_team, status');

  if (!matches) {
    return NextResponse.json({ error: 'Could not load matches from Supabase' }, { status: 500 });
  }

  let updated = 0;
  const skipped: string[] = [];

  for (const fixture of fixtures) {
    const homeApi = normalize(fixture.teams.home.name);
    const awayApi = normalize(fixture.teams.away.name);
    const homeGoals = fixture.goals.home;
    const awayGoals = fixture.goals.away;

    if (homeGoals === null || awayGoals === null) continue;

    const match = matches.find(
      (m) => normalize(m.home_team) === homeApi && normalize(m.away_team) === awayApi
    );

    if (!match) {
      skipped.push(`${fixture.teams.home.name} vs ${fixture.teams.away.name}`);
      continue;
    }

    await supabase
      .from('matches')
      .update({ home_goals: homeGoals, away_goals: awayGoals, status: 'finished' })
      .eq('id', match.id);

    updated++;
  }

  return NextResponse.json({
    updated,
    total: fixtures.length,
    skipped: skipped.length > 0 ? skipped : undefined,
  });
}

interface ApiFixture {
  teams: { home: { name: string }; away: { name: string } };
  goals: { home: number | null; away: number | null };
}
