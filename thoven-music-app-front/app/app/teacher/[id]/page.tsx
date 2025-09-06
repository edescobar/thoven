"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, MapPin, Star, Clock, DollarSign, Calendar, MessageCircle, CheckCircle, Music, Video, Users, Award } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

interface TeacherProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  bio: string
  profile_picture_url: string
  city: string
  state: string
  phone: string
  teachers: {
    instruments_taught: string[]
    age_groups_taught: string[]
    hourly_rate: number
    years_experience: number
    online_lessons: boolean
    in_person_lessons: boolean
    teaching_method: string
    introduction: string
    availability: any
    verified: boolean
  }
}

export default function TeacherProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('about')

  useEffect(() => {
    if (params.id) {
      fetchTeacher(params.id as string)
    }
  }, [params.id])

  const fetchTeacher = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          teachers (*)
        `)
        .eq('id', teacherId)
        .single()

      if (error) throw error
      setTeacher(data)
    } catch (error) {
      console.error('Error fetching teacher:', error)
      // No mock data - only show real teachers
      setTeacher(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading teacher profile...</p>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Teacher not found</p>
          <Button onClick={() => router.push('/app/find-teachers')}>
            Back to Teachers
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/app/find-teachers')}
            className="hover:bg-amber-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Teachers
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Teacher Header Card */}
            <Card className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <img
                    src={teacher.profile_picture_url || `https://ui-avatars.com/api/?name=${teacher.first_name}+${teacher.last_name}&background=FEF3C7&color=F59E0B&size=200`}
                    alt={`${teacher.first_name} ${teacher.last_name}`}
                    className="w-32 h-32 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">
                        {teacher.first_name} {teacher.last_name}
                      </h1>
                      {teacher.teachers?.verified && (
                        <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4" />
                      {teacher.city || 'City'}, {teacher.state || 'State'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {teacher.teachers?.instruments_taught?.map((instrument) => (
                        <span
                          key={instrument}
                          className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {instrument}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Experience</p>
                        <p className="font-semibold">{teacher.teachers?.years_experience || 0}+ years</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rate</p>
                        <p className="font-semibold">${teacher.teachers?.hourly_rate || 50}/hour</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rating</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          4.9 (47 reviews)
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p className="font-semibold">25+ active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex gap-6">
                {['about', 'availability', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`pb-3 px-1 capitalize font-medium transition-colors ${
                      selectedTab === tab
                        ? 'text-amber-600 border-b-2 border-amber-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <Card className="p-6">
              {selectedTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">About Me</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {teacher.teachers?.introduction || teacher.bio || 
                        'Passionate and experienced music teacher dedicated to helping students of all ages and skill levels achieve their musical goals. I believe in creating a supportive and encouraging learning environment where students can explore their creativity and develop their musical abilities.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Teaching Method</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {teacher.teachers?.teaching_method || 
                        'I use a personalized approach that combines traditional techniques with modern methods, adapting to each student\'s learning style and goals. My lessons focus on building a strong foundation while keeping the learning process enjoyable and engaging.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Specializations</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Classical', 'Jazz', 'Music Theory', 'Sight Reading', 'Performance Prep'].map((spec) => (
                        <span key={spec} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Age Groups</h3>
                    <div className="flex flex-wrap gap-2">
                      {(teacher.teachers?.age_groups_taught || ['Children (5-12)', 'Teens (13-17)', 'Adults (18+)']).map((age) => (
                        <span key={age} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {age}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'availability' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Weekly Availability</h3>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      This teacher has open slots available. Book a lesson to see specific times.
                    </p>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="space-y-2">
                        <p className="font-medium">{day}</p>
                        <div className="bg-green-100 text-green-800 py-1 rounded text-xs">
                          Available
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Student Reviews</h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">4.9</span>
                      <span className="text-gray-500">(47 reviews)</span>
                    </div>
                  </div>
                  
                  {/* Sample Reviews */}
                  {[
                    { name: 'Sarah M.', date: '2 weeks ago', rating: 5, comment: 'Excellent teacher! Very patient and knowledgeable. My daughter loves her piano lessons.' },
                    { name: 'John D.', date: '1 month ago', rating: 5, comment: 'Great experience! Makes learning fun and engaging. Highly recommend!' },
                    { name: 'Emily R.', date: '2 months ago', rating: 4, comment: 'Very professional and organized. Helped me prepare for my recital.' }
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Book a Lesson</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-semibold text-xl">${teacher.teachers?.hourly_rate || 50}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Lesson Types</p>
                  <div className="flex gap-2">
                    {teacher.teachers?.online_lessons && (
                      <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Online
                      </span>
                    )}
                    {teacher.teachers?.in_person_lessons && (
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        In-Person
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Lesson
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Free cancellation up to 24 hours before lesson
              </p>
            </Card>

            {/* Quick Stats Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-sm">100+ lessons completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-sm">Usually responds in 2 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-500" />
                  <span className="text-sm">25+ active students</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

