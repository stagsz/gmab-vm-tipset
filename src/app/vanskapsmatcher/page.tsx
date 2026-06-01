'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Lock, Save, RefreshCw } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { usePlayer } from '@/context/PlayerContext';
import { supabase } from '@/lib/supabase';

interface FriendlyMatch {
  id: number;
  match_nr: number;
  match_date: string;
  home_team: string;
  away_team: string;
  home_goals: number | null;
  away_goals: number | null;
  status: string;
}

interface FriendlyPrediction {
  id?: number;
  player_id: string;
  match_id: number;
  home_goals: number;
  away_goals: number;
}

interface PlayerRow {
  id: string;
  name: string;
}

function isMatchLocked(matchDate: string): boolean {
  return Date.now() >= new Date(matchDate).getTime() - 5 * 60 * 1000;
}

function calcSign(home: string, away: string): string {
  const h = parseInt(home, 10), a = parseInt(away, 10);
  if (isNaN(h) || isNaN(a)) return '';
  return h > a ? '1' : h === a ? 'X' : '2';
}

function calcPoints(predHome: number, predAway: number, resultHome: number, resultAway: number): number {
  if (predHome === resultHome && predAway === resultAway) return 3;
  const sign = (h: number, a: number) => h > a ? 1 : h < a ? -1 : 0;
  if (sign(predHome, predAway) === sign(resultHome, resultAway)) return 1;
  return 0;
}

