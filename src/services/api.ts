import type { Player, PlayerStatistics, Team } from "../types/Player";
import type { SearchFilters, Ranking } from "../types/SearchFilters";
import {
  mockPlayers,
  mockTeams,
  generateMockStatistics,
} from "../data/mockData";

// Serviço principal para comunicação com API de dados de futebol
class ApiService {
  // Busca jogadores com filtros aplicados
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

  // Busca dados de um jogador específico por ID
  async getPlayer(id: number): Promise<Player | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPlayers.find((player) => player.id === id) || null;
  }

  // Busca estatísticas detalhadas de um jogador
  async getPlayerStatistics(playerId: number): Promise<PlayerStatistics[]> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return generateMockStatistics(playerId);
  }

  // Busca lista de jogadores mais populares
  async getTopPlayers(): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockPlayers;
  }

  // Busca rankings de gols, assistências ou cartões
  async getRankings(type: "goals" | "assists" | "cards"): Promise<Ranking> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Obter estatísticas para todos os jogadores
    const playersWithStats = await Promise.all(
      mockPlayers.map(async (player) => {
        const stats = await this.getPlayerStatistics(player.id);
        return { player, stats: stats[0] };
      })
    );

    // Filtrar jogadores que têm estatísticas e ordenar baseado no tipo
    const sortedPlayers = playersWithStats
      .filter((item) => item.stats)
      .sort((a, b) => {
        let aValue = 0;
        let bValue = 0;

        switch (type) {
          case "goals":
            aValue = a.stats!.goals.total;
            bValue = b.stats!.goals.total;
            break;
          case "assists":
            aValue = a.stats!.goals.assists;
            bValue = b.stats!.goals.assists;
            break;
          case "cards":
            aValue = a.stats!.cards.yellow + a.stats!.cards.red;
            bValue = b.stats!.cards.yellow + b.stats!.cards.red;
            break;
        }

        return bValue - aValue;
      });

    return {
      type,
      players: sortedPlayers.slice(0, 10).map((item) => ({
        player: item.player,
        team: item.stats!.team,
        value:
          type === "goals"
            ? item.stats!.goals.total
            : type === "assists"
            ? item.stats!.goals.assists
            : item.stats!.cards.yellow + item.stats!.cards.red,
      })),
    };
  }

  // Busca sugestões de jogadores para autocompletar
  async getPlayerSuggestions(query: string): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (query.length < 2) return [];

    return mockPlayers
      .filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }

  // Busca todos os jogadores disponíveis
  async getAllPlayers(): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockPlayers;
  }

  // Busca todos os times disponíveis
  async getAllTeams(): Promise<Team[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockTeams;
  }
}

export const apiService = new ApiService();
