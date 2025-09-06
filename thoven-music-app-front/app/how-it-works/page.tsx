"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TeacherApplication } from "@/components/teacher-application"

export default function HowItWorksPage() {
  const [currentSection, setCurrentSection] = useState(0)
  const [showDemoForm, setShowDemoForm] = useState(false)
  const [demoEmail, setDemoEmail] = useState("")
  const [demoSubmitted, setDemoSubmitted] = useState(false)
  const [heroAnimated, setHeroAnimated] = useState(false)
  const [marketplaceAnimated, setMarketplaceAnimated] = useState(false)
  const [teacherDashboardAnimated, setTeacherDashboardAnimated] = useState(false)
  const [parentDashboardAnimated, setParentDashboardAnimated] = useState(false)
  const [lmsAnimated, setLmsAnimated] = useState(false)
  const [thovieBuilderSrc, setThovieBuilderSrc] = useState("/thovie-builder.png")
  const [showSignInDropdown, setShowSignInDropdown] = useState(false)
  const [showTeacherApplication, setShowTeacherApplication] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHeroAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === "marketplace-section" && entry.isIntersecting) {
            setMarketplaceAnimated(true)
          }
          if (entry.target.id === "teacher-dashboard-section" && entry.isIntersecting) {
            setTeacherDashboardAnimated(true)
          }
          if (entry.target.id === "parent-dashboard-section" && entry.isIntersecting) {
            setParentDashboardAnimated(true)
          }
          if (entry.target.id === "lms-section" && entry.isIntersecting) {
            setLmsAnimated(true)
          }
        })
      },
      { threshold: 0.3 },
    )

    const marketplaceSection = document.getElementById("marketplace-section")
    const teacherDashboardSection = document.getElementById("teacher-dashboard-section")
    const parentDashboardSection = document.getElementById("parent-dashboard-section")
    const lmsSection = document.getElementById("lms-section")
    if (marketplaceSection) {
      observer.observe(marketplaceSection)
    }
    if (teacherDashboardSection) {
      observer.observe(teacherDashboardSection)
    }
    if (parentDashboardSection) {
      observer.observe(parentDashboardSection)
    }
    if (lmsSection) {
      observer.observe(lmsSection)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".scroll-section")
      const scrollPosition = window.scrollY + window.innerHeight / 2

      sections.forEach((section, index) => {
        const element = section as HTMLElement
        const top = element.offsetTop
        const bottom = top + element.offsetHeight

        if (scrollPosition >= top && scrollPosition <= bottom) {
          setCurrentSection(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (demoEmail) {
      setDemoSubmitted(true)
      setTimeout(() => {
        setShowDemoForm(false)
        setDemoSubmitted(false)
        setDemoEmail("")
      }, 3000)
    }
  }

  const handleSignIn = () => {
    setShowSignInDropdown(!showSignInDropdown)
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-8 py-4 bg-white shadow-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <Link href="/">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logocropped-Ts5Qu9cYp28KPMWeyKi361H6sTD2Qc.png"
              alt="THOVEN - Music Education Platform"
              className="h-14 w-auto transition-transform hover:scale-105 cursor-pointer"
            />
          </Link>
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
            onClick={() => setShowTeacherApplication(true)}
          >
            Become a Teacher
          </Button>
          <Button className="bg-rose-400 hover:bg-rose-500 text-white shadow-[0_4px_0_0_rgb(244,63,94)] hover:shadow-[0_2px_0_0_rgb(244,63,94)] active:shadow-[0_1px_0_0_rgb(244,63,94)] transition-all duration-200 active:translate-y-1 font-sans font-semibold px-6 py-2.5 focus:ring-2 focus:ring-rose-300 focus:ring-offset-2">
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
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="font-sans w-full h-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all px-4"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="font-sans w-full h-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all px-4"
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
                  <a
                    href="#"
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors hover:underline"
                  >
                    Sign Up
                  </a>
                </p>
              </form>
            </div>
          )}
        </div>
      </header>

      <section className="scroll-section h-[80vh] flex items-center px-6 pt-64 md:pt-80 pb-32 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <div
                className={`transform transition-all duration-600 ease-out ${
                  heroAnimated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  How <span className="text-amber-500">Thoven</span> Works
                </h1>
              </div>

              <div
                className={`transform transition-all duration-600 ease-out delay-200 ${
                  heroAnimated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <p className="font-sans text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed font-medium">
                  Your all-in-one music education platform — discovery, scheduling, and payments in one hub.
                </p>
              </div>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-600 ease-out delay-400 ${
                  heroAnimated ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="flex flex-wrap gap-3 mb-8">
                  <a
                    href="#marketplace-section"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 text-sm rounded-lg border border-amber-300 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Marketplace
                  </a>
                  <a
                    href="#teacher-dashboard-section"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 text-sm rounded-lg border border-amber-300 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Teacher Dashboard
                  </a>
                  <a
                    href="#parent-dashboard-section"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 text-sm rounded-lg border border-amber-300 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Parent Dashboard
                  </a>
                  <a
                    href="#lms-section"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 text-sm rounded-lg border border-amber-300 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    LMS Sessions
                  </a>
                </div>
                <Button
                  variant="outline"
                  className="border-2 border-gray-700 text-gray-700 hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg rounded-xl shadow-[0_4px_0_0_rgb(55,65,81)] hover:shadow-[0_2px_0_0_rgb(55,65,81)] hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-1 bg-white"
                  onClick={() => setShowDemoForm(!showDemoForm)}
                >
                  Request a Demo
                </Button>
              </div>
            </div>

            {/* Right Column - Static Image */}
            <div className="relative">
              <div
                className={`transform transition-all duration-600 ease-out delay-600 ${
                  heroAnimated ? "translate-y-0 opacity-100" : "translate-x-12 opacity-0"
                }`}
              >
                <div className="bg-white rounded-3xl p-4 md:p-8 shadow-2xl border border-gray-100 overflow-hidden w-full max-w-none mt-20 md:mt-16">
                  <img
                    src="/hero-comparison-image.png"
                    alt="Traditional scheduling vs Thoven's digital calendar interface"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Marketplace Scrollytelling Section */}
      <section
        id="marketplace-section"
        className="scroll-section h-[75vh] flex items-center px-6 py-64 md:py-80 relative"
      >
        {/* Subtle divider line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gray-200"></div>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
            {/* Left Column - Mockup Card */}
            <div className="order-2 lg:order-1">
              <div
                className={`rounded-2xl aspect-[4/3] flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-600 ease-out overflow-hidden ${
                  marketplaceAnimated ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
                }`}
                style={{ width: "90%" }}
              >
                <img
                  src="/marketplace-screenshot.png"
                  alt="Thoven Marketplace Interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="order-1 lg:order-2 space-y-8">
              {/* Section Label */}
              <div
                className={`transform transition-all duration-600 ease-out ${
                  marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="inline-block mb-8">
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Marketplace</span>
                  <div className="h-0.5 bg-amber-500 mt-2"></div>
                </div>
              </div>

              {/* Title */}
              <div
                className={`transform transition-all duration-600 ease-out delay-100 ${
                  marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-amber-500 mb-6">Discover & Connect</h2>
              </div>

              {/* Subtitle */}
              <div
                className={`transform transition-all duration-600 ease-out delay-200 ${
                  marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <p className="font-sans text-xl text-gray-600 leading-relaxed mb-8">
                  Find the right teacher or student in seconds.
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-6 pt-2">
                <div
                  className={`transform transition-all duration-600 ease-out delay-300 ${
                    marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Verified profiles:</span> Background checks and
                    reviews for trusted connections.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-600 ease-out delay-400 ${
                    marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Smart filters:</span> Find teachers by instrument,
                    level, and schedule.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-600 ease-out delay-500 ${
                    marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Safe messaging:</span> Secure intro call requests and
                    communication.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-600 ease-out delay-600 ${
                    marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Teacher inbox:</span> Manage new student leads
                    efficiently.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-600 ease-out delay-700 ${
                    marketplaceAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Trust badges:</span> Ratings and reviews that build
                    confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Dashboard Scrollytelling Section */}
      <section
        id="teacher-dashboard-section"
        className="scroll-section h-[75vh] flex items-center px-6 py-64 md:py-80 relative"
      >
        {/* Subtle divider line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gray-200"></div>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Section Label */}
              <div
                className={`transform transition-all duration-450 ease-out ${
                  teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="inline-block mb-8">
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
                    Teacher Dashboard
                  </span>
                  <div className="h-0.5 bg-amber-500 mt-2"></div>
                </div>
              </div>

              {/* Title */}
              <div
                className={`transform transition-all duration-450 ease-out delay-75 ${
                  teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-amber-500 mb-6">
                  Simplify Your Studio
                </h2>
              </div>

              {/* Subtitle */}
              <div
                className={`transform transition-all duration-550 ease-out delay-150 ${
                  teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <p className="font-sans text-xl text-gray-600 leading-relaxed mb-8">
                  All your students, payments, and schedule in one hub.
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-6 pt-2">
                <div
                  className={`transform transition-all duration-550 ease-out delay-225 ${
                    teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Google Calendar sync:</span> Real-time updates across
                    all your devices.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-305 ${
                    teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Unified calendar:</span> Book, reschedule, or cancel
                    lessons seamlessly.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-385 ${
                    teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Stripe payments:</span> Instant receipts and automatic
                    payouts.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-465 ${
                    teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Credit system:</span> Sell lesson packs and track
                    balances automatically.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-545 ${
                    teacherDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Roster management:</span> Track students and handle
                    new requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Mockup Card */}
            <div className="flex justify-center">
              <div
                className={`rounded-2xl aspect-[4/3] flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-550 ease-out overflow-hidden ${
                  teacherDashboardAnimated ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
                style={{ width: "90%" }}
              >
                <img
                  src="/teacher-dashboard-screenshot.png"
                  alt="Thoven Teacher Dashboard Interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent Dashboard Scrollytelling Section */}
      <section
        id="parent-dashboard-section"
        className="scroll-section h-[75vh] flex items-center px-6 py-64 md:py-80 relative"
      >
        {/* Subtle divider line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gray-200"></div>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
            {/* Left Column - Mockup Card */}
            <div className="order-1">
              <div
                className={`rounded-2xl aspect-[4/3] flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-550 ease-out relative overflow-hidden ${
                  parentDashboardAnimated ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ width: "100%" }}
              >
                <img
                  src="/parent-dashboard-screenshot.png"
                  alt="Thoven Parent Dashboard Interface"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Parent View
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="order-2 space-y-8">
              {/* Section Label */}
              <div
                className={`transform transition-all duration-450 ease-out ${
                  parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="inline-block mb-8">
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">
                    Parent Dashboard
                  </span>
                  <div className="h-0.5 bg-amber-500 mt-2"></div>
                </div>
              </div>

              {/* Title */}
              <div
                className={`transform transition-all duration-450 ease-out delay-75 ${
                  parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-amber-500 mb-6">Stay Involved</h2>
              </div>

              {/* Subtitle */}
              <div
                className={`transform transition-all duration-550 ease-out delay-150 ${
                  parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <p className="font-sans text-xl text-gray-600 leading-relaxed mb-8">
                  Clear visibility into your child's lessons and payments.
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-6 pt-2">
                <div
                  className={`transform transition-all duration-550 ease-out delay-225 ${
                    parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Family calendar:</span> Reminders and availability for
                    all your children.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-305 ${
                    parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Credit tracking:</span> Monitor balances per child
                    with renewal prompts.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-385 ${
                    parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Secure payments:</span> Stripe checkout with instant
                    receipts.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-465 ${
                    parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Easy rescheduling:</span> Change lessons within
                    teacher policies.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-545 ${
                    parentDashboardAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Profile management:</span> Handle consent for under-13
                    students.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="lms-section" className="scroll-section h-[75vh] flex items-center px-6 py-64 md:py-80 relative">
        {/* Subtle divider line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-px bg-gray-200"></div>
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center h-full">
            {/* Left Column - Under Construction Card */}
            <div className="order-1">
              <div
                className={`relative rounded-xl aspect-[16/10] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-550 ease-out ${
                  lmsAnimated ? "translate-x-0 opacity-100 scale-100" : "-translate-x-4 opacity-0 scale-98"
                }`}
                style={{ width: "90%" }}
              >
                {/* Blurred UI Placeholder Background */}
                <div className="absolute inset-0 bg-gray-200 rounded-xl overflow-hidden">
                  <img
                    src="/lms-interface-mockup.jpeg"
                    alt="LMS Sessions Interface Preview"
                    className="w-full h-full object-cover blur-sm opacity-60"
                  />
                </div>

                {/* Horizontal Caution Banner */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-full h-12 flex items-center justify-center overflow-hidden">
                    <img src="/caution-banner.png" alt="Caution Banner" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Character positioned outside screenshot */}
                <div className="absolute -bottom-16 -right-16 w-48 h-48 flex items-center justify-center">
                  <img
                    src={thovieBuilderSrc || "/thovie-builder.png"}
                    alt="Thovie Builder"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="order-2 space-y-8">
              {/* Section Label */}
              <div
                className={`transform transition-all duration-450 ease-out ${
                  lmsAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <div className="inline-block mb-8">
                  <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">LMS — Sessions</span>
                  <div className="h-0.5 bg-amber-500 mt-2"></div>
                </div>
              </div>

              {/* Title */}
              <div
                className={`transform transition-all duration-450 ease-out delay-75 ${
                  lmsAnimated ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
              >
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-amber-500 mb-6">
                  Learning Path in Progress
                </h2>
              </div>

              {/* Subtitle with Construction State */}
              <div
                className={`transform transition-all duration-500 ease-out delay-150 ${
                  lmsAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <p className="font-sans text-xl text-gray-600 leading-relaxed mb-8">
                  An interactive class feed for lessons, notes, and XP.
                </p>
              </div>

              {/* Bullets */}
              <div className="space-y-6 pt-2">
                <div
                  className={`transform transition-all duration-550 ease-out delay-225 ${
                    lmsAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Assignment hub:</span> Central place for resources and
                    practice materials.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-305 ${
                    lmsAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Progress tracking:</span> Visual XP, badges, and
                    milestone achievements.
                  </p>
                </div>

                <div
                  className={`transform transition-all duration-550 ease-out delay-385 ${
                    lmsAnimated ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  <p className="font-sans text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Parent visibility:</span> Real-time updates on
                    milestones and feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 md:py-48 px-6 bg-white min-h-[75vh] flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          {/* Centered headline and subtext */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="font-sans text-xl text-gray-600">Only teachers pay — no fees for students or parents.</p>
          </div>

          <div className={`grid gap-8 items-start ${showTeacherApplication ? "lg:grid-cols-2" : "justify-center"}`}>
            {/* Pricing card */}
            <div
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full ${showTeacherApplication ? "" : "mx-auto"}`}
            >
              {/* Commission label */}
              <div className="text-center mb-6">
                <p className="font-sans font-medium text-sm text-gray-500 uppercase tracking-wide mb-3">Commission</p>
                <h3 className="font-display text-4xl font-bold text-gray-900 mb-2">8% Commission</h3>
                <p className="font-sans text-gray-600">Teachers keep 92% of every lesson.</p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-4 mb-8">
                <Button
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 text-lg rounded-xl shadow-[0_4px_0_0_rgb(217,119,6)] hover:shadow-[0_2px_0_0_rgb(217,119,6)] hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setShowTeacherApplication(true)}
                >
                  Apply to Teach
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-2 border-amber-500 text-amber-600 hover:bg-amber-50 py-4 text-lg rounded-xl transition-all duration-300 bg-transparent"
                  onClick={() => setShowDemoForm(!showDemoForm)}
                >
                  Request a Demo
                </Button>
              </div>

              {/* Includes list */}
              <div>
                <h4 className="font-sans font-medium text-gray-700 mb-4">Includes:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-sans text-gray-700">Scheduling & calendar sync (Google Calendar)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-sans text-gray-700">Secure payments via Stripe</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-sans text-gray-700">Marketplace visibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-sans text-gray-700">Teacher dashboard for roster & requests</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-sans text-gray-700">Parent dashboard transparency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-sans text-gray-700">Credit system for teachers and students</span>
                  </li>
                </ul>
              </div>
            </div>

            {showTeacherApplication && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full animate-fade-in">
                <TeacherApplication
                  onClose={() => setShowTeacherApplication(false)}
                  isOpen={showTeacherApplication}
                  isInline={true}
                />
              </div>
            )}
          </div>

          {/* Demo Form */}
          {showDemoForm && (
            <div className="mt-8 bg-white rounded-2xl p-6 border border-amber-200 max-w-md mx-auto">
              {demoSubmitted ? (
                <div className="text-center">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paperplane%20icon-lKNTKEa2TLmKwCBDaaZC37KDZnqkS5.png"
                    alt="Message sent"
                    className="w-12 h-12 mx-auto mb-4"
                  />
                  <p className="text-green-600 font-semibold">We will be reaching out shortly!</p>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                      Submit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDemoForm(false)}
                      className="px-6 border-gray-300 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
