"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, ArrowLeft, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"

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
    alerts: [],
    forecast: [],
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
    alerts: [],
    forecast: [],
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
    alerts: [],
    forecast: [],
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
    alerts: [],
    forecast: [],
  },
}

export default function WeatherPage() {
  const [currentLang, setCurrentLang] = useState<keyof typeof weatherLanguages>("en")
  const router = useRouter()
  const t = weatherLanguages[currentLang]

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

          {/* Language Selector */}
          <LanguageSelector />
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