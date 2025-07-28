"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Player, PlayerStatistics } from "../../types/Player";
import { apiService } from "../../services/api";
import { useFavorites } from "../../hooks/useFavorites";
import Button from "../../components/Button";
import "./PlayerDetails.css";

interface PlayerDetailsPageProps {
  playerId: number;
  onBack: () => void;
}

const PlayerDetailsPage: React.FC<PlayerDetailsPageProps> = ({
  playerId,
  onBack,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [statistics, setStatistics] = useState<PlayerStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const {
    isPlayerFavorite,
    isTeamFavorite,
    toggleFavoritePlayer,
    toggleFavoriteTeam,
  } = useFavorites();

  useEffect(() => {
    const loadPlayerData = async () => {
      setLoading(true);
      try {
        const [playerData, statsData] = await Promise.all([
          apiService.getPlayer(playerId),
          apiService.getPlayerStatistics(playerId),
        ]);

        setPlayer(playerData);
        setStatistics(statsData);
      } catch (error) {
        console.error("Error loading player data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayerData();
  }, [playerId]);

  if (loading) {
    return (
      <div className="player-detail-page">
        <div className="player-detail-loading">
          <div className="loading-spinner" />
          <p>Carregando dados do jogador...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="player-detail-page">
        <div className="player-detail-error card">
          <div className="card-body text-center">
            <p>Jogador não encontrado</p>
            <Button variant="primary" className="mt-4" onClick={onBack}>
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentStats = statistics[0];

  return (
    <div className="player-detail-page">
      <Button
        variant="ghost"
        className="back-button mb-6"
        onClick={onBack}
        icon={
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        }
      >
        Voltar
      </Button>

      <div className="player-detail-grid grid grid-cols-3 gap-6">
        <div className="player-profile-card card">
          <div className="card-body text-center">
            <div className="player-photo-container">
              <div className="player-photo-placeholder">
                <span className="player-photo-initial">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {player.injured && (
                <div className="injury-badge">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
              )}
            </div>

            <h1 className="player-name text-2xl font-bold mt-4">
              {player.name}
            </h1>
            <p className="player-position text-muted">
              {currentStats?.games.position || "Atacante"}
            </p>

            {currentStats?.team && (
              <div className="player-team-info mt-3">
                <div className="team-display">
                  <span className="team-name">{currentStats.team.name}</span>
                  <Button
                    variant="ghost"
                    className={`team-favorite-btn ${
                      isTeamFavorite(currentStats.team.id) ? "active" : ""
                    }`}
                    onClick={() => toggleFavoriteTeam(currentStats.team.id)}
                    title={
                      isTeamFavorite(currentStats.team.id)
                        ? "Remover time dos Favoritos"
                        : "Adicionar time aos Favoritos"
                    }
                    icon={
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                      </svg>
                    }
                  />
                </div>
              </div>
            )}

            <div className="player-actions mt-4">
              <Button
                variant="ghost"
                className={`favorite-btn ${
                  isPlayerFavorite(player.id) ? "active" : ""
                }`}
                onClick={() => toggleFavoritePlayer(player.id)}
                title={
                  isPlayerFavorite(player.id)
                    ? "Remover dos Favoritos"
                    : "Adicionar aos Favoritos"
                }
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        <div className="player-info-card card">
          <div className="card-header">
            <h2 className="card-title">Informações Pessoais</h2>
          </div>
          <div className="card-body">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Idade</span>
                <span className="info-value">{player.age} anos</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nacionalidade</span>
                <span className="info-value">{player.nationality}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Altura</span>
                <span className="info-value">{player.height}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Peso</span>
                <span className="info-value">{player.weight}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Data de Nascimento</span>
                <span className="info-value">
                  {new Date(player.birth.date).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Local de Nascimento</span>
                <span className="info-value">{player.birth.place}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="player-stats-card card">
          <div className="card-header">
            <h2 className="card-title">Estatísticas da Temporada</h2>
          </div>
          <div className="card-body">
            {currentStats ? (
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Jogos</span>
                  <span className="stat-value">
                    {currentStats.games.appearences}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Gols</span>
                  <span className="stat-value">{currentStats.goals.total}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Assistências</span>
                  <span className="stat-value">
                    {currentStats.goals.assists}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avaliação</span>
                  <span className="stat-value">
                    {currentStats.games.rating}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Minutos</span>
                  <span className="stat-value">
                    {currentStats.games.minutes}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Cartões Amarelos</span>
                  <span className="stat-value">
                    {currentStats.cards.yellow}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted">Estatísticas não disponíveis</p>
            )}
          </div>
        </div>
      </div>

      {currentStats && (
        <div className="player-detailed-stats mt-6">
          <div className="stats-tabs">
            <Button
              variant="ghost"
              className={`stats-tab ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Visão Geral
            </Button>
            <Button
              variant="ghost"
              className={`stats-tab ${
                activeTab === "attacking" ? "active" : ""
              }`}
              onClick={() => setActiveTab("attacking")}
            >
              Ataque
            </Button>
            <Button
              variant="ghost"
              className={`stats-tab ${
                activeTab === "defending" ? "active" : ""
              }`}
              onClick={() => setActiveTab("defending")}
            >
              Defesa
            </Button>
          </div>

          <div className="stats-content">
            {activeTab === "overview" && (
              <div className="stats-section">
                <h3>Visão Geral</h3>
                <div className="stats-grid-detailed">
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.games.appearences}
                    </span>
                    <span className="stat-label">Jogos</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.games.minutes}
                    </span>
                    <span className="stat-label">Minutos</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.games.rating}
                    </span>
                    <span className="stat-label">Avaliação</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attacking" && (
              <div className="stats-section">
                <h3>Estatísticas de Ataque</h3>
                <div className="stats-grid-detailed">
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.goals.total}
                    </span>
                    <span className="stat-label">Gols</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.goals.assists}
                    </span>
                    <span className="stat-label">Assistências</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.shots.total}
                    </span>
                    <span className="stat-label">Finalizações</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">{currentStats.shots.on}</span>
                    <span className="stat-label">No Gol</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "defending" && (
              <div className="stats-section">
                <h3>Estatísticas de Defesa</h3>
                <div className="stats-grid-detailed">
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.tackles.total}
                    </span>
                    <span className="stat-label">Desarmes</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.tackles.interceptions}
                    </span>
                    <span className="stat-label">Interceptações</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.tackles.blocks}
                    </span>
                    <span className="stat-label">Bloqueios</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-number">
                      {currentStats.cards.yellow}
                    </span>
                    <span className="stat-label">Cartões Amarelos</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDetailsPage;
