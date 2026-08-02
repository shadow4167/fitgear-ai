import Image from "next/image";
import { catalog } from "@/lib/gear-data";
import { unlockCostFor } from "@/lib/game-economy";
import { cheapestStore } from "@/lib/recommend";
import type { GameWallet } from "@/types/fitgear";
import { BackButton } from "./shared";

interface Props {
  wallet: GameWallet;
  onBuy: (stickId: string, cost: number) => void;
  onBack: () => void;
}

export default function ShopScreen({ wallet, onBuy, onBack }: Props) {
  const sticks = catalog.stick.candidates;

  return (
    <div style={{ minHeight: "100%", padding: "58px 18px 40px", boxSizing: "border-box", animation: "fgIn .3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 6 }}>
        <BackButton onClick={onBack} />
        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 21, letterSpacing: "-.4px" }}>Stick Shop</div>
          <div style={{ fontSize: 12.5, color: "#92A0B0", fontWeight: 600 }}>Spend goals earned in Shootout to unlock sticks</div>
        </div>
      </div>

      <div
        style={{
          margin: "16px 0",
          background: "var(--fg-brand-deep)",
          color: "#fff",
          borderRadius: 16,
          padding: "14px 18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.75 }}>Balance</span>
        <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 22 }}>${wallet.currency}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sticks.map((c) => {
          const price = cheapestStore(c).price;
          const cost = unlockCostFor(price);
          const owned = wallet.ownedStickIds.includes(c.id);
          const canAfford = wallet.currency >= cost;
          return (
            <div
              key={c.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 13,
                display: "flex",
                alignItems: "center",
                gap: 13,
                boxShadow: "0 3px 12px rgba(19,38,63,.05)",
                opacity: owned ? 1 : 0.85,
              }}
            >
              <div style={{ position: "relative", width: 52, height: 52, borderRadius: 11, flexShrink: 0, background: "#EAF3FB", overflow: "hidden" }}>
                <Image src="/equipment/stick.png" alt={c.model} fill sizes="52px" style={{ objectFit: "contain", padding: 6 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--fg-brand)" }}>{c.brand}</div>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, letterSpacing: "-.2px" }}>{c.model}</div>
                <div style={{ fontSize: 11.5, color: "#92A0B0", marginTop: 1 }}>${price} real price</div>
              </div>
              {owned ? (
                <span style={{ background: "#E0F1ED", color: "#1E7A6B", padding: "8px 14px", borderRadius: 12, fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>
                  Owned
                </span>
              ) : (
                <button
                  onClick={() => canAfford && onBuy(c.id, cost)}
                  disabled={!canAfford}
                  style={{
                    border: "none",
                    cursor: canAfford ? "pointer" : "default",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontFamily: "var(--font-hanken)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: canAfford ? "#fff" : "#92A0B0",
                    background: canAfford ? "var(--fg-brand)" : "#EEF3F8",
                    flexShrink: 0,
                  }}
                >
                  ${cost}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
