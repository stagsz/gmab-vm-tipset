'use client';

import { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { matches, groups } from '@/data/matches';

type ResultsMap = Record<number, { home: number; away: number }>;

type FilterTab = 'all' | (typeof groups)[number];

export default function MatchesPage() {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Read admin results from localStorage (client-side only)
  let results: ResultsMap = {};
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('gmab_admin_results');
    if (raw) {
      try {
        results = JSON.parse(raw);
      } catch {
        // ignore
      }
    }
  }

  const filtered =
    activeTab === 'all' ? matches : matches.filter((m) => m.group === activeTab);

  // Group by date
  const byDate: Record<string, typeof matches> = {};
  for (const m of filtered) {
    if (!byDate[m.date]) byDate[m.date] = [];
    byDate[m.date].push(m);
  }
  const sortedDates = Object.keys(byDate).sort();

  const tabClass = (tab: FilterTab) =>
    `px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
      activeTab === tab
        ? 'bg-green-600 text-white'
        : 'bg-gray-800 text-gray-400 hover:text-white'
    }`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">{t.matches.title}</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button className={tabClass('all')} onClick={() => setActiveTab('all')}>
          {t.matches.upcoming}
        </button>
        {groups.map((g) => (
          <button key={g} className={tabClass(g)} onClick={() => setActiveTab(g)}>
            {t.predictions.group} {g}
          </button>
        ))}
      </div>

      {/* Matches by date */}
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div key={date} className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              {new Date(date).toLocaleDateString('sv-SE', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </h2>
            <div className="rounded-xl border border-gray-800 overflow-hidden divide-y divide-gray-800">
              {byDate[date].map((match) => {
                const res = results[match.match_nr];
                return (
                  <div
                    key={match.match_nr}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-950 hover:bg-gray-900 transition-colors text-sm"
                  >
                    {/* Group badge */}
                    <span className="shrink-0 w-14 text-center rounded-md bg-gray-800 px-2 py-0.5 text-xs font-semibold text-gray-300">
                      {t.predictions.group} {match.group}
                    </span>

                    {/* Home team */}
                    <span className="flex-1 text-right text-gray-200 truncate">
                      {match.home_team}
                    </span>

                    {/* Score or placeholder */}
                    <span className="shrink-0 w-16 text-center font-mono font-bold">
                      {res ? (
                        <span className="text-white">
                          {res.home} – {res.away}
                        </span>
                      ) : (
                        <span className="text-gray-600">{t.matches.noResult}</span>
                      )}
                    </span>

                    {/* Away team */}
                    <span className="flex-1 text-left text-gray-200 truncate">
                      {match.away_team}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
