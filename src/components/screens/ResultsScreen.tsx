import Image from "next/image";
import { equipment } from "@/lib/gear-data";
import type { ResultEntry } from "@/types/fitgear";

interface Props {
  res: ResultEntry;
  budget: number;
  recapLevel: string;
  recapDiv: string;
  recapCat: string;
  recapBudget: string;
  onBack: () => void;
  onOpenDetail: () => void;
  onRefine: () => void;
  onAskGuide: () => void;
}

function pct(v: number, low: number, high: number) {
  return Math.max(0, Math.min(100, ((v - low) / (high - low)) * 100));
}

export default function ResultsScreen({
  res,
  budget,
  recapLevel,
  recapDiv,
  recapCat,
  recapBudget,
  onBack,
  onOpenDetail,
  onRefine,
  onAskGuide,
}: Props) {
  const { top, alts, low, high, avg } = res;
  const equipId = equipment.find((e) => e.name === recapCat)?.id;
  const avgLeft = pct(avg, low, high).toFixed(1) + "%";
  const topLeft = pct(top.price, low, high).toFixed(1) + "%";
  const inBudget = top.price <= budget;
  const budgetBadge = inBudget
    ? { text: "Within your budget", color: "#1E7A6B", bg: "#E0F1ED" }
    : { text: "A bit over budget", color: "#B06A1F", bg: "#F6ECDD" };
  const vsAvg =
    top.price < avg
      ? `$${avg - top.price} under average`
      : top.price > avg
        ? `$${top.price - avg} over average`
        : "Right at the average";

  return (
    <div style={{ minHeight: "100%", padding: "58px 18px 110px", boxSizing: "border-box", animation: "fgIn .34s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "#fff",
            cursor: "pointer",
            width: 38,
            height: 38,
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(19,38,63,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
            <path d="M9 2L2 9l7 7" stroke="#13263F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 21, letterSpacing: "-.4px" }}>Your match</div>
          <div style={{ fontSize: 12.5, color: "#92A0B0", fontWeight: 600 }}>
            {recapLevel} · {recapDiv} · {recapCat} · {recapBudget}
          </div>
        </div>
      </div>

      {/* TOP PICK */}
      <div style={{ background: "#fff", borderRadius: 24, padding: 18, boxShadow: "0 14px 34px rgba(19,38,63,.1)", marginBottom: 18, animation: "fgPop .4s ease" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--fg-brand-deep)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 9,
            fontFamily: "var(--font-archivo)",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: ".6px",
            marginBottom: 14,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1l1.7 3.6L12.5 5l-2.8 2.7.7 3.9L7 9.7 3.6 11.6l.7-3.9L1.5 5l3.8-.4L7 1z" fill="#fff" />
          </svg>
          TOP PICK FOR YOU
        </div>

        <div
          style={{
            position: "relative",
            height: 140,
            borderRadius: 16,
            background: "#EAF3FB",
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {equipId && <Image src={`/equipment/${equipId}.png`} alt={recapCat} fill sizes="440px" style={{ objectFit: "contain", padding: 22 }} />}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg-brand)", letterSpacing: ".3px" }}>{top.brand}</div>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 21, letterSpacing: "-.4px", lineHeight: 1.1, margin: "1px 0 5px" }}>
              {top.model}
            </div>
            <div style={{ fontSize: 13, color: "#5B6B7E" }}>{top.fit}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 27, letterSpacing: "-.6px", color: "var(--fg-brand-deep)" }}>
              ${top.price}
            </div>
            <div style={{ fontSize: 11.5, color: "#92A0B0" }}>at {top.store}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, margin: "14px 0 16px", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: budgetBadge.bg,
              color: budgetBadge.color,
              padding: "7px 11px",
              borderRadius: 9,
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.2l2.2 2.3 4.8-5" stroke={budgetBadge.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {budgetBadge.text}
          </span>
          <span style={{ background: "#EEF3F8", color: "#5B6B7E", padding: "7px 11px", borderRadius: 9, fontSize: 12.5, fontWeight: 700 }}>
            {vsAvg}
          </span>
        </div>

        {/* price range bar */}
        <div style={{ background: "#F6F9FC", borderRadius: 14, padding: "16px 16px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#92A0B0", marginBottom: 18 }}>
            Market price range
          </div>
          <div style={{ position: "relative", height: 42 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 20, height: 7, borderRadius: 5, background: "linear-gradient(90deg,#DCEBF8,#A9CDEE)" }} />
            <div style={{ position: "absolute", top: 14, left: avgLeft, transform: "translateX(-50%)", width: 2, height: 19, background: "#9FB6CC" }} />
            <div style={{ position: "absolute", top: 30, left: avgLeft, transform: "translateX(-50%)", fontSize: 10.5, fontWeight: 700, color: "#9FB6CC", whiteSpace: "nowrap" }}>
              Avg ${avg}
            </div>
            <div
              style={{
                position: "absolute",
                top: 14,
                left: topLeft,
                transform: "translateX(-50%)",
                width: 19,
                height: 19,
                borderRadius: "50%",
                background: "var(--fg-brand)",
                border: "3px solid #fff",
                boxShadow: "0 3px 8px rgba(31,95,212,.4)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -7,
                left: topLeft,
                transform: "translateX(-50%)",
                background: "var(--fg-brand)",
                color: "#fff",
                fontSize: 10.5,
                fontWeight: 800,
                padding: "3px 7px",
                borderRadius: 7,
                whiteSpace: "nowrap",
              }}
            >
              Pick ${top.price}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, fontWeight: 700, color: "#5B6B7E" }}>
            <span>Low ${low}</span>
            <span>High ${high}</span>
          </div>
        </div>

        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "#3F5066", margin: "0 0 16px" }}>{top.why}</p>

        <button
          onClick={onOpenDetail}
          style={{
            border: "none",
            cursor: "pointer",
            width: "100%",
            background: "var(--fg-brand)",
            color: "#fff",
            borderRadius: 15,
            padding: 15,
            fontFamily: "var(--font-archivo)",
            fontWeight: 700,
            fontSize: 15.5,
            boxShadow: "0 8px 20px rgba(31,95,212,.3)",
          }}
        >
          See full breakdown &amp; where to buy
        </button>
      </div>

      {/* ALTERNATIVES */}
      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 13, letterSpacing: ".4px", textTransform: "uppercase", color: "#92A0B0", margin: "0 0 12px 4px" }}>
        Also worth a look
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {alts.map((a) => (
          <div
            key={a.brand + a.model}
            style={{ background: "#fff", borderRadius: 16, padding: 13, display: "flex", alignItems: "center", gap: 13, boxShadow: "0 3px 12px rgba(19,38,63,.05)" }}
          >
            <div style={{ position: "relative", width: 52, height: 52, borderRadius: 11, flexShrink: 0, background: "#EEF4FA", overflow: "hidden" }}>
              {equipId && <Image src={`/equipment/${equipId}.png`} alt={a.model} fill sizes="52px" style={{ objectFit: "contain", padding: 6 }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--fg-brand)" }}>{a.brand}</div>
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15, letterSpacing: "-.2px" }}>{a.model}</div>
              <div style={{ fontSize: 11.5, color: "#92A0B0", marginTop: 1 }}>{a.note}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 17, color: "var(--fg-brand-deep)" }}>${a.price}</div>
              <div style={{ fontSize: 10.5, color: "#92A0B0" }}>{a.store}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button
          onClick={onRefine}
          style={{
            flex: 1,
            border: "1px solid rgba(19,38,63,.12)",
            background: "#fff",
            cursor: "pointer",
            borderRadius: 14,
            padding: 14,
            fontFamily: "var(--font-hanken)",
            fontWeight: 700,
            fontSize: 14,
            color: "#13263F",
          }}
        >
          Refine search
        </button>
        <button
          onClick={onAskGuide}
          style={{
            flex: 1,
            border: "none",
            cursor: "pointer",
            borderRadius: 14,
            padding: 14,
            fontFamily: "var(--font-hanken)",
            fontWeight: 700,
            fontSize: 14,
            background: "#E6F1FB",
            color: "var(--fg-brand)",
          }}
        >
          Ask the guide
        </button>
      </div>
    </div>
  );
}
