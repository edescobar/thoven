"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Instagram, Linkedin } from "lucide-react"
import { RoleSwitcher } from "@/components/role-switcher"
import { LearnerLanding } from "@/components/learner-landing"
import { TeacherLanding } from "@/components/teacher-landing"
import { H1, Highlight } from "@/components/heading"
import { useState, useEffect } from "react"
import Link from "next/link"
import { SignInModal } from "@/components/sign-in-modal"
import { SignUpModal } from "@/components/sign-up-modal"
import { TeacherApplicationModal } from "@/components/teacher-application-modal"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [currentRole, setCurrentRole] = useState<"learner" | "teacher">("learner")
  const [showTeacherApplication, setShowTeacherApplication] = useState(false)
  const [showSignInDropdown, setShowSignInDropdown] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  useEffect(() => {
    // If user is already logged in, redirect to app
    if (!loading && user && profile) {
      if (profile.role === 'parent') {
        router.push('/app/parent/dashboard')
      } else if (profile.role === 'teacher') {
        router.push('/app/teacher/dashboard')
      } else {
        router.push('/app/dashboard')
      }
    }
  }, [user, profile, loading, router])

  useEffect(() => {
    const handleOpenApplication = () => {
      setShowTeacherApplication(true)
    }

    window.addEventListener("openTeacherApplication", handleOpenApplication)
    return () => window.removeEventListener("openTeacherApplication", handleOpenApplication)
  }, [])

  const handleBecomeTeacher = () => {
    setShowTeacherApplication(true)
  }

  const handleSignIn = () => {
    setShowSignInModal(true)
    setShowSignInDropdown(false)
  }

  const handleSwitchToSignIn = () => {
    setShowSignUpModal(false)
    setShowSignInModal(true)
  }

  const handleSwitchToSignUp = () => {
    setShowSignInModal(false)
    setShowSignUpModal(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-8 py-4 bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logocropped-Ts5Qu9cYp28KPMWeyKi361H6sTD2Qc.png"
            alt="THOVEN - Music Education Platform"
            className="h-14 w-auto transition-transform hover:scale-105"
          />
        </div>
        <div className="flex items-center gap-3 relative">
          <Link
            href="/about"
            className="font-sans text-gray-600 hover:text-amber-600 transition-colors hover:underline focus:ring-2 focus:ring-amber-300 rounded px-2 py-1 text-sm"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className="font-sans text-gray-600 hover:text-amber-600 transition-colors hover:underline focus:ring-2 focus:ring-amber-300 rounded px-2 py-1 text-sm"
          >
            How It Works
          </Link>
          <Button
            variant="outline"
            className="border-2 border-orange-400 text-orange-600 hover:bg-orange-50 bg-transparent shadow-[0_4px_0_0_rgb(251,146,60)] hover:shadow-[0_2px_0_0_rgb(251,146,60)] active:shadow-[0_1px_0_0_rgb(251,146,60)] transition-all duration-200 active:translate-y-1 font-sans font-semibold px-6 py-2.5 focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            onClick={handleBecomeTeacher}
          >
            Become a Teacher
          </Button>
          <Button 
            className="bg-rose-400 hover:bg-rose-500 text-white shadow-[0_4px_0_0_rgb(244,63,94)] hover:shadow-[0_2px_0_0_rgb(244,63,94)] active:shadow-[0_1px_0_0_rgb(244,63,94)] transition-all duration-200 active:translate-y-1 font-sans font-semibold px-6 py-2.5 focus:ring-2 focus:ring-rose-300 focus:ring-offset-2"
            onClick={() => setShowSignUpModal(true)}
          >
            Find Teacher
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_0_0_rgb(217,119,6)] hover:shadow-[0_2px_0_0_rgb(217,119,6)] active:shadow-[0_1px_0_0_rgb(217,119,6)] transition-all duration-200 active:translate-y-1 font-sans font-semibold px-6 py-2.5 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
            onClick={handleSignIn}
          >
            Sign In
          </Button>

          {/* Inline sign-in dropdown */}
          {showSignInDropdown && (
            <div className="absolute top-full right-0 mt-6 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50 animate-fade-in">
              <div className="absolute -top-2 right-8 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-semibold text-gray-800">Welcome back!</h3>
                <button
                  onClick={() => setShowSignInDropdown(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
                  aria-label="Close sign in form"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-center mb-6">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/make_him_be_waving_just_waving_1756835489299-viUDIU3Cm4Qdw9BcXS2twEJbeFd7Zt.png"
                  alt="Thovie mascot waving"
                  className="w-20 h-20 animate-bounce"
                />
              </div>

              <form className="space-y-5">
                <div>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="font-sans w-full h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="font-sans w-full h-12 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all"
                  />
                </div>
                <div className="text-center">
                  <a
                    href="#"
                    className="font-sans text-sm text-amber-600 hover:text-amber-700 transition-colors hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 shadow-[0_4px_0_0_rgb(217,119,6)] hover:shadow-[0_2px_0_0_rgb(217,119,6)] active:shadow-[0_1px_0_0_rgb(217,119,6)] transition-all duration-200 active:translate-y-1 rounded-xl focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
                >
                  Sign In
                </Button>
                <p className="font-sans text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setShowSignInDropdown(false)
                      setShowSignUpModal(true)
                    }}
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-between px-6 lg:px-8 py-20 max-w-7xl mx-auto bg-white">
        {/* Left Side - Illustration */}
        <div className="flex-1 relative mr-8">
          <div className="relative">
            <img
              src="/hero-illustration.svg"
              alt="Three diverse children playing musical instruments - drums, guitar, and keyboard with musical notes floating around"
              className="w-full max-w-2xl mx-auto"
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 max-w-lg">
          <H1 className="text-balance leading-tight">
            Start your <Highlight>musical</Highlight> <Highlight>journey</Highlight> today!
          </H1>

          <p className="font-sans mt-6 text-lg sm:text-xl text-neutral-700 mb-10 leading-relaxed text-pretty">
            Connect with expert music teachers for personalized 1-on-1 lessons. Learn at your own pace, from anywhere.
          </p>

          {/* Search Bar */}
          <div className="flex gap-3 mb-10 group">
            <Input
              placeholder="What instrument do you want to learn?"
              className="font-sans flex-1 h-14 bg-yellow-50 border-2 border-amber-200 placeholder:text-amber-500 text-gray-700 rounded-2xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all text-lg group-hover:border-amber-300"
            />
            <Button className="h-14 px-4 bg-amber-500 hover:bg-amber-600 shadow-[0_4px_0_0_rgb(217,119,6)] hover:shadow-[0_2px_0_0_rgb(217,119,6)] active:shadow-[0_1px_0_0_rgb(217,119,6)] transition-all duration-200 active:translate-y-1 rounded-2xl focus:ring-2 focus:ring-amber-300 focus:ring-offset-2">
              <Search className="w-6 h-6" />
            </Button>
          </div>

          {/* Instrument Buttons */}
          <div className="flex flex-wrap gap-3">
            {[
              { src: "5-zav8gNVVDOWtBMfeKplDGGWfy39O3N.svg", alt: "Guitar", label: "Guitar" },
              { src: "2-apmAU4sove5uqw0EXCjDSqWLy0ykC4.svg", alt: "Drums", label: "Drums" },
              { src: "3-cJuiSyaGS2drw9hhOTNCO5wZUfNi7x.svg", alt: "Piano", label: "Piano" },
              { src: "4-YnYIwsbDrVvqvUfplbeBJeJV2EtHrZ.svg", alt: "Violin", label: "Violin" },
              { src: "1-RZhwcZoV4RKxDfNQRjmCop3mQkLcke.svg", alt: "Voice", label: "Voice" },
              { src: "icons/saxophone.svg", alt: "Saxophone", label: "Saxophone" },
            ].map((instrument, index) => (
              <Button
                key={instrument.label}
                variant="outline"
                className="flex items-center justify-center gap-3 w-36 border-2 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50 bg-white rounded-xl px-4 py-5 shadow-[0_3px_0_0_rgb(250,204,21)] hover:shadow-[0_1px_0_0_rgb(250,204,21)] active:shadow-[0_0px_0_0_rgb(250,204,21)] transition-all duration-200 active:translate-y-1 group focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={
                    instrument.src.startsWith("icons/")
                      ? `/${instrument.src}`
                      : `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/${instrument.src}`
                  }
                  alt={instrument.alt}
                  className="w-8 h-8 group-hover:scale-110 transition-transform"
                />
                <span className="font-sans text-red-700 font-medium text-base group-hover:text-red-800 transition-colors">
                  {instrument.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </main>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-center">
          <div className="shadow-xl rounded-2xl bg-white border border-gray-100">
            <RoleSwitcher onRoleChange={setCurrentRole} />
          </div>
        </div>
      </section>

      <section className="bg-white">{currentRole === "learner" ? <LearnerLanding /> : <TeacherLanding />}</section>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-16 mt-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logocropped-mS1l1HRRdxenEO8qxttO5VRD3cujJo.png"
                alt="THOVEN - Music Education Platform"
                className="h-12 w-auto hover:scale-105 transition-transform"
              />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {[
                { name: "About", href: "/about" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "Teachers", href: "#" },
                { name: "Students", href: "#" },
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
              ].map((link, index) => (
                <div key={link.name} className="flex items-center gap-6 lg:gap-8">
                  <Link
                    href={link.href}
                    className="font-sans text-gray-600 hover:text-amber-600 transition-colors hover:underline focus:ring-2 focus:ring-amber-300 rounded px-2 py-1"
                  >
                    {link.name}
                  </Link>
                  {index < 5 && <span className="hidden lg:inline text-gray-400">•</span>}
                </div>
              ))}
            </nav>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {[
                { icon: Instagram, label: "Instagram" },
                {
                  icon: () => (
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  ),
                  label: "TikTok",
                },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="text-amber-500 hover:text-amber-600 transition-all hover:scale-110 p-2 rounded-full hover:bg-amber-50 focus:ring-2 focus:ring-amber-300"
                  aria-label={label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)}
        onSignUpClick={handleSwitchToSignUp}
      />
      <SignUpModal 
        isOpen={showSignUpModal} 
        onClose={() => setShowSignUpModal(false)}
        onSignInClick={handleSwitchToSignIn}
      />
      {showTeacherApplication && (
        <TeacherApplicationModal
          isOpen={showTeacherApplication}
          onClose={() => setShowTeacherApplication(false)}
        />
      )}
    </div>
  )
}
