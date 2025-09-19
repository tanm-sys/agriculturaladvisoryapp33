"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDarkMode = theme === "dark"

  const handleToggle = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="theme-switch" className="sr-only">Toggle theme</Label>
      <Switch
        id="theme-switch"
        checked={isDarkMode}
        onCheckedChange={handleToggle}
        aria-label="Toggle dark mode"
        className="relative"
      >
        <span className="absolute left-1 top-1/2 -translate-y-1/2 transition-opacity duration-200" style={{ opacity: isDarkMode ? 0 : 1 }}>
          <Sun className="h-3 w-3 text-yellow-500" />
        </span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2 transition-opacity duration-200" style={{ opacity: isDarkMode ? 1 : 0 }}>
          <Moon className="h-3 w-3 text-blue-300" />
        </span>
      </Switch>
    </div>
  )
}