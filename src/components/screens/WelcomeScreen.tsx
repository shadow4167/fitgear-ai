interface Props {
  onContinue: () => void;
}

const LOGO_BLUE = "#3558D6";
const LOGO_NAVY = "#1B2A4A";

export default function WelcomeScreen({ onContinue }: Props) {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "62px 28px 48px",
        boxSizing: "border-box",
        animation: "fgIn .3s ease",
      }}
    >
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: LOGO_BLUE,
            boxShadow: `0 10px 30px ${LOGO_BLUE}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div style={{ width: 24, height: 24, borderRadius: 5, background: "#fff", transform: "rotate(45deg)" }} />
        </div>
        <span
          style={{
            fontFamily: "var(--font-archivo)",
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: "-1px",
            color: LOGO_NAVY,
            whiteSpace: "nowrap",
          }}
        >
          FitGear <span style={{ color: LOGO_BLUE }}>AI</span>
        </span>
      </div>

      <button
        onClick={onContinue}
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "17px 0",
          border: "none",
          borderRadius: 16,
          background: LOGO_BLUE,
          color: "#fff",
          fontFamily: "var(--font-archivo)",
          fontWeight: 700,
          fontSize: 17,
          cursor: "pointer",
        }}
      >
        Continue
      </button>
    </div>
  );
}
