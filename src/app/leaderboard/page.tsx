'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { supabase } from '@/lib/supabase';

interface LeaderboardEntry {
  player_id: string;
  name: string;
  match_points: number;
  bonus_points: number;
  total_points: number;
}

export default function LeaderboardPage() {
  const { t } = useLocale();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const { data } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_points', { ascending: false });

      if (data) {
        setEntries(data as LeaderboardEntry[]);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const rankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-500';
  };

  const rankIcon = (rank: number) => {
    if (rank <= 3)
      return <Trophy className={`h-4 w-4 ${rankColor(rank)}`} />;
    return <span className={`text-sm font-medium ${rankColor(rank)}`}>{rank}</span>;
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">{t.leaderboard.title}</h1>

      {loading ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-12 text-center text-gray-400">
          {t.common.loading}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-12 text-center text-gray-400">
          {t.leaderboard.noPlayers}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[2.5rem_1fr_6rem_6rem_6rem] gap-0 bg-gray-900 border-b border-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <div>{t.leaderboard.rank}</div>
            <div>{t.leaderboard.player}</div>
            <div className="text-right">{t.leaderboard.matchPoints}</div>
            <div className="text-right">{t.leaderboard.bonusPoints}</div>
            <div className="text-right">{t.leaderboard.totalPoints}</div>
          </div>

          {entries.map((entry, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={entry.player_id}
                className={`grid grid-cols-[2.5rem_1fr_6rem_6rem_6rem] gap-0 px-4 py-3 border-b border-gray-800 last:border-b-0 text-sm transition-colors ${
                  rank <= 3 ? 'bg-gray-900/60' : 'bg-gray-950'
                } hover:bg-gray-900`}
              >
                <div className="flex items-center">{rankIcon(rank)}</div>
                <div className={`font-medium ${rank <= 3 ? rankColor(rank) : 'text-white'}`}>
                  {entry.name}
                </div>
                <div className="text-right text-gray-300">{entry.match_points}</div>
                <div className="text-right text-gray-300">{entry.bonus_points}</div>
                <div className={`text-right font-bold ${rank <= 3 ? rankColor(rank) : 'text-white'}`}>
                  {entry.total_points}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
