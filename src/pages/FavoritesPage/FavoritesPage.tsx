"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import { useAuth } from "../../hooks/useAuth";
import { apiService } from "../../services/api";
import PlayerCard from "../../components/PlayerCard/PlayerCard";
import type { Player } from "../../types/Player";

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { favoritePlayers, favoriteTeams } = useFavorites();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoritePlayers = async () => {
      if (favoritePlayers.length > 0) {
        try {
          // Load player details for favorite player IDs
          const playerPromises = favoritePlayers.map((id) =>
            apiService.getPlayer(id)
          );
          const playerResults = await Promise.all(playerPromises);
          const validPlayers = playerResults.filter(
            (player) => player !== null
          ) as Player[];
          setPlayers(validPlayers);
        } catch (error) {
          console.error("Error loading favorite players:", error);
        }
      } else {
        setPlayers([]);
      }
      setLoading(false);
    };

    loadFavoritePlayers();
  }, [favoritePlayers]);

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-gray-600">
          Faça login para ver seus favoritos
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meus Favoritos</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Jogadores Favoritos</h2>
        {players.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => (
              <PlayerCard key={player.id} player={player} showFavorite={true} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-8">
            <p>Você ainda não tem jogadores favoritos</p>
            <p className="text-sm mt-2">
              Adicione jogadores à sua lista de favoritos para vê-los aqui
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Times Favoritos</h2>
        {favoriteTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* TODO: Implement team cards */}
            <div className="text-center text-gray-600 py-8">
              <p>Funcionalidade de times favoritos em desenvolvimento</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 py-8">
            <p>Você ainda não tem times favoritos</p>
            <p className="text-sm mt-2">
              Adicione times à sua lista de favoritos para vê-los aqui
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
