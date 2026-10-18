"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AppShell.module.css";
import { catalog, equipment, searchSources } from "@/lib/gear-data";
import { deterministicChatReply, deterministicRecommendation, toTopPick } from "@/lib/recommend";
import { loadWallet, saveWallet } from "@/lib/game-storage";
import { GAME_TEAMS } from "@/lib/game-teams";
import type {
  ChatMessage,
  ChatRec,
  Division,
  EquipId,
  GameWallet,
  Position,
  ResultEntry,
  Screen,
  Tier,
} from "@/types/fitgear";
import BottomNav from "./BottomNav";
import HomeScreen from "./screens/HomeScreen";
import LevelScreen from "./screens/LevelScreen";
import TypeScreen from "./screens/TypeScreen";
import BudgetScreen from "./screens/BudgetScreen";
import SearchScreen from "./screens/SearchScreen";
import ResultsScreen from "./screens/ResultsScreen";
import DetailScreen from "./screens/DetailScreen";
import ChatScreen from "./screens/ChatScreen";
import GameScreen from "./screens/GameScreen";
import ShopScreen from "./screens/ShopScreen";

const BMIN = 50;
const BMAX = 1500;

const GREETING =
  "Hey, I'm your FitGear coach — like a hockey-shop pro in your pocket. Tell me your level, what you need, and your budget, and I'll point you to the right gear.";

