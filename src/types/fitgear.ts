export type Tier = "Beginner" | "House League" | "Travel" | "AA" | "AAA";
export type Position = "Forward" | "Defense" | "Goalie";
export type Division = "U10" | "U12" | "U14" | "U16" | "U18";
export type EquipId =
  | "helmet"
  | "skates"
  | "stick"
  | "gloves"
  | "shoulder"
  | "pants"
  | "elbow"
  | "shin";

export type Screen =
  | "home"
  | "level"
  | "type"
  | "budget"
  | "search"
  | "results"
  | "detail"
  | "chat"
  | "game"
  | "shop";

export interface Equipment {
  id: EquipId;
  name: string;
  desc: string;
}

export interface StoreOffer {
  name: string;
  price: number;
  cond: string;
}

export interface GearCandidate {
  id: string;
  brand: string;
  model: string;
  specs: string[];
  tierFit: Tier[];
  positionFit?: Position[];
  stores: StoreOffer[];
}

export interface GearCatalogEntry {
  category: string;
  low: number;
  avg: number;
  high: number;
  candidates: GearCandidate[];
}

export interface TopPick {
  brand: string;
  model: string;
  price: number;
  store: string;
  fit: string;
  why: string;
  specs: string[];
  stores: StoreOffer[];
}

export interface AltPick {
  brand: string;
  model: string;
  price: number;
  store: string;
  fit: string;
  note: string;
}

export interface ResultEntry {
  category: string;
  low: number;
  avg: number;
  high: number;
  top: TopPick;
  alts: AltPick[];
}

export interface ChatRec {
  id: EquipId;
  category: string;
  brand: string;
  model: string;
  price: number;
  store: string;
}

export interface ChatMessage {
  role: "guide" | "user";
  text: string;
  rec?: ChatRec;
}

export interface GameTeam {
  id: string;
  name: string;
  jerseyColor: string;
  trimColor: string;
  crest: string;
}

export interface GamePlayer {
  name: string;
  number: number;
  ovr: number;
  teamId: string;
}

export interface GameWallet {
  currency: number;
  ownedStickIds: string[];
}

export interface OnIceSkater {
  id: string;
  role: "teammate" | "defender";
  x: number;
  y: number;
}

export type PassOutcome = "success" | "intercepted";
