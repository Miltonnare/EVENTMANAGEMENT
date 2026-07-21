import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getToken, getUser, setAuth, clearAuth } from '../utils/auth';
import { refreshAccessToken, logoutUser } from '../utils/api';

export const AuthContext = createContext(null);

const AUTH_URL = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [token, setToken] = useState(getToken());
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (authToken) => {
    try {
      const response = await fetch(`${AUTH_URL}/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const profileUser = data.data || data.user || data;
        setUser(profileUser);
        setAuth({ user: profileUser, token: authToken });
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        setToken(storedToken);
        await fetchProfile(storedToken);
      }
      setLoading(false);
    };
    initAuth();
  }, [fetchProfile]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }
      const authToken = data.token || data.accessToken;
      const loggedUser = data.user;
      setToken(authToken);
      setUser(loggedUser);
      setAuth({ token: authToken, user: loggedUser });
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }
      const authToken = data.token || data.accessToken;
      const newUser = data.user;
      if (authToken) {
        setToken(authToken);
        setUser(newUser);
        setAuth({ token: authToken, user: newUser });
      }
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      clearAuth();
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    refreshProfile: () => token && fetchProfile(token),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
