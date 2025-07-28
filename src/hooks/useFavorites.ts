"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

// Hook para gerenciar jogadores e times favoritos do usuário
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

  // Adiciona ou remove jogador dos favoritos
  const toggleFavoritePlayer = async (playerId: number) => {
    const newFavorites = favoritePlayers.includes(playerId)
      ? favoritePlayers.filter((id) => id !== playerId)
      : [...favoritePlayers, playerId];

    setFavoritesPlayers(newFavorites);
    await updateUser({ favoritePlayers: newFavorites });
  };

  // Adiciona ou remove time dos favoritos
  const toggleFavoriteTeam = async (teamId: number) => {
    const newFavorites = favoriteTeams.includes(teamId)
      ? favoriteTeams.filter((id) => id !== teamId)
      : [...favoriteTeams, teamId];

    setFavoriteTeams(newFavorites);
    await updateUser({ favoriteTeams: newFavorites });
  };

  // Verifica se jogador está nos favoritos
  const isPlayerFavorite = (playerId: number) =>
    favoritePlayers.includes(playerId);
  // Verifica se time está nos favoritos
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
