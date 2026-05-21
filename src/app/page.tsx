'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  ListOrdered,
  Star,
  CreditCard,
  CheckCircle,
  Target,
  Award,
  KeyRound,
} from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { usePlayer } from '@/context/PlayerContext';
import { ENTRY_FEE_SEK } from '@/data/matches';

export default function HomePage() {
  const { t } = useLocale();
  const { player, login, changePassword } = usePlayer();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  async function handleChangePassword(e: React.SyntheticEvent) {
    e.preventDefault();
    setPwError('');
    setPwSuccess(false);
    if (newPw.length < 4) { setPwError(t.auth.passwordMinLength); return; }
    if (newPw !== confirmPw) { setPwError(t.auth.passwordMismatch); return; }
    setSavingPw(true);
    const result = await changePassword(newPw);
    setSavingPw(false);
    if (!result.ok) { setPwError(result.error ?? t.common.error); return; }
    setPwSuccess(true);
    setNewPw('');
    setConfirmPw('');
    setTimeout(() => { setPwSuccess(false); setShowPasswordForm(false); }, 2000);
  }

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !code.trim()) return;
    setLoggingIn(true);
    const result = await login(name, code);
    setLoggingIn(false);
    if (!result.ok) {
      setError(result.error ?? t.auth.invalidCode);
    }
  }

  const steps = [
    { icon: CheckCircle, text: t.home.step1 },
    { icon: ListOrdered, text: t.home.step2 },
    { icon: Star, text: t.home.step3 },
    { icon: CreditCard, text: `${t.home.step4} (${ENTRY_FEE_SEK} SEK)` },
  ];

  const prizes = [
    { label: t.home.prize1, color: 'text-yellow-400' },
    { label: t.home.prize2, color: 'text-gray-300' },
    { label: t.home.prize3, color: 'text-amber-600' },
  ];

  const scoring = [
    { label: t.home.exactResult, pts: t.home.exactResultPts },
    { label: t.home.correctSign, pts: t.home.correctSignPts },
    { label: t.home.maxPerMatch, pts: '' },
  ];

  const bonusScoring = [
    { label: t.predictions.champion, pts: t.predictions.championPts },
    { label: t.predictions.topScorer, pts: t.predictions.topScorerPts },
    { label: t.predictions.bronzeWinner, pts: t.predictions.bronzeWinnerPts },
    { label: t.predictions.mostGoalsGroup, pts: t.predictions.mostGoalsGroupPts },
    { label: t.predictions.mostConcededGroup, pts: t.predictions.mostConcededGroupPts },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-600/20 p-5 ring-1 ring-green-600/40">
            <Trophy className="h-14 w-14 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {t.home.welcome}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t.home.description}</p>
        <p className="text-sm font-semibold text-green-400">{t.app.deadline}</p>
      </section>

      {/* Login or CTA */}
      {player ? (
        <section className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-300">
            {t.auth.welcome},{' '}
            <span className="font-bold text-white">{player.name}</span>!
          </p>
          <Link
            href="/tipset"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-3 text-base font-semibold text-white hover:bg-green-500 transition-colors"
          >
            <ListOrdered className="h-5 w-5" />
            {t.nav.predictions}
          </Link>

          {/* Change password toggle */}
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <KeyRound className="h-3.5 w-3.5" />
              {t.auth.changePassword}
            </button>
          ) : (
            <div className="w-full max-w-sm rounded-xl bg-gray-900 border border-gray-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <KeyRound className="h-4 w-4 text-green-400" />
                  {t.auth.changePassword}
                </h3>
                <button
                  onClick={() => { setShowPasswordForm(false); setPwError(''); setNewPw(''); setConfirmPw(''); }}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-500">{t.auth.passwordHint}</p>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.auth.newPassword}</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                    minLength={4}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs text-gray-400">{t.auth.confirmNewPassword}</label>
                  <input
                    type="password"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    required
                    minLength={4}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none text-sm"
                  />
                </div>
                {pwError && <p className="text-xs text-red-400">{pwError}</p>}
                {pwSuccess && <p className="text-xs text-green-400">{t.auth.passwordChanged}</p>}
                <button
                  type="submit"
                  disabled={savingPw}
                  className="w-full rounded-lg bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors disabled:opacity-60"
                >
                  {savingPw ? t.common.loading : t.auth.savePassword}
                </button>
              </form>
            </div>
          )}
        </section>
      ) : (
        <section className="mx-auto max-w-sm rounded-xl bg-gray-900 border border-gray-800 p-6 space-y-5">
          <h2 className="text-xl font-semibold text-white text-center">{t.auth.join}</h2>
          <p className="text-xs text-gray-500 text-center -mt-1">{t.auth.returningHint}</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm text-gray-400">{t.auth.enterName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.enterName}
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-gray-400">{t.auth.enterCode}</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="GMAB2026"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none text-sm uppercase"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-colors disabled:opacity-60"
            >
              {loggingIn ? t.common.loading : t.auth.join}
            </button>
          </form>
        </section>
      )}

      {/* How it works */}
      <section className="space-y-5">
        <h2 className="text-xl font-semibold text-white">{t.home.howTo}</h2>
        <ol className="space-y-3">
          {steps.map(({ icon: Icon, text }, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg bg-gray-900 border border-gray-800 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-300 pt-0.5">
                <Icon className="h-4 w-4 text-green-400 shrink-0" />
                {text}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Scoring + Prizes side by side on md+ */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scoring */}
        <section className="rounded-xl bg-gray-900 border border-gray-800 p-5 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Target className="h-5 w-5 text-green-500" />
            {t.home.scoring}
          </h2>
          <ul className="space-y-2">
            {scoring.map(({ label, pts }, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">{label}</span>
                {pts && (
                  <span className="font-semibold text-green-400 ml-2 shrink-0">{pts}</span>
                )}
              </li>
            ))}
          </ul>

          {/* Bonus questions */}
          <div className="border-t border-gray-800 pt-3 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t.home.bonusTitle}</p>
            <ul className="space-y-2">
              {bonusScoring.map(({ label, pts }, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{label}</span>
                  <span className="font-semibold text-green-400 ml-2 shrink-0">{pts}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 italic pt-1">{t.home.bonusNote}</p>
          </div>
        </section>

        {/* Prizes */}
        <section className="rounded-xl bg-gray-900 border border-gray-800 p-5 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Award className="h-5 w-5 text-yellow-400" />
            {t.home.prizes}
          </h2>
          <ul className="space-y-2">
            {prizes.map(({ label, color }, i) => (
              <li key={i} className={`text-sm font-medium ${color}`}>
                {label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
