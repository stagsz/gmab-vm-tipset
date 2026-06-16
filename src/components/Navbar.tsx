'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Trophy,
  ListOrdered,
  Calendar,
  Home,
  Globe,
  LogOut,
  Menu,
  X,
  Shield,
  ClipboardCheck,
} from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { usePlayer } from '@/context/PlayerContext';
import { locales, localeNames, Locale } from '@/i18n/index';

export default function Navbar() {
  const { t, locale, setLocale } = useLocale();
  const { player, logout } = usePlayer();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Home },
    { href: '/tipset', label: t.nav.predictions, icon: ListOrdered },
    { href: '/leaderboard', label: t.nav.leaderboard, icon: Trophy },
    { href: '/matches', label: t.nav.matches, icon: Calendar },
    { href: '/facit', label: t.nav.facit, icon: ClipboardCheck },
    ...(player?.is_admin ? [{ href: '/admin', label: t.nav.admin, icon: Shield }] : []),
  ];

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Trophy className="h-6 w-6 text-green-500" />
            <span className="font-bold text-white text-sm sm:text-base leading-tight">
              {t.app.title}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(href)
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side: locale switcher + player info */}
          <div className="hidden md:flex items-center gap-3">
            {/* Locale switcher */}
            <div className="flex items-center gap-1 border border-gray-700 rounded-md overflow-hidden">
              <Globe className="h-4 w-4 text-gray-400 ml-2" />
              {locales.map((loc: Locale) => (
                <button
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className={`px-2 py-1 text-xs font-semibold uppercase transition-colors ${
                    locale === loc
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={localeNames[loc]}
                >
                  {loc}
                </button>
              ))}
            </div>

            {/* Player info */}
            {player && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300 font-medium">{player.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                  title={t.auth.logout}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile: locale + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-0.5 border border-gray-700 rounded-md overflow-hidden">
              {locales.map((loc: Locale) => (
                <button
                  key={loc}
                  onClick={() => setLocale(loc)}
                  className={`px-2 py-1 text-xs font-semibold uppercase transition-colors ${
                    locale === loc
                      ? 'bg-green-600 text-white'
                      : 'text-gray-400'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 text-gray-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {player && (
            <div className="flex items-center justify-between px-3 py-2 mt-2 border-t border-gray-800">
              <span className="text-sm text-gray-300">{player.name}</span>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t.auth.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
