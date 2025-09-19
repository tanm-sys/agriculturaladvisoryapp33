"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Camera,
  Upload,
  Volume2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
  Leaf,
  Droplets,
  Bug,
  Phone,
  CreditCard,
  BarChart3,
  TestTube,
  MapPin,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { BottomNavigation } from "@/components/bottom-navigation" // Import BottomNavigation
import { NotificationBell } from "@/components/notification-bell" // Import NotificationBell
import { ThemeToggle } from "@/components/theme-toggle" // Import ThemeToggle

interface SoilDataEntry {
  ph: string
  nitrogen: string
  phosphorus: string
  potassium: string
  organicCarbon: string
  sulfur: string
  zinc: string
  boron: string
  iron: string
  manganese: string
}

interface SampleSoilData {
  value: number
  status: string
  range: string
}

interface DiagnosisSampleResults {
  disease: string
  description: string
  treatment: string
  prevention: string
}

interface DiagnosisTips {
  photoTips: string
  tip1: string
  tip2: string
  tip3: string
  tip4: string
}

interface DiagnosisLanguageContent {
  title: string
  subtitle: string
  uploadPrompt: string
  takePhoto: string
  uploadImage: string
  analyzing: string
  results: string
  confidence: string
  recommendations: string
  soilHealth: string
  soilHealthCard: string
  hasCard: string
  noCard: string
  uploadCard: string
  enterAadhaar: string
  linkAadhaar: string
  soilParameters: string
  locationDetails: string
  selectState: string
  selectDistrict: string
  selectCity: string
  manualEntry: string
  severity: {
    low: string
    medium: string
    high: string
  }
  actions: {
    retake: string
    speakResults: string
    getHelp: string
    back: string // Added 'back' property
  }
  sampleResults: DiagnosisSampleResults
  soilData: Record<keyof SoilDataEntry, string>
  tips: DiagnosisTips
}

