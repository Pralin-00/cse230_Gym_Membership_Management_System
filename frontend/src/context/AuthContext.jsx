import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("gms_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("gms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Keep localStorage in sync whenever the token/user change, so a page
  // refresh doesn't lose the session.
  useEffect(() => {
    if (token) localStorage.setItem("gms_token", token);
    else localStorage.removeItem("gms_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("gms_user", JSON.stringify(user));
    else localStorage.removeItem("gms_user");
  }, [user]);

  async function signup({ name, email, password }) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || "Signup failed. Please try again.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  async function login({ email, password }) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setAuthError(err.response?.data?.message || "Login failed. Please try again.");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), authError, authLoading, login, signup, logout }),
    [token, user, authError, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
