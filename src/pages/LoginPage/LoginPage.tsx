"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/Button";
import "./LoginPage.css";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

// Página de login e registro de usuários
const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const { login, register, isLoading } = useAuth();

  // Processa submissão do formulário de login/registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let success = false;

      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(
          formData.email,
          formData.password,
          formData.name
        );
      }

      if (success) {
        onNavigate("search");
      } else {
        setError("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("Erro ao fazer login/registro");
    }
  };

  // Atualiza estado do formulário conforme usuário digita
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="card-header">
          <h2 className="login-title text-2xl font-bold text-center">
            ⚽ FootballSearch
          </h2>
          <p className="login-subtitle text-center text-muted mt-2">
            {isLogin ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <Button
              type="submit"
              variant="primary"
              className="login-submit-btn"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLogin ? "Entrar" : "Registrar"}
            </Button>
          </form>

          <div className="login-toggle">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Não tem conta? Registre-se" : "Já tem conta? Entre"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
