"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Leaf, Edit, Save, ArrowLeft, Camera, Tractor, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSelector } from "@/components/language-selector"
import { NotificationBell } from "@/components/notification-bell" // Import NotificationBell
// import { ProtectedRoute } from "@/components/protected-route" // Removed ProtectedRoute import

function ProfilePageContent() {
  const { translations } = useLanguage()
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const t = translations.profile

  const [userData, setUserData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.mobileNumber || "",
    email: "",
    village: user?.village || "",
    district: user?.district || "",
    state: user?.state || "",
    farmSize: "",
    cropTypes: "",
    experience: "",
    bio: "",
  })

  const stats = {
    totalQueries: 127,
    cropsDiagnosed: 45,
    advisoriesReceived: 89,
    communityPosts: 23,
  }

  useEffect(() => {
    setIsVisible(true)
    if (user) {
      setUserData((prev) => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.mobileNumber,
        village: user.village,
        district: user.district,
        state: user.state,
      }))
    }
  }, [user])

  const handleSave = () => {
    if (user) {
      const [firstName, ...lastNameParts] = userData.fullName.split(" ")
      const lastName = lastNameParts.join(" ")

      updateProfile({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        mobileNumber: userData.phone,
        village: userData.village,
        district: userData.district,
        state: userData.state,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      setUserData({
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.mobileNumber,
        email: "",
        village: user.village,
        district: user.district,
        state: user.state,
        farmSize: "",
        cropTypes: "",
        experience: "",
        bio: "",
      })
    }
    setIsEditing(false)
  }

  if (!user) {
    // This case should ideally not be hit with the dummy user, but good for fallback
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 glass-effect">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <HamburgerMenu />
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary animate-pulse" />
              <span className="text-lg font-bold text-foreground gradient-text">{t.title}</span>
            </div>
          </div>

          {/* Language Selector and Notification Bell */}
          <div className="flex items-center gap-2">
            <NotificationBell />
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className={`container mx-auto px-4 py-6 space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        {/* Profile Header */}
        <Card className="glass-effect animate-slide-up">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {userData.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  disabled={!isEditing}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-foreground gradient-text">{userData.fullName}</h1>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {userData.village}, {userData.district}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tractor className="h-3 w-3" />
                    {userData.experience || "0"} years
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Leaf className="h-3 w-3" />
                    {userData.farmSize || "0"} acres
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="transition-all duration-200 hover:scale-105"
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t.save}
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    {t.edit}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t.statistics}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalQueries}</div>
                <div className="text-sm text-muted-foreground">{t.stats.totalQueries}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.cropsDiagnosed}</div>
                <div className="text-sm text-muted-foreground">{t.stats.cropsDiagnosed}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.advisoriesReceived}</div>
                <div className="text-sm text-muted-foreground">{t.stats.advisoriesReceived}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.communityPosts}</div>
                <div className="text-sm text-muted-foreground">{t.stats.communityPosts}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t.fields.fullName}</Label>
                <Input
                  id="fullName"
                  value={userData.fullName}
                  onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                  placeholder={t.placeholders.fullName}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.fields.phone}</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  placeholder={t.placeholders.phone}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.fields.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  placeholder={t.placeholders.email}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="village">{t.fields.village}</Label>
                  <Input
                    id="village"
                    value={userData.village}
                    onChange={(e) => setUserData({ ...userData, village: e.target.value })}
                    placeholder={t.placeholders.village}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">{t.fields.district}</Label>
                  <Input
                    id="district"
                    value={userData.district}
                    onChange={(e) => setUserData({ ...userData, district: e.target.value })}
                    placeholder={t.placeholders.district}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">{t.fields.state}</Label>
                  <Input
                    id="state"
                    value={userData.state}
                    onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                    placeholder={t.placeholders.state}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farm Information */}
          <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.6s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tractor className="h-5 w-5 text-primary" />
                {t.farmInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="farmSize">{t.fields.farmSize}</Label>
                <Input
                  id="farmSize"
                  value={userData.farmSize}
                  onChange={(e) => setUserData({ ...userData, farmSize: e.target.value })}
                  placeholder={t.placeholders.farmSize}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cropTypes">{t.fields.cropTypes}</Label>
                <Input
                  id="cropTypes"
                  value={userData.cropTypes}
                  onChange={(e) => setUserData({ ...userData, cropTypes: e.target.value })}
                  placeholder={t.placeholders.cropTypes}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">{t.fields.experience}</Label>
                <Input
                  id="experience"
                  value={userData.experience}
                  onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
                  placeholder={t.placeholders.experience}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t.fields.bio}</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  placeholder={t.placeholders.bio}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <div className="flex gap-4 justify-center animate-scale-in">
            <Button onClick={handleSave} className="transition-all duration-200 hover:scale-105">
              <Save className="mr-2 h-4 w-4" />
              {t.save}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="transition-all duration-200 hover:scale-105 bg-transparent"
            >
              {t.cancel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    // <ProtectedRoute> // Removed ProtectedRoute wrapper
      <ProfilePageContent />
    // </ProtectedRoute>
  )
}