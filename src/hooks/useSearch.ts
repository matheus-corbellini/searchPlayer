"use client";

import { useState } from "react";
import type { Player } from "../types/Player";
import type { SearchFilters } from "../types/SearchFilters";
import { apiService } from "../services/api";

export const useSearch = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  const searchPlayers = async (newFilters: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const results = await apiService.searchPlayers(newFilters);
      setPlayers(results);
      setFilters(newFilters);
    } catch (err) {
      setError("Erro ao buscar jogadores");
      console.error("Error fetching players:", err);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setPlayers([]);
    setFilters({});
    setError(null);
  };

  return {
    players,
    loading,
    error,
    filters,
    searchPlayers,
    clearSearch,
  };
};
