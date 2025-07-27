"use client";

import { useState, useEffect, useCallback } from "react";
import type { Player } from "../types/Player";
import { apiService } from "../services/api";

export const useAutocomplete = (delay = 300) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPlayers = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await apiService.getPlayerSuggestions(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching player suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await apiService.getPlayerSuggestions(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching player suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay, debouncedSearch]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    searchPlayers,
    clearSuggestions: () => setSuggestions([]),
  };
};
