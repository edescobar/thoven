"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Instagram, Linkedin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AboutPage() {
  const [showContactForm, setShowContactForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Hide form after 3 seconds
    setTimeout(() => {
      setShowContactForm(false)
      setIsSubmitted(false)
      setFormData({ name: "", email: "", message: "" })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap');
        .font-fredoka { font-family: 'Fredoka', sans-serif; }
      `}</style>

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="flex items-center justify-between px-6 lg:px-8 py-4 bg-white shadow-sm border-b border-gray-100">
          <div className="flex items-center">
            <Link href="/">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logocropped-Ts5Qu9cYp28KPMWeyKi361H6sTD2Qc.png"
                alt="THOVEN - Music Education Platform"
                className="h-14 w-auto transition-transform hover:scale-105 cursor-pointer"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="outline"
                className="border-2 border-orange-400 text-orange-600 hover:bg-orange-50 bg-transparent shadow-[0_4px_0_0_rgb(251,146,60)] hover:shadow-[0_2px_0_0_rgb(251,146,60)] active:shadow-[0_1px_0_0_rgb(251,146,60)] transition-all duration-200 active:translate-y-1 font-sans font-semibold px-6 py-2.5"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="font-fredoka text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-amber-500">Us</span>
            </h1>
            <p className="font-sans text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Reimagining music education for the modern world
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-16">
            {/* Our Mission */}
            <section>
              <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="font-sans text-lg text-gray-700 leading-relaxed">
                Thoven is reimagining music education for the modern world. We empower teachers with professional tools,
                give parents clarity into their child's growth, and inspire students with engaging, gamified learning
                experiences.
              </p>
            </section>

            {/* Our Story */}
            <section>
              <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 font-sans text-lg text-gray-700 leading-relaxed">
                <p>
                  Thoven began with a simple frustration: as a private piano teacher, Keri struggled with high
                  marketplace fees, chasing payments, and juggling multiple apps to manage lessons. After countless
                  conversations with other teachers facing the same challenges, she partnered with Andres to build a
                  better way.
                </p>
                <p>
                  From Miami to San Francisco, our journey has been guided by one belief: music education should be
                  accessible, sustainable, and inspiring for everyone — teachers, students, and families alike.
                </p>
              </div>
            </section>

            {/* What We're Building */}
            <section>
              <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-6">What We're Building</h2>
              <div className="space-y-4 font-sans text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-amber-600">A teacher-first platform:</span> scheduling, payments,
                  class dashboards, and progress tracking in one hub.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Engaging learning tools:</span> gamified progress, badges,
                  and clear milestones that motivate students.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Transparent, simple management:</span> lessons, reminders,
                  and progress updates made effortless.
                </p>
                <p>
                  <span className="font-bold text-amber-600">A future with AI support:</span> assistants that help
                  educators plan, and give learners personalized practice guidance.
                </p>
              </div>
            </section>

            {/* Who We Serve */}
            <section>
              <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-6">Who We Serve</h2>
              <div className="space-y-4 font-sans text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-amber-600">Teachers like Jasmine,</span> who want to grow their studio
                  and spend more time teaching instead of managing admin.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Parents like Emily & David,</span> who want trusted
                  teachers and clear visibility into their child's progress.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Students like Marcus,</span> who stay motivated when
                  lessons feel fun, interactive, and rewarding.
                </p>
              </div>
            </section>

            {/* Our Team */}
            <section>
              <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
              <div className="space-y-6">
                <p className="font-sans text-lg text-gray-700 leading-relaxed">
                  We're a teacher–founder team building with passion and purpose:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Generated%20Image%20September%2002%2C%202025%20-%204_08PM-kWpKdkaA79CbvbrgKe3YxxP99Br2rr.jpeg"
                      alt="Andres Martinez - Cartoon profile with brown hair and orange shirt"
                      className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
                    />
                    <h3 className="font-sans text-xl font-bold text-gray-900 mb-2">Andres Martinez</h3>
                    <p className="font-sans text-amber-600 font-medium">Product & Go-to-Market Strategy</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Generated%20Image%20September%2002%2C%202025%20-%204_09PM-On2TXwXVcvsmZlGVods9YyIVbzBLdp.jpeg"
                      alt="Keri Erten - Cartoon profile with long brown hair and black shirt"
                      className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
                    />
                    <h3 className="font-sans text-xl font-bold text-gray-900 mb-2">Keri Erten</h3>
                    <p className="font-sans text-amber-600 font-medium">Teacher Experience & Pedagogy</p>
                  </div>
                </div>
                <p className="font-sans text-lg text-gray-700 leading-relaxed">
                  We're supported by experienced advisors in education, technology, and product who share our vision of
                  modernizing music learning.
                </p>
              </div>
            </section>

            {/* Our Values */}
            <section>
              <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
              <div className="space-y-4 font-sans text-lg text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-amber-600">Learning-First, Human Connection</span> — Respecting
                  teachers, students, and parents.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Curiosity & Urgency</span> — Moving fast, asking hard
                  questions, and always iterating.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Transparency & Trust</span> — Building tools and a
                  community that put safety and clarity first.
                </p>
              </div>
            </section>

            {/* Join Us */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 lg:p-12 border border-amber-200">
              <h2 className="font-fredoka text-3xl font-bold text-gray-900 mb-6 text-center">Join Us</h2>
              <div className="space-y-4 font-sans text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                <p>
                  <span className="font-bold text-amber-600">A teacher-first platform:</span> scheduling, payments,
                  class dashboards, and progress tracking in one hub.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Engaging learning tools:</span> gamified progress, badges,
                  and clear milestones that motivate students.
                </p>
                <p>
                  <span className="font-bold text-amber-600">Transparent, simple management:</span> lessons, reminders,
                  and progress updates made effortless.
                </p>
                <p>
                  <span className="font-bold text-amber-600">A future with AI support:</span> assistants that help
                  educators plan, and give learners personalized practice guidance.
                </p>
              </div>

              <div className="mt-8 text-center">
                {!showContactForm && (
                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-[0_4px_0_0_rgb(217,119,6)] hover:shadow-[0_2px_0_0_rgb(217,119,6)] active:shadow-[0_1px_0_0_rgb(217,119,6)] transition-all duration-150 active:translate-y-1"
                  >
                    Get in touch
                  </Button>
                )}

                {showContactForm && (
                  <div className="mt-6 bg-white rounded-2xl p-6 border border-amber-200 shadow-sm max-w-md mx-auto">
                    {!isSubmitted ? (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <input
                            type="text"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none font-sans"
                          />
                        </div>
                        <div>
                          <input
                            type="email"
                            name="email"
                            placeholder="Your email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none font-sans"
                          />
                        </div>
                        <div>
                          <textarea
                            name="message"
                            placeholder="Your message"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none font-sans resize-none"
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-semibold shadow-[0_2px_0_0_rgb(217,119,6)] hover:shadow-[0_1px_0_0_rgb(217,119,6)] active:shadow-[0_1px_0_0_rgb(217,119,6)] transition-all duration-150 active:translate-y-0.5"
                          >
                            {isSubmitting ? "Sending..." : "Send Message"}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => setShowContactForm(false)}
                            variant="outline"
                            className="px-6 py-3 border-amber-300 text-amber-600 hover:bg-amber-50"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </div>
                        <p className="font-semibold text-gray-900 mb-1">Message sent!</p>
                        <p className="text-gray-600 text-sm">We'll get back to you soon.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white text-gray-800 py-16 mt-20 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-shrink-0">
                <Link href="/">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logocropped-mS1l1HRRdxenEO8qxttO5VRD3cujJo.png"
                    alt="THOVEN - Music Education Platform"
                    className="h-12 w-auto hover:scale-105 transition-transform cursor-pointer"
                  />
                </Link>
              </div>

              <nav className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                {[
                  { name: "About", href: "/about" },
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
                    {index < 4 && <span className="hidden lg:inline text-gray-400">•</span>}
                  </div>
                ))}
              </nav>

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
      </div>
    </>
  )
}
