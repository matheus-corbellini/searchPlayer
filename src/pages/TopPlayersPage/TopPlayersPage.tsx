"use client";

import type React from "react";
import { useState, useEffect } from "react";
import PlayerCard from "../../components/PlayerCard/PlayerCard";
import { apiService } from "../../services/api";
import type { Player } from "../../types/Player";

const TopPlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTopPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const topPlayers = await apiService.getTopPlayers();
        setPlayers(topPlayers);
      } catch (err) {
        setError("Erro ao carregar top jogadores");
        console.error("Error loading top players:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTopPlayers();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-600">
          Erro ao carregar top jogadores: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">👑 Top Jogadores</h1>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando top jogadores...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top 3 Players with special styling */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">🏆 Top 3</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {players.slice(0, 3).map((player, index) => (
                <div key={player.id} className="relative">
                  <div className="absolute -top-4 -left-4 z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-orange-600"
                      }`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                  </div>
                  <div
                    className={`transform transition-transform hover:scale-105 ${
                      index === 0
                        ? "scale-110"
                        : index === 1
                        ? "scale-105"
                        : "scale-100"
                    }`}
                  >
                    <PlayerCard player={player} showFavorite={true} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rest of the players */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">📊 Top 10 Completo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player, index) => (
                <div key={player.id} className="relative">
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                  </div>
                  <PlayerCard player={player} showFavorite={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && players.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          <p>Nenhum jogador encontrado</p>
        </div>
      )}
    </div>
  );
};

export default TopPlayersPage;
