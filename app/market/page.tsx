"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  MapPin,
  Calendar,
  BarChart3,
  Leaf,
  RefreshCw,
  Phone,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Language support for market intelligence
const marketLanguages = {
  en: {
    title: "Market Intelligence",
    subtitle: "Live Market Prices & Trends",
    selectLocation: "Select Location",
    selectCrop: "Select Crop",
    todayPrices: "Today's Prices",
    priceHistory: "Price History",
    marketAnalysis: "Market Analysis",
    lastUpdated: "Last updated",
    priceChange: "Price Change",
    marketTrend: "Market Trend",
    locations: {
      mumbai: "Mumbai",
      pune: "Pune",
      nashik: "Nashik",
      chennai: "Chennai",
      coimbatore: "Coimbatore",
      bangalore: "Bangalore",
      mysore: "Mysore",
      ludhiana: "Ludhiana",
      amritsar: "Amritsar",
    },
    crops: {
      cotton: "Cotton",
      wheat: "Wheat",
      rice: "Rice",
      sugarcane: "Sugarcane",
      onion: "Onion",
      tomato: "Tomato",
      potato: "Potato",
      soybean: "Soybean",
    },
    insights: {
      title: "Market Insights",
      demand: "High demand expected for cotton in next 2 weeks",
      weather: "Weather conditions favorable for wheat harvest",
      export: "Export opportunities increasing for rice varieties",
    },
    recommendations: {
      title: "Selling Recommendations",
      timing: "Best Time to Sell",
      price: "Expected Price Range",
      market: "Recommended Market",
    },
    trends: {
      rising: "Rising",
      falling: "Falling",
      stable: "Stable",
    },
  },
  mr: {
    title: "बाजार बुद्धिमत्ता",
    subtitle: "थेट बाजार भाव आणि ट्रेंड",
    selectLocation: "स्थान निवडा",
    selectCrop: "पीक निवडा",
    todayPrices: "आजचे भाव",
    priceHistory: "भावाचा इतिहास",
    marketAnalysis: "बाजार विश्लेषण",
    lastUpdated: "शेवटचे अपडेट",
    priceChange: "भाव बदल",
    marketTrend: "बाजार ट्रेंड",
    locations: {
      mumbai: "मुंबई",
      pune: "पुणे",
      nashik: "नाशिक",
      chennai: "चेन्नई",
      coimbatore: "कोयंबटूर",
      bangalore: "बंगळूर",
      mysore: "मैसूर",
      ludhiana: "लुधियाना",
      amritsar: "अमृतसर",
    },
    crops: {
      cotton: "कापूस",
      wheat: "गहू",
      rice: "तांदूळ",
      sugarcane: "ऊस",
      onion: "कांदा",
      tomato: "टोमॅटो",
      potato: "बटाटा",
      soybean: "सोयाबीन",
    },
    insights: {
      title: "बाजार अंतर्दृष्टी",
      demand: "पुढील २ आठवड्यांत कापसाची मोठी मागणी अपेक्षित",
      weather: "गव्हाच्या कापणीसाठी हवामान अनुकूल",
      export: "तांदूळ जातींसाठी निर्यात संधी वाढत आहेत",
    },
    recommendations: {
      title: "विक्री शिफारसी",
      timing: "विक्रीचा सर्वोत्तम वेळ",
      price: "अपेक्षित भाव श्रेणी",
      market: "शिफारस केलेले बाजार",
    },
    trends: {
      rising: "वाढत आहे",
      falling: "घसरत आहे",
      stable: "स्थिर",
    },
  },
  ta: {
    title: "சந்தை நுண்ணறிவு",
    subtitle: "நேரடி சந்தை விலைகள் மற்றும் போக்குகள்",
    selectLocation: "இடத்தைத் தேர்ந்தெடுக்கவும்",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    todayPrices: "இன்றைய விலைகள்",
    priceHistory: "விலை வரலாறு",
    marketAnalysis: "சந்தை பகுப்பாய்வு",
    lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
    priceChange: "விலை மாற்றம்",
    marketTrend: "சந்தை போக்கு",
    locations: {
      mumbai: "மும்பை",
      pune: "புனே",
      nashik: "நாசிக்",
      chennai: "சென்னை",
      coimbatore: "கோயம்புத்தூர்",
      bangalore: "பெங்களூரு",
      mysore: "மைசூர்",
      ludhiana: "லுதியானா",
      amritsar: "அம்ரித்சர்",
    },
    crops: {
      cotton: "பருத்தி",
      wheat: "கோதுமை",
      rice: "அரிசி",
      sugarcane: "கரும்பு",
      onion: "வெங்காயம்",
      tomato: "தக்காளி",
      potato: "உருளைக்கிழங்கு",
      soybean: "சோயாபீன்",
    },
    insights: {
      title: "சந்தை நுண்ணறிவுகள்",
      demand: "அடுத்த 2 வாரங்களில் பருத்திக்கு அதிக தேவை எதிர்பார்க்கப்படுகிறது",
      weather: "கோதுமை அறுவடைக்கு வானிலை சாதகமாக உள்ளது",
      export: "அரிசி வகைகளுக்கு ஏற்றுமதி வாய்ப்புகள் அதிகரித்து வருகின்றன",
    },
    recommendations: {
      title: "விற்பனை பரிந்துரைகள்",
      timing: "விற்க சிறந்த நேரம்",
      price: "எதிர்பார்க்கப்படும் விலை வரம்பு",
      market: "பரிந்துரைக்கப்பட்ட சந்தை",
    },
    trends: {
      rising: "உயர்ந்து வருகிறது",
      falling: "குறைந்து வருகிறது",
      stable: "நிலையானது",
    },
  },
  kn: {
    title: "ಮಾರುಕಟ್ಟೆ ಬುದ್ಧಿವಂತಿಕೆ",
    subtitle: "ನೇರ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು",
    selectLocation: "ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectCrop: "ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    todayPrices: "ಇಂದಿನ ಬೆಲೆಗಳು",
    priceHistory: "ಬೆಲೆ ಇತಿಹಾಸ",
    marketAnalysis: "ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ",
    lastUpdated: "ಕೊನೆಯ ಬಾರಿ ನವೀಕರಿಸಲಾಗಿದೆ",
    priceChange: "ಬೆಲೆ ಬದಲಾವಣೆ",
    marketTrend: "ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿ",
    locations: {
      mumbai: "ಮುಂಬೈ",
      pune: "ಪುಣೆ",
      nashik: "ನಾಸಿಕ್",
      chennai: "ಚೆನ್ನೈ",
      coimbatore: "ಕೋಯಂಬತ್ತೂರು",
      bangalore: "ಬೆಂಗಳೂರು",
      mysore: "ಮೈಸೂರು",
      ludhiana: "ಲುಧಿಯಾನಾ",
      amritsar: "ಅಮೃತಸರ",
    },
    crops: {
      cotton: "ಹತ್ತಿ",
      wheat: "ಗೋಧಿ",
      rice: "ಅಕ್ಕಿ",
      sugarcane: "ಕಬ್ಬು",
      onion: "ಈರುಳ್ಳಿ",
      tomato: "ಟೊಮೇಟೊ",
      potato: "ಆಲೂಗಡ್ಡೆ",
      soybean: "ಸೋಯಾಬೀನ್",
    },
    insights: {
      title: "ಮಾರುಕಟ್ಟೆ ಒಳನೋಟಗಳು",
      demand: "ಮುಂದಿನ 2 ವಾರಗಳಲ್ಲಿ ಹತ್ತಿಗೆ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ",
      weather: "ಗೋಧಿ ಸುಗ್ಗಿಗೆ ಹವಾಮಾನ ಅನುಕೂಲಕರವಾಗಿದೆ",
      export: "ಅಕ್ಕಿ ಪ್ರಭೇದಗಳಿಗೆ ರಫ್ತು ಅವಕಾಶಗಳು ಹೆಚ್ಚುತ್ತಿವೆ",
    },
    recommendations: {
      title: "ಮಾರಾಟ ಶಿಫಾರಸುಗಳು",
      timing: "ಮಾರಾಟ ಮಾಡಲು ಉತ್ತಮ ಸಮಯ",
      price: "ನಿರೀಕ್ಷಿತ ಬೆಲೆ ಶ್ರೇಣಿ",
      market: "ಶಿಫಾರಸು ಮಾಡಿದ ಮಾರುಕಟ್ಟೆ",
    },
    trends: {
      rising: "ಏರುತ್ತಿದೆ",
      falling: "ಇಳಿಯುತ್ತಿದೆ",
      stable: "ಸ್ಥಿರವಾಗಿದೆ",
    },
  },
  pa: {
    title: "ਮਾਰਕੀਟ ਇੰਟੈਲੀਜੈਂਸ",
    subtitle: "ਲਾਈਵ ਮਾਰਕੀਟ ਕੀਮਤਾਂ ਅਤੇ ਰੁਝਾਨ",
    selectLocation: "ਸਥਾਨ ਚੁਣੋ",
    selectCrop: "ਫਸਲ ਚੁਣੋ",
    todayPrices: "ਅੱਜ ਦੀਆਂ ਕੀਮਤਾਂ",
    priceHistory: "ਕੀਮਤ ਇਤਿਹਾਸ",
    marketAnalysis: "ਮਾਰਕੀਟ ਵਿਸ਼ਲੇਸ਼ਣ",
    lastUpdated: "ਆਖਰੀ ਵਾਰ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ",
    priceChange: "ਕੀਮਤ ਬਦਲਾਅ",
    marketTrend: "ਮਾਰਕੀਟ ਰੁਝਾਨ",
    locations: {
      mumbai: "ਮੁੰਬਈ",
      pune: "ਪੁਣੇ",
      nashik: "ਨਾਸਿਕ",
      chennai: "ਚੇਨਈ",
      coimbatore: "ਕੋਇੰਬਟੂਰ",
      bangalore: "ਬੰਗਲੌਰ",
      mysore: "ਮੈਸੂਰ",
      ludhiana: "ਲੁਧਿਆਣਾ",
      amritsar: "ਅੰਮ੍ਰਿਤਸਰ",
    },
    crops: {
      cotton: "ਕਪਾਹ",
      wheat: "ਕਣਕ",
      rice: "ਚਾਵਲ",
      sugarcane: "ਗੰਨਾ",
      onion: "ਪਿਆਜ਼",
      tomato: "ਟਮਾਟਰ",
      potato: "ਆਲੂ",
      soybean: "ਸੋਇਆਬੀਨ",
    },
    insights: {
      title: "ਮਾਰਕੀਟ ਸੂਝ",
      demand: "ਅਗਲੇ 2 ਹਫ਼ਤਿਆਂ ਵਿੱਚ ਕਪਾਹ ਦੀ ਉੱਚ ਮੰਗ ਦੀ ਉਮੀਦ",
      weather: "ਕਣਕ ਦੀ ਵਾਢੀ ਲਈ ਮੌਸਮ ਅਨੁਕੂਲ ਹੈ",
      export: "ਚਾਵਲ ਦੀਆਂ ਕਿਸਮਾਂ ਲਈ ਨਿਰਯਾਤ ਮੌਕੇ ਵਧ ਰਹੇ ਹਨ",
    },
    recommendations: {
      title: "ਵਿਕਰੀ ਸਿਫਾਰਸ਼ਾਂ",
      timing: "ਵੇਚਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ",
      price: "ਉਮੀਦ ਕੀਤੀ ਕੀਮਤ ਰੇਂਜ",
      market: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਮਾਰਕੀਟ",
    },
    trends: {
      rising: "ਵਧ ਰਿਹਾ ਹੈ",
      falling: "ਘਟ ਰਿਹਾ ਹੈ",
      stable: "ਸਥਿਰ",
    },
  },
}

