"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { ArrowLeft, ArrowRight, Upload, CheckCircle, X, Sparkles } from "lucide-react"

interface TeacherApplicationProps {
  onClose: () => void
  isOpen: boolean
  isInline?: boolean
}

export function TeacherApplication({ onClose, isOpen, isInline = false }: TeacherApplicationProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    transportation: "",

    // Teaching Background
    instruments: [] as string[],
    experience: "",
    ageGroups: [] as string[],
    education: [] as string[],
    methods: [] as string[],

    // Availability & Style
    lessonFormat: "",
    availability: "",
    teachingStyle: "",
    adaptingLessons: "",

    // Tech & Tools
    platformComfortable: "",
    videoCallsExperience: "",

    // Video Upload
    videoUploaded: false,

    // Verification
    backgroundCheckConsent: false,
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const instruments = [
    "Piano",
    "Guitar",
    "Violin",
    "Drums",
    "Voice",
    "Flute",
    "Saxophone",
    "Trumpet",
    "Cello",
    "Bass",
    "Other",
  ]
  const ageGroups = ["Ages 4-7", "Ages 8-12", "Ages 13-17", "Adults 18+"]
  const educationOptions = ["Music Degree", "Conservatory Training", "Private Study", "Self-Taught", "Other"]
  const methodOptions = ["Suzuki", "Kodály", "Traditional", "Own Method", "Other"]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Show success modal and close
    alert("🎉 Thanks for applying! We're reviewing your profile now.")
    onClose()
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isInline) {
      onClose()
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="mb-4">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fcbfcfb9-1de2-4c69-b458-839ba94b19c5-1Hq12D0SmyD5DCmFWKx5U9T0SbXIDX.png"
                  alt="Green apple with colorful confetti"
                  className="w-24 h-24 mx-auto"
                />
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome to Thoven!</h2>
              <p className="font-sans text-xl text-gray-600">Apply to Teach</p>
            </div>

            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="font-display text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-sans font-bold">Full Name</Label>
                    <Input
                      className="bg-white mt-1"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="font-sans font-bold">Email</Label>
                    <Input
                      type="email"
                      className="bg-white mt-1"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-sans font-bold">Phone</Label>
                    <Input
                      className="bg-white mt-1"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="font-sans font-bold">City & State</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="City"
                        className="bg-white mt-1"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                      <Input
                        placeholder="State"
                        className="bg-white mt-1"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-sans font-bold">Do you have reliable transportation?</Label>
                  <RadioGroup
                    className="mt-2"
                    value={formData.transportation}
                    onValueChange={(value) => setFormData({ ...formData, transportation: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="transport-yes" />
                      <Label htmlFor="transport-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="transport-no" />
                      <Label htmlFor="transport-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 2:
        return (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="font-display text-xl">Teaching Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-sans font-bold">Instruments (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {instruments.map((instrument) => (
                    <div key={instrument} className="flex items-center space-x-2">
                      <Checkbox
                        id={instrument}
                        checked={formData.instruments.includes(instrument)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, instruments: [...formData.instruments, instrument] })
                          } else {
                            setFormData({
                              ...formData,
                              instruments: formData.instruments.filter((i) => i !== instrument),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={instrument} className="text-sm">
                        {instrument}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-sans font-bold">Years of Experience</Label>
                <RadioGroup
                  className="mt-2"
                  value={formData.experience}
                  onValueChange={(value) => setFormData({ ...formData, experience: value })}
                >
                  {["<1 year", "1-3 years", "3-5 years", "5+ years"].map((exp) => (
                    <div key={exp} className="flex items-center space-x-2">
                      <RadioGroupItem value={exp} id={exp} />
                      <Label htmlFor={exp}>{exp}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="font-sans font-bold">Age Groups Taught</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {ageGroups.map((age) => (
                    <div key={age} className="flex items-center space-x-2">
                      <Checkbox
                        id={age}
                        checked={formData.ageGroups.includes(age)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, ageGroups: [...formData.ageGroups, age] })
                          } else {
                            setFormData({ ...formData, ageGroups: formData.ageGroups.filter((a) => a !== age) })
                          }
                        }}
                      />
                      <Label htmlFor={age} className="text-sm">
                        {age}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="font-display text-xl">Availability & Teaching Style</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-sans font-bold">Lesson Format</Label>
                <RadioGroup
                  className="mt-2"
                  value={formData.lessonFormat}
                  onValueChange={(value) => setFormData({ ...formData, lessonFormat: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label htmlFor="in-person">In-person only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online">Online only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both in-person and online</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="font-sans font-bold">Weekly Availability</Label>
                <Textarea
                  className="bg-white mt-1"
                  placeholder="e.g., Monday-Friday 3-7pm, Saturday mornings"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                />
              </div>

              <div>
                <Label className="font-sans font-bold">Teaching Style (2-3 sentences)</Label>
                <Textarea
                  className="bg-white mt-1"
                  placeholder="Describe your approach to teaching music..."
                  value={formData.teachingStyle}
                  onChange={(e) => setFormData({ ...formData, teachingStyle: e.target.value })}
                />
              </div>

              <div>
                <Label className="font-sans font-bold">How do you adapt lessons for different learners?</Label>
                <Textarea
                  className="bg-white mt-1"
                  placeholder="Share your approach to customizing lessons..."
                  value={formData.adaptingLessons}
                  onChange={(e) => setFormData({ ...formData, adaptingLessons: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="font-display text-xl">Tech & Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-sans font-bold">Are you comfortable using online platforms?</Label>
                <RadioGroup
                  className="mt-2"
                  value={formData.platformComfortable}
                  onValueChange={(value) => setFormData({ ...formData, platformComfortable: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="platform-yes" />
                    <Label htmlFor="platform-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="platform-no" />
                    <Label htmlFor="platform-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="font-sans font-bold">Do you have experience with video calls?</Label>
                <RadioGroup
                  className="mt-2"
                  value={formData.videoCallsExperience}
                  onValueChange={(value) => setFormData({ ...formData, videoCallsExperience: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="video-yes" />
                    <Label htmlFor="video-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="video-no" />
                    <Label htmlFor="video-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="font-display text-xl">Video Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="font-sans text-gray-600">Upload a short video of you performing your instrument.</p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {formData.videoUploaded ? (
                  <div className="text-green-600">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-sans font-semibold">Video uploaded successfully!</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <Button
                      className="bg-amber-500 hover:bg-amber-600"
                      onClick={() => setFormData({ ...formData, videoUploaded: true })}
                    >
                      Choose Video File
                    </Button>
                    <p className="font-sans text-sm text-gray-500 mt-2">Max file size: 100MB</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="font-display text-xl">Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="font-sans font-bold">Background Check Consent</Label>
                <div className="flex items-start space-x-2 mt-2">
                  <Checkbox
                    id="background-check"
                    checked={formData.backgroundCheckConsent}
                    onCheckedChange={(checked) => setFormData({ ...formData, backgroundCheckConsent: !!checked })}
                  />
                  <Label htmlFor="background-check" className="text-sm leading-relaxed">
                    I consent to a background check and identity verification as required to teach on Thoven.
                  </Label>
                </div>
                {!formData.backgroundCheckConsent && (
                  <p className="text-red-600 text-sm mt-2">⚠️ To teach on Thoven, identity verification is required.</p>
                )}
              </div>

              {formData.backgroundCheckConsent && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-sans text-green-800">
                    ✅ Ready for verification! We'll guide you through a simple ID check process.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  const containerClasses = isInline
    ? "w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200"
    : "fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"

  const contentClasses = isInline
    ? "w-full"
    : "bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"

  if (!isOpen) return null

  return (
    <div className={containerClasses} onClick={handleOverlayClick}>
      <div className={contentClasses}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-2xl font-bold">Teacher Application</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
              aria-label="Close application"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-sans text-gray-600">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{renderStep()}</div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-6 rounded-b-2xl">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!formData.backgroundCheckConsent}
                className="bg-amber-500 hover:bg-amber-600 flex items-center gap-2 shadow-[0_4px_0_0_#d97706] hover:shadow-[0_2px_0_0_#d97706] active:shadow-[0_1px_0_0_#d97706] active:translate-y-[2px] transition-all duration-150"
              >
                <Sparkles className="w-4 h-4" />
                Submit Application
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-amber-500 hover:bg-amber-600 flex items-center gap-2 shadow-[0_4px_0_0_#d97706] hover:shadow-[0_2px_0_0_#d97706] active:shadow-[0_1px_0_0_#d97706] active:translate-y-[2px] transition-all duration-150"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
