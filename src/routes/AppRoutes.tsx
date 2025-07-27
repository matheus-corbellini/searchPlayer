import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Layout/Header/Header";
import Sidebar from "../components/Layout/Sidebar/Sidebar";
import SearchPage from "../pages/SearchPage/SearchPage";
import FavoritesPage from "../pages/FavoritesPage/FavoritesPage";
import RankingPage from "../pages/RankingPage/RankingPage";
import TopPlayersPage from "../pages/TopPlayersPage/TopPlayersPage";
import ComparePage from "../pages/ComparePage/ComparePage";
import type { Player } from "../types/Player";
import PlayerDetails from "../pages/PlayerDetails/PlayerDetails";

const AppRoutes: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayerId(player.id);
  };

  const handleBackFromDetails = () => {
    setSelectedPlayerId(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">
            ⚽ FootballSearch
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Faça login para acessar o sistema
          </p>
          <div className="text-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header onMenuToggle={handleMenuToggle} />

        <Sidebar
          onNavigate={() => {}}
          currentPage={""}
          isOpen={sidebarOpen}
          onClose={handleSidebarClose}
        />

        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route
              path="/search"
              element={
                selectedPlayerId ? (
                  <PlayerDetails
                    playerId={selectedPlayerId}
                    onBack={handleBackFromDetails}
                  />
                ) : (
                  <SearchPage onPlayerSelect={handlePlayerSelect} />
                )
              }
            />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/rankings" element={<RankingPage />} />
            <Route
              path="/top-players"
              element={
                selectedPlayerId ? (
                  <PlayerDetails
                    playerId={selectedPlayerId}
                    onBack={handleBackFromDetails}
                  />
                ) : (
                  <TopPlayersPage onPlayerSelect={handlePlayerSelect} />
                )
              }
            />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="*" element={<Navigate to="/search" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default AppRoutes;
