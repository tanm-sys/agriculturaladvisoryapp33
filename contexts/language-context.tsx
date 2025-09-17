"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "hi" | "mr" | "pa"

interface LanguageContextType {
  currentLang: Language
  setCurrentLang: (lang: Language) => void
  translations: any
  hasSelectedLanguage: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const globalTranslations = {
  en: {
    title: "KrishiMitra",
    subtitle: "Your Digital Agricultural Advisor",
    description: "Get instant crop advice, market prices, and weather updates in your local language",
    getStarted: "Get Started",
    voiceSearch: "Voice Search",
    menu: {
      home: "Home",
      profile: "My Profile",
      schemes: "Government Schemes", // Added schemes translation
      contact: "Contact",
      chatbot: "Chat Bot",
    },
    features: {
      cropAdvisory: "Crop Advisory",
      cropAdvisoryDesc: "AI-powered crop diagnosis and recommendations",
      marketPrice: "Market Price",
      marketPriceDesc: "Real-time local market prices",
      weather: "Weather Recommendation",
      weatherDesc: "Hyperlocal weather forecasts and farming advice",
      soilHealth: "Soil Health Card",
      soilHealthDesc: "Digital soil testing and health monitoring",
      chatBot: "Chat Bot",
      chatBotDesc: "24/7 AI assistant for farming queries",
    },
    profile: {
      title: "My Profile",
      personalInfo: "Personal Information",
      farmInfo: "Farm Information",
      statistics: "My Statistics",
      edit: "Edit Profile",
      save: "Save Changes",
      cancel: "Cancel",
      back: "Back",
      fields: {
        fullName: "Full Name",
        phone: "Phone Number",
        email: "Email Address",
        village: "Village",
        district: "District",
        state: "State",
        farmSize: "Farm Size (Acres)",
        cropTypes: "Main Crops",
        experience: "Farming Experience (Years)",
        bio: "About Me",
      },
      placeholders: {
        fullName: "Enter your full name",
        phone: "Enter phone number",
        email: "Enter email address",
        village: "Enter village name",
        district: "Enter district",
        state: "Select state",
        farmSize: "Enter farm size",
        cropTypes: "e.g., Cotton, Wheat, Rice",
        experience: "Years of experience",
        bio: "Tell us about your farming journey...",
      },
      stats: {
        totalQueries: "Total Queries",
        cropsDiagnosed: "Crops Diagnosed",
        advisoriesReceived: "Advisories Received",
        communityPosts: "Community Posts",
      },
    },
    contact: {
      title: "Contact Us",
      subtitle: "Get in touch with our agricultural experts",
      form: {
        fullName: "Full Name",
        village: "Village",
        query: "Your Query",
        submit: "Submit Query",
        success: "Query submitted successfully!",
      },
      placeholders: {
        fullName: "Enter your full name",
        village: "Enter your village name",
        query: "Describe your farming question or issue...",
      },
    },
    ads: {
      fertilizer: "Premium Fertilizers",
      fertilizerDesc: "Best quality fertilizers for better crop yield",
      seeds: "Quality Seeds",
      seedsDesc: "High yield variety seeds available",
      equipment: "Farm Equipment",
      equipmentDesc: "Modern farming equipment for rent",
      insurance: "Crop Insurance",
      insuranceDesc: "Protect your crops with insurance",
    },
    states: "Serving farmers across India",
    languages: "Available in Hindi, Marathi, English & Punjabi",
    support: "Free Support: 1800-XXX-XXXX",
  },
  hi: {
    title: "कृषिमित्र",
    subtitle: "आपका डिजिटल कृषि सलाहकार",
    description: "अपनी स्थानीय भाषा में तुरंत फसल सलाह, बाजार भाव और मौसम अपडेट प्राप्त करें",
    getStarted: "शुरू करें",
    voiceSearch: "आवाज खोज",
    menu: {
      home: "होम",
      profile: "मेरी प्रोफाइल",
      schemes: "सरकारी योजनाएं", // Added schemes translation in Hindi
      contact: "संपर्क",
      chatbot: "चैट बॉट",
    },
    features: {
      cropAdvisory: "फसल सलाह",
      cropAdvisoryDesc: "AI-संचालित फसल निदान और सिफारिशें",
      marketPrice: "बाजार भाव",
      marketPriceDesc: "रियल-टाइम स्थानीय बाजार भाव",
      weather: "मौसम सिफारस",
      weatherDesc: "स्थानीय मौसम पूर्वानुमान और खेती सलाह",
      soilHealth: "मिट्टी स्वास्थ्य कार्ड",
      soilHealthDesc: "डिजिटल मिट्टी परीक्षण और स्वास्थ्य निगरानी",
      chatBot: "चैट बॉट",
      chatBotDesc: "खेती प्रश्नों के लिए 24/7 AI सहायक",
    },
    profile: {
      title: "मेरी प्रोफाइल",
      personalInfo: "व्यक्तिगत जानकारी",
      farmInfo: "खेत की जानकारी",
      statistics: "मेरे आंकड़े",
      edit: "प्रोफाइल संपादित करें",
      save: "परिवर्तन सहेजें",
      cancel: "रद्द करें",
      back: "वापस",
      fields: {
        fullName: "पूरा नाम",
        phone: "फोन नंबर",
        email: "ईमेल पता",
        village: "गांव",
        district: "जिला",
        state: "राज्य",
        farmSize: "खेत का आकार (एकड़)",
        cropTypes: "मुख्य फसलें",
        experience: "खेती का अनुभव (वर्ष)",
        bio: "मेरे बारे में",
      },
      placeholders: {
        fullName: "अपना पूरा नाम दर्ज करें",
        phone: "फोन नंबर दर्ज करें",
        email: "ईमेल पता दर्ज करें",
        village: "गांव का नाम दर्ज करें",
        district: "जिला दर्ज करें",
        state: "राज्य चुनें",
        farmSize: "खेत का आकार दर्ज करें",
        cropTypes: "जैसे कपास, गेहूं, चावल",
        experience: "अनुभव के वर्ष",
        bio: "अपनी खेती की यात्रा के बारे में बताएं...",
      },
      stats: {
        totalQueries: "कुल प्रश्न",
        cropsDiagnosed: "फसल निदान",
        advisoriesReceived: "प्राप्त सलाह",
        communityPosts: "समुदाय पोस्ट",
      },
    },
    contact: {
      title: "संपर्क करें",
      subtitle: "हमारे कृषि विशेषज्ञों से संपर्क करें",
      form: {
        fullName: "पूरा नाम",
        village: "गांव",
        query: "आपका प्रश्न",
        submit: "प्रश्न भेजें",
        success: "प्रश्न सफलतापूर्वक भेजा गया!",
      },
      placeholders: {
        fullName: "अपना पूरा नाम दर्ज करें",
        village: "अपने गांव का नाम दर्ज करें",
        query: "अपने खेती संबंधी प्रश्न या समस्या का वर्णन करें...",
      },
    },
    ads: {
      fertilizer: "प्रीमियम उर्वरक",
      fertilizerDesc: "बेहतर फसल उत्पादन के लिए सर्वोत्तम गुणवत्ता के उर्वरक",
      seeds: "गुणवत्ता बीज",
      seedsDesc: "उच्च उत्पादन किस्म के बीज उपलब्ध",
      equipment: "कृषि उपकरण",
      equipmentDesc: "किराए के लिए आधुनिक कृषि उपकरण",
      insurance: "फसल बीमा",
      insuranceDesc: "बीमा के साथ अपनी फसलों की सुरक्षा करें",
    },
    states: "भारत भर के किसानों की सेवा",
    languages: "हिंदी, मराठी, अंग्रेजी और पंजाबी में उपलब्ध",
    support: "निःशुल्क सहायता: 1800-XXX-XXXX",
  },
  mr: {
    title: "कृषीमित्र",
    subtitle: "तुमचा डिजिटल शेती सल्लागार",
    description: "तुमच्या स्थानिक भाषेत तत्काळ पीक सल्ला, बाजार भाव आणि हवामान अपडेट मिळवा",
    getStarted: "सुरुवात करा",
    voiceSearch: "आवाज शोध",
    menu: {
      home: "होम",
      profile: "माझी प्रोफाइल",
      schemes: "सरकारी योजना", // Added schemes translation in Marathi
      contact: "संपर्क",
      chatbot: "चॅट बॉट",
    },
    features: {
      cropAdvisory: "पीक सल्ला",
      cropAdvisoryDesc: "AI-आधारित पीक निदान आणि शिफारसी",
      marketPrice: "बाजार भाव",
      marketPriceDesc: "रिअल-टाइम स्थानिक बाजार भाव",
      weather: "हवामान शिफारस",
      weatherDesc: "स्थानिक हवामान अंदाज आणि शेती सल्ला",
      soilHealth: "माती आरोग्य कार्ड",
      soilHealthDesc: "डिजिटल माती चाचणी आणि आरोग्य निरीक्षण",
      chatBot: "चॅट बॉट",
      chatBotDesc: "शेती प्रश्नांसाठी 24/7 AI सहाय्यक",
    },
    profile: {
      title: "माझी प्रोफाइल",
      personalInfo: "वैयक्तिक माहिती",
      farmInfo: "शेताची माहिती",
      statistics: "माझे आकडेवारी",
      edit: "प्रोफाइल संपादित करा",
      save: "बदल जतन करा",
      cancel: "रद्द करा",
      back: "परत",
      fields: {
        fullName: "पूर्ण नाव",
        phone: "फोन नंबर",
        email: "ईमेल पत्ता",
        village: "गाव",
        district: "जिल्हा",
        state: "राज्य",
        farmSize: "शेताचा आकार (एकर)",
        cropTypes: "मुख्य पिके",
        experience: "शेतीचा अनुभव (वर्षे)",
        bio: "माझ्याबद्दल",
      },
      placeholders: {
        fullName: "तुमचे पूर्ण नाव टाका",
        phone: "फोन नंबर टाका",
        email: "ईमेल पत्ता टाका",
        village: "गावाचे नाव टाका",
        district: "जिल्हा टाका",
        state: "राज्य निवडा",
        farmSize: "शेताचा आकार टाका",
        cropTypes: "उदा. कापूस, गहू, तांदूळ",
        experience: "अनुभवाची वर्षे",
        bio: "तुमच्या शेतीच्या प्रवासाबद्दल सांगा...",
      },
      stats: {
        totalQueries: "एकूण प्रश्न",
        cropsDiagnosed: "पीक निदान",
        advisoriesReceived: "मिळालेले सल्ले",
        communityPosts: "समुदाय पोस्ट",
      },
    },
    contact: {
      title: "संपर्क साधा",
      subtitle: "आमच्या शेती तज्ञांशी संपर्क साधा",
      form: {
        fullName: "पूर्ण नाव",
        village: "गाव",
        query: "तुमचा प्रश्न",
        submit: "प्रश्न पाठवा",
        success: "प्रश्न यशस्वीरित्या पाठवला गेला!",
      },
      placeholders: {
        fullName: "तुमचे पूर्ण नाव टाका",
        village: "तुमच्या गावाचे नाव टाका",
        query: "तुमच्या शेतीशी संबंधित प्रश्न किंवा समस्येचे वर्णन करा...",
      },
    },
    ads: {
      fertilizer: "प्रीमियम खते",
      fertilizerDesc: "चांगल्या पीक उत्पादनासाठी सर्वोत्तम दर्जाची खते",
      seeds: "दर्जेदार बियाणे",
      seedsDesc: "उच्च उत्पादन जातीचे बियाणे उपलब्ध",
      equipment: "शेती उपकरणे",
      equipmentDesc: "भाड्याने आधुनिक शेती उपकरणे",
      insurance: "पीक विमा",
      insuranceDesc: "विम्यासह आपल्या पिकांचे संरक्षण करा",
    },
    states: "संपूर्ण भारतातील शेतकऱ्यांची सेवा",
    languages: "हिंदी, मराठी, इंग्रजी आणि पंजाबीमध्ये उपलब्ध",
    support: "मोफत सहाय्य: 1800-XXX-XXXX",
  },
  pa: {
    title: "ਕ੍ਰਿਸ਼ੀਮਿੱਤਰ",
    subtitle: "ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਖੇਤੀਬਾੜੀ ਸਲਾਹਕਾਰ",
    description: "ਆਪਣੀ ਸਥਾਨਕ ਭਾਸ਼ਾ ਵਿੱਚ ਤੁਰੰਤ ਫਸਲ ਸਲਾਹ, ਮਾਰਕੀਟ ਦੀਆਂ ਕੀਮਤਾਂ ਅਤੇ ਮੌਸਮ ਅਪਡੇਟ ਪ੍ਰਾਪਤ ਕਰੋ",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
    voiceSearch: "ਆਵਾਜ਼ ਖੋਜ",
    menu: {
      home: "ਹੋਮ",
      profile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
      schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ", // Added schemes translation in Punjabi
      contact: "ਸੰਪਰਕ",
      chatbot: "ਚੈਟ ਬੋਟ",
    },
    features: {
      cropAdvisory: "ਫਸਲ ਸਲਾਹ",
      cropAdvisoryDesc: "AI-ਸੰਚਾਲਿਤ ਫਸਲ ਨਿਦਾਨ ਅਤੇ ਸਿਫਾਰਸ਼ਾਂ",
      marketPrice: "ਮਾਰਕੀਟ ਕੀਮਤ",
      marketPriceDesc: "ਰੀਅਲ-ਟਾਈਮ ਸਥਾਨਕ ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
      weather: "ਮੌਸਮ ਸਿਫਾਰਸ਼",
      weatherDesc: "ਸਥਾਨਕ ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ ਅਤੇ ਖੇਤੀ ਸਲਾਹ",
      soilHealth: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ",
      soilHealthDesc: "ਡਿਜੀਟਲ ਮਿੱਟੀ ਜਾਂਚ ਅਤੇ ਸਿਹਤ ਨਿਗਰਾਨੀ",
      chatBot: "ਚੈਟ ਬੋਟ",
      chatBotDesc: "ਖੇਤੀ ਸਵਾਲਾਂ ਲਈ 24/7 AI ਸਹਾਇਕ",
    },
    profile: {
      title: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
      personalInfo: "ਨਿੱਜੀ ਜਾਣਕਾਰੀ",
      farmInfo: "ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ",
      statistics: "ਮੇਰੇ ਅੰਕੜੇ",
      edit: "ਪ੍ਰੋਫਾਈਲ ਸੰਪਾਦਿਤ ਕਰੋ",
      save: "ਤਬਦੀਲੀਆਂ ਸੇਵ ਕਰੋ",
      cancel: "ਰੱਦ ਕਰੋ",
      back: "ਵਾਪਸ",
      fields: {
        fullName: "ਪੂਰਾ ਨਾਮ",
        phone: "ਫੋਨ ਨੰਬਰ",
        email: "ਈਮੇਲ ਪਤਾ",
        village: "ਪਿੰਡ",
        district: "ਜ਼ਿਲ੍ਹਾ",
        state: "ਰਾਜ",
        farmSize: "ਖੇਤ ਦਾ ਆਕਾਰ (ਏਕੜ)",
        cropTypes: "ਮੁੱਖ ਫਸਲਾਂ",
        experience: "ਖੇਤੀ ਦਾ ਤਜਰਬਾ (ਸਾਲ)",
        bio: "ਮੇਰੇ ਬਾਰੇ",
      },
      placeholders: {
        fullName: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        phone: "ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ",
        email: "ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ",
        village: "ਪਿੰਡ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        district: "ਜ਼ਿਲ੍ਹਾ ਦਰਜ ਕਰੋ",
        state: "ਰਾਜ ਚੁਣੋ",
        farmSize: "ਖੇਤ ਦਾ ਆਕਾਰ ਦਰਜ ਕਰੋ",
        cropTypes: "ਜਿਵੇਂ ਕਪਾਹ, ਕਣਕ, ਚਾਵਲ",
        experience: "ਤਜਰਬੇ ਦੇ ਸਾਲ",
        bio: "ਆਪਣੀ ਖੇਤੀ ਦੀ ਯਾਤਰਾ ਬਾਰੇ ਦੱਸੋ...",
      },
      stats: {
        totalQueries: "ਕੁੱਲ ਸਵਾਲ",
        cropsDiagnosed: "ਫਸਲ ਨਿਦਾਨ",
        advisoriesReceived: "ਮਿਲੀਆਂ ਸਲਾਹਾਂ",
        communityPosts: "ਭਾਈਚਾਰਾ ਪੋਸਟਾਂ",
      },
    },
    contact: {
      title: "ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      subtitle: "ਸਾਡੇ ਖੇਤੀਬਾੜੀ ਮਾਹਿਰਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
      form: {
        fullName: "ਪੂਰਾ ਨਾਮ",
        village: "ਪਿੰਡ",
        query: "ਤੁਹਾਡਾ ਸਵਾਲ",
        submit: "ਸਵਾਲ ਭੇਜੋ",
        success: "ਸਵਾਲ ਸਫਲਤਾਪੂਰਵਕ ਭੇਜਿਆ ਗਿਆ!",
      },
      placeholders: {
        fullName: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        village: "ਆਪਣੇ ਪਿੰਡ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ",
        query: "ਆਪਣੇ ਖੇਤੀਬਾੜੀ ਸੰਬੰਧੀ ਸਵਾਲ ਜਾਂ ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ...",
      },
    },
    ads: {
      fertilizer: "ਪ੍ਰੀਮੀਅਮ ਖਾਦ",
      fertilizerDesc: "ਬਿਹਤਰ ਫਸਲ ਉਤਪਾਦਨ ਲਈ ਸਰਵੋਤਮ ਗੁਣਵੱਤਾ ਦੀ ਖਾਦ",
      seeds: "ਗੁਣਵੱਤਾ ਬੀਜ",
      seedsDesc: "ਉੱਚ ਉਤਪਾਦਨ ਕਿਸਮ ਦੇ ਬੀਜ ਉਪਲਬਧ",
      equipment: "ਖੇਤੀ ਉਪਕਰਣ",
      equipmentDesc: "ਕਿਰਾਏ ਲਈ ਆਧੁਨਿਕ ਖੇਤੀ ਉਪਕਰਣ",
      insurance: "ਫਸਲ ਬੀਮਾ",
      insuranceDesc: "ਬੀਮੇ ਨਾਲ ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਸੁਰੱਖਿਆ ਕਰੋ",
    },
    states: "ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ ਕਿਸਾਨਾਂ ਦੀ ਸੇਵਾ",
    languages: "ਹਿੰਦੀ, ਮਰਾਠੀ, ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਪੰਜਾਬੀ ਵਿੱਚ ਉਪਲਬਧ",
    support: "ਮੁਫਤ ਸਹਾਇਤਾ: 1800-XXX-XXXX",
  },
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLang, setCurrentLangState] = useState<Language>("en")
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false)

  useEffect(() => {
    const savedLang = localStorage.getItem("krishi-language") as Language
    const hasSelected = localStorage.getItem("krishi-language-selected") === "true"

    if (savedLang && ["en", "hi", "mr", "pa"].includes(savedLang)) {
      setCurrentLangState(savedLang)
      setHasSelectedLanguage(hasSelected)
    }
  }, [])

  const setCurrentLang = (lang: Language) => {
    setCurrentLangState(lang)
    localStorage.setItem("krishi-language", lang)
    localStorage.setItem("krishi-language-selected", "true")
    setHasSelectedLanguage(true)
  }

  const translations = globalTranslations[currentLang]

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang, translations, hasSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
