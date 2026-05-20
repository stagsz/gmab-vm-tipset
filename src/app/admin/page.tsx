'use client';

import { useState, useEffect } from 'react';
import { Shield, Users, Award, Key, Save, Check, Lock } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { supabase } from '@/lib/supabase';
import { bonusQuestions, BonusQuestionKey } from '@/data/matches';

const ADMIN_SESSION_KEY = 'gmab_admin';

// ── Types ──────────────────────────────────────────────────────────────────

interface SupabaseMatch {
  id: number;
  match_nr: number;
  match_date: string;
  group_letter: string;
  home_team: string;
  away_team: string;
  home_goals: number | null;
  away_goals: number | null;
  status: string;
}

interface PlayerRow {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

interface InviteCode {
  code: string;
  is_active: boolean;
  max_uses: number | null;
  uses: number;
}

type TabKey = 'results' | 'players' | 'bonus' | 'codes';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    month: 'short',
    day: 'numeric',
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ResultsTab({ t }: { t: ReturnType<typeof useLocale>['t'] }) {
  const [matches, setMatches] = useState<SupabaseMatch[]>([]);
  const [inputs, setInputs] = useState<Record<number, { home: string; away: string }>>({});
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true })
      .order('match_nr', { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        const rows = data as SupabaseMatch[];
        setMatches(rows);
        const init: Record<number, { home: string; away: string }> = {};
        for (const m of rows) {
          init[m.id] = {
            home: m.home_goals !== null ? String(m.home_goals) : '',
            away: m.away_goals !== null ? String(m.away_goals) : '',
          };
        }
        setInputs(init);
      });
  }, []);

  async function saveResult(match: SupabaseMatch) {
    const val = inputs[match.id];
    if (!val || val.home === '' || val.away === '') return;
    const home = parseInt(val.home, 10);
    const away = parseInt(val.away, 10);
    if (isNaN(home) || isNaN(away)) return;

    await supabase
      .from('matches')
      .update({ home_goals: home, away_goals: away, status: 'finished' })
      .eq('id', match.id);

    setMatches((prev) =>
      prev.map((m) =>
        m.id === match.id ? { ...m, home_goals: home, away_goals: away, status: 'finished' } : m
      )
    );
    setSavedIds((prev) => new Set(prev).add(match.id));
    setTimeout(() => {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(match.id);
        return next;
      });
    }, 2000);
  }

  return (
    <div className="space-y-2">
      {matches.map((match) => {
        const val = inputs[match.id] ?? { home: '', away: '' };
        const hasResult = match.status === 'finished' &&
          match.home_goals !== null && match.away_goals !== null;
        const isSaved = savedIds.has(match.id);

        return (
          <div
            key={match.id}
            className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 text-sm"
          >
            {/* Date + group */}
            <span className="text-gray-500 text-xs w-16 shrink-0">{formatDate(match.match_date)}</span>
            <span className="w-8 text-center text-xs font-semibold text-gray-400 shrink-0 bg-gray-800 rounded px-1">
              {match.group_letter}
            </span>

            {/* Teams */}
            <span className="flex-1 text-right text-gray-200 truncate text-xs sm:text-sm">
              {match.home_team}
            </span>

            {/* Score inputs */}
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                min={0}
                max={99}
                value={val.home}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, [match.id]: { ...prev[match.id], home: e.target.value } }))
                }
                className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 focus:border-green-500 focus:outline-none"
                placeholder="-"
              />
              <span className="text-gray-500 text-xs">-</span>
              <input
                type="number"
                min={0}
                max={99}
                value={val.away}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, [match.id]: { ...prev[match.id], away: e.target.value } }))
                }
                className="w-10 rounded border border-gray-700 bg-gray-800 text-center text-white text-sm py-1 focus:border-green-500 focus:outline-none"
                placeholder="-"
              />
            </div>

            <span className="flex-1 text-left text-gray-200 truncate text-xs sm:text-sm">
              {match.away_team}
            </span>

            {/* Status icon */}
            {hasResult && (
              <Check className="h-4 w-4 text-green-400 shrink-0" />
            )}

            {/* Save button */}
            <button
              onClick={() => saveResult(match)}
              className="shrink-0 flex items-center gap-1 rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-500 transition-colors"
            >
              {isSaved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              {isSaved ? t.admin.saved : t.admin.save}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function PlayersTab({ t }: { t: ReturnType<typeof useLocale>['t'] }) {
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('players')
      .select('id, name, invite_code, created_at')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setPlayers(data as PlayerRow[]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">{t.common.loading}</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        {t.admin.totalPlayers}: <span className="font-semibold text-white">{players.length}</span>
      </p>
      {players.length === 0 ? (
        <p className="text-gray-500 text-sm">{t.admin.noPlayers}</p>
      ) : (
        <div className="rounded-xl border border-gray-800 overflow-hidden">
          <div className="grid grid-cols-[1fr_8rem_8rem] bg-gray-900 border-b border-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            <div>Namn</div>
            <div>Kod</div>
            <div>Datum</div>
          </div>
          {players.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[1fr_8rem_8rem] px-4 py-3 border-b border-gray-800 last:border-b-0 bg-gray-950 text-sm"
            >
              <div className="text-white font-medium">{p.name}</div>
              <div className="text-gray-400">{p.invite_code}</div>
              <div className="text-gray-500 text-xs">
                {new Date(p.created_at).toLocaleDateString('sv-SE')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BonusTab({ t }: { t: ReturnType<typeof useLocale>['t'] }) {
  const [answers, setAnswers] = useState<Partial<Record<BonusQuestionKey, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from('bonus_correct_answers')
      .select('question_key, correct_answer')
      .then(({ data }) => {
        if (!data) return;
        const map: Partial<Record<BonusQuestionKey, string>> = {};
        for (const row of data) {
          map[row.question_key as BonusQuestionKey] = row.correct_answer;
        }
        setAnswers(map);
      });
  }, []);

  async function saveAll() {
    setSaving(true);
    const rows = (Object.entries(answers) as [BonusQuestionKey, string][])
      .filter(([, v]) => v.trim() !== '')
      .map(([question_key, correct_answer]) => ({ question_key, correct_answer: correct_answer.trim() }));

    if (rows.length > 0) {
      await supabase
        .from('bonus_correct_answers')
        .upsert(rows, { onConflict: 'question_key' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const bonusLabels: Record<BonusQuestionKey, string> = {
    top_scorer: 'Skyttekung / Capocannoniere',
    champion: 'Världsmästare / Campione',
    bronze_winner: 'Bronsmatch / Finale 3° posto',
    most_goals_group: 'Flest mål (grupp) / Più gol (girone)',
    most_conceded_group: 'Flest insläppta (grupp) / Più subiti (girone)',
  };

  return (
    <div className="space-y-4">
      {bonusQuestions.map((bq) => (
        <div key={bq.key} className="space-y-1.5">
          <label className="block text-sm text-gray-300">{bonusLabels[bq.key]}</label>
          <input
            type="text"
            value={answers[bq.key] ?? ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [bq.key]: e.target.value }))}
            placeholder={t.admin.setCorrectAnswer}
            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
          />
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saved ? t.admin.saved : saving ? t.common.loading : t.admin.save}
        </button>
      </div>
    </div>
  );
}

function CodesTab({ t }: { t: ReturnType<typeof useLocale>['t'] }) {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  async function fetchCodes() {
    const { data } = await supabase.from('invite_codes').select('*').order('code');
    if (data) setCodes(data as InviteCode[]);
    setLoading(false);
  }

  useEffect(() => { fetchCodes(); }, []);

  async function toggleActive(code: InviteCode) {
    await supabase
      .from('invite_codes')
      .update({ is_active: !code.is_active })
      .eq('code', code.code);
    setCodes((prev) =>
      prev.map((c) => (c.code === code.code ? { ...c, is_active: !c.is_active } : c))
    );
  }

  async function addCode() {
    const trimmed = newCode.trim().toUpperCase();
    if (!trimmed) return;
    setAdding(true);
    await supabase
      .from('invite_codes')
      .insert({ code: trimmed, is_active: true, uses: 0 });
    setNewCode('');
    await fetchCodes();
    setAdding(false);
  }

  if (loading) return <p className="text-gray-400 text-sm">{t.common.loading}</p>;

  return (
    <div className="space-y-6">
      {/* Existing codes */}
      <div className="rounded-xl border border-gray-800 overflow-hidden">
        <div className="grid grid-cols-[1fr_5rem_5rem_8rem] bg-gray-900 border-b border-gray-800 px-4 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <div>Kod</div>
          <div className="text-center">Status</div>
          <div className="text-center">Använd</div>
          <div></div>
        </div>
        {codes.map((c) => (
          <div
            key={c.code}
            className="grid grid-cols-[1fr_5rem_5rem_8rem] items-center px-4 py-3 border-b border-gray-800 last:border-b-0 bg-gray-950 text-sm"
          >
            <div className="font-mono font-semibold text-white">{c.code}</div>
            <div className="text-center">
              <span className={`text-xs font-semibold ${c.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                {c.is_active ? 'Aktiv' : 'Inaktiv'}
              </span>
            </div>
            <div className="text-center text-gray-400 text-xs">
              {c.uses}{c.max_uses !== null ? `/${c.max_uses}` : ''}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => toggleActive(c)}
                className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                  c.is_active
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-green-700 text-white hover:bg-green-600'
                }`}
              >
                {c.is_active ? t.admin.deactivate : t.admin.activate}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new code */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCode}
          onChange={(e) => setNewCode(e.target.value.toUpperCase())}
          placeholder={t.admin.addCode}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-green-500 focus:outline-none uppercase"
        />
        <button
          onClick={addCode}
          disabled={adding || !newCode.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors disabled:opacity-60"
        >
          <Key className="h-4 w-4" />
          {t.admin.addCode}
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { t } = useLocale();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('results');

  // Check session on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
      setAuthed(true);
    }
  }, []);

  function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setAuthed(true);
    } else {
      setPwError(t.admin.wrongPassword);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20 space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-gray-800 p-4">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 space-y-5">
          <h1 className="text-xl font-bold text-white text-center">{t.admin.title}</h1>
          <p className="text-sm text-gray-400 text-center">{t.admin.enterPassword}</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPwError(''); }}
              placeholder={t.admin.password}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none text-sm"
            />
            {pwError && <p className="text-sm text-red-400">{pwError}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
            >
              {t.admin.loginBtn}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; icon: typeof Shield }[] = [
    { key: 'results', label: t.admin.results, icon: Award },
    { key: 'players', label: t.admin.players, icon: Users },
    { key: 'bonus', label: t.admin.bonus, icon: Award },
    { key: 'codes', label: t.admin.codes, icon: Key },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-green-500" />
        <h1 className="text-2xl font-bold text-white">{t.admin.title}</h1>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap border-b border-gray-800 pb-0">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? 'border-green-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'results' && <ResultsTab t={t} />}
        {activeTab === 'players' && <PlayersTab t={t} />}
        {activeTab === 'bonus' && <BonusTab t={t} />}
        {activeTab === 'codes' && <CodesTab t={t} />}
      </div>
    </div>
  );
}
