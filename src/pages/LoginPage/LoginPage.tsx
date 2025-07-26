"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./LoginPage.css";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let success = false;

      if (isLogin) {
        success = await login(formData.email);
      } else {
        success = await register(formData.email, formData.name);
      }

      if (success) {
        onNavigate("search");
      } else {
        setError("Credenciais inválidas");
      }
    } catch {
      setError("Erro ao fazer login/registro");
    }
  };

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

            <button
              type="submit"
              className="login-submit-btn btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner login-spinner" />
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Registrar"
              )}
            </button>
          </form>

          <div className="login-toggle">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Não tem conta? Registre-se" : "Já tem conta? Entre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
