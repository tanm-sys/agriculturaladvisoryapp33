"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Camera,
  TrendingUp,
  Cloud,
  Leaf,
  Users,
  Phone,
  ArrowDown,
  Star,
  Shield,
  Zap,
  CreditCard,
  MessageSquare,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { AdvertisementCarousel } from "@/components/advertisement-carousel"
import { useLanguage, Language } from "@/contexts/language-context" // Import Language type
import { useAuth } from "@/contexts/auth-context"

export default function LandingPage() {
  const { currentLang, setCurrentLang, translations: t } = useLanguage() // Removed hasSelectedLanguage
  const { isAuthenticated } = useAuth() // Keep isAuthenticated for potential future use, but it will always be true now
  const [isVisible, setIsVisible] = useState(false)
  // const [attemptCount, setAttemptCount] = useState(0) // Removed attemptCount
  const router = useRouter()

  useEffect(() => {
    // No longer redirecting to login, as the app is always "authenticated"
    setIsVisible(true)

    // Removed attemptCount logic
    // const savedAttempts = localStorage.getItem("krishi-app-attempts")
    // if (savedAttempts) {
    //   setAttemptCount(Number.parseInt(savedAttempts, 10))
    // }

    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll")
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top
        const elementVisible = 150

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add("animate-fade-in")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, []) // Removed isAuthenticated, router from dependency array

  // No longer need to return a loading state for authentication
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <Leaf className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
  //         <p className="text-muted-foreground">Redirecting to login...</p>
  //       </div>
  //     </div>
  //   )
  // }

  const handleVoiceSearch = () => {
    router.push("/dashboard")
  }

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left side - Hamburger Menu */}
          <div className="flex items-center gap-3">
            <HamburgerMenu />
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xl font-bold text-foreground gradient-text text-balance">{t.title}</span>
            </div>
          </div>

          <div className="flex gap-1">
            {(["en", "hi", "mr", "pa"] as const).map((lang) => (
              <Button
                key={lang}
                variant={currentLang === lang ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentLang(lang)}
                className="text-xs px-3 py-1 h-8 transition-all duration-200 hover:scale-105"
              >
                {lang === "en" ? "EN" : lang === "hi" ? "हि" : lang === "mr" ? "मर" : "ਪੰ"}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-4">
        <AdvertisementCarousel />
      </section>

      {/* Hero Section - Simplified for mobile */}
      <section className={`container mx-auto px-4 py-8 text-center ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground text-balance gradient-text animate-slide-up">
              {t.title}
            </h1>
            <p
              className="text-lg md:text-xl text-muted-foreground text-balance animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              {t.subtitle}
            </p>
            <p
              className="text-base text-muted-foreground max-w-2xl mx-auto text-pretty animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {t.description}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-scale-in"
            style={{ animationDelay: "0.6s" }}
          >
            <Button
              size="lg"
              className="text-base px-6 py-4 h-auto min-w-40 transition-all duration-300 hover:shadow-lg hover:scale-105 pulse-glow"
              onClick={handleGetStarted}
            >
              <Camera className="mr-2 h-4 w-4" />
              {t.getStarted}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="text-base px-6 py-4 h-auto min-w-40 bg-transparent transition-all duration-300 hover:shadow-lg hover:scale-105"
              onClick={handleVoiceSearch}
            >
              <Mic className="mr-2 h-4 w-4" />
              {t.voiceSearch}
            </Button>
          </div>

          <div className="mt-8 animate-bounce cursor-pointer" onClick={scrollToFeatures}>
            <ArrowDown className="h-5 w-5 mx-auto text-primary" />
            <p className="text-xs text-muted-foreground mt-1">Explore Features</p>
          </div>
        </div>
      </section>

      <section id="features" className="container mx-auto px-4 py-12 animate-on-scroll">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 gradient-text text-balance">
            Powerful Features for Modern Farming
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base text-pretty">
            Advanced AI technology meets traditional farming wisdom to help you make better decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Crop Advisory */}
          <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 glass-effect">
            <CardHeader className="pb-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 float-animation">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg text-balance">{t.features.cropAdvisory}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-pretty">{t.features.cropAdvisoryDesc}</CardDescription>
              <div className="flex justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Market Price */}
          <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 glass-effect">
            <CardHeader className="pb-3">
              <div
                className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3 float-animation"
                style={{ animationDelay: "0.5s" }}
              >
                <TrendingUp className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg text-balance">{t.features.marketPrice}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-pretty">{t.features.marketPriceDesc}</CardDescription>
              <div className="flex justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Weather Recommendation */}
          <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 glass-effect">
            <CardHeader className="pb-3">
              <div
                className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 float-animation"
                style={{ animationDelay: "1s" }}
              >
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg text-balance">{t.features.weather}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-pretty">{t.features.weatherDesc}</CardDescription>
              <div className="flex justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Accurate
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Chat Bot (Always visible now) */}
          <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 glass-effect">
            <CardHeader className="pb-3">
              <div
                className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 float-animation"
                style={{ animationDelay: "1.5s" }}
              >
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg text-balance">{t.features.chatBot}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-pretty">{t.features.chatBotDesc}</CardDescription>
              <div className="flex justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  24/7 Support
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Government Schemes (Always visible now) */}
          <Card className="text-center p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 glass-effect">
            <CardHeader className="pb-3">
              <div
                className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3 float-animation"
                style={{ animationDelay: "2s" }}
              >
                <Shield className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg text-balance">{t.menu.schemes}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-pretty">
                {currentLang === "hi"
                  ? "सरकारी योजनाओं की जानकारी और आवेदन प्रक्रिया"
                  : currentLang === "mr"
                    ? "सरकारी योजनांची माहिती आणि अर्ज प्रक्रिया"
                    : currentLang === "pa"
                      ? "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਜਾਣਕਾਰੀ ਅਤੇ ਅਰਜ਼ੀ ਪ੍ਰਕਿਰਿਆ"
                      : "Government schemes information and application process"}
              </CardDescription>
              <div className="flex justify-center mt-3">
                <Badge variant="outline" className="text-xs">
                  <CreditCard className="h-3 w-3 mr-1" />
                  {currentLang === "hi"
                    ? "सरकारी"
                    : currentLang === "mr"
                      ? "सरकारी"
                      : currentLang === "pa"
                        ? "ਸਰਕਾਰੀ"
                        : "Government"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-muted/50 py-8 animate-on-scroll">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground gradient-text text-balance">
              24/7 Farmer Support
            </h2>
            <p className="text-muted-foreground text-pretty text-sm md:text-base">
              Get help in your local language from our agricultural experts
            </p>
            <div className="flex items-center justify-center gap-2 text-base md:text-lg font-semibold text-primary pulse-glow">
              <Phone className="h-4 w-4 md:h-5 md:w-5" />
              {t.support}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-xs md:text-sm text-muted-foreground">
          <p>© 2024 KrishiMitra. Empowering farmers with technology.</p>
        </div>
      </footer>
    </div>
  )
}