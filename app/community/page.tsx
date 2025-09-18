"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageCircle,
  Users,
  Star,
  Send,
  ArrowLeft,
  Search,
  Filter,
  ThumbsUp,
  MessageSquare,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "@/components/language-selector"

interface Question {
  id: number
  title: string
  category: string
  author: string
  time: string
  likes: number
  replies: number
  status: "answered" | "pending"
  preview: string
}

interface Expert {
  name: string
  specialty: string
  rating: number
  answers: number
  avatar: string
}

interface CommunityLanguageContent {
  title: string
  askExperts: string
  recentQuestions: string
  topExperts: string
  categories: string[]
  searchPlaceholder: string
  askQuestion: string
  questionTitle: string
  questionDetails: string
  selectCategory: string
  submitQuestion: string
  back: string
  answered: string
  pending: string
  likes: string
  replies: string
  questions: Question[]
  experts: Expert[]
}

// Language support for community
const communityLanguages: Record<string, CommunityLanguageContent> = {
  en: {
    title: "Farmer Community",
    askExperts: "Ask Experts",
    recentQuestions: "Recent Questions",
    topExperts: "Top Experts",
    categories: [
      "Crop Diseases",
      "Pest Control",
      "Fertilizers",
      "Weather",
      "Market Prices",
      "Irrigation",
      "Seeds",
      "General",
    ],
    searchPlaceholder: "Search questions...",
    askQuestion: "Ask a Question",
    questionTitle: "Question Title",
    questionDetails: "Question Details",
    selectCategory: "Select Category",
    submitQuestion: "Submit Question",
    back: "Back",
    answered: "Answered",
    pending: "Pending",
    likes: "likes",
    replies: "replies",
    questions: [
      {
        id: 1,
        title: "White spots on cotton leaves - what could this be?",
        category: "Crop Diseases",
        author: "Ramesh Kumar",
        time: "2 hours ago",
        likes: 12,
        replies: 5,
        status: "answered",
        preview: "I noticed white spots appearing on my cotton plants. The spots are small and scattered...",
      },
      {
        id: 2,
        title: "Best time for wheat sowing in Punjab?",
        category: "Seeds",
        author: "Gurpreet Singh",
        time: "5 hours ago",
        likes: 8,
        replies: 3,
        status: "answered",
        preview: "When is the optimal time to sow wheat in Punjab region? Weather has been unpredictable...",
      },
      {
        id: 3,
        title: "Organic fertilizer recommendations for tomatoes",
        category: "Fertilizers",
        author: "Priya Sharma",
        time: "1 day ago",
        likes: 15,
        replies: 7,
        status: "answered",
        preview: "Looking for organic fertilizer options for my tomato crop. Want to avoid chemicals...",
      },
    ],
    experts: [
      {
        name: "Dr. Suresh Patel",
        specialty: "Plant Pathology",
        rating: 4.9,
        answers: 234,
        avatar: "SP",
      },
      {
        name: "Prof. Meera Joshi",
        specialty: "Soil Science",
        rating: 4.8,
        answers: 189,
        avatar: "MJ",
      },
      {
        name: "Rajesh Verma",
        specialty: "Pest Management",
        rating: 4.7,
        answers: 156,
        avatar: "RV",
      },
    ],
  },
  mr: {
    title: "शेतकरी समुदाय",
    askExperts: "तज्ञांना विचारा",
    recentQuestions: "अलीकडील प्रश्न",
    topExperts: "शीर्ष तज्ञ",
    categories: [
      "पीक रोग",
      "कीटक नियंत्रण",
      "खते",
      "हवामान",
      "बाजार भाव",
      "सिंचन",
      "बियाणे",
      "सामान्य",
    ],
    searchPlaceholder: "प्रश्न शोधा...",
    askQuestion: "प्रश्न विचारा",
    questionTitle: "प्रश्नाचे शीर्षक",
    questionDetails: "प्रश्नाचे तपशील",
    selectCategory: "श्रेणी निवडा",
    submitQuestion: "प्रश्न सबमिट करा",
    back: "परत",
    answered: "उत्तर दिले",
    pending: "प्रलंबित",
    likes: "आवडी",
    replies: "उत्तरे",
    questions: [],
    experts: [],
  },
  ta: {
    title: "விவசாயி சமூகம்",
    askExperts: "நிபுணர்களிடம் கேளுங்கள்",
    recentQuestions: "சமீபத்திய கேள்விகள்",
    topExperts: "சிறந்த நிபுணர்கள்",
    categories: [
      "பயிர் நோய்கள்",
      "பூச்சி கட்டுப்பாடு",
      "உரங்கள்",
      "வானிலை",
      "சந்தை விலைகள்",
      "நீர்ப்பாசனம்",
      "விதைகள்",
      "பொது",
    ],
    searchPlaceholder: "கேள்விகளைத் தேடுங்கள்...",
    askQuestion: "கேள்வி கேளுங்கள்",
    questionTitle: "கேள்வி தலைப்பு",
    questionDetails: "கேள்வி விவரங்கள்",
    selectCategory: "வகையைத் தேர்ந்தெடுக்கவும்",
    submitQuestion: "கேள்வியை சமர்ப்பிக்கவும்",
    back: "பின்",
    answered: "பதிலளிக்கப்பட்டது",
    pending: "நிலுவையில்",
    likes: "விருப்பங்கள்",
    replies: "பதில்கள்",
    questions: [],
    experts: [],
  },
  kn: {
    title: "ರೈತ ಸಮುದಾಯ",
    askExperts: "ತಜ್ಞರನ್ನು ಕೇಳಿ",
    recentQuestions: "ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು",
    topExperts: "ಉನ್ನತ ತಜ್ಞರು",
    categories: [
      "ಬೆಳೆ ರೋಗಗಳು",
      "ಕೀಟ ನಿಯಂತ್ರಣ",
      "ಗೊಬ್ಬರಗಳು",
      "ಹವಾಮಾನ",
      "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
      "ನೀರಾವರಿ",
      "ಬೀಜಗಳು",
      "ಸಾಮಾನ್ಯ",
    ],
    searchPlaceholder: "ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ...",
    askQuestion: "ಪ್ರಶ್ನೆ ಕೇಳಿ",
    questionTitle: "ಪ್ರಶ್ನೆ ಶೀರ್ಷಿಕೆ",
    questionDetails: "ಪ್ರಶ್ನೆ ವಿವರಗಳು",
    selectCategory: "ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    submitQuestion: "ಪ್ರಶ್ನೆಯನ್ನು ಸಲ್ಲಿಸಿ",
    back: "ಹಿಂದೆ",
    answered: "ಉತ್ತರಿಸಲಾಗಿದೆ",
    pending: "ಬಾಕಿ",
    likes: "ಇಷ್ಟಗಳು",
    replies: "ಉತ್ತರಗಳು",
    questions: [],
    experts: [],
  },
  pa: {
    title: "ਕਿਸਾਨ ਭਾਈਚਾਰਾ",
    askExperts: "ਮਾਹਿਰਾਂ ਨੂੰ ਪੁੱਛੋ",
    recentQuestions: "ਹਾਲੀਆ ਸਵਾਲ",
    topExperts: "ਚੋਟੀ ਦੇ ਮਾਹਿਰ",
    categories: [
      "ਫਸਲਾਂ ਦੇ ਰੋਗ",
      "ਕੀਟ ਕੰਟਰੋਲ",
      "ਖਾਦਾਂ",
      "ਮੌਸਮ",
      "ਮਾਰਕੀਟ ਕੀਮਤਾਂ",
      "ਸਿੰਚਾਈ",
      "ਬੀਜ",
      "ਜਨਰਲ",
    ],
    searchPlaceholder: "ਸਵਾਲ ਖੋਜੋ...",
    askQuestion: "ਸਵਾਲ ਪੁੱਛੋ",
    questionTitle: "ਸਵਾਲ ਦਾ ਸਿਰਲੇਖ",
    questionDetails: "ਸਵਾਲ ਦੇ ਵੇਰਵੇ",
    selectCategory: "ਸ਼੍ਰੇਣੀ ਚੁਣੋ",
    submitQuestion: "ਸਵਾਲ ਜਮ੍ਹਾਂ ਕਰੋ",
    back: "ਵਾਪਸ",
    answered: "ਜਵਾਬ ਦਿੱਤਾ",
    pending: "ਬਾਕੀ",
    likes: "ਪਸੰਦਾਂ",
    replies: "ਜਵਾਬਾਂ",
    questions: [],
    experts: [],
  },
}

