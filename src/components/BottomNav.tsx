import type { Screen } from "@/types/fitgear";

interface Props {
  screen: Screen;
  onHome: () => void;
  onFind: () => void;
  onChat: () => void;
}

function NavButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  const color = active ? "var(--fg-brand)" : "#9FB0C2";
  return (
    <button
      onClick={onClick}
      style={{
        border: "none",
        background: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "6px 18px",
      }}
    >
      {icon}
      <span style={{ fontSize: 10.5, fontWeight: 700, color }}>{label}</span>
    </button>
  );
}

export default function BottomNav({ screen, onHome, onFind, onChat }: Props) {
  const homeColor = screen === "home" ? "var(--fg-brand)" : "#9FB0C2";
  const findColor = screen === "results" ? "var(--fg-brand)" : "#9FB0C2";
  const chatColor = screen === "chat" ? "var(--fg-brand)" : "#9FB0C2";

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 84,
        paddingBottom: 22,
        background: "rgba(255,255,255,.86)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderTop: "1px solid rgba(19,38,63,.07)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 40,
      }}
    >
      <NavButton
        active={screen === "home"}
        onClick={onHome}
        label="Home"
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M3 9l8-6 8 6v9a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1V9z"
              stroke={homeColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <NavButton
        active={screen === "results"}
        onClick={onFind}
        label="Find"
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="9.5" cy="9.5" r="6" stroke={findColor} strokeWidth="1.8" />
            <path d="M14 14l4 4" stroke={findColor} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        }
      />
      <NavButton
        active={screen === "chat"}
        onClick={onChat}
        label="Guide"
        icon={
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M4 5h14a1 1 0 011 1v9a1 1 0 01-1 1H9l-5 3V6a1 1 0 011-1z"
              stroke={chatColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </div>
  );
}
