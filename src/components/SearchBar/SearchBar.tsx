"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import type { Player } from "../../types/Player";
import { useAutocomplete } from "../../hooks/useAutocomplete";
import Button from "../Button";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onPlayerSelect?: (player: Player) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onPlayerSelect,
  placeholder = "Pesquisar jogador...",
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { suggestions, loading, searchPlayers } = useAutocomplete();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      searchPlayers(query);
    }
  }, [query, searchPlayers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (player: Player) => {
    setQuery(player.name);
    setShowSuggestions(false);
    if (onPlayerSelect) {
      onPlayerSelect(player);
    } else {
      onSearch(player.name);
    }
  };

  return (
    <div className="search-bar" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input"
            onFocus={() => setShowSuggestions(query.length > 0)}
          />
          <Button
            type="submit"
            variant="primary"
            className="search-button"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            }
          />
        </div>
      </form>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {loading && (
            <div className="suggestion-item loading">
              <div className="loading-spinner"></div>
              <span>Buscando...</span>
            </div>
          )}

          {!loading && suggestions.length === 0 && query.length > 1 && (
            <div className="suggestion-item no-results">
              Nenhum jogador encontrado
            </div>
          )}

          {!loading &&
            suggestions.map((player) => (
              <div
                key={player.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(player)}
              >
                <div className="suggestion-avatar-placeholder">
                  <span className="suggestion-avatar-initial">
                    {player.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="suggestion-info">
                  <div className="suggestion-name">{player.name}</div>
                  <div className="suggestion-details">
                    {player.nationality} • {player.age} anos
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
