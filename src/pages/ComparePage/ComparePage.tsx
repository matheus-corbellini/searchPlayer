"use client";

import type React from "react";
import { useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import { apiService } from "../../services/api";
import type { Player } from "../../types/Player";

const ComparePage: React.FC = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [suggestions, setSuggestions] = useState<Player[]>([]);

  const handleSearch = async (query: string) => {
    if (query.trim().length > 2) {
      try {
        const results = await apiService.getPlayerSuggestions(query);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const addPlayer = (player: Player) => {
    if (
      selectedPlayers.length < 3 &&
      !selectedPlayers.find((p) => p.id === player.id)
    ) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
    setSuggestions([]);
  };

  const removePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId));
  };

  const getComparisonValue = (player: Player, field: keyof Player) => {
    const value = player[field];
    if (typeof value === "number") {
      return value;
    }
    return 0;
  };

  const getComparisonWinner = (players: Player[], field: keyof Player) => {
    if (players.length < 2) return null;

    const values = players.map((p) => getComparisonValue(p, field));
    const maxValue = Math.max(...values);
    const winners = values
      .map((v, i) => (v === maxValue ? i : -1))
      .filter((i) => i !== -1);

    return winners.length === 1 ? winners[0] : null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">⚖️ Comparar Jogadores</h1>

      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Adicionar Jogadores</h2>
          <div className="relative">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar jogador para comparar..."
            />

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {suggestions.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => addPlayer(player)}
                  >
                    <img
                      src={player.photo || "/placeholder.svg"}
                      alt={player.name}
                      className="w-10 h-10 rounded-full mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder.svg?height=40&width=40";
                      }}
                    />
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-600">
                        {player.nationality} • {player.age} anos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Selecione até 3 jogadores para comparar
          </div>
        </div>
      </div>

      {selectedPlayers.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Comparação</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estatística
                  </th>
                  {selectedPlayers.map((player) => (
                    <th
                      key={player.id}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex flex-col items-center">
                        <img
                          src={player.photo || "/placeholder.svg"}
                          alt={player.name}
                          className="w-12 h-12 rounded-full mb-2"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg?height=48&width=48";
                          }}
                        />
                        <div className="font-medium">{player.name}</div>
                        <button
                          onClick={() => removePlayer(player.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1"
                        >
                          Remover
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Idade
                  </td>
                  {selectedPlayers.map((player, index) => {
                    const isWinner =
                      getComparisonWinner(selectedPlayers, "age") === index;
                    return (
                      <td
                        key={player.id}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                          isWinner
                            ? "bg-green-50 text-green-800 font-semibold"
                            : "text-gray-900"
                        }`}
                      >
                        {player.age} anos
                        {isWinner && <span className="ml-1">🏆</span>}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Nacionalidade
                  </td>
                  {selectedPlayers.map((player) => (
                    <td
                      key={player.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900"
                    >
                      {player.nationality}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Altura
                  </td>
                  {selectedPlayers.map((player, index) => {
                    const isWinner =
                      getComparisonWinner(selectedPlayers, "height") === index;
                    return (
                      <td
                        key={player.id}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                          isWinner
                            ? "bg-green-50 text-green-800 font-semibold"
                            : "text-gray-900"
                        }`}
                      >
                        {player.height}
                        {isWinner && <span className="ml-1">🏆</span>}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Peso
                  </td>
                  {selectedPlayers.map((player, index) => {
                    const isWinner =
                      getComparisonWinner(selectedPlayers, "weight") === index;
                    return (
                      <td
                        key={player.id}
                        className={`px-6 py-4 whitespace-nowrap text-sm text-center ${
                          isWinner
                            ? "bg-green-50 text-green-800 font-semibold"
                            : "text-gray-900"
                        }`}
                      >
                        {player.weight}
                        {isWinner && <span className="ml-1">🏆</span>}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Status
                  </td>
                  {selectedPlayers.map((player) => (
                    <td
                      key={player.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-center"
                    >
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          player.injured
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {player.injured ? "Lesionado" : "Disponível"}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPlayers.length === 0 && (
        <div className="text-center text-gray-600 py-12">
          <p className="text-lg mb-2">Nenhum jogador selecionado</p>
          <p className="text-sm">
            Use a barra de pesquisa acima para adicionar jogadores à comparação
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
