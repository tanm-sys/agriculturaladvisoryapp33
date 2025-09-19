"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, User, MapPin, Globe, Leaf, LogIn, UserPlus, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage, Language } from "@/contexts/language-context"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert" // Import Alert and AlertDescription

interface LocationData {
  [key: string]: {
    name: string
    districts: {
      [key: string]: string[]
    }
  }
}

const locationData: LocationData = {
  MH: {
    name: "Maharashtra",
    districts: {
      Mumbai: ["Mumbai City", "Mumbai Suburban", "Thane", "Kalyan"],
      Pune: ["Pune City", "Pimpri-Chinchwad", "Baramati", "Maval"],
      Nashik: ["Nashik City", "Malegaon", "Sinnar", "Dindori"],
      Aurangabad: ["Aurangabad City", "Jalna", "Beed", "Osmanabad"],
      Solapur: ["Solapur City", "Pandharpur", "Barshi", "Karmala"],
      Nagpur: ["Nagpur City", "Wardha", "Bhandara", "Gondia"],
    },
  },
  KA: {
    name: "Karnataka",
    districts: {
      Bangalore: ["Bangalore Urban", "Bangalore Rural", "Ramanagara", "Tumkur"],
      Mysore: ["Mysore City", "Mandya", "Hassan", "Kodagu"],
      Hubli: ["Hubli-Dharwad", "Gadag", "Haveri", "Uttara Kannada"],
      Mangalore: ["Dakshina Kannada", "Udupu", "Kasaragod", "Chikmagalur"],
      Belgaum: ["Belgaum City", "Bagalkot", "Bijapur", "Gulbarga"],
    },
  },
  PB: {
    name: "Punjab",
    districts: {
      Ludhiana: ["Ludhiana City", "Khanna", "Samrala", "Payal"],
      Amritsar: ["Amritsar City", "Tarn Taran", "Gurdaspur", "Pathankot"],
      Jalandhar: ["Jalandhar City", "Kapurthala", "Hoshiarpur", "Nawanshahr"],
      Patiala: ["Patiala City", "Rajpura", "Samana", "Patran"],
      Bathinda: ["Bathinda City", "Mansa", "Sardulgarh", "Rampura"],
    },
  },
  UP: {
    name: "Uttar Pradesh",
    districts: {
      Lucknow: ["Lucknow City", "Barabanki", "Sitapur", "Hardoi"],
      Kanpur: ["Kanpur City", "Kanpur Dehat", "Unnao", "Fatehpur"],
      Agra: ["Agra City", "Mathura", "Firozabad", "Mainpuri"],
      Varanasi: ["Varanasi City", "Jaunpur", "Ghazipur", "Ballia"],
      Allahabad: ["Prayagraj", "Kaushambi", "Pratapgarh", "Sultanpur"],
      Meerut: ["Meerut City", "Ghaziabad", "Gautam Buddha Nagar", "Bulandshahr"],
    },
  },
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [mobileNumber, setMobileNumber] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedTaluka, setSelectedTaluka] = useState("")
  const [selectedVillage, setSelectedVillage] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { login, register, isAuthenticated, user } = useAuth()
  const { translations: t, setCurrentLang } = useLanguage()

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router])

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Only allow digits
    if (value.length <= 10) {
      setMobileNumber(value)
      setError(null)
    }
  }

  const validateMobileNumber = (num: string) => {
    return /^\d{10}$/.test(num)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateMobileNumber(mobileNumber)) {
      setError(t.invalidMobile || "Please enter a valid 10-digit mobile number")
      return
    }

    setIsLoading(true)
    // Simulate API call for login
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
      const foundUser = storedUsers.find((u: any) => u.mobileNumber === mobileNumber)

      if (foundUser) {
        login(foundUser)
        toast.success(t.loginSuccess || "Login successful!")
      } else {
        setError(t.userNotFound || "User not found. Please sign up.")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !selectedState ||
      !selectedDistrict ||
      !selectedTaluka ||
      !selectedVillage ||
      !selectedLanguage
    ) {
      setError(t.fillAllFields || "Please fill all fields")
      return
    }

    if (!validateMobileNumber(mobileNumber)) {
      setError(t.invalidMobile || "Please enter a valid 10-digit mobile number")
      return
    }

    setIsLoading(true)
    // Simulate API call for registration
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem("registered_users") || "[]")
      if (storedUsers.some((u: any) => u.mobileNumber === mobileNumber)) {
        setError(t.mobileExists || "Mobile number already registered. Please log in.")
        setIsLoading(false)
        return
      }

      const newUser = {
        id: `user-${Date.now()}`,
        mobileNumber,
        firstName,
        lastName,
        state: locationData[selectedState].name,
        district: selectedDistrict,
        taluka: selectedTaluka,
        village: selectedVillage,
        language: selectedLanguage,
      }
      const updatedUsers = [...storedUsers, newUser]
      localStorage.setItem("registered_users", JSON.stringify(updatedUsers))

      setCurrentLang(selectedLanguage) // Set the language for the new user
      register(newUser) // Log in the new user
      toast.success(t.signupSuccess || "Registration successful!")
      setIsLoading(false)
    }, 2000)
  }

  const getDistricts = () => {
    return selectedState ? Object.keys(locationData[selectedState].districts) : []
  }

  const getTalukas = () => {
    return selectedState && selectedDistrict ? locationData[selectedState].districts[selectedDistrict] : []
  }

  const getVillages = () => {
    // For simplicity, talukas are treated as villages in this demo
    return selectedState && selectedDistrict && selectedTaluka ? [selectedTaluka] : []
  }

  const languageOptions: { value: Language; label: string }[] = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिंदी" },
    { value: "mr", label: "मराठी" },
    { value: "pa", label: "ਪੰਜਾਬੀ" },
    { value: "kn", label: "ಕನ್ನಡ" },
    { value: "ta", label: "தமிழ்" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in glass-effect">
        <CardHeader className="text-center space-y-2">
          <Leaf className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <CardTitle className="text-3xl font-bold gradient-text">{isSignUp ? t.signup : t.login}</CardTitle>
          <CardDescription className="text-muted-foreground text-pretty">
            {t.loginDescription || "Please provide your details to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.firstName}</Label>
                  <Input
                    id="firstName"
                    placeholder={t.firstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.lastName}</Label>
                  <Input
                    id="lastName"
                    placeholder={t.lastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">{t.mobileNumber}</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  maxLength={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t.selectLanguage}</Label>
                <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
                  <SelectTrigger>
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={t.selectLanguage} />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">{t.selectState}</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder={t.selectState} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(locationData).map(([code, data]) => (
                        <SelectItem key={code} value={code}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">{t.selectDistrict}</Label>
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!selectedState}>
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder={t.selectDistrict} />
                    </SelectTrigger>
                    <SelectContent>
                      {getDistricts().map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taluka">{t.selectTaluka}</Label>
                  <Select value={selectedTaluka} onValueChange={setSelectedTaluka} disabled={!selectedDistrict}>
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder={t.selectTaluka} />
                    </SelectTrigger>
                    <SelectContent>
                      {getTalukas().map((taluka) => (
                        <SelectItem key={taluka} value={taluka}>
                          {taluka}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">{t.selectVillage}</Label>
                  <Select value={selectedVillage} onValueChange={setSelectedVillage} disabled={!selectedTaluka}>
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder={t.selectVillage} />
                    </SelectTrigger>
                    <SelectContent>
                      {getVillages().map((village) => (
                        <SelectItem key={village} value={village}>
                          {village}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full pulse-glow" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isLoading ? "Registering..." : t.register}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                {t.alreadyHaveAccount}{" "}
                <Button variant="link" onClick={() => setIsSignUp(false)} className="p-0 h-auto">
                  {t.login}
                </Button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">{t.mobileNumber}</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  maxLength={10}
                  required
                />
              </div>
              <Button type="submit" className="w-full pulse-glow" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : <LogIn className="mr-2 h-4 w-4" />}
                {isLoading ? "Logging in..." : t.continue}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                {t.dontHaveAccount}{" "}
                <Button variant="link" onClick={() => setIsSignUp(true)} className="p-0 h-auto">
                  {t.signup}
                </Button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}