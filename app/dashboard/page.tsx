"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  TrendingUp,
  Cloud,
  Leaf,
  MicIcon,
  Volume2,
  Home,
  BarChart3,
  Stethoscope,
  MessageCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage, Language } from "@/contexts/language-context" // Import Language type
import { LanguageSelector } from "@/components/language-selector"
import { BottomNavigation } from "@/components/bottom-navigation" // Import BottomNavigation
import { NotificationBell } from "@/components/notification-bell" // Import NotificationBell
import { useAuth } from "@/contexts/auth-context" // Import useAuth
import { ThemeToggle } from "@/components/theme-toggle" // Import ThemeToggle
import { HamburgerMenu } from "@/components/hamburger-menu" // Import HamburgerMenu

export default function Dashboard() {
  const { translations: t } = useLanguage()
  const { user } = useAuth() // Get user from AuthContext
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing">("idle")
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Voice interface simulation
  const handleVoiceActivation = () => {
    if (voiceStatus === "idle") {
      setVoiceStatus("listening")
      setIsListening(true)

      // Simulate voice recognition
      setTimeout(() => {
        setVoiceStatus("processing")
        setTimeout(() => {
          setVoiceStatus("idle")
          setIsListening(false)
          // Here would integrate with actual voice processing
        }, 2000)
      }, 3000)
    }
  }

  const getVoiceStatusText = () => {
    switch (voiceStatus) {
      case "listening":
        return t.dashboard.voiceListening
      case "processing":
        return t.dashboard.voiceProcessing
      default:
        return t.dashboard.voicePrompt
    }
  }

  const handleCropDiagnosis = () => {
    router.push("/diagnose")
  }

  const handleMarketPrices = () => {
    router.push("/market")
  }

  const handleWeather = () => {
    router.push("/weather")
  }

  const handleCommunity = () => {
    router.push("/community")
  }

  return (
    <div className="min-h-screen bg-background pb-20"> {/* Added pb-20 for bottom navigation */}
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HamburgerMenu /> {/* Added HamburgerMenu */}
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-lg font-bold text-foreground gradient-text">{t.dashboard.title}</span>
            </div>
          </div>

          {/* Language Selector, Notification Bell, and Theme Toggle */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className={`container mx-auto px-4 py-6 space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        {/* Welcome Section */}
        <div className="text-center space-y-2 animate-slide-up">
          <h1 className="text-2xl font-bold text-foreground gradient-text">
            {t.dashboard.welcome}, {user?.firstName || "Farmer"}!
          </h1>
          <p className="text-muted-foreground">Today is a good day for farming</p>
        </div>

        {/* Voice Interface - Prominent Central Feature */}
        <Card
          className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 transition-all duration-300 hover:shadow-lg hover:scale-105 animate-scale-in"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center float-animation">
                {voiceStatus === "listening" ? (
                  <div className="relative">
                    <MicIcon className="h-10 w-10 text-primary animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping" />
                  </div>
                ) : voiceStatus === "processing" ? (
                  <Volume2 className="h-10 w-10 text-accent-foreground animate-bounce" />
                ) : (
                  <MicIcon className="h-10 w-10 text-primary" />
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">{getVoiceStatusText()}</h2>

                <Button
                  size="lg"
                  onClick={handleVoiceActivation}
                  disabled={voiceStatus !== "idle"}
                  className="text-lg px-8 py-6 h-auto transition-all duration-300 hover:shadow-lg hover:scale-105 pulse-glow"
                >
                  {voiceStatus === "idle" ? (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      {t.dashboard.speakNow}
                    </>
                  ) : voiceStatus === "listening" ? (
                    t.dashboard.voiceListening
                  ) : (
                    t.dashboard.voiceProcessing
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-semibold text-foreground">{t.dashboard.quickActions}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card
              className="transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer glass-effect"
              onClick={handleCropDiagnosis}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center float-animation">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t.dashboard.actions.cropDiagnosis}</h3>
                  <p className="text-xs text-muted-foreground">{t.dashboard.actions.cropDiagnosisDesc}</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer glass-effect"
              onClick={handleMarketPrices}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div
                  className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center float-animation"
                  style={{ animationDelay: "0.5s" }}
                >
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t.dashboard.actions.marketPrices}</h3>
                  <p className="text-xs text-muted-foreground">{t.dashboard.actions.marketPricesDesc}</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer glass-effect"
              onClick={handleWeather}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div
                  className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center float-animation"
                  style={{ animationDelay: "1s" }}
                >
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t.dashboard.actions.weather}</h3>
                  <p className="text-xs text-muted-foreground">{t.dashboard.actions.weatherDesc}</p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer glass-effect"
              onClick={handleCommunity}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div
                  className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center float-animation"
                  style={{ animationDelay: "1.5s" }}
                >
                  <MessageCircle className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{t.dashboard.actions.community}</h3>
                  <p className="text-xs text-muted-foreground">{t.dashboard.actions.communityDesc}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: "0.6s" }}>
          {/* Recent Advisories */}
          <Card className="glass-effect transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary animate-pulse" />
                {t.dashboard.recentAdvisories}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.dashboard.advisories.map((advisory, index) => (
                <div
                  key={index}
                  className="border-l-4 border-primary/30 pl-3 space-y-1 animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{advisory.title}</h4>
                    <Badge variant={advisory.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                      {advisory.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{advisory.description}</p>
                  <p className="text-xs text-muted-foreground">{advisory.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weather Card */}
          <Card className="glass-effect transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary animate-pulse" />
                {t.dashboard.todayWeather}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground gradient-text">{t.dashboard.weather?.temp || "N/A"}</div>
                <div className="text-sm text-muted-foreground">{t.dashboard.weather?.condition || "Loading..."}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Humidity:</span>
                  <div className="font-medium">{t.dashboard.weather?.humidity || "N/A"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rainfall:</span>
                  <div className="font-medium">{t.dashboard.weather?.rainfall || "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Prices */}
          <Card className="glass-effect transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
                {t.dashboard.marketPrices}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.dashboard.prices.map((price, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center animate-fade-in"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div>
                    <div className="font-medium text-sm">{price.crop}</div>
                    <div className="text-xs text-muted-foreground">{price.price}</div>
                  </div>
                  <Badge variant={price.change.startsWith("+") ? "default" : "destructive"} className="text-xs">
                    {price.change}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}