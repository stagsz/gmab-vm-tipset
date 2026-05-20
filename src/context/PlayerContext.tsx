'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface Player {
  id: string;
  name: string;
  paid: boolean;
}

interface PlayerContextValue {
  player: Player | null;
  loading: boolean;
  login: (name: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const LS_PLAYER_ID = 'gmab_player_id';
const LS_PLAYER_NAME = 'gmab_player_name';

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const storedId = localStorage.getItem(LS_PLAYER_ID);
      const storedName = localStorage.getItem(LS_PLAYER_NAME);
      if (storedId && storedName) {
        // Verify the player still exists in Supabase
        const { data, error } = await supabase
          .from('players')
          .select('id, name, paid')
          .eq('id', storedId)
          .single();
        if (!error && data) {
          setPlayer({ id: data.id, name: data.name, paid: data.paid ?? false });
        } else {
          // Player no longer valid — clear storage
          localStorage.removeItem(LS_PLAYER_ID);
          localStorage.removeItem(LS_PLAYER_NAME);
        }
      }
      setLoading(false);
    }
    restoreSession();
  }, []);

  async function login(name: string, code: string): Promise<{ ok: boolean; error?: string }> {
    const upperCode = code.trim().toUpperCase();
    const trimmedName = name.trim();

    // 1. Validate invite code
    const { data: codeRow, error: codeErr } = await supabase
      .from('invite_codes')
      .select('code, is_active, max_uses, uses')
      .eq('code', upperCode)
      .eq('is_active', true)
      .single();

    if (codeErr || !codeRow) {
      return { ok: false, error: 'Ogiltig inbjudningskod' };
    }

    // 2. Check max uses
    if (codeRow.max_uses !== null && codeRow.uses >= codeRow.max_uses) {
      return { ok: false, error: 'Ogiltig inbjudningskod' };
    }

    // 3. Insert player
    const { data: newPlayer, error: insertErr } = await supabase
      .from('players')
      .insert({ name: trimmedName, invite_code: upperCode })
      .select('id, name, paid')
      .single();

    if (insertErr || !newPlayer) {
      return { ok: false, error: 'Något gick fel, försök igen' };
    }

    // 4. Increment invite code uses
    await supabase
      .from('invite_codes')
      .update({ uses: codeRow.uses + 1 })
      .eq('code', upperCode);

    // 5. Store in localStorage and set state
    localStorage.setItem(LS_PLAYER_ID, newPlayer.id);
    localStorage.setItem(LS_PLAYER_NAME, newPlayer.name);
    setPlayer({ id: newPlayer.id, name: newPlayer.name, paid: newPlayer.paid ?? false });

    return { ok: true };
  }

  function logout() {
    setPlayer(null);
    localStorage.removeItem(LS_PLAYER_ID);
    localStorage.removeItem(LS_PLAYER_NAME);
  }

  return (
    <PlayerContext.Provider value={{ player, loading, login, logout }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
