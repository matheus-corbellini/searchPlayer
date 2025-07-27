"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Header from "../Layout/Header/Header";
import Sidebar from "../Layout/Sidebar/Sidebar";
import LoginPage from "../../pages/LoginPage/LoginPage";
import SearchPage from "../../pages/SearchPage/SearchPage";
import PlayerDetailPage from "../../pages/PlayerDetails/PlayerDetails";
import FavoritesPage from "../../pages/FavoritesPage/FavoritesPage";
import RankingsPage from "../../pages/RankingPage/RankingPage";
import TopPlayersPage from "../../pages/TopPlayersPage/TopPlayersPage";
import ComparePage from "../../pages/ComparePage/ComparePage";
import type { Player } from "../../types/Player";

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState("search");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setCurrentPage("player-detail");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedPlayer(null);
  };

  const handleBackToSearch = () => {
    setCurrentPage("search");
    setSelectedPlayer(null);
  };

  if (!user) {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <div className="app-main">
        <Header onMenuToggle={() => setSidebarOpen(true)} />

        <main className="main-content container">
          {currentPage === "search" && (
            <SearchPage onPlayerSelect={handlePlayerSelect} />
          )}

          {currentPage === "player-detail" && selectedPlayer && (
            <PlayerDetailPage
              playerId={selectedPlayer.id}
              onBack={handleBackToSearch}
            />
          )}

          {currentPage === "favorites" && <FavoritesPage />}

          {currentPage === "rankings" && <RankingsPage />}

          {currentPage === "top-players" && (
            <TopPlayersPage onPlayerSelect={() => {}} />
          )}

          {currentPage === "compare" && <ComparePage />}
        </main>
      </div>
    </div>
  );
};

export default AppContent;
