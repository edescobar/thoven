'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Music, Users, DollarSign, BookOpen, MessageSquare, Settings, LogOut, Star, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/contexts/auth-context'
import { useTeacherProfile } from '@/hooks/use-teacher-profile'
import { useTeacherStudents } from '@/hooks/use-teacher-students'
import { Switch } from '@/components/ui/switch'
import { BookingRequestsPanel } from '@/components/booking-requests-panel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const INSTRUMENTS = [
  'Piano', 'Guitar', 'Violin', 'Drums', 'Bass', 'Saxophone', 
  'Trumpet', 'Flute', 'Clarinet', 'Cello', 'Voice', 'Ukulele'
]

export default function TeacherDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, profile, signOut } = useAuth()
  const { teacherProfile, updateProfile, loading: profileLoading } = useTeacherProfile()
  const { students, updateEnrollmentStatus, loading: studentsLoading } = useTeacherStudents()
  
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState({
    introduction: '',
    instruments_taught: [] as string[],
    hourly_rate: 50,
    years_experience: 0,
    online_lessons: true,
    in_person_lessons: false
  })

  useEffect(() => {
    if (teacherProfile) {
      setEditData({
        introduction: teacherProfile.introduction || '',
        instruments_taught: teacherProfile.instruments_taught || [],
        hourly_rate: teacherProfile.hourly_rate || 50,
        years_experience: teacherProfile.years_experience || 0,
        online_lessons: teacherProfile.online_lessons ?? true,
        in_person_lessons: teacherProfile.in_person_lessons ?? false
      })
    }
  }, [teacherProfile])

  const handleSaveProfile = async () => {
    setSaving(true)
    const { error } = await updateProfile(editData)
    
    if (error) {
      toast({
        title: 'Error updating profile',
        description: error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully'
      })
      setEditing(false)
    }
    setSaving(false)
  }

  const handleStudentStatusChange = async (enrollmentId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    const { error } = await updateEnrollmentStatus(enrollmentId, newStatus)
    
    if (error) {
      toast({
        title: 'Error updating student status',
        description: error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Status updated',
        description: 'Student enrollment status has been updated'
      })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const activeStudents = students.filter(s => s.status === 'active')
  const pendingStudents = students.filter(s => s.status === 'pending')
  const totalEarnings = activeStudents.length * (teacherProfile?.hourly_rate || 50) * 4 // Estimated monthly

  if (profileLoading || studentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logocropped-Ts5Qu9cYp28KPMWeyKi361H6sTD2Qc.png"
                alt="Thoven"
                className="h-12 w-auto"
              />
              <span className="ml-4 text-lg font-semibold text-gray-900">Teacher Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.first_name} {profile?.last_name}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStudents.length}</div>
              {pendingStudents.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{pendingStudents.length} pending
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings}</div>
              <p className="text-xs text-muted-foreground">
                Based on {activeStudents.length} students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${teacherProfile?.hourly_rate || 50}/hr</div>
              <p className="text-xs text-muted-foreground">
                {teacherProfile?.online_lessons && teacherProfile?.in_person_lessons
                  ? 'Online & In-person'
                  : teacherProfile?.online_lessons
                  ? 'Online only'
                  : 'In-person only'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {teacherProfile?.verified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium">Pending Verification</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {teacherProfile?.is_active ? 'Active' : 'Inactive'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <BookingRequestsPanel />
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Students</CardTitle>
                <CardDescription>
                  Manage your current and pending students
                </CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No students yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Students will appear here when they enroll in your lessons
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={student.student.profile_picture_url || 
                              `https://ui-avatars.com/api/?name=${student.student.first_name}+${student.student.last_name}&background=FEF3C7&color=F59E0B`}
                            alt={`${student.student.first_name} ${student.student.last_name}`}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">
                              {student.student.first_name} {student.student.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {student.instrument} • {student.lesson_type === 'online' ? 'Online' : 'In-person'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Parent: {student.parent.first_name} {student.parent.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {student.status === 'pending' ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStudentStatusChange(student.enrollment_id, 'active')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStudentStatusChange(student.enrollment_id, 'inactive')}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </>
                          ) : (
                            <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                              {student.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Schedule</CardTitle>
                <CardDescription>
                  Manage your teaching schedule and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Schedule management coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">
                    You'll be able to set your availability and manage lessons here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Teacher Profile</CardTitle>
                <CardDescription>
                  Manage your teaching profile and rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!editing ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-500">Introduction</Label>
                        <p className="mt-1">
                          {teacherProfile?.introduction || 'No introduction yet'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-gray-500">Instruments</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {teacherProfile?.instruments_taught?.length ? (
                            teacherProfile.instruments_taught.map((instrument) => (
                              <Badge key={instrument} variant="secondary">
                                {instrument}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400">No instruments added</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-500">Hourly Rate</Label>
                          <p className="mt-1">${teacherProfile?.hourly_rate || 50}/hour</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">Experience</Label>
                          <p className="mt-1">{teacherProfile?.years_experience || 0} years</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-500">Online Lessons</Label>
                          <p className="mt-1">{teacherProfile?.online_lessons ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">In-Person Lessons</Label>
                          <p className="mt-1">{teacherProfile?.in_person_lessons ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="introduction">Introduction</Label>
                        <Textarea
                          id="introduction"
                          value={editData.introduction}
                          onChange={(e) => setEditData({ ...editData, introduction: e.target.value })}
                          placeholder="Tell students and parents about yourself..."
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <Label>Instruments You Teach</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {INSTRUMENTS.map((instrument) => (
                            <label
                              key={instrument}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={editData.instruments_taught.includes(instrument)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditData({
                                      ...editData,
                                      instruments_taught: [...editData.instruments_taught, instrument]
                                    })
                                  } else {
                                    setEditData({
                                      ...editData,
                                      instruments_taught: editData.instruments_taught.filter(i => i !== instrument)
                                    })
                                  }
                                }}
                                className="rounded text-amber-500"
                              />
                              <span className="text-sm">{instrument}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                          <Input
                            id="hourly_rate"
                            type="number"
                            value={editData.hourly_rate}
                            onChange={(e) => setEditData({ ...editData, hourly_rate: parseInt(e.target.value) || 0 })}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="years_experience">Years of Experience</Label>
                          <Input
                            id="years_experience"
                            type="number"
                            value={editData.years_experience}
                            onChange={(e) => setEditData({ ...editData, years_experience: parseInt(e.target.value) || 0 })}
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="online_lessons" className="cursor-pointer">
                            Offer Online Lessons
                          </Label>
                          <Switch
                            id="online_lessons"
                            checked={editData.online_lessons}
                            onCheckedChange={(checked) => setEditData({ ...editData, online_lessons: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="in_person_lessons" className="cursor-pointer">
                            Offer In-Person Lessons
                          </Label>
                          <Switch
                            id="in_person_lessons"
                            checked={editData.in_person_lessons}
                            onCheckedChange={(checked) => setEditData({ ...editData, in_person_lessons: checked })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)} disabled={saving}>
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communicate with students and parents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Messaging coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">
                    You'll be able to communicate with students and parents here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}