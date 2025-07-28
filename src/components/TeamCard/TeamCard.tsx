"use client";

import "./TeamCard.css";
import React from "react";
import type { Team } from "../../types/Player";
import { useFavorites } from "../../hooks/useFavorites";
import Button from "../Button";

interface TeamCardProps {
  team: Team;
  showFavorite?: boolean;
  onClick?: (team: Team) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({
  team,
  showFavorite = true,
  onClick,
}) => {
  const { isTeamFavorite, toggleFavoriteTeam } = useFavorites();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteTeam(team.id);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(team);
    }
  };

  return (
    <div className="team-card" onClick={handleCardClick}>
      {showFavorite && (
        <Button
          variant="ghost"
          className={`favorite-btn ${isTeamFavorite(team.id) ? "active" : ""}`}
          onClick={handleFavoriteClick}
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
      )}

      <div className="team-logo">
        <div className="team-logo-placeholder">
          <span className="team-initial">
            {team.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="team-info">
        <h3 className="team-name">{team.name}</h3>
        <div className="team-details">
          <span className="team-country">{team.country}</span>
          <span className="team-founded">{team.founded}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
