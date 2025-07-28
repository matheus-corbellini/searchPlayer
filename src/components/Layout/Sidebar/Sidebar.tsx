import React from "react";
import "./Sidebar.css";
import { useAuth } from "../../../hooks/useAuth";
import Button from "../../Button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentPage,
}) => {
  const { user } = useAuth();

  const menuItems = [
    { id: "search", label: "Buscar Jogadores", icon: "🔍" },
    { id: "favorites", label: "Favoritos", icon: "⭐" },
    { id: "rankings", label: "Rankings", icon: "🏆" },
    {
      id: "top-players",
      label: "Top Jogadores",
      icon: "👑",
    },
    { id: "compare", label: "Comparar", icon: "⚖️" },
  ];

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    onClose();
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
          <Button
            variant="ghost"
            onClick={onClose}
            className="close-btn"
            icon={
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
            }
          />
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => handleItemClick(item.id)}
              icon={<span className="nav-icon">{item.icon}</span>}
            >
              <span className="nav-label">{item.label}</span>
            </Button>
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
