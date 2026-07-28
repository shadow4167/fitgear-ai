import type { CSSProperties } from "react";
import type { EquipId } from "@/types/fitgear";

const EQUIP_ICON_PATHS: Record<EquipId, React.ReactNode> = {
  helmet: (
    <>
      <path d="M4 12.5C4 7.8 7.6 4 12 4s8 3.8 8 8.5V17a2 2 0 01-2 2H6a2 2 0 01-2-2v-4.5z" />
      <path d="M6.5 13h11" />
      <path d="M6.8 16.3h10.4" />
      <path d="M9 13v6" />
      <path d="M15 13v6" />
    </>
  ),
  skates: (
    <>
      <path d="M7 3.2h3.2a2.6 2.6 0 012.6 2.6v5.6c0 .8.5 1.5 1.3 1.7l3.4.9" />
      <path d="M7 3.2v10.5" />
      <path d="M4 15.4h14" />
      <path d="M18 15.4c1.6-.2 2.6-.9 2.6-.9" />
    </>
  ),
  stick: (
    <>
      <path d="M19 3L9.8 16" />
      <path d="M9.8 16l-5.2 1.2a1.3 1.3 0 00-1 1.5l.2 1.1 6.7-1.6a1.5 1.5 0 001.1-1.8z" />
    </>
  ),
  gloves: (
    <>
      <path d="M8 4.5a2 2 0 014 0v6.5" />
      <path d="M12 5.2a2 2 0 014 0v5.8" />
      <path d="M6.5 10.3a2 2 0 014 0v1.8" />
      <path d="M6.5 12v2.5c0 3.6 2.8 6.5 6.3 6.5s6.2-2.7 6.2-6.1V9.5" />
      <path d="M6.5 14.5c-1.6.2-2.8 1.5-2.8 3.1 0 1.5 1.1 2.8 2.6 3l1.2.1" />
    </>
  ),
  shoulder: (
    <>
      <path d="M7 6.5a3 3 0 013-3h4a3 3 0 013 3v2.3a6 6 0 01-2 4.5v3a1.6 1.6 0 01-1.6 1.6h-2.8A1.6 1.6 0 019 16.3v-3a6 6 0 01-2-4.5V6.5z" />
      <path d="M7 7.2a2.4 2.4 0 00-2.4 2.4v.6" />
      <path d="M17 7.2a2.4 2.4 0 012.4 2.4v.6" />
    </>
  ),
  pants: (
    <>
      <path d="M6 3.5h12v4.3l-1.3 11.7h-2.7l-.8-9h-2.4l-.8 9H7.3L6 7.8z" />
      <line x1="6" y1="7.8" x2="18" y2="7.8" />
    </>
  ),
  elbow: (
    <>
      <ellipse cx="12" cy="12" rx="4.3" ry="8.3" />
      <circle cx="12" cy="12" r="2.4" />
      <line x1="8.1" y1="7" x2="15.9" y2="7" />
      <line x1="8.1" y1="17" x2="15.9" y2="17" />
    </>
  ),
  shin: (
    <>
      <path d="M8.5 6.2a3.5 3.5 0 017 0v2.6c0 .9-.2 1.8-.5 2.6l-1.6 4.2c-.3.7-.4 1.5-.4 2.3v1.3H11v-1.3c0-.8-.1-1.6-.4-2.3L9 11.4a7.5 7.5 0 01-.5-2.6V6.2z" />
      <path d="M8.6 9.3h6.8" />
      <path d="M9.4 13.3h5.2" />
    </>
  ),
};

export function EquipIcon({
  id,
  size = 26,
  color = "var(--fg-brand)",
}: {
  id: EquipId;
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {EQUIP_ICON_PATHS[id]}
    </svg>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
  );
}

export function StepHeader({
  onBack,
  step,
  label,
}: {
  onBack: () => void;
  step: 1 | 2 | 3;
  label: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
      <BackButton onClick={onBack} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: 4,
                flex: 1,
                borderRadius: 2,
                background: n <= step ? "var(--fg-brand)" : "#D6E1ED",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#92A0B0", marginTop: 7 }}>
          Step {step} of 3 · {label}
        </div>
      </div>
    </div>
  );
}

export function ContinueButton({
  onClick,
  label = "Continue",
  variant = "deep",
}: {
  onClick: () => void;
  label?: string;
  variant?: "deep" | "brand";
}) {
  const bg = variant === "deep" ? "var(--fg-brand-deep)" : "var(--fg-brand)";
  const shadow =
    variant === "deep" ? "0 12px 26px rgba(16,42,71,.26)" : "0 12px 28px rgba(31,95,212,.34)";
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 24,
        border: "none",
        cursor: "pointer",
        width: "100%",
        background: bg,
        color: "#fff",
        borderRadius: 18,
        padding: 18,
        fontFamily: "var(--font-archivo)",
        fontWeight: 700,
        fontSize: 17,
        boxShadow: shadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {label}
      <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
        <path d="M3 9h11M9 4l5 5-5 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function SectionLabel({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-archivo)",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".5px",
        textTransform: "uppercase",
        color: "#92A0B0",
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Chip({
  label,
  selected,
  onClick,
  flex,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  flex?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: flex ? 1 : undefined,
        border: "none",
        cursor: "pointer",
        padding: flex ? "13px 8px" : "11px 18px",
        borderRadius: 13,
        fontWeight: 700,
        fontSize: flex ? 14.5 : 15,
        fontFamily: "var(--font-hanken)",
        background: selected ? "var(--fg-brand)" : "#fff",
        color: selected ? "#fff" : "#13263F",
        boxShadow: selected ? "inset 0 0 0 2px var(--fg-brand)" : "inset 0 0 0 1px rgba(19,38,63,.1)",
      }}
    >
      {label}
    </button>
  );
}
