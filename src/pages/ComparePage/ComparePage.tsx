"use client";

import type React from "react";
import { useState } from "react";
import type { Player } from "../../types/Player";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./ComparePage.css";

const ComparePage: React.FC = () => {
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [searchingFor, setSearchingFor] = useState<1 | 2 | null>(null);

  const handlePlayerSelect = (player: Player) => {
    if (searchingFor === 1) {
      setPlayer1(player);
    } else if (searchingFor === 2) {
      setPlayer2(player);
    }
    setSearchingFor(null);
  };

  const clearPlayer = (playerNumber: 1 | 2) => {
    if (playerNumber === 1) {
      setPlayer1(null);
    } else {
      setPlayer2(null);
    }
  };

  const getComparisonValue = (player: Player, stat: string) => {
    // Mock comparison values - replace with real data
    const mockStats: Record<string, number> = {
      goals: Math.floor(Math.random() * 30) + 5,
      assists: Math.floor(Math.random() * 20) + 2,
      matches: Math.floor(Math.random() * 40) + 20,
      rating: Math.floor(Math.random() * 20) + 70, // 70-90 range
    };
    return mockStats[stat] || 0;
  };

  return (
    <div className="compare-page">
      <div className="compare-header">
        <h1 className="compare-title text-3xl font-bold mb-6">
          ⚖️ Comparar Jogadores
        </h1>
        <p className="compare-description text-muted mb-8">
          Selecione dois jogadores para comparar suas estatísticas e performance
        </p>
      </div>

      {searchingFor && (
        <div className="search-overlay">
          <div className="search-modal">
            <div className="search-modal-header">
              <h3 className="search-modal-title">
                Selecionar Jogador {searchingFor}
              </h3>
              <button
                className="close-btn"
                onClick={() => setSearchingFor(null)}
              >
                ✕
              </button>
            </div>
            <div className="search-modal-content">
              <SearchBar
                onSearch={() => {}}
                onPlayerSelect={handlePlayerSelect}
              />
            </div>
          </div>
        </div>
      )}

      <div className="compare-content">
        <div className="players-selection">
          <div className="player-slot">
            <div className="slot-header">
              <h3 className="slot-title">Jogador 1</h3>
              {player1 && (
                <button
                  className="clear-btn btn btn-ghost btn-sm"
                  onClick={() => clearPlayer(1)}
                >
                  ✕
                </button>
              )}
            </div>

            {!player1 ? (
              <div className="empty-slot" onClick={() => setSearchingFor(1)}>
                <div className="empty-slot-content">
                  <div className="empty-icon">👤</div>
                  <p>Clique para selecionar um jogador</p>
                </div>
              </div>
            ) : (
              <div className="selected-player">
                <div className="player-photo-placeholder">
                  <span className="player-photo-initial">
                    {player1.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h4 className="player-name">{player1.name}</h4>
                <p className="player-info text-muted">
                  {player1.nationality} • {player1.age} anos
                </p>
                <p className="player-physical text-muted">
                  {player1.height} • {player1.weight}
                </p>
              </div>
            )}
          </div>

          <div className="vs-divider">
            <span className="vs-text">VS</span>
          </div>

          <div className="player-slot">
            <div className="slot-header">
              <h3 className="slot-title">Jogador 2</h3>
              {player2 && (
                <button
                  className="clear-btn btn btn-ghost btn-sm"
                  onClick={() => clearPlayer(2)}
                >
                  ✕
                </button>
              )}
            </div>

            {!player2 ? (
              <div className="empty-slot" onClick={() => setSearchingFor(2)}>
                <div className="empty-slot-content">
                  <div className="empty-icon">👤</div>
                  <p>Clique para selecionar um jogador</p>
                </div>
              </div>
            ) : (
              <div className="selected-player">
                <div className="player-photo-placeholder">
                  <span className="player-photo-initial">
                    {player2.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h4 className="player-name">{player2.name}</h4>
                <p className="player-info text-muted">
                  {player2.nationality} • {player2.age} anos
                </p>
                <p className="player-physical text-muted">
                  {player2.height} • {player2.weight}
                </p>
              </div>
            )}
          </div>
        </div>

        {player1 && player2 && (
          <div className="comparison-results">
            <h3 className="results-title">📊 Comparação de Estatísticas</h3>
            <div className="stats-comparison">
              <div className="stat-row">
                <div className="stat-label">Gols</div>
                <div className="stat-value player1">
                  {getComparisonValue(player1, "goals")}
                </div>
                <div className="stat-value player2">
                  {getComparisonValue(player2, "goals")}
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Assistências</div>
                <div className="stat-value player1">
                  {getComparisonValue(player1, "assists")}
                </div>
                <div className="stat-value player2">
                  {getComparisonValue(player2, "assists")}
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Jogos</div>
                <div className="stat-value player1">
                  {getComparisonValue(player1, "matches")}
                </div>
                <div className="stat-value player2">
                  {getComparisonValue(player2, "matches")}
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Avaliação</div>
                <div className="stat-value player1">
                  {(getComparisonValue(player1, "rating") / 10).toFixed(1)}
                </div>
                <div className="stat-value player2">
                  {(getComparisonValue(player2, "rating") / 10).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
