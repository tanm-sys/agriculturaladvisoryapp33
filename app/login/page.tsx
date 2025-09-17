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
      alert(translations.fillAllFields || "Please fill all fields")
      return
    }

    // Mobile number validation
    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      alert(translations.invalidMobile || "Please enter a valid 10-digit mobile number")
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md p-6">
          <div className="text-center mb-8">
            <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {currentLang === "hi"
                ? "भाषा चुनें"
                : currentLang === "mr"
                  ? "भाषा निवडा"
                  : currentLang === "pa"
                    ? "ਭਾਸ਼ਾ ਚੁਣੋ"
                    : "Select Language"}
            </h1>
            <p className="text-gray-600">
              {currentLang === "hi"
                ? "अपनी पसंदीदा भाषा चुनें"
                : currentLang === "mr"
                  ? "आपली आवडती भाषा निवडा"
                  : currentLang === "pa"
                    ? "ਆਪਣੀ ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ ਚੁਣੋ"
                    : "Choose your preferred language"}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleLanguageSelect("en")}
              className="w-full p-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              English
            </Button>
            <Button
              onClick={() => handleLanguageSelect("hi")}
              className="w-full p-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              हिंदी
            </Button>
            <Button
              onClick={() => handleLanguageSelect("mr")}
              className="w-full p-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              मराठी
            </Button>
            <Button
              onClick={() => handleLanguageSelect("pa")}
              className="w-full p-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              ਪੰਜਾਬੀ
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLanguageSelection(true)}
          className="text-white hover:bg-green-700 p-2 mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-center flex-1 mr-11">{translations.myProfile || "My Profile"}</h1>
      </div>

      {/* Form */}
      <div className="p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number */}
          <div>
            <Input
              type="tel"
              placeholder={translations.mobileNumber || "Mobile Number"}
              value={formData.mobileNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, mobileNumber: e.target.value }))}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg"
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
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg"
            />
          </div>

          {/* Last Name */}
          <div>
            <Input
              type="text"
              placeholder={translations.lastName || "Last Name"}
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg"
            />
          </div>

          {/* State Selection */}
          <div>
            <Select value={formData.state} onValueChange={handleStateChange}>
              <SelectTrigger className="w-full p-4 text-lg bg-green-600 text-white border-0 rounded-lg">
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
              <SelectTrigger className="w-full p-4 text-lg bg-green-600 text-white border-0 rounded-lg">
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
              <SelectTrigger className="w-full p-4 text-lg bg-green-600 text-white border-0 rounded-lg">
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
              <SelectTrigger className="w-full p-4 text-lg bg-green-600 text-white border-0 rounded-lg">
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
              className="w-full bg-gray-800 hover:bg-gray-900 text-white text-lg py-4 rounded-lg font-semibold"
            >
              {translations.update || "UPDATE"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}