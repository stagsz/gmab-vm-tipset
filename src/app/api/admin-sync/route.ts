import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Apify returns English names; our DB uses Swedish names.
const EN_TO_SV: Record<string, string> = {
  'mexico': 'mexiko',
  'south africa': 'sydafrika',
  'south korea': 'sydkorea',
  'canada': 'kanada',
  'bosnia and herzegovina': 'bosnien-hercegovina',
  'switzerland': 'schweiz',
  'brazil': 'brasilien',
  'morocco': 'marocko',
  'scotland': 'skottland',
  'united states': 'usa',
  'australia': 'australien',
  'türkiye': 'turkiet',
  'turkey': 'turkiet',
  'germany': 'tyskland',
  'curacao': 'curaçao',
  "côte d'ivoire": 'elfenbenskusten',
  "cote d'ivoire": 'elfenbenskusten',
  'ivory coast': 'elfenbenskusten',
  'netherlands': 'nederländerna',
  'sweden': 'sverige',
  'tunisia': 'tunisien',
  'belgium': 'belgien',
  'egypt': 'egypten',
  'new zealand': 'nya zeeland',
  'spain': 'spanien',
  'cape verde': 'kap verde',
  'saudi arabia': 'saudiarabien',
  'france': 'frankrike',
  'iraq': 'irak',
  'norway': 'norge',
  'algeria': 'algeriet',
  'austria': 'österrike',
  'jordan': 'jordanien',
  'dr congo': 'kongo',
  'congo dr': 'kongo',
  'democratic republic of congo': 'kongo',
  'croatia': 'kroatien',
};

function toSv(name: string): string {
  const key = name.toLowerCase().trim();
  return EN_TO_SV[key] ?? key;
}

interface ApifyFixture {
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
}

export async function GET() {
  const datasetUrl = process.env.APIFY_DATASET_URL;
  if (!datasetUrl) {
    return NextResponse.json({ error: 'APIFY_DATASET_URL not configured' }, { status: 503 });
  }

  let fixtures: ApifyFixture[];
  try {
    const res = await fetch(datasetUrl, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`Apify returned ${res.status}`);
    fixtures = await res.json();
  } catch (err) {
    return NextResponse.json({ error: `Apify fetch failed: ${String(err)}` }, { status: 502 });
  }

  const finished = fixtures.filter(
    (f) => f.home_score !== null && f.away_score !== null
  );

  if (finished.length === 0) {
    return NextResponse.json({ updated: 0, total: fixtures.length, message: 'No finished matches in dataset yet' });
  }

  const { data: matches } = await supabase
    .from('matches')
    .select('id, home_team, away_team');

  if (!matches) {
    return NextResponse.json({ error: 'Could not load matches from Supabase' }, { status: 500 });
  }

  let updated = 0;
  const skipped: string[] = [];

  for (const fixture of finished) {
    const homeSv = toSv(fixture.home_team);
    const awaySv = toSv(fixture.away_team);

    const match = matches.find(
      (m) =>
        m.home_team.toLowerCase() === homeSv &&
        m.away_team.toLowerCase() === awaySv
    );

    if (!match) {
      skipped.push(`${fixture.home_team} vs ${fixture.away_team}`);
      continue;
    }

    await supabase
      .from('matches')
      .update({ home_goals: fixture.home_score, away_goals: fixture.away_score, status: 'finished' })
      .eq('id', match.id);

    updated++;
  }

  return NextResponse.json({
    updated,
    total: fixtures.length,
    finished: finished.length,
    ...(skipped.length > 0 && { skipped }),
  });
}
