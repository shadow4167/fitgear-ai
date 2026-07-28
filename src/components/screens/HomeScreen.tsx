import type { EquipId } from "@/types/fitgear";
import { EquipIcon } from "./shared";

interface QuickPick {
  id: EquipId;
  name: string;
  from: string;
  onPick: () => void;
}

interface Props {
  onFindGear: () => void;
  onAskGuide: () => void;
  onPlay: () => void;
  quickPicks: QuickPick[];
}

export default function HomeScreen({ onFindGear, onAskGuide, onPlay, quickPicks }: Props) {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "62px 20px 110px",
        boxSizing: "border-box",
        animation: "fgIn .34s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 30 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "var(--fg-brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(31,95,212,.32)",
          }}
        >
          <div style={{ width: 13, height: 13, background: "#fff", transform: "rotate(45deg)", borderRadius: 2 }} />
        </div>
        <span style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 20, letterSpacing: "-.3px" }}>
          FitGear<span style={{ color: "var(--fg-brand)" }}> AI</span>
        </span>
        <div
          style={{
            marginLeft: "auto",
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "#fff",
            border: "1px solid rgba(19,38,63,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
            color: "#5B6B7E",
          }}
        >
          NB
        </div>
      </div>

      <div style={{ fontSize: 14, color: "#5B6B7E", fontWeight: 600, marginBottom: 6 }}>Let&rsquo;s gear up, Neil.</div>
      <h1
        style={{
          fontFamily: "var(--font-archivo)",
          fontWeight: 800,
          fontSize: 32,
          lineHeight: 1.08,
          letterSpacing: "-.6px",
          margin: "0 0 28px",
        }}
      >
        Find gear that fits
        <br />
        your level &amp; budget.
      </h1>

      <button
        onClick={onFindGear}
        style={{
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          background: "var(--fg-brand-deep)",
          color: "#fff",
          borderRadius: 22,
          padding: 22,
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 14px 30px rgba(16,42,71,.28)",
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 18, letterSpacing: "-.3px" }}>
            Find my gear
          </div>
          <div style={{ fontSize: 13.5, opacity: 0.7, marginTop: 3 }}>Answer 3 quick questions →</div>
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "var(--fg-brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h11M9 4l5 5-5 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      <button
        onClick={onAskGuide}
        style={{
          border: "1px solid rgba(19,38,63,.1)",
          cursor: "pointer",
          textAlign: "left",
          background: "#fff",
          color: "#13263F",
          borderRadius: 22,
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#E6F1FB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H8l-4 3V5a1 1 0 011-1z"
              stroke="var(--fg-brand)"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}>Ask the guide</div>
          <div style={{ fontSize: 13, color: "#5B6B7E", marginTop: 2 }}>Chat with the FitGear coach</div>
        </div>
      </button>

      <button
        onClick={onPlay}
        style={{
          border: "1px solid rgba(19,38,63,.1)",
          cursor: "pointer",
          textAlign: "left",
          background: "#fff",
          color: "#13263F",
          borderRadius: 22,
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "#E6F1FB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="var(--fg-brand)" strokeWidth="1.8" />
            <path d="M7 10h6M10 7v6" stroke="var(--fg-brand)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}>Play Shootout</div>
          <div style={{ fontSize: 13, color: "#5B6B7E", marginTop: 2 }}>See your gear in action</div>
        </div>
      </button>

      <div
        style={{
          fontFamily: "var(--font-archivo)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: ".4px",
          textTransform: "uppercase",
          color: "#92A0B0",
          marginBottom: 12,
        }}
      >
        Start with
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {quickPicks.map((q) => (
          <button
            key={q.id}
            onClick={q.onPick}
            style={{
              border: "1px solid rgba(19,38,63,.08)",
              cursor: "pointer",
              textAlign: "left",
              background: "#fff",
              borderRadius: 16,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 11,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background:
                  "repeating-linear-gradient(135deg,#E6F1FB,#E6F1FB 5px,#DCEBF8 5px,#DCEBF8 10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <EquipIcon id={q.id} size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{q.name}</div>
              <div style={{ fontSize: 11.5, color: "#92A0B0" }}>from {q.from}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
