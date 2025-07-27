"use client";

import type React from "react";
import { useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/User";
import { AuthContext } from "./AuthContextDef";
import { authService } from "../services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Limpar persistência de autenticação quando o componente é montado
  useEffect(() => {
    // Garantir que não há sessão persistente
    authService.clearAuthPersistence();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const user = await authService.register(email, password, name);
      setUser(user);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      setIsLoading(true);
      try {
        const updatedUser = await authService.updateUser(updates);
        setUser(updatedUser);
      } catch (error) {
        console.error("Update user error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
