"use client";

import "./PlayerCard.css";
import React from "react";
import type { Player } from "../../types/Player";
import { useFavorites } from "../../hooks/useFavorites";

interface PlayerCardProps {
  player: Player;
  showFavorite?: boolean;
  onClick?: (player: Player) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  showFavorite = true,
  onClick,
}) => {
  const { isPlayerFavorite, toggleFavoritePlayer } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoritePlayer(player.id);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div className="player-card" onClick={handleCardClick}>
      {showFavorite && (
        <button
          className={`favorite-btn ${
            isPlayerFavorite(player.id) ? "active" : ""
          }`}
          onClick={handleFavoriteClick}
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
        </button>
      )}

      <div className="player-photo">
        <div className="player-photo-placeholder">
          <span className="player-initial">
            {player.name.charAt(0).toUpperCase()}
          </span>
        </div>
        {player.injured && (
          <div className="injury-badge">
            <svg
              width="16"
              height="16"
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

      <div className="player-info">
        <h3 className="player-name">{player.name}</h3>
        <div className="player-details">
          <span className="player-age">{player.age} anos</span>
          <span className="player-nationality">{player.nationality}</span>
        </div>
        <div className="player-physical">
          <span>{player.height}</span>
          <span>{player.weight}</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