// Enhanced language support for crop diagnosis with soil health
const diagnosisLanguages: Record<string, DiagnosisLanguageContent> = {
  en: {
    title: "Crop Advisory & Soil Health",
    subtitle: "AI-Powered Crop Analysis with Soil Health Integration",
    uploadPrompt: "Take a photo or upload an image of your crop",
    takePhoto: "Take Photo",
    uploadImage: "Upload Image",
    analyzing: "Analyzing your crop...",
    results: "Diagnosis Results",
    confidence: "Confidence Level",
    recommendations: "Recommendations",
    soilHealth: "Soil Health Analysis",
    soilHealthCard: "Soil Health Card",
    hasCard: "I have Soil Health Card",
    noCard: "I don't have Soil Health Card",
    uploadCard: "Upload Soil Health Card",
    enterAadhaar: "Enter Aadhaar Number",
    linkAadhaar: "Link with Aadhaar",
    soilParameters: "Soil Parameters",
    locationDetails: "Location Details",
    selectState: "Select State",
    selectDistrict: "Select District",
    selectCity: "Select City/Village",
    manualEntry: "Manual Soil Data Entry",
    severity: {
      low: "Low Risk",
      medium: "Medium Risk",
      high: "High Risk",
    },
    actions: {
      retake: "Take Another Photo",
      speakResults: "Listen to Results",
      getHelp: "Get Expert Help",
      back: "Back", // Added translation
    },
    sampleResults: {
      disease: "Leaf Spot Disease",
      description: "Early signs of fungal infection detected on crop leaves",
      treatment:
        "Apply copper-based fungicide spray every 7-10 days. Ensure proper drainage and avoid overhead watering.",
      prevention: "Maintain proper plant spacing for air circulation. Remove infected plant debris regularly.",
    },
    soilData: {
      ph: "pH Level",
      nitrogen: "Nitrogen (N)",
      phosphorus: "Phosphorus (P)",
      potassium: "Potassium (K)",
      organicCarbon: "Organic Carbon",
      sulfur: "Sulfur (S)",
      zinc: "Zinc (Zn)",
      boron: "Boron (B)",
      iron: "Iron (Fe)",
      manganese: "Manganese (Mn)",
    },
    tips: {
      photoTips: "Photo Tips",
      tip1: "Take photos in good natural light",
      tip2: "Focus on affected areas clearly",
      tip3: "Include healthy parts for comparison",
      tip4: "Avoid shadows and blur",
    },
  },
  hi: {
    title: "फसल सलाह और मिट्टी स्वास्थ्य",
    subtitle: "मिट्टी स्वास्थ्य एकीकरण के साथ AI-संचालित फसल विश्लेषण",
    uploadPrompt: "अपनी फसल का फोटो लें या छवि अपलोड करें",
    takePhoto: "फोटो लें",
    uploadImage: "छवि अपलोड करें",
    analyzing: "आपकी फसल का विश्लेषण कर रहे हैं...",
    results: "निदान परिणाम",
    confidence: "विश्वास स्तर",
    recommendations: "सिफारिशें",
    soilHealth: "मिट्टी स्वास्थ्य विश्लेषण",
    soilHealthCard: "मिट्टी स्वास्थ्य कार्ड",
    hasCard: "मेरे पास मिट्टी स्वास्थ्य कार्ड है",
    noCard: "मेरे पास मिट्टी स्वास्थ्य कार्ड नहीं है",
    uploadCard: "मिट्टी स्वास्थ्य कार्ड अपलोड करें",
    enterAadhaar: "आधार नंबर दर्ज करें",
    linkAadhaar: "आधार से लिंक करें",
    soilParameters: "मिट्टी के पैरामीटर",
    locationDetails: "स्थान विवरण",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",
    selectCity: "शहर/गांव चुनें",
    manualEntry: "मैन्युअल मिट्टी डेटा प्रविष्टि",
    severity: {
      low: "कम जोखिम",
      medium: "मध्यम जोखिम",
      high: "उच्च जोखिम",
    },
    actions: {
      retake: "दूसरी फोटो लें",
      speakResults: "परिणाम सुनें",
      getHelp: "विशेषज्ञ सहायता लें",
      back: "वापस", // Added translation
    },
    sampleResults: {
      disease: "पत्ती धब्बा रोग",
      description: "फसल की पत्तियों पर फंगल संक्रमण के प्रारंभिक संकेत मिले",
      treatment: "हर 7-10 दिन में तांबा आधारित फंगीसाइड स्प्रे करें। उचित जल निकासी सुनिश्चित करें और ऊपर से पानी देने से बचें।",
      prevention: "हवा के संचलन के लिए उचित पौधों की दूरी बनाए रखें। संक्रमित पौधों के मलबे को नियमित रूप से हटाएं।",
    },
    soilData: {
      ph: "pH स्तर",
      nitrogen: "नाइट्रोजन (N)",
      phosphorus: "फास्फोरस (P)",
      potassium: "पोटेशियम (K)",
      organicCarbon: "जैविक कार्बन",
      sulfur: "सल्फर (S)",
      zinc: "जिंक (Zn)",
      boron: "बोरॉन (B)",
      iron: "आयरन (Fe)",
      manganese: "मैंगनीज (Mn)",
    },
    tips: {
      photoTips: "फोटो टिप्स",
      tip1: "अच्छी प्राकृतिक रोशनी में फोटो लें",
      tip2: "प्रभावित क्षेत्रों पर स्पष्ट रूप से ध्यान दें",
      tip3: "तुलना के लिए स्वस्थ भागों को शामिल करें",
      tip4: "छाया और धुंधलेपन से बचें",
    },
  },
  mr: {
    title: "पीक सल्ला आणि माती आरोग्य",
    subtitle: "माती आरोग्य एकीकरणासह AI-आधारित पीक विश्लेषण",
    uploadPrompt: "तुमच्या पिकाचा फोटो घ्या किंवा प्रतिमा अपलोड करा",
    takePhoto: "फोटो घ्या",
    uploadImage: "प्रतिमा अपलोड करा",
    analyzing: "तुमच्या पिकाचे विश्लेषण करत आहे...",
    results: "निदान परिणाम",
    confidence: "विश्वास पातळी",
    recommendations: "शिफारसी",
    soilHealth: "माती आरोग्य विश्लेषण",
    soilHealthCard: "माती आरोग्य कार्ड",
    hasCard: "माझ्याकडे माती आरोग्य कार्ड आहे",
    noCard: "माझ्याकडे माती आरोग्य कार्ड नाही",
    uploadCard: "माती आरोग्य कार्ड अपलोड करा",
    enterAadhaar: "आधार नंबर टाका",
    linkAadhaar: "आधारशी जोडा",
    soilParameters: "माती पॅरामीटर",
    locationDetails: "स्थान तपशील",
    selectState: "राज्य निवडा",
    selectDistrict: "जिल्हा निवडा",
    selectCity: "शहर/गाव निवडा",
    manualEntry: "मॅन्युअल माती डेटा एंट्री",
    severity: {
      low: "कमी धोका",
      medium: "मध्यम धोका",
      high: "उच्च धोका",
    },
    actions: {
      retake: "दुसरा फोटो घ्या",
      speakResults: "परिणाम ऐका",
      getHelp: "तज्ञ मदत मिळवा",
      back: "परत", // Added translation
    },
    sampleResults: {
      disease: "पानावरील डाग रोग",
      description: "पिकाच्या पानांवर बुरशीजन्य संसर्गाची सुरुवातीची चिन्हे आढळली",
      treatment: "दर ७-१० दिवसांनी तांब्याचे बुरशीनाशक फवारणी करा। योग्य निचरा सुनिश्चित करा आणि वरून पाणी देणे टाळा।",
      prevention: "हवेच्या प्रवाहासाठी योग्य अंतर ठेवा। संक्रमित वनस्पतींचे अवशेष नियमितपणे काढून टाका।",
    },
    soilData: {
      ph: "pH पातळी",
      nitrogen: "नायट्रोजन (N)",
      phosphorus: "फॉस्फरस (P)",
      potassium: "पोटॅशियम (K)",
      organicCarbon: "सेंद्रिय कार्बन",
      sulfur: "सल्फर (S)",
      zinc: "झिंक (Zn)",
      boron: "बोरॉन (B)",
      iron: "लोह (Fe)",
      manganese: "मॅंगनीज (Mn)",
    },
    tips: {
      photoTips: "फोटो टिप्स",
      tip1: "चांगल्या नैसर्गिक प्रकाशात फोटो घ्या",
      tip2: "प्रभावित भागांवर स्पष्टपणे लक्ष केंद्रित करा",
      tip3: "तुलनेसाठी निरोगी भाग समाविष्ट करा",
      tip4: "सावली आणि अस्पष्टता टाळा",
    },
  },
  pa: {
    title: "ਫਸਲ ਸਲਾਹ ਅਤੇ ਮਿੱਟੀ ਸਿਹਤ",
    subtitle: "ਮਿੱਟੀ ਸਿਹਤ ਏਕੀਕਰਣ ਨਾਲ AI-ਸੰਚਾਲਿਤ ਫਸਲ ਵਿਸ਼ਲੇਸ਼ਣ",
    uploadPrompt: "ਆਪਣੀ ਫਸਲ ਦੀ ਫੋਟੋ ਲਓ ਜਾਂ ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
    takePhoto: "ਫੋਟੋ ਲਓ",
    uploadImage: "ਤਸਵੀਰ ਅਪਲੋਡ ਕਰੋ",
    analyzing: "ਤੁਹਾਡੀ ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...",
    results: "ਨਿਦਾਨ ਨਤੀਜੇ",
    confidence: "ਭਰੋਸੇ ਦਾ ਪੱਧਰ",
    recommendations: "ਸਿਫਾਰਸ਼ਾਂ",
    soilHealth: "ਮਿੱਟੀ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ",
    soilHealthCard: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ",
    hasCard: "ਮੇਰੇ ਕੋਲ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਹੈ",
    noCard: "ਮੇਰੇ ਕੋਲ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਨਹੀਂ ਹੈ",
    uploadCard: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਅਪਲੋਡ ਕਰੋ",
    enterAadhaar: "ਆਧਾਰ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    linkAadhaar: "ਆਧਾਰ ਨਾਲ ਲਿੰਕ ਕਰੋ",
    soilParameters: "ਮਿੱਟੀ ਪੈਰਾਮੀਟਰ",
    locationDetails: "ਸਥਾਨ ਵੇਰਵੇ",
    selectState: "ਰਾਜ ਚੁਣੋ",
    selectDistrict: "ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ",
    selectCity: "ਸ਼ਹਿਰ/ਪਿੰਡ ਚੁਣੋ",
    manualEntry: "ਮੈਨੁਅਲ ਮਿੱਟੀ ਡੇਟਾ ਐਂਟਰੀ",
    severity: {
      low: "ਘੱਟ ਖਤਰਾ",
      medium: "ਮੱਧਮ ਖਤਰਾ",
      high: "ਉੱਚ ਖਤਰਾ",
    },
    actions: {
      retake: "ਹੋਰ ਫੋਟੋ ਲਓ",
      speakResults: "ਨਤੀਜੇ ਸੁਣੋ",
      getHelp: "ਮਾਹਿਰ ਮਦਦ ਲਓ",
      back: "ਵਾਪਸ", // Added translation
    },
    sampleResults: {
      disease: "ਪੱਤੇ ਦਾ ਧੱਬਾ ਰੋਗ",
      description: "ਫਸਲ ਦੇ ਪੱਤਿਆਂ ਉੱਤੇ ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ ਦੇ ਸ਼ੁਰੂਆਤੀ ਨਿਸ਼ਾਨ ਮਿਲੇ ਹਨ",
      treatment: "ਹਰ 7-10 ਦਿਨਾਂ ਵਿੱਚ ਤਾਂਬੇ ਆਧਾਰਿਤ ਫੰਗੀਸਾਈਡ ਸਪਰੇ ਕਰੋ। ਸਹੀ ਨਿਕਾਸ ਯਕੀਨੀ ਬਣਾਓ ਅਤੇ ਉੱਪਰੋਂ ਪਾਣੀ ਦੇਣ ਤੋਂ ਬਚੋ।",
      prevention: "ਹਵਾ ਦੇ ਪ੍ਰਵਾਹ ਲਈ ਸਹੀ ਦੂਰੀ ਰੱਖੋ। ਸੰਕਰਮਿਤ ਪੌਧਿਆਂ ਦੇ ਬਚੇ ਹੋਏ ਹਿੱਸੇ ਨਿਯਮਿਤ ਹਟਾਓ।",
    },
    soilData: {
      ph: "pH ਪੱਧਰ",
      nitrogen: "ਨਾਈਟ੍ਰੋਜਨ (N)",
      phosphorus: "ਫਾਸਫੋਰਸ (P)",
      potassium: "ਪੋਟਾਸ਼ੀਅਮ (K)",
      organicCarbon: "ਜੈਵਿਕ ਕਾਰਬਨ",
      sulfur: "ਸਲਫਰ (S)",
      zinc: "ਜ਼ਿੰਕ (Zn)",
      boron: "ਬੋਰਾਨ (B)",
      iron: "ਆਇਰਨ (Fe)",
      manganese: "ਮੈਂਗਨੀਜ਼ (Mn)",
    },
    tips: {
      photoTips: "ਫੋਟੋ ਸੁਝਾਅ",
      tip1: "ਚੰਗੀ ਕੁਦਰਤੀ ਰੋਸ਼ਨੀ ਵਿੱਚ ਫੋਟੋ ਲਓ",
      tip2: "ਪ੍ਰਭਾਵਿਤ ਖੇਤਰਾਂ ਉੱਤੇ ਸਪਸ਼ਟ ਧਿਆਨ ਦਿਓ",
      tip3: "ਤੁਲਨਾ ਲਈ ਸਿਹਤਮੰਦ ਹਿੱਸੇ ਸ਼ਾਮਲ ਕਰੋ",
      tip4: "ਪਰਛਾਵੇਂ ਅਤੇ ਧੁੰਦਲੇਪਨ ਤੋਂ ਬਚੋ",
    },
  },
}

