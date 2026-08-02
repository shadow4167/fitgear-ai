import Image from "next/image";
import { equipment } from "@/lib/gear-data";
import type { ResultEntry } from "@/types/fitgear";
import { BackButton } from "./shared";

interface Props {
  res: ResultEntry;
  recapLevel: string;
  onBack: () => void;
  onAskGuide: () => void;
}

export default function DetailScreen({ res, recapLevel, onBack, onAskGuide }: Props) {
  const { top, category } = res;
  const { stores, specs } = top;
  const bestStore = stores.reduce((a, b) => (b.price < a.price ? b : a), stores[0]);
  const equipId = equipment.find((e) => e.name === category)?.id;

  return (
    <div style={{ minHeight: "100%", padding: "58px 18px 40px", boxSizing: "border-box", animation: "fgIn .3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
        <BackButton onClick={onBack} />
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}>Gear details</div>
      </div>

      <div
        style={{
          position: "relative",
          height: 180,
          borderRadius: 20,
          background: "#EAF3FB",
          overflow: "hidden",
          marginBottom: 18,
        }}
      >
        {equipId && <Image src={`/equipment/${equipId}.png`} alt={category} fill sizes="480px" style={{ objectFit: "contain", padding: 28 }} />}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg-brand)" }}>{top.brand}</div>
      <h2 style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 25, letterSpacing: "-.5px", margin: "2px 0 6px" }}>
        {top.model}
      </h2>
      <div style={{ fontSize: 14, color: "#5B6B7E", marginBottom: 18 }}>
        {top.fit} · for {recapLevel}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 4px 16px rgba(19,38,63,.05)", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, letterSpacing: ".5px", textTransform: "uppercase", color: "#92A0B0", marginBottom: 14 }}>
          Where to buy
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {stores.map((st) => {
            const isBest = st.name === bestStore.name && st.price === bestStore.price;
            return (
              <div
                key={st.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 13px",
                  borderRadius: 13,
                  background: isBest ? "#EAF3FB" : "#F6F9FC",
                  boxShadow: isBest ? "inset 0 0 0 1.5px var(--fg-brand)" : "none",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, display: "flex", alignItems: "center", gap: 8 }}>
                    {st.name}
                    {isBest && (
                      <span style={{ background: "var(--fg-brand)", color: "#fff", fontSize: 9.5, fontWeight: 800, padding: "2px 7px", borderRadius: 6, letterSpacing: ".3px" }}>
                        BEST PRICE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#92A0B0", marginTop: 1 }}>{st.cond}</div>
                </div>
                <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 18, color: "var(--fg-brand-deep)" }}>${st.price}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 4px 16px rgba(19,38,63,.05)", marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 12, letterSpacing: ".5px", textTransform: "uppercase", color: "#92A0B0", marginBottom: 12 }}>
          Why it fits your level
        </div>
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#3F5066", margin: "0 0 14px" }}>{top.why}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {specs.map((sp) => (
            <div key={sp} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#E0F1ED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="#1E7A6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#13263F" }}>{sp}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onAskGuide}
        style={{
          border: "none",
          cursor: "pointer",
          width: "100%",
          background: "var(--fg-brand-deep)",
          color: "#fff",
          borderRadius: 16,
          padding: 16,
          fontFamily: "var(--font-archivo)",
          fontWeight: 700,
          fontSize: 15.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
          boxShadow: "0 10px 24px rgba(16,42,71,.24)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H8l-4 3V5a1 1 0 011-1z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        Ask the guide about this
      </button>
    </div>
  );
}
