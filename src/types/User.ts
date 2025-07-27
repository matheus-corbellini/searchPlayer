export interface User {
  id?: string;
  uid: string;
  email: string;
  name: string;
  favoriteTeams: number[];
  favoritePlayers: number[];
  preferences: {
    theme: "light" | "dark";
    language: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
