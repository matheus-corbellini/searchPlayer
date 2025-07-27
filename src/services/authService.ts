import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
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

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      let user = await firestoreService.getUserByUid(firebaseUser.uid);

      if (!user) {
        // If user doesn't exist in Firestore, create it
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

      // Store user in localStorage
      this.saveUserToStorage(user);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Update user
  async updateUser(updates: Partial<User>): Promise<User> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    try {
      // Update in Firestore
      await firestoreService.updateUser(currentUser.uid, updates);

      // Update local user
      const updatedUser = { ...currentUser, ...updates };
      this.saveUserToStorage(updatedUser);

      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Sign out from Firebase Auth
      await signOut(auth);

      // Remove user from localStorage
      this.removeUserFromStorage();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Get current user from localStorage
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          // User is signed in
          const user = await firestoreService.getUserByUid(firebaseUser.uid);
          if (user) {
            this.saveUserToStorage(user);
            callback(user);
          } else {
            callback(null);
          }
        } else {
          // User is signed out
          this.removeUserFromStorage();
          callback(null);
        }
      }
    );
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
  }

  private removeUserFromStorage(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }
}

export const authService = new AuthService();
