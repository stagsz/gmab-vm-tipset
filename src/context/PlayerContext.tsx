'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const VALID_CODES = ['GMAB2026', 'VMTIPS'];

interface Player {
  name: string;
  code: string;
}

interface PlayerContextValue {
  player: Player | null;
  login: (name: string, code: string) => boolean;
  logout: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('gmab_player');
    if (stored) {
      try {
        setPlayer(JSON.parse(stored));
      } catch {
        localStorage.removeItem('gmab_player');
      }
    }
  }, []);

  function login(name: string, code: string): boolean {
    if (!VALID_CODES.includes(code.trim().toUpperCase())) {
      return false;
    }
    const p: Player = { name: name.trim(), code: code.trim().toUpperCase() };
    setPlayer(p);
    localStorage.setItem('gmab_player', JSON.stringify(p));
    return true;
  }

  function logout() {
    setPlayer(null);
    localStorage.removeItem('gmab_player');
  }

  return (
    <PlayerContext.Provider value={{ player, login, logout }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
