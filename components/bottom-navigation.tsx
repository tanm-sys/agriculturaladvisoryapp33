"use client"

import { Button } from "@/components/ui/button"
import { Home, Stethoscope, BarChart3, MessageCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Diagnose",
      icon: Stethoscope,
      href: "/diagnose",
    },
    {
      label: "Markets",
      icon: BarChart3,
      href: "/market",
    },
    {
      label: "Community",
      icon: MessageCircle,
      href: "/community",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border glass-effect z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-col gap-1 h-auto py-2 transition-all duration-200 hover:scale-105",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}