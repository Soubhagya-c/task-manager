import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (tokenObj: TokenResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface JwtPayload {
  exp: number;
  email: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = (response: TokenResponse) => {
    localStorage.setItem("token", response.access_token);
    localStorage.setItem("refresh_token", response.refresh_token);
    setToken(response.access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  const isAuthenticated = !!token;

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!token) return;

    const { exp } = jwtDecode<JwtPayload>(token);
    const expiresIn = exp * 1000 - Date.now();

    if (expiresIn <= 0) {
      logout();
      return;
    }

    const refreshTimeout = setTimeout(async () => {
      try {
        const res = await API.post("/auth/refresh");
        login(res.data.access_token);
      } catch (err) {
        console.error("Failed to refresh token", err);
        logout();
      }
    }, expiresIn - 60000); // refresh 1 min before expiry

    return () => clearTimeout(refreshTimeout);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
