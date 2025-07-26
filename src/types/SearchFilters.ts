import type { Player, Team } from "./Player";

export interface SearchFilters {
  name?: string;
  team?: string;
  nationality?: string;
  position?: string;
  ageMin?: number;
  ageMax?: number;
}

export interface Ranking {
  type: "goals" | "assists" | "cards";
  players: Array<{
    player: Player;
    team: Team;
    value: number;
  }>;
}
