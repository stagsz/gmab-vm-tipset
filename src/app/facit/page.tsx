'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, X } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { usePlayer } from '@/context/PlayerContext';
import { supabase } from '@/lib/supabase';

interface FacitRow {
  match_nr: number;
  match_date: string;
  group_letter: string;
  home_team: string;
  away_team: string;
  result_home: number;
  result_away: number;
  player_id: string;
  player_name: string;
  pred_home: number;
  pred_away: number;
  points: number;
}

interface MatchGroup {
  match_nr: number;
  match_date: string;
  group_letter: string;
  home_team: string;
  away_team: string;
  result_home: number;
  result_away: number;
  rows: FacitRow[];
}

export default function FacitPage() {
  const { t } = useLocale();
  const { player } = usePlayer();
  const [rows, setRows] = useState<FacitRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacit() {
      setLoading(true);
      const { data } = await supabase.from('match_facit').select('*');
      if (data) setRows(data as FacitRow[]);
      setLoading(false);
    }
    fetchFacit();
  }, []);

  // Group rows by match, newest match first; players sorted by points desc then name.
  const matches: MatchGroup[] = (() => {
    const byNr = new Map<number, MatchGroup>();
    for (const r of rows) {
      let g = byNr.get(r.match_nr);
      if (!g) {
        g = {
          match_nr: r.match_nr,
          match_date: r.match_date,
          group_letter: r.group_letter,
          home_team: r.home_team,
          away_team: r.away_team,
          result_home: r.result_home,
          result_away: r.result_away,
          rows: [],
        };
        byNr.set(r.match_nr, g);
      }
      g.rows.push(r);
    }
    const list = Array.from(byNr.values());
    list.sort((a, b) => b.match_date.localeCompare(a.match_date) || b.match_nr - a.match_nr);
    for (const g of list) {
      g.rows.sort((a, b) => b.points - a.points || a.player_name.localeCompare(b.player_name));
    }
    return list;
  })();

  if (!player) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center space-y-4">
        <p className="text-gray-400 text-lg">{t.auth.enterCode}</p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
        >
          {t.auth.join}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">{t.facit.title}</h1>

      {loading ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-12 text-center text-gray-400">
          {t.common.loading}
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-12 text-center text-gray-400">
          {t.facit.noResults}
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m) => (
            <div key={m.match_nr} className="rounded-xl border border-gray-800 overflow-hidden">
              {/* Match header: result */}
              <div className="flex items-center gap-3 bg-gray-900 px-4 py-3 border-b border-gray-800">
                <span className="shrink-0 w-12 text-center rounded-md bg-gray-800 px-2 py-0.5 text-xs font-semibold text-gray-300">
                  {t.predictions.group} {m.group_letter}
                </span>
                <span className="flex-1 text-right text-sm text-gray-200 truncate">{m.home_team}</span>
                <span className="shrink-0 font-mono font-bold text-white text-sm">
                  {m.result_home} – {m.result_away}
                </span>
                <span className="flex-1 text-left text-sm text-gray-200 truncate">{m.away_team}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-gray-500">
                  {t.matches.finished}
                </span>
              </div>

              {/* Per-player breakdown */}
              <div className="divide-y divide-gray-800">
                {m.rows.map((r) => {
                  const isMe = r.player_id === player.id;
                  const marker =
                    r.points === 4
                      ? { Icon: CheckCircle2, color: 'text-green-400', label: t.facit.exact }
                      : r.points === 1
                      ? { Icon: Circle, color: 'text-yellow-400', label: t.facit.sign }
                      : { Icon: X, color: 'text-gray-600', label: t.facit.miss };
                  const { Icon } = marker;
                  return (
                    <div
                      key={r.player_id}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                        isMe ? 'bg-green-950/30' : 'bg-gray-950'
                      }`}
                    >
                      <span className={`flex-1 truncate ${isMe ? 'font-semibold text-white' : 'text-gray-300'}`}>
                        {r.player_name.trim()}
                        {isMe ? ` ${t.predictions.youSuffix}` : ''}
                      </span>
                      <span className="shrink-0 w-12 text-center font-mono text-gray-200">
                        {r.pred_home}–{r.pred_away}
                      </span>
                      <span className={`shrink-0 flex items-center gap-1 w-20 ${marker.color}`}>
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-xs">{marker.label}</span>
                      </span>
                      <span
                        className={`shrink-0 w-10 text-right font-semibold ${
                          r.points > 0 ? 'text-green-400' : 'text-gray-600'
                        }`}
                      >
                        {r.points > 0 ? `+${r.points}` : '0'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
