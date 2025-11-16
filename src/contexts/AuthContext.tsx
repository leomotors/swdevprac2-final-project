"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { client } from "@/libs/api";
import { components } from "@/libs/api/schema";
import { accessTokenKey } from "@/libs/constants";

type User = components["schemas"]["UserResponse"];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    const token = localStorage.getItem(accessTokenKey);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await client.GET("/auth/me");

      if (error || !data?.data) {
        localStorage.removeItem(accessTokenKey);
        setUser(null);
        setIsAuthenticated(false);
      } else {
        setUser(data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem(accessTokenKey);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem(accessTokenKey, token);
    setIsLoading(true);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem(accessTokenKey);
    setUser(null);
    setIsAuthenticated(false);
  };

  const refetchUser = async () => {
    setIsLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
