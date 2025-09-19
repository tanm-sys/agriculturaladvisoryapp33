"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, ArrowLeft, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"
import { NotificationBell } from "@/components/notification-bell" // Import NotificationBell
import { useLanguage } from "@/contexts/language-context" // Import useLanguage
import { ThemeToggle } from "@/components/theme-toggle" // Import ThemeToggle

interface AlertItem {
  type: string
  title: string
  description: string
  time: string
}

interface ForecastItem {
  day: string
  temp: string
  condition: string
  icon: string
  rain: string
}

interface WeatherLanguageContent {
  title: string
  currentWeather: string
  sevenDayForecast: string
  hourlyForecast: string
  weatherAlerts: string
  location: string
  temperature: string
  humidity: string
  windSpeed: string
  visibility: string
  rainfall: string
  uvIndex: string
  back: string
  today: string
  tomorrow: string
  alerts: AlertItem[]
  forecast: ForecastItem[]
}

// Language support for weather
const weatherLanguages: Record<string, WeatherLanguageContent> = {
  en: {
    title: "Weather Forecast",
    currentWeather: "Current Weather",
    sevenDayForecast: "7-Day Forecast",
    hourlyForecast: "Hourly Forecast",
    weatherAlerts: "Weather Alerts",
    location: "Your Location",
    temperature: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    visibility: "Visibility",
    rainfall: "Rainfall",
    uvIndex: "UV Index",
    back: "Back",
    today: "Today",
    tomorrow: "Tomorrow",
    alerts: [
      {
        type: "warning",
        title: "Heavy Rain Expected",
        description: "Heavy rainfall expected in next 24 hours. Protect crops from waterlogging.",
        time: "Next 24 hours",
      },
    ],
    forecast: [
      { day: "Today", temp: "28°C", condition: "Partly Cloudy", icon: "partly-cloudy", rain: "20%" },
      { day: "Tomorrow", temp: "30°C", condition: "Sunny", icon: "sunny", rain: "5%" },
      { day: "Wed", temp: "26°C", condition: "Rainy", icon: "rainy", rain: "80%" },
      { day: "Thu", temp: "25°C", condition: "Cloudy", icon: "cloudy", rain: "40%" },
      { day: "Fri", temp: "29°C", condition: "Sunny", icon: "sunny", rain: "10%" },
      { day: "Sat", temp: "31°C", condition: "Hot", icon: "sunny", rain: "0%" },
      { day: "Sun", temp: "27°C", condition: "Partly Cloudy", icon: "partly-cloudy", rain: "15%" },
    ],
  },
  hi: {
    title: "मौसम पूर्वानुमान",
    currentWeather: "वर्तमान मौसम",
    sevenDayForecast: "7-दिवसीय पूर्वानुमान",
    hourlyForecast: "प्रति घंटा पूर्वानुमान",
    weatherAlerts: "मौसम अलर्ट",
    location: "आपका स्थान",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    windSpeed: "हवा की गति",
    visibility: "दृश्यता",
    rainfall: "वर्षा",
    uvIndex: "यूवी सूचकांक",
    back: "वापस",
    today: "आज",
    tomorrow: "कल",
    alerts: [
      {
        type: "चेतावनी",
        title: "भारी बारिश की उम्मीद",
        description: "अगले 24 घंटों में भारी बारिश की उम्मीद है। फसलों को जलभराव से बचाएं।",
        time: "अगले 24 घंटे",
      },
    ],
    forecast: [
      { day: "आज", temp: "28°C", condition: "आंशिक रूप से बादल छाए रहेंगे", icon: "partly-cloudy", rain: "20%" },
      { day: "कल", temp: "30°C", condition: "धूप", icon: "sunny", rain: "5%" },
      { day: "बुध", temp: "26°C", condition: "बारिश", icon: "rainy", rain: "80%" },
      { day: "गुरु", temp: "25°C", condition: "बादल छाए रहेंगे", icon: "cloudy", rain: "40%" },
      { day: "शुक्र", temp: "29°C", condition: "धूप", icon: "sunny", rain: "10%" },
      { day: "शनि", temp: "31°C", condition: "गर्म", icon: "sunny", rain: "0%" },
      { day: "रवि", temp: "27°C", condition: "आंशिक रूप से बादल छाए रहेंगे", icon: "partly-cloudy", rain: "15%" },
    ],
  },
  mr: {
    title: "हवामान अंदाज",
    currentWeather: "सध्याचे हवामान",
    sevenDayForecast: "७ दिवसांचा अंदाज",
    hourlyForecast: "तासनिहाय अंदाज",
    weatherAlerts: "हवामान इशारे",
    location: "तुमचे स्थान",
    temperature: "तापमान",
    humidity: "आर्द्रता",
    windSpeed: "वाऱ्याचा वेग",
    visibility: "दृश्यता",
    rainfall: "पाऊस",
    uvIndex: "यूव्ही निर्देशांक",
    back: "परत",
    today: "आज",
    tomorrow: "उद्या",
    alerts: [
      {
        type: "इशारा",
        title: "मुसळधार पावसाची शक्यता",
        description: "पुढील 24 तासांत मुसळधार पावसाची शक्यता आहे. पिकांना पाणी साचण्यापासून वाचवा.",
        time: "पुढील 24 तास",
      },
    ],
    forecast: [
      { day: "आज", temp: "28°C", condition: "अंशतः ढगाळ", icon: "partly-cloudy", rain: "20%" },
      { day: "उद्या", temp: "30°C", condition: "सूर्यप्रकाशित", icon: "sunny", rain: "5%" },
      { day: "बुध", temp: "26°C", condition: "पावसाळी", icon: "rainy", rain: "80%" },
      { day: "गुरु", temp: "25°C", condition: "ढगाळ", icon: "cloudy", rain: "40%" },
      { day: "शुक्र", temp: "29°C", condition: "सूर्यप्रकाशित", icon: "sunny", rain: "10%" },
      { day: "शनि", temp: "31°C", condition: "गरम", icon: "sunny", rain: "0%" },
      { day: "रवि", temp: "27°C", condition: "अंशतः ढगाळ", icon: "partly-cloudy", rain: "15%" },
    ],
  },
  ta: {
    title: "வானிலை முன்னறிவிப்பு",
    currentWeather: "தற்போதைய வானிலை",
    sevenDayForecast: "7 நாள் முன்னறிவிப்பு",
    hourlyForecast: "மணிநேர முன்னறிவிப்பு",
    weatherAlerts: "வானிலை எச்சரிக்கைகள்",
    location: "உங்கள் இடம்",
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
    windSpeed: "காற்றின் வேகம்",
    visibility: "தெரிவுநிலை",
    rainfall: "மழைப்பொழிவு",
    uvIndex: "யூவி குறியீடு",
    back: "பின்",
    today: "இன்று",
    tomorrow: "நாளை",
    alerts: [
      {
        type: "எச்சரிக்கை",
        title: "கனமழை எதிர்பார்க்கப்படுகிறது",
        description: "அடுத்த 24 மணி நேரத்தில் கனமழை எதிர்பார்க்கப்படுகிறது. பயிர்களை நீர் தேக்கத்திலிருந்து பாதுகாக்கவும்.",
        time: "அடுத்த 24 மணி நேரம்",
      },
    ],
    forecast: [
      { day: "இன்று", temp: "28°C", condition: "பகுதி மேகமூட்டம்", icon: "partly-cloudy", rain: "20%" },
      { day: "நாளை", temp: "30°C", condition: "சன்னி", icon: "sunny", rain: "5%" },
      { day: "புதன்", temp: "26°C", condition: "மழை", icon: "rainy", rain: "80%" },
      { day: "வியாழன்", temp: "25°C", condition: "மேகமூட்டம்", icon: "cloudy", rain: "40%" },
      { day: "வெள்ளி", temp: "29°C", condition: "சன்னி", icon: "sunny", rain: "10%" },
      { day: "சனி", temp: "31°C", condition: "சூடான", icon: "sunny", rain: "0%" },
      { day: "ஞாயிறு", temp: "27°C", condition: "பகுதி மேகமூட்டம்", icon: "partly-cloudy", rain: "15%" },
    ],
  },
  kn: {
    title: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    currentWeather: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
    sevenDayForecast: "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
    hourlyForecast: "ಗಂಟೆಯ ಮುನ್ಸೂಚನೆ",
    weatherAlerts: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು",
    location: "ನಿಮ್ಮ ಸ್ಥಳ",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ",
    windSpeed: "ಗಾಳಿಯ ವೇಗ",
    visibility: "ಗೋಚರತೆ",
    rainfall: "ಮಳೆ",
    uvIndex: "ಯುವಿ ಸೂಚ್ಯಂಕ",
    back: "ಹಿಂದೆ",
    today: "ಇಂದು",
    tomorrow: "ನಾಳೆ",
    alerts: [
      {
        type: "ಎಚ್ಚರಿಕೆ",
        title: "ಭಾರೀ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ",
        description: "ಮುಂದಿನ 24 ಗಂಟೆಗಳಲ್ಲಿ ಭಾರೀ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ. ಬೆಳೆಗಳನ್ನು ಜಲಾವೃತದಿಂದ ರಕ್ಷಿಸಿ.",
        time: "ಮುಂದಿನ 24 ಗಂಟೆಗಳು",
      },
    ],
    forecast: [
      { day: "ಇಂದು", temp: "28°C", condition: "ಭಾಗಶಃ ಮೋಡ ಕವಿದಿದೆ", icon: "partly-cloudy", rain: "20%" },
      { day: "ನಾಳೆ", temp: "30°C", condition: "ಸನ್ನಿ", icon: "sunny", rain: "5%" },
      { day: "ಬುಧ", temp: "26°C", condition: "ಮಳೆ", icon: "rainy", rain: "80%" },
      { day: "ಗುರು", temp: "25°C", condition: "ಮೋಡ ಕವಿದಿದೆ", icon: "cloudy", rain: "40%" },
      { day: "ಶುಕ್ರ", temp: "29°C", condition: "ಸನ್ನಿ", icon: "sunny", rain: "10%" },
      { day: "ಶನಿ", temp: "31°C", condition: "ಬಿಸಿ", icon: "sunny", rain: "0%" },
      { day: "ಭಾನು", temp: "27°C", condition: "ಭಾಗಶಃ ಮೋಡ ಕವಿದಿದೆ", icon: "partly-cloudy", rain: "15%" },
    ],
  },
  pa: {
    title: "ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ",
    currentWeather: "ਮੌਜੂਦਾ ਮੌਸਮ",
    sevenDayForecast: "7 ਦਿਨਾਂ ਦਾ ਪੂਰਵ-ਅਨੁਮਾਨ",
    hourlyForecast: "ਘੰਟੇਵਾਰ ਪੂਰਵ-ਅਨੁਮਾਨ",
    weatherAlerts: "ਮੌਸਮੀ ਚੇਤਾਵਨੀਆਂ",
    location: "ਤੁਹਾਡਾ ਸਥਾਨ",
    temperature: "ਤਾਪਮਾਨ",
    humidity: "ਨਮੀ",
    windSpeed: "ਹਵਾ ਦੀ ਰਫ਼ਤਾਰ",
    visibility: "ਦਿੱਖ",
    rainfall: "ਬਰਸਾਤ",
    uvIndex: "ਯੂਵੀ ਸੂਚਕਾਂਕ",
    back: "ਵਾਪਸ",
    today: "ਅੱਜ",
    tomorrow: "ਕੱਲ੍ਹ",
    alerts: [
      {
        type: "ਚੇਤਾਵਨੀ",
        title: "ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਉਮੀਦ",
        description: "ਅਗਲੇ 24 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਉਮੀਦ ਹੈ। ਫਸਲਾਂ ਨੂੰ ਜਲ ਭਰਨ ਤੋਂ ਬਚਾਓ।",
        time: "ਅਗਲੇ 24 ਘੰਟੇ",
      },
    ],
    forecast: [
      { day: "ਅੱਜ", temp: "28°C", condition: "ਅੰਸ਼ਕ ਤੌਰ 'ਤੇ ਬੱਦਲਵਾਈ", icon: "partly-cloudy", rain: "20%" },
      { day: "ਕੱਲ੍ਹ", temp: "30°C", condition: "ਧੁੱਪ", icon: "sunny", rain: "5%" },
      { day: "ਬੁੱਧ", temp: "26°C", condition: "ਬਾਰਿਸ਼", icon: "rainy", rain: "80%" },
      { day: "ਵੀਰ", temp: "25°C", condition: "ਬੱਦਲਵਾਈ", icon: "cloudy", rain: "40%" },
      { day: "ਸ਼ੁੱਕਰ", temp: "29°C", condition: "ਧੁੱਪ", icon: "sunny", rain: "10%" },
      { day: "ਸ਼ਨੀ", temp: "31°C", condition: "ਗਰਮ", icon: "sunny", rain: "0%" },
      { day: "ਐਤ", temp: "27°C", condition: "ਅੰਸ਼ਕ ਤੌਰ 'ਤੇ ਬੱਦਲਵਾਈ", icon: "partly-cloudy", rain: "15%" },
    ],
  },
}

