'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { matches, bonusQuestions, BonusQuestionKey } from '@/data/matches';

interface PlayerEntry {
  name: string;
  matchPoints: number;
  bonusPoints: number;
  total: number;
}

type Results = Record<number, { home: number; away: number }>;
type BonusResults = Partial<Record<BonusQuestionKey, string>>;

function calcSign(home: number, away: number): string {
  if (home > away) return '1';
  if (home === away) return 'X';
  return '2';
}

function scoreMatch(
  predHome: string,
  predAway: string,
  resHome: number,
  resAway: number
): number {
  const h = parseInt(predHome, 10);
  const a = parseInt(predAway, 10);
  if (isNaN(h) || isNaN(a)) return 0;
  if (h === resHome && a === resAway) return 3;
  if (calcSign(h, a) === calcSign(resHome, resAway)) return 1;
  return 0;
}

export default function LeaderboardPage() {
  const { t } = useLocale();
  const [entries, setEntries] = useState<PlayerEntry[]>([]);

  useEffect(() => {
    // Gather all player prediction keys from localStorage
    const playerEntries: PlayerEntry[] = [];
    const resultsRaw = localStorage.getItem('gmab_admin_results');
    const adminBonusRaw = localStorage.getItem('gmab_admin_bonus_results');
    const results: Results = resultsRaw ? JSON.parse(resultsRaw) : {};
    const bonusResults: BonusResults = adminBonusRaw ? JSON.parse(adminBonusRaw) : {};

    const hasResults = Object.keys(results).length > 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('gmab_predictions_')) continue;
      const playerName = key.replace('gmab_predictions_', '');
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      let matchPoints = 0;
      if (hasResults) {
        try {
          const preds: Record<number, { home: string; away: string }> = JSON.parse(raw);
          for (const match of matches) {
            const res = results[match.match_nr];
            if (!res) continue;
            const pred = preds[match.match_nr];
            if (!pred) continue;
            matchPoints += scoreMatch(pred.home, pred.away, res.home, res.away);
          }
        } catch {
          // ignore
        }
      }

      let bonusPoints = 0;
      const bonusRaw = localStorage.getItem(`gmab_bonus_${playerName}`);
      if (bonusRaw) {
        try {
          const bonusPreds: Partial<Record<BonusQuestionKey, string>> = JSON.parse(bonusRaw);
          for (const bq of bonusQuestions) {
            const answer = bonusPreds[bq.key]?.trim().toLowerCase();
            const correct = bonusResults[bq.key]?.trim().toLowerCase();
            if (answer && correct && answer === correct) {
              bonusPoints += bq.points;
            }
          }
        } catch {
          // ignore
        }
      }

      playerEntries.push({
        name: playerName,
        matchPoints,
        bonusPoints,
        total: matchPoints + bonusPoints,
      });
    }

    playerEntries.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
    setEntries(playerEntries);
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

      {entries.length === 0 ? (
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
                key={entry.name}
                className={`grid grid-cols-[2.5rem_1fr_6rem_6rem_6rem] gap-0 px-4 py-3 border-b border-gray-800 last:border-b-0 text-sm transition-colors ${
                  rank <= 3 ? 'bg-gray-900/60' : 'bg-gray-950'
                } hover:bg-gray-900`}
              >
                <div className="flex items-center">{rankIcon(rank)}</div>
                <div className={`font-medium ${rank <= 3 ? rankColor(rank) : 'text-white'}`}>
                  {entry.name}
                </div>
                <div className="text-right text-gray-300">{entry.matchPoints}</div>
                <div className="text-right text-gray-300">{entry.bonusPoints}</div>
                <div className={`text-right font-bold ${rank <= 3 ? rankColor(rank) : 'text-white'}`}>
                  {entry.total}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