export default function CommunityPage() {
  const [currentLang, setCurrentLang] = useState<keyof typeof communityLanguages>("en")
  const [showAskForm, setShowAskForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const t = communityLanguages[currentLang]

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
              <MessageCircle className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">{t.title}</span>
            </div>
          </div>

          {/* Language Selector */}
          <LanguageSelector />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Ask Question */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowAskForm(!showAskForm)} className="whitespace-nowrap">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t.askQuestion}
          </Button>
        </div>

        {/* Ask Question Form */}
        {showAskForm && (
          <Card>
            <CardHeader>
              <CardTitle>{t.askQuestion}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.questionTitle}</label>
                <Input placeholder="Enter your question title..." className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">{t.questionDetails}</label>
                <Textarea placeholder="Describe your question in detail..." className="mt-1" rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium">{t.selectCategory}</label>
                <select className="w-full mt-1 p-2 border border-border rounded-md bg-background">
                  {t.categories.map((category: string, index: number) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  {t.submitQuestion}
                </Button>
                <Button variant="outline" onClick={() => setShowAskForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {t.recentQuestions}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {t.questions.map((question: Question) => (
                  <div key={question.id} className="border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {question.category}
                          </Badge>
                          <Badge
                            variant={question.status === "answered" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {question.status === "answered" ? t.answered : t.pending}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{question.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{question.preview}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {question.author}
                          </span>
                          <span>{question.time}</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {question.likes} {t.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {question.replies} {t.replies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Experts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t.topExperts}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.experts.map((expert: Expert, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">{expert.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{expert.name}</div>
                      <div className="text-xs text-muted-foreground">{expert.specialty}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          {expert.rating}
                        </div>
                        <span className="text-muted-foreground">{expert.answers} answers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t.categories}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {t.categories.map((category: string, index: number) => (
                    <Button key={index} variant="ghost" size="sm" className="w-full justify-start text-xs">
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}