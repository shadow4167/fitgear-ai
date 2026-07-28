import type { OnIceSkater, PassOutcome } from "@/types/fitgear";

const LANE_HALF_WIDTH = 32;

export function generateOnIceSkaters(centerX: number, laneY: number): OnIceSkater[] {
  const defenderOffset = (Math.random() * 2 - 1) * 65;
  return [
    { id: "defender", role: "defender", x: centerX + defenderOffset, y: laneY },
    { id: "teammate-left", role: "teammate", x: centerX - 75, y: laneY + 10 },
    { id: "teammate-right", role: "teammate", x: centerX + 75, y: laneY + 10 },
  ];
}

export function isLaneBlocked(centerX: number, skaters: OnIceSkater[]): boolean {
  const defender = skaters.find((s) => s.role === "defender");
  if (!defender) return false;
  return Math.abs(defender.x - centerX) < LANE_HALF_WIDTH;
}

export function resolvePass(target: OnIceSkater, defender: OnIceSkater | undefined): PassOutcome {
  if (target.role !== "teammate") return "intercepted";
  if (!defender) return "success";
  const distance = Math.hypot(target.x - defender.x, target.y - defender.y);
  const interceptChance = Math.max(0, 0.35 - distance / 300);
  return Math.random() < interceptChance ? "intercepted" : "success";
}
