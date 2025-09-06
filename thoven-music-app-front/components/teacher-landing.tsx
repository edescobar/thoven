"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { Play } from "lucide-react"
import { TeacherApplication } from "./teacher-application"

export function TeacherLanding() {
  const [hours, setHours] = useState([10])
  const [income, setIncome] = useState(0)
  const [showDemoForm, setShowDemoForm] = useState(false)
  const [demoEmail, setDemoEmail] = useState("")
  const [demoSubmitted, setDemoSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTeacherApplication, setShowTeacherApplication] = useState(false)
  const avgRate = 50

  useEffect(() => {
    const calculatedIncome = Math.round(hours[0] * avgRate * 4.3 * 0.92)
    setIncome(calculatedIncome)
  }, [hours])

  const handleApplyClick = () => {
    window.dataLayer?.push({ event: "lp_teacher_apply_click" })
    if (window.mixpanel) {
      window.mixpanel.track("lp_teacher_apply_click")
    }
    setShowTeacherApplication(true)
  }

  const handleCloseTeacherApplication = () => {
    setShowTeacherApplication(false)
  }

  const handleDemoClick = () => {
    window.dataLayer?.push({ event: "lp_teacher_demo_click" })
    if (window.mixpanel) {
      window.mixpanel.track("lp_teacher_demo_click")
    }
    setShowDemoForm(true)
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!demoEmail.trim()) return

    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setDemoSubmitted(true)
    setIsSubmitting(false)

    setTimeout(() => {
      setShowDemoForm(false)
      setDemoSubmitted(false)
      setDemoEmail("")
    }, 3000)
  }

  const handleSliderChange = (value: number[]) => {
    setHours(value)
    window.dataLayer?.push({ event: "lp_income_slider_change", hours: value[0] })
    if (window.mixpanel) {
      window.mixpanel.track("lp_income_slider_change", { hours: value[0] })
    }
  }

  const valueProps = [
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3908aacb-96b9-44d6-86d9-3600cafd3dc0-cz7AfXA1kW6IoGETqPsQfDFtQhBRC1.png"
          alt="Dollar bill"
          className="w-24 h-16"
        />
      ),
      title: "Keep More of Your Earnings",
      subtitle: "Take home 92% with our low 8% fee",
      detail: "Low 8% fee — take home more compared to other platforms charging 20–40%.",
    },
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/86098da5-a04c-43d3-aa7d-6779ca2ec36f-uRmrXX8JWMKisqf4H6SplbzX80cqem.png"
          alt="Clock"
          className="w-16 h-16"
        />
      ),
      title: "Save Time on Admin",
      subtitle: "Automated scheduling, payments, and reminders in one hub",
      detail: "Scheduling, payments, and reminders — automated in one hub, built for music teachers.",
    },
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4abca796-0957-456d-8c48-fcd2ba283f49-GqelX6i9Kez3gUpboJxpvxr4XPzEXU.png"
          alt="Handshake"
          className="w-24 h-16"
        />
      ),
      title: "Build Parent Trust",
      subtitle: "Clear progress dashboards and detailed lesson notes",
      detail: "Share clear progress dashboards and lesson notes that highlight student growth.",
    },
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2fc3a333-f399-4721-b30d-5741a27df877-XNaOpItOjITR2JpbU62ZdbxLwqVY7N.png"
          alt="Growth chart"
          className="w-16 h-16"
        />
      ),
      title: "Grow Your Studio",
      subtitle: "Access new students while keeping current ones engaged",
      detail: "Access new students while keeping your current ones engaged and committed.",
    },
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9117f6cd-d339-4de1-a0fc-78d9d7728711-gqIrioXB3ClTtmmQbE9qEhQmoKqRcL.png"
          alt="Notebook"
          className="w-16 h-16"
        />
      ),
      title: "Professional Tools, Simplified",
      subtitle: "Polished profiles and organized dashboards, no setup needed",
      detail: "Polished teacher profiles and organized class dashboards — no extra setup needed.",
    },
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/63437109-a9d6-4f7f-9dec-31f2faca2de0-qpFO4JQQa3NMKKOPdrug7NalAUUJQ3.png"
          alt="Infinity loop"
          className="w-16 h-16"
        />
      ),
      title: "Flexible Teaching, Your Way",
      subtitle: "Online or in-person, individual or group lessons",
      detail: "Teach online or in-person, one-on-one or in groups, all managed through Thoven.",
    },
  ]

  const tips = [
    {
      title: "Getting Started Guide",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download.jpg-euw9TCqwvD4BtBDbKwN6onliUrEXPO.jpeg",
    },
    {
      title: "Student Engagement Tips",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-1.jpg-n2u4KajqlBvnmsfCSgv1kZsLxGxT7u.jpeg",
    },
    {
      title: "Pricing Your Lessons",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-2.jpg-sO2GIf1aCaQ4ILVjLMKoP0UODcodMU.jpeg",
    },
    {
      title: "Building Your Studio",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download.jpg-euw9TCqwvD4BtBDbKwN6onliUrEXPO.jpeg",
    },
  ]

  const faqs = [
    {
      question: "What is Thoven, and how does it work?",
      answer:
        "Thoven is an all-in-one music learning platform that connects teachers, students, and parents. It combines scheduling, payments, class dashboards, and progress tracking into one hub.",
    },
    {
      question: "How do teachers get paid, and what fees does Thoven charge?",
      answer:
        "Teachers keep the majority of their earnings. Thoven charges an ~8% transaction fee (vs. 20–40% on other platforms) and offers optional premium subscriptions with extra features.",
    },
    {
      question: "How does the credit system for lessons work?",
      answer:
        "Parents purchase lesson credits, which can be applied to future bookings. Credits simplify rescheduling and ensure teachers are paid consistently, even if a class is moved.",
    },
    {
      question: "Can I use Thoven for both online and in-person lessons?",
      answer:
        "Yes. Teachers can set availability for in-person, online, or hybrid classes. Parents and students choose what works best for them.",
    },
    {
      question: "How does Thoven keep parents informed about progress?",
      answer:
        "Parents get access to lesson notes, assignments, and progress dashboards so they can see their child's growth in real time.",
    },
    {
      question: "What makes Thoven different from other music lesson platforms?",
      answer:
        "Unlike marketplaces that only match students and teachers, Thoven provides a full ecosystem — teacher discovery, scheduling, payments, and gamified learning tools that keep students engaged.",
    },
    {
      question: "Is it safe for children to use Thoven?",
      answer:
        "Yes. Teachers undergo background checks, and under-13 accounts are managed by parents with verified consent. Messaging and payments are always parent-controlled.",
    },
    {
      question: "Do teachers need to bring their own students, or can they find new ones on Thoven?",
      answer:
        "Both. Teachers can onboard their current students and also gain new students through Thoven's discovery marketplace, referrals, and partnerships with schools, conservatories, and music stores.",
    },
  ]

  return (
    <div className="bg-white py-20">
      {/* Hero Section */}
      <div className="text-center px-6 max-w-5xl mx-auto mb-24 relative">
        <div className="absolute -top-4 left-1/4 text-amber-300 text-2xl transform -rotate-12">♪</div>
        <div className="absolute top-8 right-1/3 text-amber-400 text-xl transform rotate-45">♫</div>
        <div className="absolute -top-2 right-1/4 text-amber-300 text-lg transform rotate-12">♪</div>
        <div className="absolute top-12 left-1/3 text-amber-400 text-xl transform -rotate-30">♫</div>

        <h2 className="font-display text-5xl font-bold text-gray-900 mb-6 text-balance relative z-10">
          Why <span className="font-sans font-bold text-amber-500">teach</span> with Thoven?
        </h2>
        <p className="font-sans text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Empowering private music educators with modern tools and a thriving community.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 text-xl font-semibold rounded-xl shadow-[0_4px_0_0_#d97706] hover:shadow-[0_4px_0_0_#b45309] active:shadow-[0_2px_0_0_#b45309] active:translate-y-[2px] transition-all duration-150"
            onClick={handleApplyClick}
          >
            Apply to Teach
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-amber-400 text-amber-600 hover:bg-amber-50 px-10 py-4 text-xl font-semibold rounded-xl bg-transparent shadow-[0_4px_0_0_#f59e0b] hover:shadow-[0_4px_0_0_#d97706] active:shadow-[0_2px_0_0_#d97706] active:translate-y-[2px] transition-all duration-150"
            onClick={handleDemoClick}
          >
            Request a Demo
          </Button>
        </div>

        {/* Inline Demo Form */}
        {showDemoForm && (
          <div className="mt-8 max-w-md mx-auto">
            <Card className="p-6 rounded-xl border-amber-200 bg-amber-50">
              {!demoSubmitted ? (
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">Request a Demo</h3>
                    <p className="font-sans text-gray-600 text-sm">
                      Enter your email and we'll reach out to schedule your demo
                    </p>
                  </div>
                  <div>
                    <input
                      type="email"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none font-sans"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !demoEmail.trim()}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-[0_3px_0_0_#d97706] hover:shadow-[0_3px_0_0_#b45309] active:shadow-[0_1px_0_0_#b45309] active:translate-y-[2px] transition-all duration-150"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDemoForm(false)}
                      className="border-amber-300 text-amber-600 hover:bg-amber-100"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="flex justify-center mb-2">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paperplane%20icon-lKNTKEa2TLmKwCBDaaZC37KDZnqkS5.png"
                      alt="Paper plane sent"
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900 mb-1">Thank you!</h3>
                  <p className="font-sans text-gray-600">We will be reaching out shortly</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {showTeacherApplication && (
          <div className="mt-8 w-full">
            <TeacherApplication
              isOpen={showTeacherApplication}
              onClose={handleCloseTeacherApplication}
              isInline={true}
            />
          </div>
        )}
      </div>

      {/* Value Props Grid */}
      <div className="px-6 max-w-7xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <Card
              key={index}
              className="h-full p-8 rounded-2xl border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.03] transition-all duration-300 group cursor-pointer"
            >
              <CardContent className="p-0 space-y-4 text-center">
                <div className="flex justify-center">
                  <div className="text-amber-500">{prop.icon}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-lg font-bold text-gray-900 group-hover:text-amber-500 transition-colors duration-300">
                    {prop.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-500 leading-relaxed">{prop.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Keri's Story Video */}
      <div className="px-6 max-w-4xl mx-auto mb-20">
        <h3 className="font-display text-3xl font-bold text-center mb-8">Keri's Story</h3>
        <Card className="bg-gray-100 aspect-video flex items-center justify-center">
          <div className="text-center">
            <Play className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <p className="font-sans text-gray-600">Video placeholder - Keri's teaching journey</p>
          </div>
        </Card>
      </div>

      {/* New to Teaching Section */}
      <div className="px-6 max-w-7xl mx-auto mb-24">
        <h3 className="font-display text-4xl font-bold text-center mb-16 text-balance">New to Teaching?</h3>
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Support List */}
          <div>
            <h4 className="font-display text-2xl font-semibold mb-8 text-amber-600">We've got you covered:</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="font-sans text-lg">
                  <strong className="text-gray-900">Community:</strong>{" "}
                  <span className="text-gray-600">
                    Learn from experienced teachers and grow together in a supportive network.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="font-sans text-lg">
                  <strong className="text-gray-900">Onboarding Support:</strong>{" "}
                  <span className="text-gray-600">Step-by-step setup so you're ready to take your first student.</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="font-sans text-lg">
                  <strong className="text-gray-900">Starter Resources:</strong>{" "}
                  <span className="text-gray-600">
                    Lesson templates and practice guides to help you look polished from day one.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="font-sans text-lg">
                  <strong className="text-gray-900">Student Discovery:</strong>{" "}
                  <span className="text-gray-600">Get matched with students beyond your personal network.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Income Estimator */}
          <div>
            <h4 className="font-display text-2xl font-semibold mb-8 text-amber-600">Estimate Your Income:</h4>
            <Card className="p-8 rounded-2xl border-amber-200 bg-amber-50">
              <div className="space-y-8">
                <div>
                  <label className="font-sans block text-lg font-semibold mb-4 text-gray-900">
                    Hours taught per week: {hours[0]}
                  </label>
                  <Slider
                    value={hours}
                    onValueChange={handleSliderChange}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="text-center">
                  <div className="font-display text-4xl font-bold text-amber-600">${income.toLocaleString()}</div>
                  <div className="font-sans text-lg text-gray-700 font-medium">Estimated monthly income</div>
                  <div className="font-sans text-sm text-gray-600 mt-2">
                    Based on ${avgRate}/hr average rate, you keep 92%
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Tips Carousel */}
      <div className="px-6 max-w-6xl mx-auto mb-20">
        <h3 className="font-display text-3xl font-bold text-center mb-12">Tips, Resources & Teacher Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Getting Started Guide
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Student Engagement Tips
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Pricing Your Lessons
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Building Your Studio
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Lesson Planning
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Parent Communication
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Online Teaching Setup
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Marketing Your Services
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Student Progress Tracking
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Recital Planning
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Music Theory Resources
          </Button>
          <Button
            variant="outline"
            className="h-16 text-center justify-center px-4 bg-yellow-100 border-yellow-200 text-amber-800 font-semibold hover:bg-yellow-200 hover:border-yellow-300 shadow-[0_3px_0_0_#fbbf24] hover:shadow-[0_3px_0_0_#f59e0b] active:shadow-[0_1px_0_0_#f59e0b] active:translate-y-[2px] transition-all duration-150 rounded-xl"
          >
            Practice Assignments
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-6 max-w-5xl mx-auto">
        <h3 className="font-display text-4xl font-bold text-center mb-16 text-balance">Frequently Asked Questions</h3>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              id={`faq-${index}`}
              className="border border-gray-200 rounded-xl px-6"
            >
              <AccordionTrigger className="font-sans text-left text-lg font-semibold hover:text-amber-600">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-sans text-gray-600 text-lg leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
