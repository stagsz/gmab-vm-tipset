'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface Player {
  id: string;
  name: string;
  paid: boolean;
  is_admin: boolean;
}

interface PlayerContextValue {
  player: Player | null;
  loading: boolean;
  login: (name: string, code: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<{ ok: boolean; error?: string }>;
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
          .select('id, name, paid, is_admin')
          .eq('id', storedId)
          .single();
        if (!error && data) {
          setPlayer({ id: data.id, name: data.name, paid: data.paid ?? false, is_admin: data.is_admin ?? false });
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
    const normalizedName = name.trim().replace(/\s+/g, ' ');
    const trimmedCode = code.trim();
    const upperCode = trimmedCode.toUpperCase();

    // 1. Check if a player with this name already exists (returning player)
    const { data: existingRows } = await supabase
      .from('players')
      .select('id, name, paid, is_admin, invite_code, player_password')
      .ilike('name', normalizedName)
      .order('created_at', { ascending: true })
      .limit(1);

    const existing = existingRows?.[0];

    if (existing) {
      // Returning player — authenticate against personal password or invite code
      if (existing.player_password) {
        // Player has set a personal password — validate against it
        if (trimmedCode !== existing.player_password) {
          return { ok: false, error: 'Fel lösenord' };
        }
      } else {
        // No personal password — validate against their stored invite code
        if (existing.invite_code !== upperCode) {
          return { ok: false, error: 'Ogiltig inbjudningskod' };
        }
        // Also confirm the invite code is still active
        const { data: codeRow } = await supabase
          .from('invite_codes')
          .select('is_active')
          .eq('code', upperCode)
          .single();
        if (!codeRow?.is_active) {
          return { ok: false, error: 'Ogiltig inbjudningskod' };
        }
      }

      localStorage.setItem(LS_PLAYER_ID, existing.id);
      localStorage.setItem(LS_PLAYER_NAME, existing.name);
      setPlayer({ id: existing.id, name: existing.name, paid: existing.paid ?? false, is_admin: existing.is_admin ?? false });
      return { ok: true };
    }

    // 2. New player — validate invite code
    const { data: codeRow, error: codeErr } = await supabase
      .from('invite_codes')
      .select('code, is_active, max_uses, uses')
      .eq('code', upperCode)
      .eq('is_active', true)
      .single();

    if (codeErr || !codeRow) {
      return { ok: false, error: 'Ogiltig inbjudningskod' };
    }

    if (codeRow.max_uses !== null && codeRow.uses >= codeRow.max_uses) {
      return { ok: false, error: 'Ogiltig inbjudningskod' };
    }

    // 3. Insert new player
    const { data: newPlayer, error: insertErr } = await supabase
      .from('players')
      .insert({ name: normalizedName, invite_code: upperCode })
      .select('id, name, paid, is_admin')
      .single();

    if (insertErr || !newPlayer) {
      return { ok: false, error: 'Något gick fel, försök igen' };
    }

    // 4. Increment invite code uses
    await supabase
      .from('invite_codes')
      .update({ uses: codeRow.uses + 1 })
      .eq('code', upperCode);

    localStorage.setItem(LS_PLAYER_ID, newPlayer.id);
    localStorage.setItem(LS_PLAYER_NAME, newPlayer.name);
    setPlayer({ id: newPlayer.id, name: newPlayer.name, paid: newPlayer.paid ?? false, is_admin: newPlayer.is_admin ?? false });

    return { ok: true };
  }

  async function changePassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
    if (!player) return { ok: false, error: 'Inte inloggad' };
    const passwordToSet = newPassword.trim() || null;
    const { data, error } = await supabase
      .from('players')
      .update({ player_password: passwordToSet })
      .eq('id', player.id)
      .select('id')
      .single();
    if (error || !data) return { ok: false, error: 'Något gick fel – kontrollera anslutningen' };
    return { ok: true };
  }

  function logout() {
    setPlayer(null);
    localStorage.removeItem(LS_PLAYER_ID);
    localStorage.removeItem(LS_PLAYER_NAME);
  }

  return (
    <PlayerContext.Provider value={{ player, loading, login, logout, changePassword }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
