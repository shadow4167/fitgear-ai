import type { CSSProperties } from "react";

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
