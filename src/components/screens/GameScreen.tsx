"use client";

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { catalog } from "@/lib/gear-data";
import { cheapestStore } from "@/lib/recommend";
import { GAME_TEAMS, goalieFor, shooterFor } from "@/lib/game-teams";
import { currencyForGoal, ovrMultiplier } from "@/lib/game-economy";
import { generateOnIceSkaters, isLaneBlocked, resolvePass } from "@/lib/game-play";
import {
  GOALIE_HALF,
  H,
  NET_CENTER_X,
  NET_H,
  NET_W,
  NET_X,
  NET_Y,
  W,
  drawGoalCelebration,
  drawGoalie,
  drawHelmetDrop,
  drawNet,
  drawPassArrow,
  drawSaveCelebration,
  drawShooter,
  drawSkater,
} from "@/lib/game-render";
import type { GameWallet, GearCandidate, OnIceSkater, Tier } from "@/types/fitgear";
import { BackButton, Chip } from "./shared";

const TIER_RANK: Record<Tier, number> = {
  Beginner: 0,
  "House League": 1,
  Travel: 2,
  AA: 3,
  AAA: 4,
};
const TIER_SPEED: Record<Tier, number> = {
  Beginner: 1,
  "House League": 1.15,
  Travel: 1.3,
  AA: 1.45,
  AAA: 1.6,
};
const SPEED_LABEL: Record<Tier, string> = {
  Beginner: "Slow",
  "House League": "Medium",
  Travel: "Quick",
  AA: "Fast",
  AAA: "Very Fast",
};

function bestTierFor(c: GearCandidate): Tier {
  return c.tierFit.reduce((best, t) => (TIER_RANK[t] > TIER_RANK[best] ? t : best), c.tierFit[0]);
}

const GOALIE_SPEED = 0.21; // px per ms of goalie reaction toward the shot
const SHOT_MEMORY = 5; // recent shots the goalie "remembers" when repositioning
const LEAN_STRENGTH = 0.6; // how strongly the goalie anticipates your recent tendency (0-1)
const PUCK_START = { x: W / 2, y: H - 50 };
const BASE_DURATION = 650;
const CELEBRATION_MS = 2000;
const ON_ICE_Y = NET_Y + NET_H + 64;
const SKATER_HIT_RADIUS = 26;
const CHECK_COUNTDOWN_MS = 2500;
const HURT_COOLDOWN_MS = 1600;

function animate(
  from: { x: number; y: number },
  to: { x: number; y: number },
  duration: number,
  onFrame: (p: { x: number; y: number }, t: number) => void,
  onDone: () => void,
): () => void {
  const start = performance.now();
  let rafId: number;
  let cancelled = false;
  function step(now: number) {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    onFrame({ x: from.x + (to.x - from.x) * eased, y: from.y + (to.y - from.y) * eased }, t);
    if (t < 1) rafId = requestAnimationFrame(step);
    else onDone();
  }
  rafId = requestAnimationFrame(step);
  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}

function runCelebration(
  outcome: "goal" | "save",
  onTick: (outcome: "goal" | "save", elapsed: number) => void,
  onDone: () => void,
): () => void {
  const start = performance.now();
  let rafId: number;
  let cancelled = false;
  function step(now: number) {
    if (cancelled) return;
    const elapsed = now - start;
    onTick(outcome, elapsed);
    if (elapsed < CELEBRATION_MS) rafId = requestAnimationFrame(step);
    else onDone();
  }
  rafId = requestAnimationFrame(step);
  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}

interface Props {
  wallet: GameWallet;
  setWallet: Dispatch<SetStateAction<GameWallet>>;
  stickId: string;
  setStickId: Dispatch<SetStateAction<string>>;
  userTeamId: string;
  setUserTeamId: Dispatch<SetStateAction<string>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  shots: number;
  setShots: Dispatch<SetStateAction<number>>;
  onBack: () => void;
  onOpenShop: () => void;
}

