import type { Tier } from "@/types/fitgear";
import { StepHeader } from "./shared";

interface Props {
  budget: number;
  bmin: number;
  bmax: number;
  tier: Tier;
  category: string;
  low: number;
  high: number;
  recapLevel: string;
  recapDiv: string;
  recapCat: string;
  onBudgetChange: (v: number) => void;
  onBack: () => void;
  onSearch: () => void;
}

export default function BudgetScreen({
  budget,
  bmin,
  bmax,
  tier,
  category,
  low,
  high,
  recapLevel,
  recapDiv,
  recapCat,
  onBudgetChange,
  onBack,
  onSearch,
}: Props) {
  const pct = (((budget - bmin) / (bmax - bmin)) * 100).toFixed(1);

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", padding: "58px 20px 40px", boxSizing: "border-box", animation: "fgIn .3s ease" }}>
      <StepHeader onBack={onBack} step={3} label="Your budget" />

      <h2 style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", margin: "8px 0 6px" }}>
        What&rsquo;s your budget?
      </h2>
      <p style={{ fontSize: 14.5, color: "#5B6B7E", margin: "0 0 30px", lineHeight: 1.4 }}>
        We&rsquo;ll find the best-fit gear at or under this price.
      </p>

      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 54, letterSpacing: "-1.5px", color: "var(--fg-brand-deep)", lineHeight: 1 }}>
          ${budget}
        </div>
        <div style={{ fontSize: 13, color: "#92A0B0", marginTop: 8 }}>
          {tier} {category.toLowerCase()} usually run ${low}–${high}
        </div>
      </div>

      <div style={{ margin: "26px 4px 8px" }}>
        <input
          type="range"
          className="fgRange"
          min={bmin}
          max={bmax}
          step={5}
          value={budget}
          onChange={(e) => onBudgetChange(parseInt(e.target.value, 10))}
          style={{ background: `linear-gradient(to right, var(--fg-brand) ${pct}%, #DCE6F0 ${pct}%)` }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12.5, fontWeight: 600, color: "#92A0B0" }}>
          <span>${bmin}</span>
          <span>${bmax}</span>
        </div>
      </div>

      <div style={{ marginTop: 26, background: "#fff", borderRadius: 18, padding: "18px 20px", boxShadow: "0 4px 16px rgba(19,38,63,.05)" }}>
        <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 11, letterSpacing: ".5px", textTransform: "uppercase", color: "#92A0B0", marginBottom: 12 }}>
          Your search
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#5B6B7E" }}>Level</span>
            <span style={{ fontWeight: 700, fontSize: 14.5 }}>{recapLevel} · {recapDiv}</span>
          </div>
          <div style={{ height: 1, background: "rgba(19,38,63,.06)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#5B6B7E" }}>Equipment</span>
            <span style={{ fontWeight: 700, fontSize: 14.5 }}>{recapCat}</span>
          </div>
          <div style={{ height: 1, background: "rgba(19,38,63,.06)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#5B6B7E" }}>Budget</span>
            <span style={{ fontWeight: 700, fontSize: 14.5, color: "var(--fg-brand)" }}>${budget}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <button
        onClick={onSearch}
        style={{
          marginTop: 28,
          border: "none",
          cursor: "pointer",
          width: "100%",
          background: "var(--fg-brand)",
          color: "#fff",
          borderRadius: 18,
          padding: 18,
          fontFamily: "var(--font-archivo)",
          fontWeight: 700,
          fontSize: 17,
          boxShadow: "0 12px 28px rgba(31,95,212,.34)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 9,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6.4" stroke="#fff" strokeWidth="2" />
          <path d="M13.6 13.6L17 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Find my gear
      </button>
    </div>
  );
}
