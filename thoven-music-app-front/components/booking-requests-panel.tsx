'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle, XCircle, Clock, Calendar, User, Music, DollarSign, MessageSquare, Loader2 } from 'lucide-react'
import { useBookingRequests } from '@/hooks/use-booking-requests'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

export function BookingRequestsPanel() {
  const { bookingRequests, loading, updateRequestStatus } = useBookingRequests()
  const { toast } = useToast()
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const [confirmedDetails, setConfirmedDetails] = useState({
    start_date: '',
    time: '',
    day_of_week: 'Monday'
  })
  const [processing, setProcessing] = useState(false)

  const pendingRequests = bookingRequests.filter(r => r.status === 'pending')
  const processedRequests = bookingRequests.filter(r => r.status !== 'pending')

  const handleRespond = async (requestId: string, status: 'accepted' | 'rejected') => {
    setProcessing(true)
    
    const details = status === 'accepted' ? confirmedDetails : undefined
    const { error } = await updateRequestStatus(requestId, status, response, details)
    
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to ${status} request: ${error}`,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Success',
        description: `Request ${status} successfully`,
      })
      setRespondingTo(null)
      setResponse('')
      setConfirmedDetails({
        start_date: '',
        time: '',
        day_of_week: 'Monday'
      })
    }
    
    setProcessing(false)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
          <CardDescription>
            Respond to lesson requests from parents and students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 && processedRequests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No booking requests yet</p>
              <p className="text-sm text-gray-400 mt-2">
                New requests from parents will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Requests */}
              {pendingRequests.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Pending Requests ({pendingRequests.length})
                  </h3>
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 bg-amber-50/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">
                                {request.parent.first_name} {request.parent.last_name}
                              </span>
                              {request.student && (
                                <span className="text-sm text-gray-500">
                                  for {request.student.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Music className="w-3 h-3" />
                                {request.instrument}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${request.hourly_rate}/hr
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {request.duration_minutes} min
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-amber-100">
                            {request.frequency}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <p className="text-sm">
                            <span className="font-medium">Lesson Type:</span> {request.lesson_type}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Preferred Time:</span> {request.preferred_time}
                          </p>
                          {request.preferred_dates && request.preferred_dates.length > 0 && (
                            <p className="text-sm">
                              <span className="font-medium">Available Dates:</span>{' '}
                              {request.preferred_dates.map(date => 
                                format(new Date(date), 'MMM d')
                              ).join(', ')}
                            </p>
                          )}
                          {request.message && (
                            <div className="bg-white rounded p-2 mt-2">
                              <p className="text-sm text-gray-600">{request.message}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => setRespondingTo(request.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRespondingTo(request.id)
                              setResponse('Unfortunately, I am not able to take on new students at this time.')
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processed Requests */}
              {processedRequests.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Processed Requests
                  </h3>
                  <div className="space-y-3">
                    {processedRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-sm">
                              {request.parent.first_name} {request.parent.last_name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              • {request.instrument} • {request.lesson_type}
                            </span>
                          </div>
                          <Badge 
                            variant={request.status === 'accepted' ? 'default' : 'secondary'}
                            className={request.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {request.status}
                          </Badge>
                        </div>
                        {request.status === 'accepted' && request.confirmed_start_date && (
                          <p className="text-xs text-gray-500 mt-1">
                            Starting {format(new Date(request.confirmed_start_date), 'MMM d, yyyy')} • {request.confirmed_day_of_week}s at {request.confirmed_time}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Dialog */}
      <Dialog open={!!respondingTo} onOpenChange={() => setRespondingTo(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Respond to Booking Request</DialogTitle>
            <DialogDescription>
              {respondingTo && bookingRequests.find(r => r.id === respondingTo)?.status === 'pending' && 
                response.includes('Unfortunately') ? 
                'Decline this booking request' : 
                'Accept this booking request and confirm lesson details'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!response.includes('Unfortunately') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={confirmedDetails.start_date}
                      onChange={(e) => setConfirmedDetails({
                        ...confirmedDetails,
                        start_date: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Lesson Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={confirmedDetails.time}
                      onChange={(e) => setConfirmedDetails({
                        ...confirmedDetails,
                        time: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="day_of_week">Regular Day</Label>
                  <Select
                    value={confirmedDetails.day_of_week}
                    onValueChange={(value) => setConfirmedDetails({
                      ...confirmedDetails,
                      day_of_week: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="response">Message to Parent</Label>
              <Textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder={response.includes('Unfortunately') ? 
                  "Add a personalized message..." : 
                  "Welcome! I'm excited to work with your child. Our first lesson will be..."
                }
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondingTo(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (respondingTo) {
                  const status = response.includes('Unfortunately') ? 'rejected' : 'accepted'
                  handleRespond(respondingTo, status)
                }
              }}
              disabled={processing || (!response.includes('Unfortunately') && (!confirmedDetails.start_date || !confirmedDetails.time))}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : response.includes('Unfortunately') ? (
                'Send Decline'
              ) : (
                'Confirm & Accept'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}