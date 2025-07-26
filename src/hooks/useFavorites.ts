"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const { user, updateUser } = useAuth();
  const [favoritePlayers, setFavoritesPlayers] = useState<number[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      setFavoritesPlayers(user.favoritePlayers);
      setFavoriteTeams(user.favoriteTeams);
    }
  }, [user]);

  const toggleFavoritePlayer = (playerId: number) => {
    const newFavorites = favoritePlayers.includes(playerId)
      ? favoritePlayers.filter((id) => id !== playerId)
      : [...favoritePlayers, playerId];

    setFavoritesPlayers(newFavorites);
    updateUser({ favoritePlayers: newFavorites });
  };

  const toggleFavoriteTeam = (teamId: number) => {
    const newFavorites = favoriteTeams.includes(teamId)
      ? favoriteTeams.filter((id) => id !== teamId)
      : [...favoriteTeams, teamId];

    setFavoriteTeams(newFavorites);
    updateUser({ favoriteTeams: newFavorites });
  };

  const isPlayerFavorite = (playerId: number) =>
    favoritePlayers.includes(playerId);
  const isTeamFavorite = (teamId: number) => favoriteTeams.includes(teamId);

  return {
    favoritePlayers,
    favoriteTeams,
    toggleFavoritePlayer,
    toggleFavoriteTeam,
    isPlayerFavorite,
    isTeamFavorite,
  };
};
