import type { Division, Position, Tier } from "@/types/fitgear";
import { Chip, ContinueButton, SectionLabel, StepHeader } from "./shared";

const TIERS: Tier[] = ["Beginner", "House League", "Travel", "AA", "AAA"];
const POSITIONS: Position[] = ["Forward", "Defense", "Goalie"];
const DIVISIONS: Division[] = ["U10", "U12", "U14", "U16", "U18"];

interface Props {
  tier: Tier;
  position: Position;
  division: Division;
  onBack: () => void;
  onSelectTier: (t: Tier) => void;
  onSelectPosition: (p: Position) => void;
  onSelectDivision: (d: Division) => void;
  onContinue: () => void;
}

export default function LevelScreen({
  tier,
  position,
  division,
  onBack,
  onSelectTier,
  onSelectPosition,
  onSelectDivision,
  onContinue,
}: Props) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", padding: "58px 20px 40px", boxSizing: "border-box", animation: "fgIn .3s ease" }}>
      <StepHeader onBack={onBack} step={1} label="Your level" />

      <h2 style={{ fontFamily: "var(--font-archivo)", fontWeight: 800, fontSize: 26, letterSpacing: "-.5px", margin: "8px 0 6px" }}>
        What&rsquo;s your level?
      </h2>
      <p style={{ fontSize: 14.5, color: "#5B6B7E", margin: "0 0 26px", lineHeight: 1.4 }}>
        We match gear protection and stiffness to how you actually play.
      </p>

      <SectionLabel>Tier</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 24 }}>
        {TIERS.map((t) => (
          <Chip key={t} label={t} selected={t === tier} onClick={() => onSelectTier(t)} />
        ))}
      </div>

      <SectionLabel>Position</SectionLabel>
      <div style={{ display: "flex", gap: 9, marginBottom: 24 }}>
        {POSITIONS.map((p) => (
          <Chip key={p} label={p} selected={p === position} onClick={() => onSelectPosition(p)} flex />
        ))}
      </div>

      <SectionLabel>Age division</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
        {DIVISIONS.map((d) => (
          <Chip key={d} label={d} selected={d === division} onClick={() => onSelectDivision(d)} />
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <ContinueButton onClick={onContinue} />
    </div>
  );
}
