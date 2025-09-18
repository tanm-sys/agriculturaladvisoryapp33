"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  mobileNumber: string
  firstName: string
  lastName: string
  state: string
  district: string
  taluka: string
  village: string
  language: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void // Keeping for compatibility, but won't be used in a login flow
  logout: () => void // Keeping for compatibility, but won't be used in a login flow
  updateProfile: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a dummy user, as there's no login page
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("agricultural_app_user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    }
    // Default dummy user if no user is stored
    return {
      id: "dummy-user-123",
      mobileNumber: "9876543210",
      firstName: "Kisan",
      lastName: "Mitra",
      state: "Maharashtra",
      district: "Solapur",
      taluka: "Solapur North",
      village: "Hotgi",
      language: "en",
    };
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated

  useEffect(() => {
    // Store dummy user if not already present or if it's the initial dummy
    if (user && typeof window !== 'undefined') {
      localStorage.setItem("agricultural_app_user", JSON.stringify(user));
    }
  }, [user]);

  // Login and logout functions are kept for API compatibility but won't be triggered by a login page
  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem("agricultural_app_user", JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("agricultural_app_user")
    }
  }

  const updateProfile = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        localStorage.setItem("agricultural_app_user", JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}