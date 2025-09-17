"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage, Language } from "@/contexts/language-context" // Import Language type
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Leaf } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast" // Import toast for notifications

// Indian states and their districts data
const statesData = {
  Maharashtra: {
    Solapur: {
      "Solapur North": ["Solapur (M Corp.)", "Hotgi", "Mohol"],
      "Solapur South": ["Barshi", "Karmala", "Madha"],
      Akkalkot: ["Akkalkot", "South Solapur"],
    },
    Pune: {
      "Pune City": ["Pune (M Corp.)", "Pimpri-Chinchwad"],
      Haveli: ["Maval", "Mulshi", "Velhe"],
    },
    Mumbai: {
      "Mumbai City": ["Mumbai (M Corp.)"],
      "Mumbai Suburban": ["Andheri", "Borivali", "Kurla"],
    },
  },
  Karnataka: {
    Bangalore: {
      "Bangalore North": ["Bangalore (M Corp.)", "Yelahanka"],
      "Bangalore South": ["Bommanahalli", "BTM Layout"],
    },
  },
  Gujarat: {
    Ahmedabad: {
      "Ahmedabad City": ["Ahmedabad (M Corp.)"],
      Gandhinagar: ["Gandhinagar", "Kalol"],
    },
  },
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { currentLang, setCurrentLang, translations } = useLanguage()

  const [showLanguageSelection, setShowLanguageSelection] = useState(true)

  const [formData, setFormData] = useState({
    mobileNumber: "",
    firstName: "",
    lastName: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    language: currentLang,
  })

  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])
  const [availableTalukas, setAvailableTalukas] = useState<string[]>([])
  const [availableVillages, setAvailableVillages] = useState<string[]>([])

  const handleLanguageSelect = (lang: Language) => {
    setCurrentLang(lang)
    setFormData((prev) => ({ ...prev, language: lang }))
    setShowLanguageSelection(false)
  }

  const handleStateChange = (state: string) => {
    setFormData((prev) => ({ ...prev, state, district: "", taluka: "", village: "" }))
    setAvailableDistricts(Object.keys(statesData[state as keyof typeof statesData] || {}))
    setAvailableTalukas([])
    setAvailableVillages([])
  }

  const handleDistrictChange = (district: string) => {
    setFormData((prev) => ({ ...prev, district, taluka: "", village: "" }))
    const stateData = statesData[formData.state as keyof typeof statesData]
    if (stateData) {
      setAvailableTalukas(Object.keys(stateData[district as keyof typeof stateData] || {}))
    }
    setAvailableVillages([])
  }

  const handleTalukaChange = (taluka: string) => {
    setFormData((prev) => ({ ...prev, taluka, village: "" }))
    const stateData = statesData[formData.state as keyof typeof statesData]
    if (stateData) {
      const districtData = stateData[formData.district as keyof typeof stateData]
      if (districtData) {
        setAvailableVillages(districtData[taluka as keyof typeof districtData] || [])
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (
      !formData.mobileNumber ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.state ||
      !formData.district ||
      !formData.taluka ||
      !formData.village
    ) {
      toast.error(translations.fillAllFields || "Please fill all fields")
      return
    }

    // Mobile number validation
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error(translations.invalidMobile || "Please enter a valid 10-digit mobile number")
      return
    }

    // Create user object and login
    const userData = {
      id: Date.now().toString(),
      ...formData,
    }

    login(userData)
    router.push("/")
  }

  if (showLanguageSelection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center space-y-6 glass-effect animate-fade-in">
          <CardHeader>
            <Leaf className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
            <CardTitle className="text-2xl font-bold text-foreground gradient-text">
              {currentLang === "hi"
                ? "भाषा चुनें"
                : currentLang === "mr"
                  ? "भाषा निवडा"
                  : currentLang === "pa"
                    ? "ਭਾਸ਼ਾ ਚੁਣੋ"
                    : currentLang === "kn"
                      ? "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ"
                      : currentLang === "ta"
                        ? "மொழி தேர்வு செய்யவும்"
                        : "Select Language"}
            </CardTitle>
            <p className="text-muted-foreground text-pretty">
              {currentLang === "hi"
                ? "अपनी पसंदीदा भाषा चुनें"
                : currentLang === "mr"
                  ? "आपली आवडती भाषा निवडा"
                  : currentLang === "pa"
                    ? "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ"
                    : currentLang === "kn"
                      ? "ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆರಿಸಿ"
                      : currentLang === "ta"
                        ? "உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்"
                        : "Choose your preferred language"}
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            <Button
              onClick={() => handleLanguageSelect("en")}
              className="w-full p-4 text-lg transition-all duration-200 hover:scale-105"
            >
              English
            </Button>
            <Button
              onClick={() => handleLanguageSelect("hi")}
              className="w-full p-4 text-lg transition-all duration-200 hover:scale-105"
            >
              हिंदी
            </Button>
            <Button
              onClick={() => handleLanguageSelect("mr")}
              className="w-full p-4 text-lg transition-all duration-200 hover:scale-105"
            >
              मराठी
            </Button>
            <Button
              onClick={() => handleLanguageSelect("pa")}
              className="w-full p-4 text-lg transition-all duration-200 hover:scale-105"
            >
              ਪੰਜਾਬੀ
            </Button>
            <Button
              onClick={() => handleLanguageSelect("kn")}
              className="w-full p-4 text-lg transition-all duration-200 hover:scale-105"
            >
              ಕನ್ನಡ
            </Button>
            <Button
              onClick={() => handleLanguageSelect("ta")}
              className="w-full p-4 text-lg transition-all duration-200 hover:scale-105"
            >
              தமிழ்
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowLanguageSelection(true)} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-lg font-bold text-foreground gradient-text">{translations.title}</span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex gap-1">
            {(["en", "hi", "mr", "pa", "kn", "ta"] as const).map((lang) => (
              <Button
                key={lang}
                variant={currentLang === lang ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentLang(lang)}
                className="text-xs px-3 py-1 h-8 transition-all duration-200 hover:scale-105"
              >
                {lang === "en" ? "EN" : lang === "hi" ? "हि" : lang === "mr" ? "मर" : lang === "pa" ? "ਪੰ" : lang === "kn" ? "ಕ" : "த"}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Card className="glass-effect animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground gradient-text">
              {translations.myProfile || "My Profile"}
            </CardTitle>
            <p className="text-muted-foreground text-pretty">
              {translations.loginDescription || "Please provide your details to get started."}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mobile Number */}
              <div>
                <Input
                  type="tel"
                  placeholder={translations.mobileNumber || "Mobile Number"}
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
                  maxLength={10}
                />
              </div>

              {/* First Name */}
              <div>
                <Input
                  type="text"
                  placeholder={translations.firstName || "First Name"}
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </div>

              {/* Last Name */}
              <div>
                <Input
                  type="text"
                  placeholder={translations.lastName || "Last Name"}
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </div>

              {/* State Selection */}
              <div>
                <Select value={formData.state} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={translations.selectState || "Select State"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statesData).map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District Selection */}
              <div>
                <Select value={formData.district} onValueChange={handleDistrictChange} disabled={!formData.state}>
                  <SelectTrigger>
                    <SelectValue placeholder={translations.selectDistrict || "Select District"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Taluka Selection */}
              <div>
                <Select value={formData.taluka} onValueChange={handleTalukaChange} disabled={!formData.district}>
                  <SelectTrigger>
                    <SelectValue placeholder={translations.selectTaluka || "Select Taluka"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTalukas.map((taluka) => (
                      <SelectItem key={taluka} value={taluka}>
                        {taluka}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Village Selection */}
              <div>
                <Select
                  value={formData.village}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, village: value }))}
                  disabled={!formData.taluka}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={translations.selectVillage || "Select Village"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVillages.map((village) => (
                      <SelectItem key={village} value={village}>
                        {village}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full text-lg py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 pulse-glow"
                >
                  {translations.update || "UPDATE"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}