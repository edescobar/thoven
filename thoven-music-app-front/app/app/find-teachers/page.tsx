"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Search, MapPin, Star, Clock, DollarSign, Music, Filter, ChevronLeft } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

interface Teacher {
  id: string
  first_name: string
  last_name: string
  bio: string
  profile_picture_url: string
  city: string
  state: string
  teachers: {
    instruments_taught: string[]
    hourly_rate: number
    years_experience: number
    online_lessons: boolean
    in_person_lessons: boolean
    introduction: string
    verified: boolean
  }
}

export default function FindTeachersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInstrument, setSelectedInstrument] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [lessonType, setLessonType] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeachers()
  }, [])

  useEffect(() => {
    filterTeachers()
  }, [searchTerm, selectedInstrument, priceRange, lessonType, teachers])

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          teachers (*)
        `)
        .eq('role', 'teacher')
        .eq('teachers.is_active', true)

      if (error) throw error
      setTeachers(data || [])
      setFilteredTeachers(data || [])
    } catch (error) {
      console.error('Error fetching teachers:', error)
      // No mock data - only show real teachers
      setTeachers([])
      setFilteredTeachers([])
    } finally {
      setLoading(false)
    }
  }

  const filterTeachers = useCallback(() => {
    let filtered = [...teachers]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        `${teacher.first_name} ${teacher.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teachers?.instruments_taught?.some(i => i.toLowerCase().includes(searchTerm.toLowerCase())) ||
        teacher.city?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Instrument filter
    if (selectedInstrument !== "all") {
      filtered = filtered.filter(teacher => 
        teacher.teachers?.instruments_taught?.includes(selectedInstrument)
      )
    }

    // Price filter
    if (priceRange !== "all") {
      filtered = filtered.filter(teacher => {
        const rate = teacher.teachers?.hourly_rate || 0
        switch(priceRange) {
          case "0-50": return rate <= 50
          case "50-100": return rate > 50 && rate <= 100
          case "100+": return rate > 100
          default: return true
        }
      })
    }

    // Lesson type filter
    if (lessonType !== "all") {
      filtered = filtered.filter(teacher => {
        if (lessonType === "online") return teacher.teachers?.online_lessons
        if (lessonType === "in-person") return teacher.teachers?.in_person_lessons
        return true
      })
    }

    setFilteredTeachers(filtered)
  }, [searchTerm, selectedInstrument, priceRange, lessonType, teachers])

  const allInstruments = useMemo(() => 
    Array.from(new Set(
      teachers.flatMap(t => t.teachers?.instruments_taught || [])
    )), [teachers])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/app/parent/dashboard')}
                className="hover:bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Navigate back to parent dashboard"
              >
                <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Find Music Teachers</h1>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Your area</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label className="text-sm text-gray-700 mb-2">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name, instrument, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Search teachers"
                  role="searchbox"
                />
              </div>
            </div>

            {/* Instrument Filter */}
            <div>
              <Label className="text-sm text-gray-700 mb-2">Instrument</Label>
              <select
                value={selectedInstrument}
                onChange={(e) => setSelectedInstrument(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                aria-label="Filter by instrument"
              >
                <option value="all">All Instruments</option>
                {allInstruments.map(instrument => (
                  <option key={instrument} value={instrument}>{instrument}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm text-gray-700 mb-2">Price Range</Label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                aria-label="Filter by price range"
              >
                <option value="all">Any Price</option>
                <option value="0-50">Under $50/hr</option>
                <option value="50-100">$50-100/hr</option>
                <option value="100+">Over $100/hr</option>
              </select>
            </div>

            {/* Lesson Type */}
            <div>
              <Label className="text-sm text-gray-700 mb-2">Lesson Type</Label>
              <select
                value={lessonType}
                onChange={(e) => setLessonType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                aria-label="Filter by lesson type"
              >
                <option value="all">All Types</option>
                <option value="online">Online Only</option>
                <option value="in-person">In-Person Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredTeachers.length}</span> teachers
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Teachers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading teachers...</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Music className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No teachers found matching your criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedInstrument("all")
                setPriceRange("all")
                setLessonType("all")
              }}
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card
                key={teacher.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/app/teacher/${teacher.id}`)}
              >
                <div className="p-6">
                  {/* Teacher Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={teacher.profile_picture_url || `https://ui-avatars.com/api/?name=${teacher.first_name}+${teacher.last_name}&background=FEF3C7&color=F59E0B`}
                      alt={`${teacher.first_name} ${teacher.last_name}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {teacher.first_name} {teacher.last_name}
                        </h3>
                        {teacher.teachers?.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {teacher.city || 'Location not specified'}, {teacher.state || 'State'}
                      </p>
                    </div>
                  </div>

                  {/* Instruments */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {teacher.teachers?.instruments_taught?.map((instrument) => (
                        <span
                          key={instrument}
                          className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full"
                        >
                          {instrument}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Introduction */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {teacher.teachers?.introduction || teacher.bio || 'Passionate music teacher dedicated to helping students achieve their musical goals.'}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{teacher.teachers?.years_experience || 0}+ years</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>${teacher.teachers?.hourly_rate || 50}/hr</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Lesson Types */}
                  <div className="flex gap-2 mt-4">
                    {teacher.teachers?.online_lessons && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Online
                      </span>
                    )}
                    {teacher.teachers?.in_person_lessons && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        In-Person
                      </span>
                    )}
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="px-6 pb-6">
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    aria-label={`View profile of ${teacher.first_name} ${teacher.last_name}`}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

