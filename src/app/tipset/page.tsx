'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Save, Lock } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { usePlayer } from '@/context/PlayerContext';
import { matches, groups, bonusQuestions, DEADLINE, BonusQuestionKey } from '@/data/matches';

type ScorePrediction = { home: string; away: string };
type Predictions = Record<number, ScorePrediction>;
type BonusAnswers = Partial<Record<BonusQuestionKey, string>>;

const LS_KEY_PREFIX = 'gmab_predictions_';
const LS_BONUS_PREFIX = 'gmab_bonus_';

function calcSign(home: string, away: string): string {
  const h = parseInt(home, 10);
  const a = parseInt(away, 10);
  if (isNaN(h) || isNaN(a)) return '';
  if (h > a) return '1';
  if (h === a) return 'X';
  return '2';
}

export default function TipsetPage() {
  const { t } = useLocale();
  const { player } = usePlayer();
  const [predictions, setPredictions] = useState<Predictions>({});
  const [bonus, setBonus] = useState<BonusAnswers>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g) => [g, true]))
  );
  const [saved, setSaved] = useState(false);

  const isLocked = new Date() > DEADLINE;
  const storageKey = player ? `${LS_KEY_PREFIX}${player.name}` : null;
  const bonusKey = player ? `${LS_BONUS_PREFIX}${player.name}` : null;

  useEffect(() => {
    if (!storageKey || !bonusKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setPredictions(JSON.parse(raw));
      const rawB = localStorage.getItem(bonusKey);
      if (rawB) setBonus(JSON.parse(rawB));
    } catch {
      // ignore corrupt data
    }
  }, [storageKey, bonusKey]);

  function setScore(matchNr: number, side: 'home' | 'away', val: string) {
    // Allow only empty or non-negative integers
    if (val !== '' && !/^\d{0,2}$/.test(val)) return;
    setPredictions((prev) => ({
      ...prev,
      [matchNr]: { ...prev[matchNr], [side]: val },
    }));
    setSaved(false);
  }

  function handleSave() {
    if (!storageKey || !bonusKey) return;
    localStorage.setItem(storageKey, JSON.stringify(predictions));
    localStorage.setItem(bonusKey, JSON.stringify(bonus));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleGroup(g: string) {
    setOpenGroups((prev) => ({ ...prev, [g]: !prev[g] }));
  }

  const bonusLabels: Record<BonusQuestionKey, string> = {
    top_scorer: t.predictions.topScorer,
    champion: t.predictions.champion,
    bronze_winner: t.predictions.bronzeWinner,
    most_goals_group: t.predictions.mostGoalsGroup,
    most_conceded_group: t.predictions.mostConcededGroup,
  };

  const bonusPts: Record<BonusQuestionKey, string> = {
    top_scorer: t.predictions.topScorerPts,
    champion: t.predictions.championPts,
    bronze_winner: t.predictions.bronzeWinnerPts,
    most_goals_group: t.predictions.mostGoalsGroupPts,
    most_conceded_group: t.predictions.mostConcededGroupPts,
  };

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
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t.predictions.title}</h1>
        {isLocked && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-900/40 border border-red-800 px-3 py-1 text-xs text-red-400">
            <Lock className="h-3.5 w-3.5" />
            {t.predictions.locked}
          </span>
        )}
      </div>

      {/* Groups */}
      {groups.map((group) => {
        const groupMatches = matches.filter((m) => m.group === group);
        const open = openGroups[group];

        return (
          <div key={group} className="rounded-xl border border-gray-800 overflow-hidden">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              <span className="font-semibold text-white text-sm">
                {t.predictions.group} {group}
              </span>
              {open ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {open && (
              <div className="divide-y divide-gray-800">
                {groupMatches.map((match) => {
                  const pred = predictions[match.match_nr] ?? { home: '', away: '' };
                  const sign = calcSign(pred.home, pred.away);

                  return (
                    <div
                      key={match.match_nr}
                      className="flex items-center gap-2 px-4 py-3 bg-gray-950 text-sm"
                    >
                      {/* Date */}
                      <span className="text-gray-500 text-xs w-20 shrink-0">
                        {new Date(match.date).toLocaleDateString('sv-SE', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>

                      {/* Home team */}
                      <span className="flex-1 text-right text-gray-200 text-xs sm:text-sm truncate">
                        {match.home_team}
                      </span>

                      {/* Score inputs */}
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={pred.home}
                          onChange={(e) => setScore(match.match_nr, 'home', e.target.value)}
                          disabled={isLocked}
                          className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 disabled:opacity-50 focus:border-green-500 focus:outline-none"
                          placeholder="-"
                        />
                        <span className="text-gray-500 text-xs">-</span>
                        <input
                          type="number"
                          min={0}
                          max={99}
                          value={pred.away}
                          onChange={(e) => setScore(match.match_nr, 'away', e.target.value)}
                          disabled={isLocked}
                          className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 disabled:opacity-50 focus:border-green-500 focus:outline-none"
                          placeholder="-"
                        />
                      </div>

                      {/* Away team */}
                      <span className="flex-1 text-left text-gray-200 text-xs sm:text-sm truncate">
                        {match.away_team}
                      </span>

                      {/* 1X2 sign */}
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
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Bonus questions */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-4 py-3 bg-gray-900">
          <h2 className="font-semibold text-white text-sm">{t.predictions.bonusTitle}</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {bonusQuestions.map((bq) => (
            <div key={bq.key} className="px-4 py-3 bg-gray-950 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-300">{bonusLabels[bq.key]}</label>
                <span className="text-xs font-semibold text-green-400">{bonusPts[bq.key]}</span>
              </div>
              <input
                type="text"
                value={bonus[bq.key] ?? ''}
                onChange={(e) => {
                  setBonus((prev) => ({ ...prev, [bq.key]: e.target.value }));
                  setSaved(false);
                }}
                disabled={isLocked}
                placeholder="..."
                className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 disabled:opacity-50 focus:border-green-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      {!isLocked && (
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saved ? t.predictions.saved : t.predictions.save}
          </button>
        </div>
      )}
    </div>
  );
}
