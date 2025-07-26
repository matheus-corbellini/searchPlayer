import type { Player, PlayerStatistics, Team } from "../types/Player";
import type { SearchFilters, Ranking } from "../types/SearchFilters";

// Mock data for demonstration
const mockPlayers: Player[] = [
  {
    id: 1,
    name: "Lionel Messi",
    firstname: "Lionel",
    lastname: "Messi",
    age: 36,
    birth: {
      date: "1987-06-24",
      place: "Rosario",
      country: "Argentina",
    },
    nationality: "Argentina",
    height: "170 cm",
    weight: "72 kg",
    injured: false,
    photo: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Cristiano Ronaldo",
    firstname: "Cristiano",
    lastname: "Ronaldo",
    age: 39,
    birth: {
      date: "1985-02-05",
      place: "Funchal",
      country: "Portugal",
    },
    nationality: "Portugal",
    height: "187 cm",
    weight: "83 kg",
    injured: false,
    photo: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Neymar Jr",
    firstname: "Neymar",
    lastname: "da Silva Santos Júnior",
    age: 32,
    birth: {
      date: "1992-02-05",
      place: "Mogi das Cruzes",
      country: "Brazil",
    },
    nationality: "Brazil",
    height: "175 cm",
    weight: "68 kg",
    injured: false,
    photo: "/placeholder.svg?height=200&width=200",
  },
];

const mockTeams: Team[] = [
  {
    id: 1,
    name: "Paris Saint-Germain",
    logo: "/placeholder.svg?height=50&width=50",
    founded: 1970,
    country: "France",
  },
  {
    id: 2,
    name: "Al Nassr",
    logo: "/placeholder.svg?height=50&width=50",
    founded: 1955,
    country: "Saudi Arabia",
  },
];

class ApiService {
  private baseUrl = "https://api-football-v1.p.rapidapi.com/v3";
  private apiKey = "your-api-key-here";

  async searchPlayers(filters: SearchFilters): Promise<Player[]> {
    // Mock implementation - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 500));

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

    return filteredPlayers;
  }

  async getPlayer(id: number): Promise<Player | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPlayers.find((player) => player.id === id) || null;
  }

  async getPlayerStatistics(): Promise<PlayerStatistics[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Mock statistics
    return [
      {
        team: mockTeams[0],
        league: {
          id: 1,
          name: "Ligue 1",
          country: "France",
          logo: "/placeholder.svg?height=30&width=30",
          flag: "/placeholder.svg?height=20&width=30",
          season: 2023,
        },
        games: {
          appearences: 25,
          lineups: 23,
          minutes: 2100,
          number: 10,
          position: "Attacker",
          rating: "8.5",
          captain: true,
        },
        substitutes: {
          in: 2,
          out: 5,
          bench: 2,
        },
        shots: {
          total: 85,
          on: 45,
        },
        goals: {
          total: 18,
          conceded: 0,
          assists: 12,
          saves: 0,
        },
        passes: {
          total: 1250,
          key: 65,
          accuracy: 88,
        },
        tackles: {
          total: 15,
          blocks: 3,
          interceptions: 8,
        },
        duels: {
          total: 180,
          won: 95,
        },
        dribbles: {
          attempts: 120,
          success: 85,
          past: 0,
        },
        fouls: {
          drawn: 45,
          committed: 12,
        },
        cards: {
          yellow: 3,
          yellowred: 0,
          red: 0,
        },
        penalty: {
          won: 5,
          commited: 0,
          scored: 4,
          missed: 1,
          saved: 0,
        },
      },
    ];
  }

  async getTopPlayers(): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockPlayers.slice(0, 10);
  }

  async getRankings(type: "goals" | "assists" | "cards"): Promise<Ranking> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      type,
      players: mockPlayers.map((player, index) => ({
        player,
        team: mockTeams[index % mockTeams.length],
        value:
          type === "goals"
            ? 25 - index * 3
            : type === "assists"
            ? 15 - index * 2
            : index + 1,
      })),
    };
  }

  async getPlayerSuggestions(query: string): Promise<Player[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (query.length < 2) return [];

    return mockPlayers
      .filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }
}

export const apiService = new ApiService();
