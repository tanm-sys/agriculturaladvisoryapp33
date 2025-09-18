"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Newspaper } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function NewsUpdates() {
  const { currentLang } = useLanguage()

  const newsData = {
    en: [
      { title: "New subsidy for drip irrigation announced", time: "3h ago" },
      { title: "Weather advisory: Expect heavy rains this weekend", time: "8h ago" },
      { title: "Cotton prices see a 5% increase in local markets", time: "1d ago" },
    ],
    hi: [
      { title: "ड्रिप सिंचाई के लिए नई सब्सिडी की घोषणा", time: "3 घंटे पहले" },
      { title: "मौसम सलाह: इस सप्ताह के अंत में भारी बारिश की उम्मीद", time: "8 घंटे पहले" },
      { title: "स्थानीय बाजारों में कपास की कीमतों में 5% की वृद्धि", time: "1 दिन पहले" },
    ],
    mr: [
      { title: "ठिबक सिंचनासाठी नवीन अनुदानाची घोषणा", time: "३ तासांपूर्वी" },
      { title: "हवामान सल्ला: या आठवड्याच्या शेवटी मुसळधार पावसाची शक्यता", time: "८ तासांपूर्वी" },
      { title: "स्थानिक बाजारात कापसाच्या दरात ५% वाढ", time: "१ दिवसापूर्वी" },
    ],
    pa: [
      { title: "ਡਰਿਪ ਸਿੰਚਾਈ ਲਈ ਨਵੀਂ ਸਬਸਿਡੀ ਦਾ ਐਲਾਨ", time: "3 ਘੰਟੇ ਪਹਿਲਾਂ" },
      { title: "ਮੌਸਮ ਸਲਾਹ: ਇਸ ਹਫਤੇ ਭਾਰੀ ਬਾਰਸ਼ ਦੀ ਉਮੀਦ", time: "8 ਘੰਟੇ ਪਹਿਲਾਂ" },
      { title: "ਸਥਾਨਕ ਬਾਜ਼ਾਰਾਂ ਵਿੱਚ ਕਪਾਹ ਦੀਆਂ ਕੀਮਤਾਂ ਵਿੱਚ 5% ਦਾ ਵਾਧਾ", time: "1 ਦਿਨ ਪਹਿਲਾਂ" },
    ],
  }

  const t = newsData[currentLang as keyof typeof newsData] || newsData.en

  return (
    <Card className="glass-effect transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          News & Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {t.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <p className="text-foreground flex-1 pr-2">{item.title}</p>
            <p className="text-muted-foreground text-xs whitespace-nowrap">{item.time}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}