interface CityData {
  [key: string]: string[]
}

interface DistrictData {
  [key: string]: CityData
}

interface StateData {
  name: string
  districts: CityData
}

interface LocationData {
  [key: string]: StateData
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

type DiagnosisStage = "upload" | "analyzing" | "results"

export default function CropDiagnosis() {
  const { currentLang } = useLanguage() // Removed hasSelectedLanguage
  const [stage, setStage] = useState<DiagnosisStage>("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasSoilCard, setHasSoilCard] = useState<boolean | null>(null)
  // const [aadhaarNumber, setAadhaarNumber] = useState("") // Removed aadhaarNumber state
  const [soilDataLoaded, setSoilDataLoaded] = useState(false)
  const [uploadedSoilCard, setUploadedSoilCard] = useState<string | null>(null)

  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [showManualEntry, setShowManualEntry] = useState(false)

  const [manualSoilData, setManualSoilData] = useState<SoilDataEntry>({
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicCarbon: "",
    sulfur: "",
    zinc: "",
    boron: "",
    iron: "",
    manganese: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const soilCardInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const t = diagnosisLanguages[currentLang] || diagnosisLanguages.en // Fallback to English

  const sampleSoilData: Record<keyof SoilDataEntry, SampleSoilData> = {
    ph: { value: 6.8, status: "optimal", range: "6.5-7.5" },
    nitrogen: { value: 280, status: "medium", range: "280-560 kg/ha" },
    phosphorus: { value: 22, status: "high", range: "10-25 kg/ha" },
    potassium: { value: 240, status: "medium", range: "280-560 kg/ha" },
    organicCarbon: { value: 0.65, status: "medium", range: "0.5-0.75%" },
    sulfur: { value: 12, status: "low", range: "10-20 ppm" },
    zinc: { value: 0.8, status: "medium", range: "0.6-1.2 ppm" },
    boron: { value: 0.5, status: "low", range: "0.5-1.0 ppm" },
    iron: { value: 8.2, status: "optimal", range: "4.5-15.0 ppm" },
    manganese: { value: 3.5, status: "optimal", range: "1.0-5.0 ppm" },
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        startAnalysis()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSoilCardUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedSoilCard(e.target?.result as string)
        setSoilDataLoaded(true)
        setHasSoilCard(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTakePhoto = () => {
    // In a real app, this would open camera
    // For demo, we'll simulate with file input
    fileInputRef.current?.click()
  }

  const startAnalysis = () => {
    setStage("analyzing")
    setAnalysisProgress(0)

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setStage("results"), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
  }

  const handleSpeakResults = () => {
    setIsSpeaking(true)
    // Simulate text-to-speech
    setTimeout(() => setIsSpeaking(false), 3000)
  }

  // Removed handleLinkAadhaar function as it's no longer needed.

  const handleManualSoilSubmit = () => {
    if (selectedState && selectedDistrict && selectedCity) {
      setSoilDataLoaded(true)
      setHasSoilCard(true)
      setShowManualEntry(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "default"
      case "high":
        return "secondary"
      case "medium":
        return "outline"
      case "low":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20"> {/* Added pb-20 for bottom navigation */}
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground text-balance">{t.title}</span>
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

      <div className="container mx-auto px-4 py-6">
        {/* Upload Stage */}
        {stage === "upload" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground text-balance">{t.subtitle}</h1>
              <p className="text-muted-foreground text-pretty">{t.uploadPrompt}</p>
            </div>

            <Tabs defaultValue="crop" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crop" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Crop Diagnosis
                </TabsTrigger>
                <TabsTrigger value="soil" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  {t.soilHealth}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crop" className="space-y-6">
                {/* Upload Area */}
                <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
                  <CardContent className="p-12 text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <Camera className="h-10 w-10 text-primary" />
                    </div>

                    <div className="space-y-4">
                      <Button size="lg" onClick={handleTakePhoto} className="w-full sm:w-auto">
                        <Camera className="mr-2 h-5 w-5" />
                        {t.takePhoto}
                      </Button>

                      <div className="text-sm text-muted-foreground">or</div>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        {t.uploadImage}
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      capture="environment"
                    />
                  </CardContent>
                </Card>

                {/* Photo Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" />
                      {t.tips.photoTips}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-pretty">{t.tips.tip1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-pretty">{t.tips.tip2}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-pretty">{t.tips.tip3}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-pretty">{t.tips.tip4}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="soil" className="space-y-6">
                {soilDataLoaded ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-primary" />
                        {t.soilHealthCard}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {selectedState && selectedDistrict && selectedCity
                          ? `${selectedCity}, ${selectedDistrict}, ${locationData[selectedState].name}`
                          : "Data from uploaded card or manual entry"}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {uploadedSoilCard && (
                        <div className="w-full h-48 rounded-lg overflow-hidden border-2 border-primary/20 mb-4">
                          <img src={uploadedSoilCard} alt="Uploaded Soil Health Card" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold mb-2">{t.soilParameters}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(sampleSoilData).map(([key, data]) => (
                          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium text-sm">{t.soilData[key as keyof typeof t.soilData]}</div>
                              <div className="text-xs text-muted-foreground">{data.range}</div>
                            </div>
                            <Badge variant={getStatusColor(data.status)} className="text-xs">
                              {data.value} ({data.status})
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <Button onClick={() => {
                        setSoilDataLoaded(false);
                        setHasSoilCard(null);
                        setUploadedSoilCard(null);
                        setSelectedState("");
                        setSelectedDistrict("");
                        setSelectedCity("");
                        setShowManualEntry(false);
                        setManualSoilData({
                          ph: "", nitrogen: "", phosphorus: "", potassium: "", organicCarbon: "",
                          sulfur: "", zinc: "", boron: "", iron: "", manganese: "",
                        });
                      }} variant="outline" className="w-full mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t.actions.back}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        {t.soilHealthCard}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {hasSoilCard === null && (
                        <div className="space-y-4">
                          <p className="text-muted-foreground text-pretty">
                            Do you have a Soil Health Card? We can show you detailed soil parameters or help you get one.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => setHasSoilCard(true)} className="flex-1">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {t.hasCard}
                            </Button>
                            <Button variant="outline" onClick={() => setHasSoilCard(false)} className="flex-1">
                              <CreditCard className="mr-2 h-4 w-4" />
                              {t.noCard}
                            </Button>
                          </div>
                        </div>
                      )}

                      {hasSoilCard === true && !soilDataLoaded && (
                        <div className="space-y-4">
                          <p className="text-muted-foreground text-pretty">
                            Upload your Soil Health Card to view all parameters automatically.
                          </p>
                          <Button onClick={() => soilCardInputRef.current?.click()} className="w-full">
                            <FileText className="mr-2 h-4 w-4" />
                            {t.uploadCard}
                          </Button>
                          <input
                            ref={soilCardInputRef}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleSoilCardUpload}
                            className="hidden"
                          />
                        </div>
                      )}

                      {hasSoilCard === false && !soilDataLoaded && (
                        <div className="space-y-6">
                          <Card className="p-4">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              {t.locationDetails}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>{t.selectState}</Label>
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
                                <Label>{t.selectDistrict}</Label>
                                <Select
                                  value={selectedDistrict}
                                  onValueChange={setSelectedDistrict}
                                  disabled={!selectedState}
                                >
                                  <SelectTrigger>
                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder={t.selectDistrict} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedState &&
                                      Object.keys(locationData[selectedState].districts).map(
                                        (district: string) => (
                                          <SelectItem key={district} value={district}>
                                            {district}
                                          </SelectItem>
                                        ),
                                      )}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>{t.selectCity}</Label>
                                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedDistrict}>
                                  <SelectTrigger>
                                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder={t.selectCity} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {selectedState &&
                                      selectedDistrict &&
                                      locationData[selectedState].districts[selectedDistrict]?.map((city: string) => (
                                        <SelectItem key={city} value={city}>
                                          {city}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </Card>

                          <div className="text-center">
                            <Button variant="outline" onClick={() => setShowManualEntry(true)} className="w-full"
                              disabled={!selectedState || !selectedDistrict || !selectedCity}
                            >
                              <TestTube className="mr-2 h-4 w-4" />
                              {t.manualEntry}
                            </Button>
                          </div>

                          {showManualEntry && (
                            <Card className="p-4">
                              <h3 className="text-lg font-semibold mb-4">{t.manualEntry}</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(manualSoilData).map(([key, value]) => (
                                  <div key={key} className="space-y-2">
                                    <Label htmlFor={key}>{t.soilData[key as keyof typeof t.soilData]}</Label>
                                    <Input
                                      id={key}
                                      type="number"
                                      step="0.1"
                                      value={value}
                                      onChange={(e) =>
                                        setManualSoilData((prev) => ({
                                          ...prev,
                                          [key]: e.target.value,
                                        }))
                                      }
                                      placeholder="Enter value"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-4 mt-4">
                                <Button
                                  onClick={handleManualSoilSubmit}
                                  disabled={!selectedState || !selectedDistrict || !selectedCity}
                                  className="flex-1"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Submit Data
                                </Button>
                                <Button variant="outline" onClick={() => setShowManualEntry(false)} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </Card>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Analysis Stage */}
        {stage === "analyzing" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground text-balance">{t.analyzing}</h1>

              {uploadedImage && (
                <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden border-2 border-primary/20">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded crop"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Progress value={analysisProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">{Math.round(analysisProgress)}% complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Stage */}
        {stage === "results" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground text-balance">{t.results}</h1>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">{t.confidence}:</span>
                <Badge variant="default">87%</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Uploaded Image */}
              <div className="lg:col-span-1">
                {uploadedImage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Analyzed Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full aspect-square rounded-lg overflow-hidden border">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Analyzed crop"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Diagnosis Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Disease Detection */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bug className="h-5 w-5 text-destructive" />
                        <span className="text-balance">{t.sampleResults.disease}</span>
                      </CardTitle>
                      <Badge variant={getSeverityColor("medium")} className="flex items-center gap-1">
                        {getSeverityIcon("medium")}
                        {t.severity.medium}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-pretty">{t.sampleResults.description}</p>
                  </CardContent>
                </Card>

                {/* Treatment Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-primary" />
                      {t.recommendations}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Treatment:</strong> <span className="text-pretty">{t.sampleResults.treatment}</span>
                      </AlertDescription>
                    </Alert>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Prevention:</strong> <span className="text-pretty">{t.sampleResults.prevention}</span>
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handleSpeakResults} disabled={isSpeaking} className="flex-1">
                    <Volume2 className="mr-2 h-4 w-4" />
                    {isSpeaking ? "Speaking..." : t.actions.speakResults}
                  </Button>

                  <Button variant="outline" onClick={() => setStage("upload")} className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    {t.actions.retake}
                  </Button>

                  <Button variant="secondary" className="flex-1">
                    <Phone className="mr-2 h-4 w-4" />
                    {t.actions.getHelp}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNavigation /> {/* Add BottomNavigation here */}
    </div>
  )
}