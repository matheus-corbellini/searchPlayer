"use client";

import type React from "react";
import { useState } from "react";
import { useSearch } from "../hooks/useSearch";
import type { Player, SearchFilters } from "../types";
import SearchBar from "../components/SearchBar/SearchBar";
import PlayerCard from "../components/PlayerCard/PlayerCard";
import "./SearchPage.css";

interface SearchPageProps {
  onPlayerSelect: (player: Player) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onPlayerSelect }) => {
  const { players, loading, error, searchPlayers } = useSearch();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (query: string) => {
    searchPlayers({ ...filters, name: query });
  };

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | number
  ) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    if (newFilters.name) {
      searchPlayers(newFilters);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="search-title text-3xl font-bold mb-6">
          Buscar Jogadores
        </h1>

        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} onPlayerSelect={onPlayerSelect} />
        </div>

        <div className="search-controls flex items-center gap-4 mb-4">
          <button
            className={`btn ${showFilters ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            Filtros
          </button>

          {Object.keys(filters).length > 0 && (
            <button className="btn btn-ghost" onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        </div>

        {showFilters && (
          <div className="filters-card card mb-6">
            <div className="card-body">
              <div className="filters-grid grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Nacionalidade</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Brasil, Argentina..."
                    value={filters.nationality || ""}
                    onChange={(e) =>
                      handleFilterChange("nationality", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Posição</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Atacante, Meio-campo..."
                    value={filters.position || ""}
                    onChange={(e) =>
                      handleFilterChange("position", e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Idade Mínima</label>
                  <input
                    type="number"
                    className="form-input"
                    min="16"
                    max="45"
                    value={filters.ageMin || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "ageMin",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Idade Máxima</label>
                  <input
                    type="number"
                    className="form-input"
                    min="16"
                    max="45"
                    value={filters.ageMax || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "ageMax",
                        Number.parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="search-content">
        {loading && (
          <div className="search-loading">
            <div className="loading-spinner search-spinner"></div>
          </div>
        )}

        {error && (
          <div className="search-error card">
            <div className="card-body text-center">
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && players.length === 0 && (
          <div className="search-empty card">
            <div className="card-body text-center">
              <p className="text-muted">
                Nenhum jogador encontrado. Tente uma nova busca.
              </p>
            </div>
          </div>
        )}

        {!loading && players.length > 0 && (
          <div className="search-results">
            <p className="search-results-count text-muted mb-4">
              {players.length} jogador{players.length !== 1 ? "es" : ""}{" "}
              encontrado{players.length !== 1 ? "s" : ""}
            </p>

            <div className="players-grid grid grid-cols-4 gap-6">
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onClick={onPlayerSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
