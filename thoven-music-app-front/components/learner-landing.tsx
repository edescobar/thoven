"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export function LearnerLanding() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailError, setEmailError] = useState("")

  const features = [
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3d9bce0d-c9e1-4271-bb0b-830dea75a504-U62YWR7PA95gr9E8uhYImdn5Tt8ggL.png"
          alt="Child with magnifying glass and teacher"
          className="w-80 h-auto max-w-full"
        />
      ),
      title: (
        <>
          <span className="text-amber-500">Find</span> Your Perfect Match
        </>
      ),
      description: "Connect with expert music teachers who match your learning style and musical goals.",
      imageLeft: true,
    },
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Generated%20Image%20September%2002%2C%202025%20-%2011_41AM%20-%20Edited-MFE26vsNT6lQMibNKyGxOhWAeOHKTH.png"
          alt="Music teacher with easel and musical notes"
          className="w-80 h-auto max-w-full"
        />
      ),
      title: (
        <>
          <span className="text-amber-500">Learn</span> from the Best
        </>
      ),
      description: "All our teachers are vetted and have real teaching experience in their instruments.",
      imageLeft: false,
    },
    {
      icon: (
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c59b5fa9-aff4-48ff-8aad-66a08720d0f0-6zDxtzgLXbmC60gnPXes18BOq5QhI1.png"
          alt="Child tracking progress on tablet with achievements and medals"
          className="w-80 h-auto max-w-full"
        />
      ),
      title: (
        <>
          <span className="text-amber-500">Track</span> Your Progress
        </>
      ),
      description: "Set goals, track your progress, and celebrate achievements with integrated learning tools.",
      imageLeft: true,
    },
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Parent",
      content:
        "My daughter has been taking piano lessons through Thoven for 6 months. The progress tracking feature helps me see her improvement every week!",
      rating: 5,
    },
    {
      name: "Mike R.",
      role: "Guitar Student",
      content:
        "Found the perfect guitar teacher who matches my rock music interests. The lessons are engaging and I'm finally playing my favorite songs!",
      rating: 5,
    },
    {
      name: "Jennifer L.",
      role: "Parent",
      content:
        "The teacher communication tools make it so easy to stay updated on my son's violin progress. Highly recommend Thoven!",
      rating: 5,
    },
  ]

  const handleFindTeacher = () => {
    window.dataLayer?.push({ event: "lp_find_teacher_click" })
    if (window.mixpanel) {
      window.mixpanel.track("lp_find_teacher_click")
    }
  }

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError("")

    if (!email) {
      setEmailError("Oops! Please type in a correct email")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Oops! Please type in a correct email")
      return
    }

    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setEmail("")
    }, 3000)
  }

  return (
    <div className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 relative">
          <div className="absolute -top-4 left-1/4 text-teal-300 text-2xl transform -rotate-12">♪</div>
          <div className="absolute top-8 right-1/3 text-teal-400 text-xl transform rotate-45">♫</div>
          <div className="absolute -top-2 right-1/4 text-teal-300 text-lg transform rotate-12">♪</div>
          <div className="absolute top-12 left-1/3 text-teal-400 text-xl transform -rotate-30">♫</div>

          <h2 className="font-display text-5xl font-bold text-gray-900 mb-6 text-balance relative z-10">
            Why <span className="text-teal-500">learn</span> with Thoven?
          </h2>
          <p className="font-sans text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with expert music teachers for personalized lessons that fit your schedule and goals.
          </p>
        </div>

        {/* Feature Sections */}
        <div className="space-y-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col ${feature.imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-20 animate-fade-in`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Icon/Illustration */}
              <div className="flex-1 flex justify-center lg:max-w-md">{feature.icon}</div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left max-w-lg">
                <h3 className="font-display text-4xl font-bold text-gray-900 mb-8 text-balance">{feature.title}</h3>
                <p className="font-sans text-xl text-gray-600 leading-relaxed max-w-md">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-16 py-6 text-2xl font-bold rounded-xl shadow-[0_6px_0_0_#d97706] hover:shadow-[0_8px_0_0_#b45309] active:shadow-[0_2px_0_0_#b45309] active:translate-y-1 transition-all duration-150"
            onClick={handleFindTeacher}
          >
            Find a Teacher
          </Button>
        </div>

        <div className="mt-32 bg-white border-2 border-amber-200 rounded-3xl p-12 lg:p-16 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - CTA */}
            <div className="text-center lg:text-left">
              <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 text-balance">
                <span className="text-gray-900">Ready to Start</span>
                <br />
                <span className="text-amber-500">Your Musical Journey?</span>
              </h2>
              <p className="font-sans text-lg text-gray-600 mb-8 leading-relaxed">
                Join thousands of students who are discovering the joy of music through personalized lessons
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleEmailSignup} className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="font-sans w-full px-6 py-4 rounded-xl border-2 border-amber-200 bg-amber-50 placeholder:text-amber-600 text-gray-800 focus:outline-none focus:border-amber-400 h-14"
                    />
                    {emailError && (
                      <div className="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <span className="text-red-500 text-sm">⚠️</span>
                        <span className="text-red-600 text-sm font-medium">{emailError}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      We collect email information for updates only. No spam, unsubscribe anytime.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white px-8 rounded-xl font-semibold shadow-[0_4px_0_0_#d97706] hover:shadow-[0_2px_0_0_#d97706] active:shadow-[0_1px_0_0_#d97706] active:translate-y-1 transition-all duration-150 h-14"
                  >
                    Subscribe
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-3 text-amber-600 font-semibold text-lg">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paperplane%20icon-lKNTKEa2TLmKwCBDaaZC37KDZnqkS5.png"
                    alt="Paper plane"
                    className="w-6 h-6"
                  />
                  Thanks! We'll be in touch soon.
                </div>
              )}
            </div>

            {/* Right Side - Testimonials */}
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-bold text-gray-900 text-center lg:text-left mb-6">
                What Our Students Say
              </h3>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="font-sans text-gray-700 mb-4 leading-relaxed">"{testimonial.content}"</p>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name} <span className="font-normal text-gray-600">• {testimonial.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
