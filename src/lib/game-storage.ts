import type { GameWallet } from "@/types/fitgear";

const WALLET_KEY = "fitgear:game-wallet";
const TUTORIAL_KEY = "fitgear:game-tutorial-seen";
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

export function loadTutorialSeen(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(TUTORIAL_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveTutorialSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TUTORIAL_KEY, "1");
  } catch {
    // storage unavailable (quota, private browsing) — silently skip persistence
  }
}
