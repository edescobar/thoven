'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, Music, Users, DollarSign, BookOpen, MessageSquare, Settings, LogOut, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
}

interface TeacherProfile {
  id: string
  name: string
  bio?: string
  instruments: string[]
  hourly_rate: number
  verified: boolean
  is_active: boolean
  avatar_url?: string
}

export default function TeacherDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    bio: '',
    instruments: '',
    hourly_rate: 50
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setProfile(profile)
        
        const { data: teacher } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (teacher) {
          setTeacherProfile(teacher)
          setEditData({
            bio: teacher.bio || '',
            instruments: teacher.instruments?.join(', ') || '',
            hourly_rate: teacher.hourly_rate || 50
          })
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully'
    })
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    try {
      const { error } = await supabase
        .from('teachers')
        .update({
          bio: editData.bio,
          instruments: editData.instruments.split(',').map(i => i.trim()),
          hourly_rate: editData.hourly_rate,
          name: `${profile.first_name} ${profile.last_name}`
        })
        .eq('id', profile.id)

      if (error) throw error

      toast({
        title: 'Profile updated',
        description: 'Your teaching profile has been updated successfully'
      })
      
      setEditing(false)
      loadProfile()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Music className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold">Thoven Teacher</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.first_name || 'Teacher'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm">Students</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm">Total Lessons</span>
                  </div>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm">Earnings</span>
                  </div>
                  <span className="font-semibold">$0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <span className="font-semibold">N/A</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="ghost">
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Schedule
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Users className="mr-2 h-4 w-4" />
                  My Students
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome to Your Teaching Dashboard!</CardTitle>
                    <CardDescription>
                      Manage your students, schedule, and teaching profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {teacherProfile?.verified ? (
                      <Badge className="mb-4" variant="default">Verified Teacher</Badge>
                    ) : (
                      <Badge className="mb-4" variant="secondary">Pending Verification</Badge>
                    )}
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Getting Started</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                          <li>Complete your teaching profile</li>
                          <li>Set your availability and rates</li>
                          <li>Wait for students to book lessons</li>
                          <li>Conduct lessons and track progress</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">
                      No lessons scheduled for today
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Profile</CardTitle>
                    <CardDescription>
                      Update your profile to attract more students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={editData.bio}
                            onChange={(e) => setEditData({...editData, bio: e.target.value})}
                            placeholder="Tell students about yourself..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="instruments">Instruments (comma-separated)</Label>
                          <Input
                            id="instruments"
                            value={editData.instruments}
                            onChange={(e) => setEditData({...editData, instruments: e.target.value})}
                            placeholder="Piano, Guitar, Violin..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rate">Hourly Rate ($)</Label>
                          <Input
                            id="rate"
                            type="number"
                            value={editData.hourly_rate}
                            onChange={(e) => setEditData({...editData, hourly_rate: parseInt(e.target.value)})}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Bio</h4>
                          <p className="text-gray-600">{teacherProfile?.bio || 'No bio added yet'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Instruments</h4>
                          <p className="text-gray-600">
                            {teacherProfile?.instruments?.join(', ') || 'No instruments specified'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Hourly Rate</h4>
                          <p className="text-gray-600">${teacherProfile?.hourly_rate || 50}/hour</p>
                        </div>
                        <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Students</CardTitle>
                    <CardDescription>Manage your student roster</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">
                      You don't have any students yet. They will appear here once they book lessons with you.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Schedule</CardTitle>
                    <CardDescription>Manage your availability and lessons</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-center py-8">
                      No upcoming lessons scheduled
                    </p>
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Students will be able to book lessons with you once you set your availability.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}