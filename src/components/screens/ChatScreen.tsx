import type { KeyboardEvent } from "react";
import type { ChatMessage } from "@/types/fitgear";
import { BackButton } from "./shared";

const SUGGESTIONS = ["What helmet for AAA?", "Cheapest skates under $500", "Best value stick"];

interface Props {
  messages: ChatMessage[];
  typing: boolean;
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onSuggestion: (text: string) => void;
  onBack: () => void;
}

export default function ChatScreen({ messages, typing, draft, onDraftChange, onSend, onSuggestion, onBack }: Props) {
  const showSuggestions = messages.length <= 1 && !typing;

  function onDraftKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") onSend();
  }

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "54px 18px 14px",
          background: "rgba(238,243,248,.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(19,38,63,.06)",
        }}
      >
        <BackButton onClick={onBack} />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "var(--fg-brand)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(31,95,212,.3)",
          }}
        >
          <div style={{ width: 14, height: 14, background: "#fff", transform: "rotate(45deg)", borderRadius: 2 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 16 }}>FitGear Coach</div>
          <div style={{ fontSize: 11.5, color: "#1E7A6B", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#21B07A", display: "inline-block" }} />
            Online · powered by AI
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "18px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "80%",
                  background: isUser ? "var(--fg-brand)" : "#fff",
                  color: isUser ? "#fff" : "#13263F",
                  padding: "12px 15px",
                  borderRadius: 18,
                  fontSize: 14,
                  lineHeight: 1.45,
                  boxShadow: "0 2px 10px rgba(19,38,63,.06)",
                }}
              >
                {m.text}
                {m.rec && (
                  <div style={{ marginTop: 11, background: "#F4F8FC", borderRadius: 13, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: "repeating-linear-gradient(135deg,#E6F1FB,#E6F1FB 6px,#DAE9F7 6px,#DAE9F7 12px)",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--fg-brand)" }}>
                        {m.rec.brand} · {m.rec.category}
                      </div>
                      <div style={{ fontFamily: "var(--font-archivo)", fontWeight: 700, fontSize: 14.5, color: "#13263F" }}>{m.rec.model}</div>
                      <div style={{ fontSize: 11.5, color: "#92A0B0" }}>
                        ${m.rec.price} at {m.rec.store}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#fff", padding: "14px 16px", borderRadius: 18, display: "flex", gap: 5, boxShadow: "0 2px 10px rgba(19,38,63,.06)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#9FB6CC", animation: "fgPulse 1s infinite" }} />
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#9FB6CC", animation: "fgPulse 1s infinite .2s" }} />
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#9FB6CC", animation: "fgPulse 1s infinite .4s" }} />
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "rgba(238,243,248,.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "10px 14px 26px",
          borderTop: "1px solid rgba(19,38,63,.06)",
        }}
      >
        {showSuggestions && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10 }}>
            {SUGGESTIONS.map((sg) => (
              <button
                key={sg}
                onClick={() => onSuggestion(sg)}
                style={{
                  whiteSpace: "nowrap",
                  border: "1px solid rgba(31,95,212,.25)",
                  background: "#fff",
                  cursor: "pointer",
                  color: "var(--fg-brand)",
                  borderRadius: 20,
                  padding: "9px 14px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  fontFamily: "var(--font-hanken)",
                  flexShrink: 0,
                }}
              >
                {sg}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 24, padding: "6px 6px 6px 18px", boxShadow: "0 3px 14px rgba(19,38,63,.08)" }}>
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={onDraftKey}
            placeholder="Ask about gear, level, or budget…"
            style={{ flex: 1, border: "none", outline: "none", background: "none", fontFamily: "var(--font-hanken)", fontSize: 14.5, color: "#13263F", minWidth: 0 }}
          />
          <button
            onClick={onSend}
            style={{
              border: "none",
              cursor: "pointer",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--fg-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 10h13M11 5l5 5-5 5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
