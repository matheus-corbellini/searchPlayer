export interface User {
  id?: string; // Optional for new users, will be set to Firebase UID
  uid: string; // Firebase UID
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
