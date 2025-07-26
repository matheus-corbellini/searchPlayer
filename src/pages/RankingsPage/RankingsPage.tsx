"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import type { Ranking } from "../../types/SearchFilters";

const RankingsPage: React.FC = () => {
  const [rankings, setRankings] = useState<Ranking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    "goals" | "assists" | "cards"
  >("goals");

  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        const rankingData = await apiService.getRankings(selectedType);
        setRankings(rankingData);
      } catch (err) {
        setError("Erro ao carregar rankings");
        console.error("Error loading rankings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [selectedType]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "goals":
        return "Gols";
      case "assists":
        return "Assistências";
      case "cards":
        return "Cartões";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "goals":
        return "⚽";
      case "assists":
        return "🎯";
      case "cards":
        return "🟨";
      default:
        return "🏆";
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-600">
          Erro ao carregar rankings: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Rankings</h1>

      <div className="mb-6">
        <div className="flex gap-4 mb-6">
          {(["goals", "assists", "cards"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {getTypeIcon(type)} {getTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando rankings...</p>
        </div>
      ) : rankings ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              {getTypeIcon(rankings.type)} Ranking de{" "}
              {getTypeLabel(rankings.type)}
            </h2>
          </div>

          <div className="divide-y">
            {rankings.players.map((item, index) => (
              <div
                key={item.player.id}
                className="flex items-center px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex-shrink-0 w-8 text-center font-bold text-gray-500">
                  #{index + 1}
                </div>

                <div className="flex-shrink-0 w-12 h-12 mx-4">
                  <img
                    src={item.player.photo || "/placeholder.svg"}
                    alt={item.player.name}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder.svg?height=48&width=48";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {item.player.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.team.name} • {item.player.age} anos
                  </p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getTypeLabel(rankings.type)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          Nenhum ranking disponível
        </div>
      )}
    </div>
  );
};

export default RankingsPage;
