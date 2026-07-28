import { searchSources } from "@/lib/gear-data";

interface Props {
  searchStep: number;
  recapCat: string;
  recapLevel: string;
  recapBudget: string;
}

export default function SearchScreen({ searchStep, recapCat, recapLevel, recapBudget }: Props) {
  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "62px 28px 40px",
        boxSizing: "border-box",
        textAlign: "center",
        animation: "fgIn .3s ease",
      }}
    >
      <div style={{ position: "relative", width: 74, height: 74, marginBottom: 26 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "5px solid #DCE8F4" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "5px solid transparent",
            borderTopColor: "var(--fg-brand)",
            animation: "fgSpin .8s linear infinite",
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6.4" stroke="var(--fg-brand)" strokeWidth="2" />
            <path d="M13.6 13.6L17 17" stroke="var(--fg-brand)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <h2 style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 23, letterSpacing: "-.4px", margin: "0 0 8px" }}>
        Scanning the stores…
      </h2>
      <p style={{ fontSize: 14, color: "#5B6B7E", margin: "0 0 30px", lineHeight: 1.45 }}>
        Matching <b style={{ color: "#13263F" }}>{recapCat}</b> for a <b style={{ color: "#13263F" }}>{recapLevel}</b> to your{" "}
        <b style={{ color: "#13263F" }}>{recapBudget}</b> budget.
      </p>

      <div style={{ width: "100%", maxWidth: 300, display: "flex", flexDirection: "column", gap: 9 }}>
        {searchSources.map((name, i) => {
          const done = searchStep > i;
          const active = searchStep === i;
          return (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#fff",
                borderRadius: 13,
                padding: "13px 15px",
                boxShadow: "0 2px 8px rgba(19,38,63,.05)",
                opacity: searchStep >= i ? 1 : 0.45,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: done ? "var(--fg-brand)" : active ? "#C7D9EC" : "#E4ECF4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {done && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6.2l2.2 2.3 4.8-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ fontWeight: 600, fontSize: 14, color: "#13263F", textAlign: "left" }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
