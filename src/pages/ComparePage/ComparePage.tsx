"use client";

import type React from "react";
import { useState } from "react";
import type { Player, PlayerStatistics } from "../../types/Player";
import SearchBar from "../../components/SearchBar/SearchBar";
import Button from "../../components/Button";
import { apiService } from "../../services";
import "./ComparePage.css";

// Página para comparar estatísticas entre dois jogadores
const ComparePage: React.FC = () => {
  const [player1, setPlayer1] = useState<Player | null>(null);
  const [player2, setPlayer2] = useState<Player | null>(null);
  const [player1Stats, setPlayer1Stats] = useState<PlayerStatistics | null>(
    null
  );
  const [player2Stats, setPlayer2Stats] = useState<PlayerStatistics | null>(
    null
  );
  const [searchingFor, setSearchingFor] = useState<1 | 2 | null>(null);

  // Seleciona jogador para comparação
  const handlePlayerSelect = async (player: Player) => {
    if (searchingFor === 1) {
      setPlayer1(player);
      const stats = await apiService.getPlayerStatistics(player.id);
      setPlayer1Stats(stats[0] || null);
    } else if (searchingFor === 2) {
      setPlayer2(player);
      const stats = await apiService.getPlayerStatistics(player.id);
      setPlayer2Stats(stats[0] || null);
    }
    setSearchingFor(null);
  };

  // Remove jogador selecionado da comparação
  const clearPlayer = (playerNumber: 1 | 2) => {
    if (playerNumber === 1) {
      setPlayer1(null);
      setPlayer1Stats(null);
    } else {
      setPlayer2(null);
      setPlayer2Stats(null);
    }
  };

  // Extrai valor específico das estatísticas para comparação
  const getComparisonValue = (stats: PlayerStatistics | null, stat: string) => {
    if (!stats) return 0;

    switch (stat) {
      case "goals":
        return stats.goals.total;
      case "assists":
        return stats.goals.assists;
      case "matches":
        return stats.games.appearences;
      case "rating":
        return parseFloat(stats.games.rating) * 10;
      default:
        return 0;
    }
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
              <Button
                variant="ghost"
                className="close-btn"
                onClick={() => setSearchingFor(null)}
              >
                ✕
              </Button>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="clear-btn"
                  onClick={() => clearPlayer(1)}
                >
                  ✕
                </Button>
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="clear-btn"
                  onClick={() => clearPlayer(2)}
                >
                  ✕
                </Button>
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
                  {getComparisonValue(player1Stats, "goals")}
                </div>
                <div className="stat-value player2">
                  {getComparisonValue(player2Stats, "goals")}
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Assistências</div>
                <div className="stat-value player1">
                  {getComparisonValue(player1Stats, "assists")}
                </div>
                <div className="stat-value player2">
                  {getComparisonValue(player2Stats, "assists")}
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Jogos</div>
                <div className="stat-value player1">
                  {getComparisonValue(player1Stats, "matches")}
                </div>
                <div className="stat-value player2">
                  {getComparisonValue(player2Stats, "matches")}
                </div>
              </div>
              <div className="stat-row">
                <div className="stat-label">Avaliação</div>
                <div className="stat-value player1">
                  {(getComparisonValue(player1Stats, "rating") / 10).toFixed(1)}
                </div>
                <div className="stat-value player2">
                  {(getComparisonValue(player2Stats, "rating") / 10).toFixed(1)}
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
