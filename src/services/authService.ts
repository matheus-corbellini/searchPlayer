import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebaseconfig";
import { firestoreService } from "./firestoreService";
import type { User } from "../types/User";

class AuthService {
  private readonly USER_STORAGE_KEY = "user";

  // Register new user
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        favoriteTeams: [],
        favoritePlayers: [],
        preferences: {
          theme: "light",
          language: "pt",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await firestoreService.saveUser(newUser);

      // Store user in localStorage
      this.saveUserToStorage(newUser);

      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      let user = await firestoreService.getUserByUid(firebaseUser.uid);

      if (!user) {
        user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || email.split("@")[0],
          favoriteTeams: [],
          favoritePlayers: [],
          preferences: {
            theme: "light",
            language: "pt",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await firestoreService.saveUser(user);
      }

      this.saveUserToStorage(user);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async updateUser(updates: Partial<User>): Promise<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    try {
      await firestoreService.updateUser(currentUser.uid, updates);

      const updatedUser = { ...currentUser, ...updates };
      this.saveUserToStorage(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);

      this.removeUserFromStorage();

      this.clearAuthPersistence();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
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

  clearAuthPersistence(): void {
    this.removeUserFromStorage();

    // Limpar qualquer sessão persistente do Firebase
    // Isso garante que o usuário precisa fazer login manualmente na próxima vez
    if (typeof window !== "undefined") {
      // Limpar todos os dados relacionados à autenticação
      Object.keys(localStorage).forEach((key) => {
        if (key.includes("firebase") || key.includes("auth")) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // Removido o método onAuthStateChanged que causava login automático

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }
}

export const authService = new AuthService();