export default function WeatherPage() {
  const { currentLang } = useLanguage()
  const router = useRouter()
  const t = weatherLanguages[currentLang] || weatherLanguages.en // Fallback to English

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "partly-cloudy":
      default:
        return <Cloud className="h-8 w-8 text-gray-400" />
    }
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
              <Cloud className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">{t.title}</span>
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

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Current Weather */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t.location}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">28°C</div>
                <div className="text-lg text-muted-foreground">Partly Cloudy</div>
                <div className="text-sm text-muted-foreground">Feels like 31°C</div>
              </div>
              <div className="text-right">{getWeatherIcon("partly-cloudy")}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <div className="text-sm text-muted-foreground">{t.humidity}</div>
                <div className="font-semibold">65%</div>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                <div className="text-sm text-muted-foreground">{t.windSpeed}</div>
                <div className="font-semibold">12 km/h</div>
              </div>
              <div className="text-center">
                <Eye className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                <div className="text-sm text-muted-foreground">{t.visibility}</div>
                <div className="font-semibold">10 km</div>
              </div>
              <div className="text-center">
                <Sun className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                <div className="text-sm text-muted-foreground">{t.uvIndex}</div>
                <div className="font-semibold">6 (High)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Alerts */}
        {t.alerts && t.alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.weatherAlerts}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {t.alerts.map((alert: AlertItem, index: number) => (
                <div key={index} className="border-l-4 border-orange-500 pl-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Badge variant="destructive" className="text-xs">
                      {alert.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t.sevenDayForecast}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {t.forecast.map((day: ForecastItem, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {getWeatherIcon(day.icon)}
                    <div>
                      <div className="font-medium">{day.day}</div>
                      <div className="text-sm text-muted-foreground">{day.condition}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{day.temp}</div>
                    <div className="text-sm text-blue-500">{day.rain}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}