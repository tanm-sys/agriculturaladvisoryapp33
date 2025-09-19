"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Import useRouter
import { Language } from "./language-context" // Import Language type

export interface User {
  id: string
  mobileNumber: string
  firstName: string
  lastName: string
  state: string
  district: string
  taluka: string
  village: string
  language: Language // Use Language type from language-context
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
  register: (userData: User) => void // Add register function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("agricultural_app_user")
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      }
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem("agricultural_app_user", JSON.stringify(userData))
    }
    router.push("/dashboard") // Redirect to dashboard on login
  }

  const register = (userData: User) => {
    // In a real app, this would involve an API call to register the user
    // For now, we'll just log them in directly after "registration"
    login(userData)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem("agricultural_app_user")
    }
    router.push("/login") // Redirect to login on logout
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile, register }}>
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