// Sample market data
const sampleMarketData = {
  cotton: {
    currentPrice: 6200,
    change: 2.5,
    trend: "rising",
    history: [5800, 5950, 6100, 6200],
    markets: [
      { location: "mumbai", price: 6200, change: 2.5 },
      { location: "pune", price: 6150, change: 1.8 },
      { location: "nashik", price: 6180, change: 2.2 },
    ],
  },
  wheat: {
    currentPrice: 2150,
    change: -1.2,
    trend: "falling",
    history: [2200, 2180, 2160, 2150],
    markets: [
      { location: "ludhiana", price: 2150, change: -1.2 },
      { location: "amritsar", price: 2140, change: -1.5 },
      { location: "pune", price: 2160, change: -0.8 },
    ],
  },
  rice: {
    currentPrice: 3800,
    change: 0.8,
    trend: "stable",
    history: [3750, 3770, 3790, 3800],
    markets: [
      { location: "chennai", price: 3800, change: 0.8 },
      { location: "coimbatore", price: 3780, change: 0.5 },
      { location: "bangalore", price: 3820, change: 1.1 },
    ],
  },
}

export default function MarketIntelligence() {
  const [currentLang, setCurrentLang] = useState<keyof typeof marketLanguages>("en")
  const [selectedLocation, setSelectedLocation] = useState("mumbai")
  const [selectedCrop, setSelectedCrop] = useState("cotton")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const t = marketLanguages[currentLang]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const getCurrentCropData = () => {
    return sampleMarketData[selectedCrop as keyof typeof sampleMarketData]
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="h-4 w-4 text-primary" />
      case "falling":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <BarChart3 className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "default"
    if (change < 0) return "destructive"
    return "secondary"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">{t.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>

            {/* Language Selector */}
            <div className="flex gap-1">
              {Object.keys(marketLanguages).map((lang) => (
                <Button
                  key={lang}
                  variant={currentLang === lang ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentLang(lang as keyof typeof marketLanguages)}
                  className="text-xs px-2 py-1 h-7"
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{t.subtitle}</h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4" />
            {t.lastUpdated}: 2 minutes ago
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectLocation} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.locations).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger>
                <SelectValue placeholder={t.selectCrop} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t.crops).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      {value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="prices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prices">{t.todayPrices}</TabsTrigger>
            <TabsTrigger value="history">{t.priceHistory}</TabsTrigger>
            <TabsTrigger value="analysis">{t.marketAnalysis}</TabsTrigger>
          </TabsList>

          {/* Today's Prices Tab */}
          <TabsContent value="prices" className="space-y-6">
            {/* Current Price Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-between">
                  <span>{t.crops[selectedCrop as keyof typeof t.crops]}</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(getCurrentCropData().trend)}
                    <Badge variant={getTrendColor(getCurrentCropData().change)}>
                      {getCurrentCropData().change > 0 ? "+" : ""}
                      {getCurrentCropData().change}%
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-foreground">
                    ₹{getCurrentCropData().currentPrice.toLocaleString()}/quintal
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t.marketTrend}: {t.trends[getCurrentCropData().trend as keyof typeof t.trends]}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Market Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getCurrentCropData().markets.map((market, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{t.locations[market.location as keyof typeof t.locations]}</div>
                        <div className="text-sm text-muted-foreground">₹{market.price.toLocaleString()}/quintal</div>
                      </div>
                    </div>
                    <Badge variant={getTrendColor(market.change)}>
                      {market.change > 0 ? "+" : ""}
                      {market.change}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Price History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t.priceHistory} - {t.crops[selectedCrop as keyof typeof t.crops]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Simple price history visualization */}
                  <div className="grid grid-cols-4 gap-2">
                    {getCurrentCropData().history.map((price, index) => (
                      <div key={index} className="text-center p-3 border rounded-lg">
                        <div className="text-xs text-muted-foreground">Week {index + 1}</div>
                        <div className="font-semibold">₹{price.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Trend Analysis */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Trend Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Prices have shown a {getCurrentCropData().trend} trend over the past month. Current market
                      conditions suggest this trend may continue in the short term.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  {t.insights.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                  <p className="text-sm">{t.insights.demand}</p>
                </div>
                <div className="p-3 border-l-4 border-accent bg-accent/5 rounded-r-lg">
                  <p className="text-sm">{t.insights.weather}</p>
                </div>
                <div className="p-3 border-l-4 border-secondary bg-secondary/5 rounded-r-lg">
                  <p className="text-sm">{t.insights.export}</p>
                </div>
              </CardContent>
            </Card>

            {/* Selling Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t.recommendations.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t.recommendations.timing}</div>
                    <div className="font-semibold">Next 7-10 days</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t.recommendations.price}</div>
                    <div className="font-semibold">₹6,100 - ₹6,300</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-sm text-muted-foreground">{t.recommendations.market}</div>
                    <div className="font-semibold">{t.locations.mumbai}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Expert Consultation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Need personalized market advice? Connect with our agricultural market experts.
                  </p>
                  <Button className="w-full sm:w-auto">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Market Expert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
