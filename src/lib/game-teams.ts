import type { GamePlayer, GameTeam } from "@/types/fitgear";

export const GAME_TEAMS: GameTeam[] = [
  { id: "frostbite-phantoms", name: "Frostbite Phantoms", jerseyColor: "#2f9bd6", trimColor: "#0b3d54", crest: "FRO" },
  { id: "arctic-stormbreakers", name: "Arctic Stormbreakers", jerseyColor: "#6b46c1", trimColor: "#2d1b4e", crest: "ARC" },
  { id: "glacier-ghosts", name: "Glacier Ghosts", jerseyColor: "#4fc3c9", trimColor: "#12494c", crest: "GHO" },
  { id: "power-play-predators", name: "Power Play Predators", jerseyColor: "#8b1e3f", trimColor: "#2a0a14", crest: "PPP" },
  { id: "winter-warhawks", name: "Winter Warhawks", jerseyColor: "#2e7d5b", trimColor: "#0f3d2c", crest: "WAR" },
];

export const GAME_PLAYERS: GamePlayer[] = GAME_TEAMS.flatMap((team) => [
  { name: `${team.name} Forward`, number: 27, ovr: 80, teamId: team.id },
  { name: `${team.name} Goalie`, number: 92, ovr: 80, teamId: team.id },
]);

export function shooterFor(teamId: string): GamePlayer {
  return GAME_PLAYERS.find((p) => p.teamId === teamId && p.number === 27) ?? GAME_PLAYERS[0];
}

export function goalieFor(teamId: string): GamePlayer {
  return GAME_PLAYERS.find((p) => p.teamId === teamId && p.number === 92) ?? GAME_PLAYERS[1];
}
