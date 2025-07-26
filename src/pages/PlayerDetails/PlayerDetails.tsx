"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Player, PlayerStatistics } from "../types";
import { apiService } from "../services/api";
import { useFavorites } from "../hooks/useFavorites";
import "./PlayerDetailPage.css";

interface PlayerDetailPageProps {
  playerId: number;
  onBack: () => void;
}

const PlayerDetailPage: React.FC<PlayerDetailPageProps> = ({
  playerId,
  onBack,
}) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [statistics, setStatistics] = useState<PlayerStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { isPlayerFavorite, togglePlayerFavorite } = useFavorites();

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
          <div className="loading-spinner player-detail-spinner"></div>
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
            <button className="btn btn-primary mt-4" onClick={onBack}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStats = statistics[0];

  return (
    <div className="player-detail-page">
      <button className="back-button btn btn-ghost mb-6" onClick={onBack}>
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
        Voltar
      </button>

      <div className="player-detail-grid grid grid-cols-3 gap-6">
        <div className="player-profile-card card">
          <div className="card-body text-center">
            <div className="player-photo-container">
              <img
                src={player.photo || "/placeholder.svg"}
                alt={player.name}
                className="player-photo"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder.svg?height=128&width=128";
                }}
              />
              {player.injured && <div className="injury-indicator">⚠️</div>}
            </div>

            <h1 className="player-name text-2xl font-bold mb-2">
              {player.name}
            </h1>
            <p className="player-full-name text-muted mb-4">
              {player.firstname} {player.lastname}
            </p>

            <button
              className={`favorite-button btn ${
                isPlayerFavorite(player.id) ? "btn-primary" : "btn-secondary"
              } mb-4`}
              onClick={() => togglePlayerFavorite(player.id)}
            >
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
              {isPlayerFavorite(player.id)
                ? "Remover dos Favoritos"
                : "Adicionar aos Favoritos"}
            </button>

            <div className="player-basic-info grid grid-cols-2 gap-4 text-sm">
              <div className="info-item">
                <div className="info-label font-semibold">Idade</div>
                <div className="info-value text-muted">{player.age} anos</div>
              </div>
              <div className="info-item">
                <div className="info-label font-semibold">Nacionalidade</div>
                <div className="info-value text-muted">
                  {player.nationality}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label font-semibold">Altura</div>
                <div className="info-value text-muted">{player.height}</div>
              </div>
              <div className="info-item">
                <div className="info-label font-semibold">Peso</div>
                <div className="info-value text-muted">{player.weight}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="player-details-section">
          <div className="player-details-card card">
            <div className="card-header">
              <div className="tabs-container flex gap-4">
                {["overview", "statistics", "career"].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-button btn ${
                      activeTab === tab ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "overview" && "Visão Geral"}
                    {tab === "statistics" && "Estatísticas"}
                    {tab === "career" && "Carreira"}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-body">
              {activeTab === "overview" && (
                <div className="overview-tab">
                  <h3 className="section-title text-xl font-semibold mb-4">
                    Informações Pessoais
                  </h3>
                  <div className="personal-info grid grid-cols-2 gap-4">
                    <div className="info-item">
                      <div className="info-label font-semibold">
                        Data de Nascimento
                      </div>
                      <div className="info-value text-muted">
                        {new Date(player.birth.date).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="info-label font-semibold">
                        Local de Nascimento
                      </div>
                      <div className="info-value text-muted">
                        {player.birth.place}, {player.birth.country}
                      </div>
                    </div>
                  </div>

                  {currentStats && (
                    <div className="current-season">
                      <h3 className="section-title text-xl font-semibold mb-4 mt-6">
                        Temporada Atual
                      </h3>
                      <div className="stats-cards grid grid-cols-3 gap-4">
                        <div className="stat-card card">
                          <div className="card-body text-center">
                            <div className="stat-value text-2xl font-bold text-primary">
                              {currentStats.games.appearences}
                            </div>
                            <div className="stat-label text-sm text-muted">
                              Jogos
                            </div>
                          </div>
                        </div>
                        <div className="stat-card card">
                          <div className="card-body text-center">
                            <div className="stat-value text-2xl font-bold text-success">
                              {currentStats.goals.total}
                            </div>
                            <div className="stat-label text-sm text-muted">
                              Gols
                            </div>
                          </div>
                        </div>
                        <div className="stat-card card">
                          <div className="card-body text-center">
                            <div className="stat-value text-2xl font-bold text-warning">
                              {currentStats.goals.assists}
                            </div>
                            <div className="stat-label text-sm text-muted">
                              Assistências
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "statistics" && currentStats && (
                <div className="statistics-tab">
                  <h3 className="section-title text-xl font-semibold mb-4">
                    Estatísticas Detalhadas
                  </h3>

                  <div className="stats-sections grid grid-cols-2 gap-6">
                    <div className="stats-section">
                      <h4 className="stats-section-title font-semibold mb-3">
                        Desempenho
                      </h4>
                      <div className="stats-list">
                        <div className="stat-row flex justify-between">
                          <span>Jogos disputados:</span>
                          <span className="font-medium">
                            {currentStats.games.appearences}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Minutos jogados:</span>
                          <span className="font-medium">
                            {currentStats.games.minutes}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Nota média:</span>
                          <span className="font-medium">
                            {currentStats.games.rating}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Posição:</span>
                          <span className="font-medium">
                            {currentStats.games.position}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="stats-section">
                      <h4 className="stats-section-title font-semibold mb-3">
                        Gols e Assistências
                      </h4>
                      <div className="stats-list">
                        <div className="stat-row flex justify-between">
                          <span>Gols marcados:</span>
                          <span className="font-medium">
                            {currentStats.goals.total}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Assistências:</span>
                          <span className="font-medium">
                            {currentStats.goals.assists}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Chutes totais:</span>
                          <span className="font-medium">
                            {currentStats.shots.total}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Chutes no gol:</span>
                          <span className="font-medium">
                            {currentStats.shots.on}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="stats-section">
                      <h4 className="stats-section-title font-semibold mb-3">
                        Passes
                      </h4>
                      <div className="stats-list">
                        <div className="stat-row flex justify-between">
                          <span>Passes totais:</span>
                          <span className="font-medium">
                            {currentStats.passes.total}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Passes decisivos:</span>
                          <span className="font-medium">
                            {currentStats.passes.key}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Precisão:</span>
                          <span className="font-medium">
                            {currentStats.passes.accuracy}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="stats-section">
                      <h4 className="stats-section-title font-semibold mb-3">
                        Disciplina
                      </h4>
                      <div className="stats-list">
                        <div className="stat-row flex justify-between">
                          <span>Cartões amarelos:</span>
                          <span className="font-medium">
                            {currentStats.cards.yellow}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Cartões vermelhos:</span>
                          <span className="font-medium">
                            {currentStats.cards.red}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Faltas cometidas:</span>
                          <span className="font-medium">
                            {currentStats.fouls.committed}
                          </span>
                        </div>
                        <div className="stat-row flex justify-between">
                          <span>Faltas sofridas:</span>
                          <span className="font-medium">
                            {currentStats.fouls.drawn}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "career" && (
                <div className="career-tab">
                  <h3 className="section-title text-xl font-semibold mb-4">
                    Histórico da Carreira
                  </h3>
                  <p className="text-muted">
                    Informações detalhadas sobre a carreira em
                    desenvolvimento...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailPage;
