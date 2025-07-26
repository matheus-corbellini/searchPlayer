import type { User } from "../types/User";

class AuthService {
  private readonly USER_STORAGE_KEY = "user";

  async login(email: string): Promise<User> {
    // Mock login - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      favoriteTeams: [],
      favoritePlayers: [],
      preferences: {
        theme: "light",
        language: "pt",
      },
    };

    // Store user in localStorage
    this.saveUserToStorage(mockUser);

    return mockUser;
  }

  async register(email: string, name: string): Promise<User> {
    // Mock registration - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      favoriteTeams: [],
      favoritePlayers: [],
      preferences: {
        theme: "light",
        language: "pt",
      },
    };

    // Store user in localStorage
    this.saveUserToStorage(mockUser);

    return mockUser;
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const updatedUser = { ...currentUser, ...updates };

    // Mock API call - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Store updated user in localStorage
    this.saveUserToStorage(updatedUser);

    return updatedUser;
  }

  async logout(): Promise<void> {
    // Mock API call - replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Remove user from localStorage
    this.removeUserFromStorage();
  }

  getCurrentUser(): User | null {
    const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        this.removeUserFromStorage();
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }
}

export const authService = new AuthService();
