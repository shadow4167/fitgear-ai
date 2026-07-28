import type { GameWallet } from "@/types/fitgear";

const WALLET_KEY = "fitgear:game-wallet";
const STARTER_STICK_ID = "stick-sherwood-rekkerelementone";

export const DEFAULT_WALLET: GameWallet = {
  currency: 0,
  ownedStickIds: [STARTER_STICK_ID],
};

export function loadWallet(): GameWallet {
  if (typeof window === "undefined") return DEFAULT_WALLET;
  try {
    const raw = window.localStorage.getItem(WALLET_KEY);
    if (!raw) return DEFAULT_WALLET;
    const parsed = JSON.parse(raw) as GameWallet;
    if (typeof parsed.currency !== "number" || !Array.isArray(parsed.ownedStickIds)) return DEFAULT_WALLET;
    return parsed;
  } catch {
    return DEFAULT_WALLET;
  }
}

export function saveWallet(wallet: GameWallet): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WALLET_KEY, JSON.stringify(wallet));
  } catch {
    // storage unavailable (quota, private browsing) — silently skip persistence
  }
}