export default function VanskapsmatcherPage() {
  const { t } = useLocale();
  const { player } = usePlayer();

  const [matches, setMatches] = useState<FriendlyMatch[]>([]);
  const [myPreds, setMyPreds] = useState<Record<number, { home: string; away: string }>>({});
  const [allPreds, setAllPreds] = useState<FriendlyPrediction[]>([]);
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [adminScores, setAdminScores] = useState<Record<number, { home: string; away: string }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [adminSaved, setAdminSaved] = useState<Record<number, boolean>>({});
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setFetching(true);

      const [matchesRes, allPredsRes, playersRes] = await Promise.all([
        supabase.from('friendly_matches').select('*').order('match_date', { ascending: true }),
        supabase.from('friendly_predictions').select('*'),
        supabase.from('players').select('id, name'),
      ]);

      const matchData = matchesRes.data as FriendlyMatch[] | null;
      if (matchData) {
        setMatches(matchData);
        const initialAdminScores: Record<number, { home: string; away: string }> = {};
        for (const m of matchData) {
          initialAdminScores[m.id] = {
            home: m.home_goals?.toString() ?? '',
            away: m.away_goals?.toString() ?? '',
          };
        }
        setAdminScores(initialAdminScores);
      }

      if (allPredsRes.data) setAllPreds(allPredsRes.data as FriendlyPrediction[]);
      if (playersRes.data) setPlayers(playersRes.data as PlayerRow[]);

      if (player && matchData) {
        const { data: myPredData } = await supabase
          .from('friendly_predictions')
          .select('*')
          .eq('player_id', player.id);

        if (myPredData) {
          const predsMap: Record<number, { home: string; away: string }> = {};
          for (const p of myPredData as FriendlyPrediction[]) {
            predsMap[p.match_id] = {
              home: p.home_goals.toString(),
              away: p.away_goals.toString(),
            };
          }
          setMyPreds(predsMap);
        }
      }

      setFetching(false);
    }

    fetchData();
  }, [player]);

  async function handleSaveTips() {
    if (!player) return;
    setSaving(true);
    const rows = matches
      .filter(m => !isMatchLocked(m.match_date))
      .map(m => {
        const pred = myPreds[m.id];
        if (!pred || pred.home === '' || pred.away === '') return null;
        return {
          player_id: player.id,
          match_id: m.id,
          home_goals: parseInt(pred.home, 10),
          away_goals: parseInt(pred.away, 10),
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    if (rows.length > 0) {
      await supabase.from('friendly_predictions').upsert(rows, { onConflict: 'player_id,match_id' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleAdminSaveResult(matchId: number) {
    const scores = adminScores[matchId];
    if (!scores || scores.home === '' || scores.away === '') return;
    await supabase.from('friendly_matches')
      .update({
        home_goals: parseInt(scores.home, 10),
        away_goals: parseInt(scores.away, 10),
        status: 'finished',
      })
      .eq('id', matchId);
    setAdminSaved(prev => ({ ...prev, [matchId]: true }));
    setTimeout(() => setAdminSaved(prev => ({ ...prev, [matchId]: false })), 2500);
    const { data } = await supabase.from('friendly_matches').select('*').order('match_date', { ascending: true });
    if (data) setMatches(data as FriendlyMatch[]);
    const { data: predsData } = await supabase.from('friendly_predictions').select('*');
    if (predsData) setAllPreds(predsData as FriendlyPrediction[]);
  }

  async function handleSync() {
    setSyncing(true);
    try {
      await fetch('/api/sync-friendly-scores');
      const { data } = await supabase.from('friendly_matches').select('*').order('match_date', { ascending: true });
      if (data) setMatches(data as FriendlyMatch[]);
      const { data: predsData } = await supabase.from('friendly_predictions').select('*');
      if (predsData) setAllPreds(predsData as FriendlyPrediction[]);
    } finally {
      setSyncing(false);
    }
  }

  const playerMap = new Map<string, string>(players.map(p => [p.id, p.name]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.friendly.title}</h1>
        <p className="text-gray-400 text-sm mt-1">{t.friendly.description}</p>
      </div>

      {player?.is_admin && (
        <div className="flex justify-end">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            {syncing ? t.friendly.syncing : t.friendly.syncScores}
          </button>
        </div>
      )}

      {fetching && <p className="text-gray-400">{t.common.loading}</p>}

      {!fetching && matches.length === 0 && (
        <p className="text-gray-400">{t.friendly.noMatches}</p>
      )}

      {matches.map(match => {
        const locked = isMatchLocked(match.match_date);
        const finished = match.status === 'finished' && match.home_goals !== null && match.away_goals !== null;
        const pred = myPreds[match.id] ?? { home: '', away: '' };
        const sign = calcSign(pred.home, pred.away);

        const dateStr = new Date(match.match_date).toLocaleDateString('sv-SE', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
        const timeStr = new Date(match.match_date).toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const matchPreds = allPreds
          .filter(p => p.match_id === match.id)
          .map(p => ({
            pred: p,
            name: playerMap.get(p.player_id) ?? p.player_id,
            points: finished
              ? calcPoints(p.home_goals, p.away_goals, match.home_goals as number, match.away_goals as number)
              : null,
          }))
          .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

        return (
          <div key={match.id} className="rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-900">
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="text-xs text-gray-400">{dateStr} {timeStr}</span>
              <span className="flex-1 text-center text-sm font-semibold text-white">
                {match.home_team} {t.common.vs} {match.away_team}
              </span>
              {locked && <Lock className="h-4 w-4 text-gray-500 shrink-0" />}
            </div>

            {/* Body */}
            <div className="px-4 py-4 bg-gray-950">
              {finished ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-green-400">
                      {match.home_goals} - {match.away_goals}
                    </span>
                  </div>
                  {matchPreds.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        {t.friendly.allPredictions}
                      </p>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-gray-500 border-b border-gray-800">
                            <th className="text-left pb-1">{t.friendly.player}</th>
                            <th className="text-center pb-1">{t.friendly.prediction}</th>
                            <th className="text-right pb-1">{t.friendly.points}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {matchPreds.map(({ pred: p, name, points }) => (
                            <tr key={p.player_id}>
                              <td className="py-1.5 text-gray-300">{name}</td>
                              <td className="py-1.5 text-center text-gray-300">
                                {p.home_goals} - {p.away_goals}
                              </td>
                              <td className="py-1.5 text-right font-semibold text-green-400">
                                {points}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : locked ? (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  {t.friendly.matchLocked}
                </p>
              ) : !player ? (
                <p className="text-sm text-gray-400">
                  <Link href="/" className="text-green-400 hover:text-green-300 underline">
                    {t.friendly.loginPrompt}
                  </Link>
                </p>
              ) : (
                <div className="flex items-center gap-3 justify-center">
                  <span className="text-sm text-gray-300">{match.home_team}</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={pred.home}
                    onChange={e => {
                      const val = e.target.value;
                      if (val !== '' && !/^\d{0,2}$/.test(val)) return;
                      setMyPreds(prev => ({ ...prev, [match.id]: { ...prev[match.id] ?? { home: '', away: '' }, home: val } }));
                    }}
                    className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 focus:border-green-500 focus:outline-none"
                    placeholder="-"
                  />
                  <span className="text-gray-500 text-sm">-</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={pred.away}
                    onChange={e => {
                      const val = e.target.value;
                      if (val !== '' && !/^\d{0,2}$/.test(val)) return;
                      setMyPreds(prev => ({ ...prev, [match.id]: { ...prev[match.id] ?? { home: '', away: '' }, away: val } }));
                    }}
                    className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 focus:border-green-500 focus:outline-none"
                    placeholder="-"
                  />
                  <span className="text-sm text-gray-300">{match.away_team}</span>
                  <span
                    className={`w-7 text-center text-xs font-bold shrink-0 ${
                      sign === '1'
                        ? 'text-green-400'
                        : sign === 'X'
                        ? 'text-yellow-400'
                        : sign === '2'
                        ? 'text-blue-400'
                        : 'text-gray-600'
                    }`}
                  >
                    {sign || '-'}
                  </span>
                </div>
              )}
            </div>

            {/* Admin section */}
            {player?.is_admin && (
              <div className="border-t border-gray-800 bg-gray-900/50 px-4 py-3 flex items-center gap-3">
                <span className="text-xs text-gray-500">{t.friendly.adminSection}:</span>
                <input
                  type="number"
                  min={0}
                  value={adminScores[match.id]?.home ?? ''}
                  onChange={e =>
                    setAdminScores(prev => ({
                      ...prev,
                      [match.id]: { ...prev[match.id] ?? { home: '', away: '' }, home: e.target.value },
                    }))
                  }
                  className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 focus:border-green-500 focus:outline-none"
                  placeholder="-"
                />
                <span className="text-gray-500 text-sm">-</span>
                <input
                  type="number"
                  min={0}
                  value={adminScores[match.id]?.away ?? ''}
                  onChange={e =>
                    setAdminScores(prev => ({
                      ...prev,
                      [match.id]: { ...prev[match.id] ?? { home: '', away: '' }, away: e.target.value },
                    }))
                  }
                  className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 focus:border-green-500 focus:outline-none"
                  placeholder="-"
                />
                <button
                  onClick={() => handleAdminSaveResult(match.id)}
                  className="rounded bg-green-700 px-3 py-1 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
                >
                  {adminSaved[match.id] ? t.friendly.resultSaved : t.friendly.saveResult}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {player && !fetching && matches.some(m => !isMatchLocked(m.match_date)) && (
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSaveTips}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-colors disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saved ? t.friendly.saved : saving ? t.common.loading : t.friendly.save}
          </button>
        </div>
      )}
    </div>
  );
}
