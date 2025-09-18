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

interface Advisory {
  title: string
  description: string
  time: string
  priority: "high" | "medium" | "low"
}

interface WeatherInfo {
  temp: string
  condition: string
  humidity: string
  rainfall: string
}

interface PriceInfo {
  crop: string
  price: string
  change: string
}

interface DashboardLanguageContent {
  title: string
  welcome: string
  voicePrompt: string
  quickActions: string
  recentAdvisories: string
  todayWeather: string
  marketPrices: string
  actions: {
    cropDiagnosis: string
    cropDiagnosisDesc: string
    marketPrices: string
    marketPricesDesc: string
    weather: string
    weatherDesc: string
    community: string
    communityDesc: string
  }
  advisories: Advisory[]
  weather: WeatherInfo
  prices: PriceInfo[]
  voiceListening: string
  voiceProcessing: string
  speakNow: string
}

// Language support for dashboard
const dashboardLanguages: Record<string, DashboardLanguageContent> = {
  en: {
    title: "KrishiMitra Dashboard",
    welcome: "Welcome back, Farmer",
    voicePrompt: "Tap to speak your question",
    quickActions: "Quick Actions",
    recentAdvisories: "Recent Advisories",
    todayWeather: "Today's Weather",
    marketPrices: "Market Prices",
    actions: {
      cropDiagnosis: "Crop Diagnosis",
      cropDiagnosisDesc: "Photo diagnosis",
      marketPrices: "Market Prices",
      marketPricesDesc: "Live rates",
      weather: "Weather",
      weatherDesc: "7-day forecast",
      community: "Community",
      communityDesc: "Ask experts",
    },
    advisories: [
      {
        title: "Cotton Bollworm Alert",
        description: "Monitor your cotton crops for early signs",
        time: "2 hours ago",
        priority: "high",
      },
      {
        title: "Fertilizer Application",
        description: "Best time for nitrogen application",
        time: "1 day ago",
        priority: "medium",
      },
    ],
    weather: {
      temp: "28°C",
      condition: "Partly Cloudy",
      humidity: "65%",
      rainfall: "20mm expected",
    },
    prices: [
      { crop: "Cotton", price: "₹6,200/quintal", change: "+2.5%" },
      { crop: "Wheat", price: "₹2,150/quintal", change: "-1.2%" },
      { crop: "Rice", price: "₹3,800/quintal", change: "+0.8%" },
    ],
    voiceListening: "Listening...",
    voiceProcessing: "Processing your question...",
    speakNow: "Speak now",
  },
  mr: {
    title: "कृषीमित्र डॅशबोर्ड",
    welcome: "परत स्वागत, शेतकरी",
    voicePrompt: "तुमचा प्रश्न बोलण्यासाठी टॅप करा",
    quickActions: "त्वरित क्रिया",
    recentAdvisories: "अलीकडील सल्ले",
    todayWeather: "आजचे हवामान",
    marketPrices: "बाजार भाव",
    actions: {
      cropDiagnosis: "पीक निदान",
      cropDiagnosisDesc: "फोटो निदान",
      marketPrices: "बाजार भाव",
      marketPricesDesc: "थेट दर",
      weather: "हवामान",
      weatherDesc: "७ दिवसांचा अंदाज",
      community: "समुदाय",
      communityDesc: "तज्ञांना विचारा",
    },
    advisories: [],
    weather: {
      temp: "28°C",
      condition: "अंशतः ढगाळ",
      humidity: "65%",
      rainfall: "20मिमी अपेक्षित",
    },
    prices: [],
    voiceListening: "ऐकत आहे...",
    voiceProcessing: "तुमचा प्रश्न प्रक्रिया करत आहे...",
    speakNow: "आता बोला",
  },
  ta: {
    title: "கிருஷிமித்ரா டாஷ்போர்டு",
    welcome: "மீண்டும் வரவேற்கிறோம், விவசாயி",
    voicePrompt: "உங்கள் கேள்வியைச் சொல்ல தட்டவும்",
    quickActions: "விரைவு செயல்கள்",
    recentAdvisories: "சமீபத்திய ஆலோசனைகள்",
    todayWeather: "இன்றைய வானிலை",
    marketPrices: "சந்தை விலைகள்",
    actions: {
      cropDiagnosis: "பயிர் நோய் கண்டறிதல்",
      cropDiagnosisDesc: "புகைப்பட நோய் கண்டறிதல்",
      marketPrices: "சந்தை விலைகள்",
      marketPricesDesc: "நேரடி விலைகள்",
      weather: "வானிலை",
      weatherDesc: "7 நாள் முன்னறிவிப்பு",
      community: "சமூகம்",
      communityDesc: "நிபுணர்களிடம் கேளுங்கள்",
    },
    advisories: [],
    weather: {
      temp: "28°C",
      condition: "பகுதி மேகமூட்டம்",
      humidity: "65%",
      rainfall: "20மிமீ எதிர்பார்க்கப்படுகிறது",
    },
    prices: [],
    voiceListening: "கேட்கிறது...",
    voiceProcessing: "உங்கள் கேள்வியை செயலாக்குகிறது...",
    speakNow: "இப்போது பேசுங்கள்",
  },
  kn: {
    title: "ಕೃಷಿಮಿತ್ರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ, ರೈತ",
    voicePrompt: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಹೇಳಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
    recentAdvisories: "ಇತ್ತೀಚಿನ ಸಲಹೆಗಳು",
    todayWeather: "ಇಂದಿನ ಹವಾಮಾನ",
    marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    actions: {
      cropDiagnosis: "ಬೆಳೆ ರೋಗ ನಿರ್ಣಯ",
      cropDiagnosisDesc: "ಫೋಟೋ ರೋಗ ನಿರ್ಣಯ",
      marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
      marketPricesDesc: "ನೇರ ದರಗಳು",
      weather: "ಹವಾಮಾನ",
      weatherDesc: "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
      community: "ಸಮುದಾಯ",
      communityDesc: "ತಜ್ಞರನ್ನು ಕೇಳಿ",
    },
    advisories: [],
    weather: {
      temp: "28°C",
      condition: "ಭಾಗಶಃ ಮೋಡ ಕವಿದಿದೆ",
      humidity: "65%",
      rainfall: "20ಮಿಮೀ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ",
    },
    prices: [],
    voiceListening: "ಕೇಳುತ್ತಿದೆ...",
    voiceProcessing: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...",
    speakNow: "ಈಗ ಮಾತನಾಡಿ",
  },
  pa: {
    title: "ਕ੍ਰਿਸ਼ੀਮਿੱਤਰ ਡੈਸ਼ਬੋਰਡ",
    welcome: "ਫਿਰ ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ",
    voicePrompt: "ਆਪਣਾ ਸਵਾਲ ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
    quickActions: "ਤੁਰੰਤ ਕਾਰਵਾਈਆਂ",
    recentAdvisories: "ਹਾਲੀਆ ਸਲਾਹਾਂ",
    todayWeather: "ਅੱਜ ਦਾ ਮੌਸਮ",
    marketPrices: "ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
    actions: {
      cropDiagnosis: "ਫਸਲ ਨਿਦਾਨ",
      cropDiagnosisDesc: "ਫੋਟੋ ਨਿਦਾਨ",
      marketPrices: "ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
      marketPricesDesc: "ਲਾਈਵ ਰੇਟ",
      weather: "ਮੌਸਮ",
      weatherDesc: "7 ਦਿਨਾਂ ਦਾ ਪੂਰਵ-ਅਨੁਮਾਨ",
      community: "ਭਾਈਚਾਰਾ",
      communityDesc: "ਮਾਹਿਰਾਂ ਨੂੰ ਪੁੱਛੋ",
    },
    advisories: [],
    weather: {
      temp: "28°C",
      condition: "ਅੰਸ਼ਕ ਤੌਰ 'ਤੇ ਬੱਦਲਵਾਈ",
      humidity: "65%",
      rainfall: "20mm ਦੀ ਉਮੀਦ",
    },
    prices: [],
    voiceListening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
    voiceProcessing: "ਤੁਹਾਡੇ ਸਵਾਲ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕਰ ਰਿਹਾ ਹੈ...",
    speakNow: "ਹੁਣ ਬੋਲੋ",
  },
}

