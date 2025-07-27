import type { Player, PlayerStatistics, Team } from "../types/Player";
import type { SearchFilters, Ranking } from "../types/SearchFilters";
import {
  mockPlayers,
  mockTeams,
  generateMockStatistics,
} from "../data/mockData";

class ApiService {
  async searchPlayers(filters: SearchFilters): Promise<Player[]> {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredPlayers = [...mockPlayers];

    if (filters.name) {
      filteredPlayers = filteredPlayers.filter((player) =>
        player.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }

    if (filters.nationality) {
      filteredPlayers = filteredPlayers.filter((player) =>
        player.nationality
          .toLowerCase()
          .includes(filters.nationality!.toLowerCase())
      );
    }

    if (filters.position) {
      filteredPlayers = filteredPlayers.filter((player) =>
        player.name.toLowerCase().includes(filters.position!.toLowerCase())
      );
    }

    return filteredPlayers;
  }

  async getPlayer(id: number): Promise<Player | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPlayers.find((player) => player.id === id) || null;
  }

  async getPlayerStatistics(playerId: number): Promise<PlayerStatistics[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return generateMockStatistics(playerId);
  }

  async getTopPlayers(): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPlayers.slice(0, 10);
  }

  async getRankings(type: "goals" | "assists" | "cards"): Promise<Ranking> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const sortedPlayers = [...mockPlayers].sort((a, b) => {
      // Simular diferentes rankings baseados no tipo
      const aValue =
        type === "goals" ? a.id * 2 : type === "assists" ? a.id * 1.5 : a.id;
      const bValue =
        type === "goals" ? b.id * 2 : type === "assists" ? b.id * 1.5 : b.id;
      return bValue - aValue;
    });

    return {
      type,
      players: sortedPlayers.slice(0, 10).map((player, index) => ({
        player,
        team: mockTeams[index % mockTeams.length],
        value:
          type === "goals"
            ? 25 - index * 2
            : type === "assists"
            ? 15 - index * 1
            : index + 1,
      })),
    };
  }

  async getPlayerSuggestions(query: string): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (query.length < 2) return [];

    return mockPlayers
      .filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }

  async getAllPlayers(): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockPlayers;
  }

  async getAllTeams(): Promise<Team[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockTeams;
  }
}

export const apiService = new ApiService();
