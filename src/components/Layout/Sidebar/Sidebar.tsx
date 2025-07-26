import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../../../hooks/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "search", label: "Buscar Jogadores", icon: "🔍", path: "/search" },
    { id: "favorites", label: "Favoritos", icon: "⭐", path: "/favorites" },
    { id: "rankings", label: "Rankings", icon: "🏆", path: "/rankings" },
    {
      id: "top-players",
      label: "Top Jogadores",
      icon: "👑",
      path: "/top-players",
    },
    { id: "compare", label: "Comparar", icon: "⚖️", path: "/compare" },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const getCurrentPage = () => {
    const path = location.pathname;
    const menuItem = menuItems.find((item) => item.path === path);
    return menuItem ? menuItem.id : "search";
  };

  if (!user) return null;

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                getCurrentPage() === item.id ? "active" : ""
              }`}
              onClick={() => handleItemClick(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