export default function Dashboard() {
  const { currentLang, setCurrentLang, translations: t } = useLanguage() // Removed hasSelectedLanguage
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
        return t.voiceListening
      case "processing":
        return t.voiceProcessing
      default:
        return t.voicePrompt
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary animate-pulse" />
            <span className="text-lg font-bold text-foreground gradient-text">{t.title}</span>
          </div>

          {/* Language Selector (always visible now) */}
          <div className="flex gap-1">
            {Object.keys(dashboardLanguages).map((lang) => (
              <Button
                key={lang}
                variant={currentLang === lang ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentLang(lang as Language)}
                className="text-xs px-2 py-1 h-7 transition-all duration-200 hover:scale-105"
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className={`container mx-auto px-4 py-6 space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        {/* Welcome Section */}
        <div className="text-center space-y-2 animate-slide-up">
          <h1 className="text-2xl font-bold text-foreground gradient-text">{t.welcome}</h1>
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
                      {t.speakNow}
                    </>
                  ) : voiceStatus === "listening" ? (
                    t.voiceListening
                  ) : (
                    t.voiceProcessing
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-xl font-semibold text-foreground">{t.quickActions}</h2>
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
                  <h3 className="font-semibold text-sm">{t.actions.cropDiagnosis}</h3>
                  <p className="text-xs text-muted-foreground">{t.actions.cropDiagnosisDesc}</p>
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
                  <h3 className="font-semibold text-sm">{t.actions.marketPrices}</h3>
                  <p className="text-xs text-muted-foreground">{t.actions.marketPricesDesc}</p>
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
                  <h3 className="font-semibold text-sm">{t.actions.weather}</h3>
                  <p className="text-xs text-muted-foreground">{t.actions.weatherDesc}</p>
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
                  <h3 className="font-semibold text-sm">{t.actions.community}</h3>
                  <p className="text-xs text-muted-foreground">{t.actions.communityDesc}</p>
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
                {t.recentAdvisories}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.advisories.map((advisory: Advisory, index: number) => (
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
                {t.todayWeather}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground gradient-text">{t.weather?.temp || "N/A"}</div>
                <div className="text-sm text-muted-foreground">{t.weather?.condition || "Loading..."}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Humidity:</span>
                  <div className="font-medium">{t.weather?.humidity || "N/A"}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Rainfall:</span>
                  <div className="font-medium">{t.weather?.rainfall || "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Prices */}
          <Card className="glass-effect transition-all duration-300 hover:shadow-lg hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary animate-pulse" />
                {t.marketPrices}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.prices.map((price: PriceInfo, index: number) => (
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
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border glass-effect">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-col gap-1 h-auto py-2 transition-all duration-200 hover:scale-105"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-col gap-1 h-auto py-2 transition-all duration-200 hover:scale-105"
              onClick={handleCropDiagnosis}
            >
              <Stethoscope className="h-5 w-5" />
              <span className="text-xs">Diagnose</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-col gap-1 h-auto py-2 transition-all duration-200 hover:scale-105"
              onClick={handleMarketPrices}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Markets</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-col gap-1 h-auto py-2 transition-all duration-200 hover:scale-105"
              onClick={handleCommunity}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">Community</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  )
}