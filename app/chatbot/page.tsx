"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, ArrowLeft, Bot, Sparkles, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

interface Message {
  text: string
  sender: "user" | "bot"
}

export default function ChatbotPage() {
  const { currentLang, translations } = useLanguage()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const t = {
    en: {
      title: "AI Assistant",
      welcome: "Hello! I'm your AI farming assistant. How can I help you today?",
      placeholder: "Ask about crops, weather, prices...",
      suggestions: [
        "What is the market price of cotton in Mumbai?",
        "My tomato plants have yellow leaves.",
        "When should I plant wheat in Punjab?",
        "Tell me about the PM-KISAN scheme.",
      ],
    },
    hi: {
      title: "AI सहायक",
      welcome: "नमस्ते! मैं आपका AI खेती सहायक हूँ। मैं आज आपकी कैसे मदद कर सकता हूँ?",
      placeholder: "फसलों, मौसम, कीमतों के बारे में पूछें...",
      suggestions: [
        "मुंबई में कपास का बाजार भाव क्या है?",
        "मेरे टमाटर के पौधों में पीली पत्तियां हैं।",
        "पंजाब में गेहूं कब बोना चाहिए?",
        "मुझे पीएम-किसान योजना के बारे में बताएं।",
      ],
    },
    mr: {
      title: "AI सहाय्यक",
      welcome: "नमस्कार! मी तुमचा AI शेती सहाय्यक आहे। मी आज तुमची कशी मदत करू शकतो?",
      placeholder: "पिके, हवामान, भावांबद्दल विचारा...",
      suggestions: [
        "मुंबईमध्ये कापसाचा बाजार भाव काय आहे?",
        "माझ्या टोमॅटोच्या झाडांना पिवळी पाने आहेत.",
        "पंजाबमध्ये गहू केव्हा लावावा?",
        "मला पीएम-किसान योजनेबद्दल सांगा.",
      ],
    },
    pa: {
      title: "AI ਸਹਾਇਕ",
      welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
      placeholder: "ਫਸਲਾਂ, ਮੌਸਮ, ਕੀਮਤਾਂ ਬਾਰੇ ਪੁੱਛੋ...",
      suggestions: [
        "ਮੁੰਬਈ ਵਿੱਚ ਕਪਾਹ ਦਾ ਬਾਜ਼ਾਰੀ ਮੁੱਲ ਕੀ ਹੈ?",
        "ਮੇਰੇ ਟਮਾਟਰ ਦੇ ਪੌਦਿਆਂ ਦੇ ਪੱਤੇ ਪੀਲੇ ਹਨ।",
        "ਪੰਜਾਬ ਵਿੱਚ ਕਣਕ ਕਦੋਂ ਬੀਜਣੀ ਚਾਹੀਦੀ ਹੈ?",
        "ਮੈਨੂੰ ਪੀਐਮ-ਕਿਸਾਨ ਯੋਜਨਾ ਬਾਰੇ ਦੱਸੋ।",
      ],
    },
  }

  const currentT = t[currentLang as keyof typeof t] || t.en

  useEffect(() => {
    setMessages([{ text: currentT.welcome, sender: "bot" }])
  }, [currentLang])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSend = (messageText?: string) => {
    const text = (messageText || input).trim()
    if (!text) return

    const newMessages: Message[] = [...messages, { text, sender: "user" }]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = `This is a simulated response for: "${text}". In a real application, an AI would provide a detailed answer here.`
      setMessages([...newMessages, { text: botResponse, sender: "bot" }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">{currentT.title}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={cn("flex items-start gap-3", msg.sender === "user" ? "justify-end" : "")}>
            {msg.sender === "bot" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-xs md:max-w-md p-3 rounded-lg text-sm",
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted rounded-bl-none",
              )}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-muted rounded-bl-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-border bg-card/50">
        <Card className="mb-4">
          <CardHeader className="p-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex flex-wrap gap-2">
              {currentT.suggestions.map((s, i) => (
                <Button key={i} variant="outline" size="sm" className="text-xs" onClick={() => handleSend(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={currentT.placeholder}
            className="flex-1"
          />
          <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}