"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import type { Player } from "../../types/Player";
import PlayerCard from "../../components/PlayerCard/PlayerCard";
import "./TopPlayersPage.css";

interface TopPlayersPageProps {
  onPlayerSelect: (player: Player) => void;
}

const TopPlayersPage: React.FC<TopPlayersPageProps> = ({ onPlayerSelect }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "week" | "month">("week");

  useEffect(() => {
    const loadTopPlayers = async () => {
      setLoading(true);
      try {
        const topPlayers = await apiService.getTopPlayers();
        setPlayers(topPlayers);
      } catch (error) {
        console.error("Error loading top players:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopPlayers();
  }, [filter]);

  const getFilterTitle = () => {
    switch (filter) {
      case "week":
        return "Top da Semana";
      case "month":
        return "Top do Mês";
      case "all":
        return "Mais Buscados";
      default:
        return "Top Jogadores";
    }
  };

  if (loading) {
    return (
      <div className="top-players-page">
        <div className="top-players-loading">
          <div className="loading-spinner" />
          <p>Carregando top jogadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="top-players-page">
      <div className="top-players-header">
        <h1 className="top-players-title text-3xl font-bold mb-6">
          👑 Top Jogadores
        </h1>

        <div className="filter-section">
          <p className="filter-description text-muted mb-4">
            Descubra os jogadores mais populares e buscados na plataforma
          </p>

          <div className="filter-tabs">
            <button
              className={`filter-tab btn ${
                filter === "week" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setFilter("week")}
            >
              <span className="tab-icon">📅</span>
              Esta Semana
            </button>
            <button
              className={`filter-tab btn ${
                filter === "month" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setFilter("month")}
            >
              <span className="tab-icon">📊</span>
              Este Mês
            </button>
            <button
              className={`filter-tab btn ${
                filter === "all" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setFilter("all")}
            >
              <span className="tab-icon">🔥</span>
              Mais Buscados
            </button>
          </div>
        </div>
      </div>

      <div className="top-players-content">
        <div className="section-header">
          <h2 className="section-title">{getFilterTitle()}</h2>
          <p className="section-subtitle text-muted">
            {players.length} jogadores encontrados
          </p>
        </div>

        {players.length === 0 ? (
          <div className="empty-state card">
            <div className="card-body text-center">
              <div className="empty-icon">👑</div>
              <h3 className="empty-title">Nenhum jogador encontrado</h3>
              <p className="empty-description text-muted">
                Não há dados disponíveis para o período selecionado
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Top 3 Destaque */}
            <div className="podium-section">
              <h3 className="podium-title">🏆 Pódium</h3>
              <div className="podium-grid">
                {players.slice(0, 3).map((player, index) => (
                  <div
                    key={player.id}
                    className={`podium-item position-${index + 1}`}
                  >
                    <div className="podium-rank">
                      <span className="rank-number">{index + 1}</span>
                      <span className="rank-medal">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    </div>
                    <div className="podium-player">
                      <div className="podium-photo-placeholder">
                        <span className="podium-photo-initial">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <h4 className="podium-name">{player.name}</h4>
                      <p className="podium-info text-muted">
                        {player.nationality} • {player.age} anos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista Completa */}
            <div className="players-list-section">
              <h3 className="list-title">📋 Lista Completa</h3>
              <div className="players-grid grid grid-cols-4 gap-6">
                {players.map((player, index) => (
                  <div key={player.id} className="player-card-wrapper">
                    <div className="player-rank-badge">#{index + 1}</div>
                    <PlayerCard
                      player={player}
                      onClick={onPlayerSelect}
                      showFavorite={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopPlayersPage;