export default function GameScreen({
  wallet,
  setWallet,
  stickId,
  setStickId,
  userTeamId,
  setUserTeamId,
  score,
  setScore,
  shots,
  setShots,
  onBack,
  onOpenShop,
}: Props) {
  const sticks = catalog.stick.candidates;
  const stick = sticks.find((c) => c.id === stickId) ?? sticks[0];
  const streakRef = useRef(0);
  const speedTier = bestTierFor(stick);
  const speed = TIER_SPEED[speedTier];

  const userTeamIdx = GAME_TEAMS.findIndex((t) => t.id === userTeamId);
  const userTeam = GAME_TEAMS[userTeamIdx];
  const opponentTeam = GAME_TEAMS[(userTeamIdx + 1) % GAME_TEAMS.length];
  const shooter = shooterFor(userTeam.id);
  const goalie = goalieFor(opponentTeam.id);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puckRef = useRef({ ...PUCK_START });
  const goalieXRef = useRef(NET_CENTER_X);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const shotHistoryRef = useRef<number[]>([]);
  const celebrationRef = useRef<{ outcome: "goal" | "save"; elapsed: number } | null>(null);

  const [result, setResult] = useState<"goal" | "save" | null>(null);
  const [busy, setBusy] = useState(false);

  const [shotOriginX, setShotOriginX] = useState(PUCK_START.x);
  const [onIce, setOnIce] = useState<OnIceSkater[]>(() => generateOnIceSkaters(PUCK_START.x, ON_ICE_Y));
  const [passedThisRound, setPassedThisRound] = useState(false);
  const [passResult, setPassResult] = useState<"success" | "intercepted" | null>(null);
  const laneBlocked = isLaneBlocked(shotOriginX, onIce);
  const canPass = laneBlocked && !passedThisRound && !busy;

  const [countdownActive, setCountdownActive] = useState(true);
  const [roundKey, setRoundKey] = useState(0);
  const [hit, setHit] = useState(false);

  const cancelAnimRef = useRef<() => void>(() => {});
  const passTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      cancelAnimRef.current();
      if (passTimeoutRef.current) clearTimeout(passTimeoutRef.current);
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, []);

  function clearCountdown() {
    setCountdownActive(false);
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
      checkTimeoutRef.current = null;
    }
  }

  function armCheckTimer() {
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    checkTimeoutRef.current = setTimeout(() => {
      setCountdownActive(false);
      setBusy(true);
      setHit(true);
      draw();
      passTimeoutRef.current = setTimeout(() => {
        setHit(false);
        resetRound();
      }, HURT_COOLDOWN_MS);
    }, CHECK_COUNTDOWN_MS);
  }

  function startCountdown() {
    setCountdownActive(true);
    armCheckTimer();
  }

  useEffect(() => {
    armCheckTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#eef3f8";
    ctx.fillRect(0, 0, W, H);

    drawNet(ctx);

    const cel = celebrationRef.current;
    if (cel) {
      const t = cel.elapsed / CELEBRATION_MS;
      ctx.save();
      ctx.globalAlpha = t > 0.85 ? Math.max(0, 1 - (t - 0.85) / 0.15) : 1;
      if (cel.outcome === "save") {
        drawSaveCelebration(ctx, goalieXRef.current, cel.elapsed, opponentTeam.jerseyColor, opponentTeam.trimColor);
      } else {
        drawGoalCelebration(
          ctx,
          goalieXRef.current,
          cel.elapsed,
          opponentTeam.jerseyColor,
          opponentTeam.trimColor,
          userTeam.jerseyColor,
        );
      }
      ctx.restore();
    } else {
      drawGoalie(
        ctx,
        goalieXRef.current,
        "idle",
        0,
        opponentTeam.jerseyColor,
        opponentTeam.trimColor,
        opponentTeam.crest,
        goalie.number,
      );
    }

    if (!cel) {
      onIce.forEach((s) => {
        const jersey = s.role === "defender" ? opponentTeam.jerseyColor : userTeam.jerseyColor;
        drawSkater(ctx, s.x, s.y, jersey, canPass && s.role === "teammate");
      });
      if (canPass) {
        onIce
          .filter((s) => s.role === "teammate")
          .forEach((s) => drawPassArrow(ctx, shotOriginX, PUCK_START.y, s.x, s.y));
      }
    }

    drawShooter(ctx, shotOriginX - 24, PUCK_START.y + 4, userTeam.jerseyColor, userTeam.trimColor, userTeam.crest, shooter.number, hit);
    if (hit) {
      drawHelmetDrop(ctx, shotOriginX - 10, PUCK_START.y - 20, PUCK_START.y + 22, 1, userTeam.trimColor);
    }

    const trail = trailRef.current;
    trail.forEach((p, i) => {
      const t = (i + 1) / trail.length;
      ctx.beginPath();
      ctx.fillStyle = `rgba(31,95,212,${0.35 * t})`;
      ctx.arc(p.x, p.y, 7 * t, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.beginPath();
    ctx.fillStyle = "#13263F";
    ctx.arc(puckRef.current.x, puckRef.current.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTeamId, hit]);

  function resetRound() {
    setOnIce(generateOnIceSkaters(PUCK_START.x, ON_ICE_Y));
    setShotOriginX(PUCK_START.x);
    setPassedThisRound(false);
    setRoundKey((k) => k + 1);
    puckRef.current = { ...PUCK_START };
    trailRef.current = [];
    setBusy(false);
    draw();
    startCountdown();
  }

  function completeShot(targetX: number, targetY: number) {
    clearCountdown();
    setBusy(true);
    setResult(null);
    trailRef.current = [];
    const finalSpeed = speed * ovrMultiplier(shooter.ovr);
    const finalGoalieSpeed = GOALIE_SPEED * ovrMultiplier(goalie.ovr);
    const duration = BASE_DURATION / finalSpeed;
    const goalieStartX = goalieXRef.current;
    const desiredDelta = targetX - goalieStartX;

    cancelAnimRef.current = animate(
      { x: shotOriginX, y: PUCK_START.y },
      { x: targetX, y: targetY },
      duration,
      (p, t) => {
        puckRef.current = p;
        trailRef.current = [...trailRef.current, p].slice(-6);
        const maxTravel = finalGoalieSpeed * (t * duration);
        const delta = Math.abs(desiredDelta) <= maxTravel ? desiredDelta : Math.sign(desiredDelta) * maxTravel;
        goalieXRef.current = goalieStartX + delta;
        draw();
      },
      () => {
        const blocked = Math.abs(targetX - goalieXRef.current) < GOALIE_HALF;
        setShots((s) => s + 1);
        if (!blocked) {
          const reward = currencyForGoal(streakRef.current);
          streakRef.current += 1;
          setScore((s) => s + 1);
          setWallet((w) => ({ ...w, currency: w.currency + reward }));
        } else {
          streakRef.current = 0;
        }
        setResult(blocked ? "save" : "goal");

        shotHistoryRef.current = [...shotHistoryRef.current, targetX].slice(-SHOT_MEMORY);
        const tendency = shotHistoryRef.current.reduce((a, b) => a + b, 0) / shotHistoryRef.current.length;
        const anticipatedX = NET_CENTER_X + (tendency - NET_CENTER_X) * LEAN_STRENGTH;

        cancelAnimRef.current = runCelebration(
          blocked ? "save" : "goal",
          (outcome, elapsed) => {
            celebrationRef.current = { outcome, elapsed };
            draw();
          },
          () => {
            celebrationRef.current = null;
            goalieXRef.current = anticipatedX;
            setResult(null);
            resetRound();
          },
        );
      },
    );
  }

  function handlePass(target: OnIceSkater) {
    const defender = onIce.find((s) => s.role === "defender");
    const outcome = resolvePass(target, defender);
    if (outcome === "success") {
      setShotOriginX(target.x);
      setPassedThisRound(true);
      setPassResult("success");
      passTimeoutRef.current = setTimeout(() => setPassResult(null), 700);
      armCheckTimer();
      setRoundKey((k) => k + 1);
      draw();
    } else {
      setBusy(true);
      setPassResult("intercepted");
      passTimeoutRef.current = setTimeout(() => {
        setPassResult(null);
        resetRound();
      }, 1200);
    }
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (busy) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * W;
    const rawY = ((e.clientY - rect.top) / rect.height) * H;

    if (canPass) {
      const hit = onIce.find((s) => s.role === "teammate" && Math.hypot(s.x - rawX, s.y - rawY) < SKATER_HIT_RADIUS);
      if (hit) {
        handlePass(hit);
        return;
      }
    }

    const targetX = Math.min(NET_X + NET_W - 14, Math.max(NET_X + 14, rawX));
    const targetY = Math.min(NET_Y + NET_H - 10, Math.max(NET_Y + 10, rawY));
    completeShot(targetX, targetY);
  }

  const banner = hit
    ? { text: "CHECKED!", bg: "#C0392B" }
    : result === "goal"
      ? { text: "GOALLL!", bg: "#1E7A6B" }
      : result === "save"
        ? { text: "SAVED", bg: "#C0392B" }
        : passResult === "success"
          ? { text: "PASS!", bg: "var(--fg-brand)" }
          : passResult === "intercepted"
            ? { text: "INTERCEPTED!", bg: "#C0392B" }
            : null;

  return (
    <div style={{ minHeight: "100%", padding: "58px 20px 40px", boxSizing: "border-box", animation: "fgIn .3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <BackButton onClick={onBack} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 20 }}>Shootout</div>
          <div style={{ fontSize: 12, color: "#92A0B0" }}>Tap the net to shoot, or tap a teammate to pass — don&rsquo;t wait too long</div>
        </div>
        <button
          onClick={onOpenShop}
          style={{
            border: "none",
            cursor: "pointer",
            borderRadius: 12,
            padding: "9px 13px",
            fontFamily: "var(--font-hanken)",
            fontWeight: 700,
            fontSize: 13,
            background: "var(--fg-brand-deep)",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          Shop · ${wallet.currency}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10 }}>
        {GAME_TEAMS.map((t) => (
          <Chip key={t.id} label={t.name} selected={t.id === userTeamId} onClick={() => !busy && setUserTeamId(t.id)} />
        ))}
      </div>

      <div style={{ fontSize: 12.5, color: "#92A0B0", marginBottom: 12 }}>
        {userTeam.name} #{shooter.number} · OVR {shooter.ovr} vs {opponentTeam.name} #{goalie.number} · OVR {goalie.ovr} in goal
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 14 }}>
        {sticks.map((c) => {
          const owned = wallet.ownedStickIds.includes(c.id);
          return (
            <div key={c.id} style={{ opacity: owned ? 1 : 0.45 }}>
              <Chip
                label={owned ? `${c.brand} ${c.model}` : `${c.brand} ${c.model} · Locked`}
                selected={c.id === stickId}
                onClick={() => !busy && owned && setStickId(c.id)}
              />
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 12.5, color: "#92A0B0", marginBottom: 10 }}>
        {stick.brand} {stick.model} · ${cheapestStore(stick).price} · Shot speed:{" "}
        <span style={{ color: "var(--fg-brand)", fontWeight: 700 }}>{SPEED_LABEL[speedTier]}</span>
      </div>

      {countdownActive && (
        <div style={{ height: 4, background: "#E1E9F0", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
          <div
            key={roundKey}
            style={{
              height: "100%",
              background: "var(--fg-brand)",
              width: "100%",
              animation: `fgShrink ${CHECK_COUNTDOWN_MS}ms linear forwards`,
            }}
          />
        </div>
      )}

      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 20px rgba(19,38,63,.1)" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={handleCanvasClick}
          style={{ width: "100%", height: "auto", display: "block", cursor: busy ? "default" : "crosshair" }}
        />
        {banner && (
          <div style={{ position: "absolute", top: 10, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <div
              style={{
                fontFamily: "var(--font-archivo)",
                fontWeight: 800,
                fontSize: banner.text === "GOALLL!" ? 22 : 18,
                letterSpacing: "-.3px",
                color: "#fff",
                background: banner.bg,
                padding: "6px 18px",
                borderRadius: 20,
                boxShadow: "0 6px 16px rgba(19,38,63,.25)",
                animation: "fgPop .28s cubic-bezier(.2,1.4,.4,1)",
              }}
            >
              {banner.text}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16, textAlign: "center", fontSize: 14, fontWeight: 700 }}>
        {score} / {shots} shots{shots > 0 ? ` · ${Math.round((score / shots) * 100)}%` : ""}
      </div>
    </div>
  );
}
