import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContextDef";

// Hook para acessar contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
