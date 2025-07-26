export interface User {
  id: string;
  email: string;
  name: string;
  favoriteTeams: number[];
  favoritePlayers: number[];
  preferences: {
    theme: "light" | "dark";
    language: string;
  };
}
