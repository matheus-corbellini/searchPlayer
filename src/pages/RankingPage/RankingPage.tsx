"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import type { Ranking } from "../../types/SearchFilters";
import Button from "../../components/Button";
import "./RankingPage.css";

// Página para exibir rankings de gols, assistências e cartões
const RankingPage: React.FC = () => {
  const [rankings, setRankings] = useState<{
    goals?: Ranking;
    assists?: Ranking;
    cards?: Ranking;
  }>({});
  const [activeRanking, setActiveRanking] = useState<
    "goals" | "assists" | "cards"
  >("goals");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Carrega todos os rankings disponíveis
    const loadRankings = async () => {
      setLoading(true);
      setError(null);

      try {
        const [goals, assists, cards] = await Promise.all([
          apiService.getRankings("goals"),
          apiService.getRankings("assists"),
          apiService.getRankings("cards"),
        ]);

        setRankings({ goals, assists, cards });
      } catch (err) {
        setError("Erro ao carregar rankings");
        console.error("Error loading rankings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, []);

  // Retorna título do ranking baseado no tipo
  const getRankingTitle = (type: string) => {
    switch (type) {
      case "goals":
        return "Artilheiros";
      case "assists":
        return "Assistentes";
      case "cards":
        return "Cartões";
      default:
        return "Ranking";
    }
  };

  // Retorna ícone do ranking baseado no tipo
  const getRankingIcon = (type: string) => {
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

  const currentRanking = rankings[activeRanking];

  if (loading) {
    return (
      <div className="rankings-page">
        <div className="rankings-loading">
          <div className="loading-spinner" />
          <p>Carregando rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rankings-page">
        <div className="rankings-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rankings-page">
      <div className="rankings-header">
        <h1 className="rankings-title text-3xl font-bold mb-6">🏆 Rankings</h1>

        <div className="rankings-tabs">
          <Button
            variant="ghost"
            className={`ranking-tab ${
              activeRanking === "goals" ? "active" : ""
            }`}
            onClick={() => setActiveRanking("goals")}
            icon={<span className="tab-icon">⚽</span>}
          >
            Artilheiros
          </Button>
          <Button
            variant="ghost"
            className={`ranking-tab ${
              activeRanking === "assists" ? "active" : ""
            }`}
            onClick={() => setActiveRanking("assists")}
            icon={<span className="tab-icon">🎯</span>}
          >
            Assistentes
          </Button>
          <Button
            variant="ghost"
            className={`ranking-tab ${
              activeRanking === "cards" ? "active" : ""
            }`}
            onClick={() => setActiveRanking("cards")}
            icon={<span className="tab-icon">🟨</span>}
          >
            Cartões
          </Button>
        </div>
      </div>

      <div className="rankings-content">
        {currentRanking && (
          <div className="ranking-section">
            <div className="ranking-header-info">
              <h2 className="ranking-section-title">
                <span className="ranking-icon">
                  {getRankingIcon(activeRanking)}
                </span>
                Top {getRankingTitle(activeRanking)}
              </h2>
              <p className="ranking-description text-muted">
                {activeRanking === "goals" &&
                  "Os maiores artilheiros da temporada atual"}
                {activeRanking === "assists" &&
                  "Jogadores com mais assistências na temporada"}
                {activeRanking === "cards" &&
                  "Jogadores com mais cartões disciplinares"}
              </p>
            </div>

            <div className="ranking-list">
              {currentRanking.players.map((entry, index) => (
                <div
                  key={entry.player.id}
                  className={`ranking-item ${index < 3 ? "podium" : ""}`}
                >
                  <div className="ranking-position">
                    <span
                      className={`position-number ${
                        index === 0
                          ? "gold"
                          : index === 1
                          ? "silver"
                          : index === 2
                          ? "bronze"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </span>
                    {index < 3 && (
                      <span className="medal">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    )}
                  </div>

                  <div className="player-info">
                    <div className="player-avatar-placeholder">
                      <span className="player-avatar-initial">
                        {entry.player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="player-details">
                      <h3 className="player-name">{entry.player.name}</h3>
                      <p className="player-team text-muted">
                        {entry.team.name}
                      </p>
                    </div>
                  </div>

                  <div className="ranking-stats">
                    <div className="stat-value">
                      {entry.value}
                      <span className="stat-label">
                        {activeRanking === "goals" && "gols"}
                        {activeRanking === "assists" && "assist."}
                        {activeRanking === "cards" && "cartões"}
                      </span>
                    </div>
                  </div>

                  <div className="team-logo">
                    <div className="team-logo-placeholder">
                      <span className="team-logo-initial">
                        {entry.team.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
