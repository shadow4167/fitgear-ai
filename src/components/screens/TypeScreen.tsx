import { equipment } from "@/lib/gear-data";
import type { EquipId } from "@/types/fitgear";
import { ContinueButton, EquipIcon, StepHeader } from "./shared";

interface Props {
  equip: EquipId;
  onBack: () => void;
  onSelectEquip: (id: EquipId) => void;
  onContinue: () => void;
}

export default function TypeScreen({ equip, onBack, onSelectEquip, onContinue }: Props) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", padding: "58px 20px 40px", boxSizing: "border-box", animation: "fgIn .3s ease" }}>
      <StepHeader onBack={onBack} step={2} label="What you need" />

      <h2 style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", margin: "8px 0 6px" }}>
        What are you after?
      </h2>
      <p style={{ fontSize: 14.5, color: "#5B6B7E", margin: "0 0 22px", lineHeight: 1.4 }}>
        Pick one piece to start. You can run another search anytime.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
        {equipment.map((e) => {
          const active = e.id === equip;
          return (
            <button
              key={e.id}
              onClick={() => onSelectEquip(e.id)}
              style={{
                position: "relative",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                background: "#fff",
                borderRadius: 16,
                padding: 14,
                boxShadow: active
                  ? "inset 0 0 0 2px var(--fg-brand), 0 6px 16px rgba(31,95,212,.14)"
                  : "inset 0 0 0 1px rgba(19,38,63,.07)",
              }}
            >
              <div
                style={{
                  height: 54,
                  borderRadius: 11,
                  marginBottom: 11,
                  background: "repeating-linear-gradient(135deg,#EAF3FB,#EAF3FB 6px,#DEEBF7 6px,#DEEBF7 12px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <EquipIcon id={e.id} size={26} color={active ? "var(--fg-brand)" : "#9DB4CA"} />
              </div>
              <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 15 }}>{e.name}</div>
              <div style={{ fontSize: 11.5, color: "#92A0B0", marginTop: 2 }}>{e.desc}</div>
              {active && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--fg-brand)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <ContinueButton onClick={onContinue} />
    </div>
  );
}
