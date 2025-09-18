"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Phone, Home, MessageSquare, FileText, LogOut, LogIn } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  // const [attemptCount, setAttemptCount] = useState(0) // Removed attemptCount
  const { translations } = useLanguage()
  const { isAuthenticated, user, logout } = useAuth() // Keep logout for compatibility, though not used in UI
  const router = useRouter()

  // Removed attemptCount logic
  // useEffect(() => {
  //   const savedAttempts = localStorage.getItem("krishi-app-attempts")
  //   if (savedAttempts) {
  //     setAttemptCount(Number.parseInt(savedAttempts, 10))
  //   }
  // }, [])

  // const incrementAttempts = () => {
  //   const newCount = attemptCount + 1
  //   setAttemptCount(newCount)
  //   localStorage.setItem("krishi-app-attempts", newCount.toString())
  // }

  const baseMenuItems = [
    {
      icon: Home,
      label: translations.menu?.home || "Home",
      href: "/",
    },
    {
      icon: User,
      label: translations.menu?.profile || "My Profile",
      href: "/profile",
    },
    {
      icon: Phone,
      label: translations.menu?.contact || "Contact",
      href: "/contact",
    },
    // Government Schemes and Chat Bot are now always visible
    {
      icon: FileText,
      label: translations.menu?.schemes || "Government Schemes",
      href: "/schemes",
    },
    {
      icon: MessageSquare,
      label: translations.menu?.chatbot || "Chat Bot",
      href: "/chatbot",
    },
  ]

  // Removed conditionalMenuItems logic, all items are now in baseMenuItems
  const menuItems = baseMenuItems;

  const handleMenuItemClick = (href: string) => {
    // Removed incrementAttempts logic
    // if (href === "/schemes" || href === "/chatbot") {
    //   incrementAttempts()
    // }
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout() // Call logout for consistency, though no login button
    setIsOpen(false)
    router.push("/")
  }

  // Removed handleLogin as there is no login page
  // const handleLogin = () => {
  //   setIsOpen(false)
  //   router.push("/login")
  // }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full bg-gradient-to-b from-primary/10 to-background">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground gradient-text text-balance">
              {translations.title || "KrishiMitra"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 text-pretty">
              {translations.subtitle || "Your Digital Agricultural Advisor"}
            </p>
            {isAuthenticated && user && ( // isAuthenticated will always be true now
              <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.village}, {user.district}
                </p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href} onClick={() => handleMenuItemClick(item.href)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 text-left hover:bg-primary/10 transition-all duration-200"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-foreground text-balance">{item.label}</span>
                  </Button>
                </Link>
              ))}

              {/* Logout button is now always present, as user is always "authenticated" */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 h-12 text-left hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-balance">{translations.logout || "Logout"}</span>
              </Button>
            </nav>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center text-pretty">
              {translations.support || "Free Support: 1800-XXX-XXXX"}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}