export default function FitGearApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tier, setTier] = useState<Tier>("AAA");
  const [position, setPosition] = useState<Position>("Defense");
  const [division, setDivision] = useState<Division>("U14");
  const [equip, setEquip] = useState<EquipId>("helmet");
  const [budget, setBudget] = useState(250);
  const [searchStep, setSearchStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "guide", text: GREETING },
  ]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState<{
    res: ResultEntry;
    tier: Tier;
    position: Position;
    budget: number;
  } | null>(null);
  const [chatResult, setChatResult] = useState<ResultEntry | null>(null);
  const [skipTypeStep, setSkipTypeStep] = useState(false);
  const [detailBack, setDetailBack] = useState<Screen>("results");
  const [wallet, setWallet] = useState<GameWallet>(() => loadWallet());
  const [gameStickId, setGameStickId] = useState(
    () => wallet.ownedStickIds[0] ?? catalog.stick.candidates[0].id,
  );
  const [gameTeamId, setGameTeamId] = useState(GAME_TEAMS[0].id);
  const [gameScore, setGameScore] = useState(0);
  const [gameShots, setGameShots] = useState(0);

  useEffect(() => {
    saveWallet(wallet);
  }, [wallet]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearInterval(searchTimer.current);
    };
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = screen === "chat" ? el.scrollHeight : 0;
    });
    return () => cancelAnimationFrame(raf);
  }, [screen, messages.length, typing]);

  function go(next: Screen) {
    setScreen(next);
  }

  function startSearch() {
    go("search");
    setSearchStep(0);
    if (searchTimer.current) clearInterval(searchTimer.current);

    let timerDone = false;
    let fetchedResult: ResultEntry | null = null;
    let step = 0;

    function maybeFinish() {
      if (!timerDone || !fetchedResult) return;
      setSearch({ res: fetchedResult, tier, position, budget });
      setTimeout(() => go("results"), 350);
    }

    searchTimer.current = setInterval(() => {
      step += 1;
      if (step > searchSources.length) {
        if (searchTimer.current) clearInterval(searchTimer.current);
        timerDone = true;
        maybeFinish();
        return;
      }
      setSearchStep(step);
    }, 460);

    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ equip, tier, position, division, budget }),
    })
      .then((r) => r.json() as Promise<ResultEntry>)
      .then((data) => {
        fetchedResult = data;
        maybeFinish();
      })
      .catch(() => {
        fetchedResult = deterministicRecommendation(equip, tier, position, budget);
        maybeFinish();
      });
  }

  function sendChat(text?: string) {
    if (typing) return;
    const t = (text ?? draft).trim();
    if (!t) return;
    const history = messages;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setDraft("");
    setTyping(true);

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: t, history, tier, position, budget }),
    })
      .then(
        (r) =>
          r.json() as Promise<{
            reply: string;
            rec?: ChatRec;
            tier?: Tier;
            position?: Position;
            budget?: number;
          }>,
      )
      .then(applyChatReply)
      .catch(() => applyChatReply(deterministicChatReply(t, tier, position, budget)))
      .finally(() => setTyping(false));
  }

  function applyChatReply(data: { reply: string; rec?: ChatRec; tier?: Tier; position?: Position; budget?: number }) {
    setMessages((m) => [...m, { role: "guide", text: data.reply, rec: data.rec }]);
    if (data.tier) setTier(data.tier);
    if (data.position) setPosition(data.position);
    if (data.budget) setBudget(Math.min(BMAX, Math.max(BMIN, Math.round(data.budget))));
  }

  function onSelectChatRec(rec: ChatRec) {
    const candidate = catalog[rec.id].candidates.find(
      (c) => c.brand === rec.brand && c.model === rec.model,
    );
    if (!candidate) return;
    const entry = catalog[rec.id];
    setChatResult({
      category: entry.category,
      low: entry.low,
      avg: entry.avg,
      high: entry.high,
      top: toTopPick(candidate, tier, position, "Recommended by your FitGear coach based on your level and budget."),
      alts: [],
    });
    setDetailBack("chat");
    go("detail");
  }

  const catalogEntry = catalog[equip];
  const showNav = screen === "home" || screen === "results";

  const quickPicks = (["helmet", "skates", "stick", "gloves"] as EquipId[]).map(
    (id) => {
      const e = equipment.find((x) => x.id === id)!;
      const c = catalog[id];
      return {
        id,
        name: e.name,
        from: "$" + c.low,
        onPick: () => {
          setEquip(id);
          setSkipTypeStep(true);
          go("level");
        },
      };
    },
  );

  return (
    <div className={styles.page}>
      <div className={styles.frame}>
        <div ref={scrollRef} className={`${styles.scroll} fgScroll`}>
          {screen === "home" && (
            <HomeScreen
              onFindGear={() => {
                setSkipTypeStep(false);
                go("level");
              }}
              onAskGuide={() => go("chat")}
              onPlay={() => go("game")}
              quickPicks={quickPicks}
            />
          )}
          {screen === "level" && (
            <LevelScreen
              tier={tier}
              position={position}
              division={division}
              onBack={() => go("home")}
              onSelectTier={setTier}
              onSelectPosition={setPosition}
              onSelectDivision={setDivision}
              onContinue={() => go(skipTypeStep ? "budget" : "type")}
            />
          )}
          {screen === "type" && (
            <TypeScreen
              equip={equip}
              onBack={() => go("level")}
              onSelectEquip={setEquip}
              onContinue={() => go("budget")}
            />
          )}
          {screen === "budget" && (
            <BudgetScreen
              budget={budget}
              bmin={BMIN}
              bmax={BMAX}
              tier={tier}
              category={catalogEntry.category}
              low={catalogEntry.low}
              high={catalogEntry.high}
              recapLevel={`${tier} ${position}`}
              recapDiv={division}
              recapCat={catalogEntry.category}
              onBudgetChange={setBudget}
              onBack={() => go(skipTypeStep ? "level" : "type")}
              onSearch={startSearch}
            />
          )}
          {screen === "search" && (
            <SearchScreen
              searchStep={searchStep}
              recapCat={catalogEntry.category}
              recapLevel={`${tier} ${position}`}
              recapBudget={"$" + budget}
            />
          )}
          {screen === "results" && search && (
            <ResultsScreen
              res={search.res}
              budget={search.budget}
              recapLevel={`${search.tier} ${search.position}`}
              recapDiv={division}
              recapCat={search.res.category}
              recapBudget={"$" + search.budget}
              onBack={() => go("budget")}
              onOpenDetail={() => {
                setDetailBack("results");
                go("detail");
              }}
              onRefine={() => go("budget")}
              onAskGuide={() => go("chat")}
            />
          )}
          {screen === "detail" && detailBack === "chat" && chatResult && (
            <DetailScreen
              res={chatResult}
              recapLevel={`${tier} ${position}`}
              onBack={() => go("chat")}
              onAskGuide={() => go("chat")}
            />
          )}
          {screen === "detail" && detailBack === "results" && search && (
            <DetailScreen
              res={search.res}
              recapLevel={`${search.tier} ${search.position}`}
              onBack={() => go(detailBack)}
              onAskGuide={() => go("chat")}
            />
          )}
          {screen === "chat" && (
            <ChatScreen
              messages={messages}
              typing={typing}
              draft={draft}
              onDraftChange={setDraft}
              onSend={() => sendChat()}
              onSuggestion={(t) => sendChat(t)}
              onSelectRec={onSelectChatRec}
              onBack={() => go("home")}
            />
          )}
          {screen === "game" && (
            <GameScreen
              wallet={wallet}
              setWallet={setWallet}
              stickId={gameStickId}
              setStickId={setGameStickId}
              userTeamId={gameTeamId}
              setUserTeamId={setGameTeamId}
              score={gameScore}
              setScore={setGameScore}
              shots={gameShots}
              setShots={setGameShots}
              onBack={() => go("home")}
              onOpenShop={() => go("shop")}
            />
          )}
          {screen === "shop" && (
            <ShopScreen
              wallet={wallet}
              onBuy={(stickId, cost) =>
                setWallet((w) => ({ currency: w.currency - cost, ownedStickIds: [...w.ownedStickIds, stickId] }))
              }
              onBack={() => go("game")}
            />
          )}
        </div>

        {showNav && (
          <BottomNav
            screen={screen}
            onHome={() => go("home")}
            onFind={() => {
              setSkipTypeStep(false);
              go("level");
            }}
            onChat={() => go("chat")}
          />
        )}
      </div>
    </div>
  );
}
