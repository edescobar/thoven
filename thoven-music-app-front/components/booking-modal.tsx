'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  teacher: {
    id: string
    name: string
    instruments: string[]
    hourly_rate: number
    online_lessons: boolean
    in_person_lessons: boolean
  }
  studentId?: string
  parentId: string
}

export function BookingModal({ isOpen, onClose, teacher, studentId, parentId }: BookingModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [formData, setFormData] = useState({
    instrument: '',
    lesson_type: 'online',
    frequency: 'weekly',
    duration: '60',
    message: '',
    preferred_time: 'afternoon'
  })

  const handleSubmit = async () => {
    if (!formData.instrument || selectedDates.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please select an instrument and at least one preferred date',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      // TODO: Create booking request when booking_requests table is added to database
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // const { error } = await supabase
      //   .from('booking_requests')
      //   .insert({
      //     teacher_id: teacher.id,
      //     parent_id: parentId,
      //     student_id: studentId,
      //     instrument: formData.instrument,
      //     lesson_type: formData.lesson_type,
      //     frequency: formData.frequency,
      //     duration_minutes: parseInt(formData.duration),
      //     preferred_dates: selectedDates.map(d => format(d, 'yyyy-MM-dd')),
      //     preferred_time: formData.preferred_time,
      //     message: formData.message,
      //     status: 'pending',
      //     hourly_rate: teacher.hourly_rate
      //   })

      // if (error) throw error

      toast({
        title: 'Booking Request Sent!',
        description: `Your request has been sent to ${teacher.name}. They will respond within 24-48 hours.`
      })
      
      onClose()
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: 'Booking Failed',
        description: 'Unable to send booking request. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Lessons with {teacher.name}</DialogTitle>
          <DialogDescription>
            Fill out this form to request lessons. The teacher will review and confirm availability.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Instrument Selection */}
          <div className="space-y-2">
            <Label>Which instrument?</Label>
            <Select value={formData.instrument} onValueChange={(value) => setFormData({...formData, instrument: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select an instrument" />
              </SelectTrigger>
              <SelectContent>
                {teacher.instruments.map((instrument) => (
                  <SelectItem key={instrument} value={instrument}>
                    {instrument}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lesson Type */}
          <div className="space-y-2">
            <Label>Lesson Type</Label>
            <RadioGroup value={formData.lesson_type} onValueChange={(value) => setFormData({...formData, lesson_type: value})}>
              {teacher.online_lessons && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online (Video Call)</Label>
                </div>
              )}
              {teacher.in_person_lessons && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person">In-Person</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>How often?</Label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Every 2 Weeks</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="as-needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label>Lesson Duration</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Dates */}
          <div className="space-y-2">
            <Label>Select preferred start dates (choose up to 3)</Label>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={(dates) => {
                if (dates && dates.length <= 3) {
                  setSelectedDates(dates)
                }
              }}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
            {selectedDates.length > 0 && (
              <p className="text-sm text-gray-600">
                Selected: {selectedDates.map(d => format(d, 'MMM d')).join(', ')}
              </p>
            )}
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label>Preferred Time of Day</Label>
            <Select value={formData.preferred_time} onValueChange={(value) => setFormData({...formData, preferred_time: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8am-12pm)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message to Teacher (Optional)</Label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Tell the teacher about your child's experience level, goals, or any special requirements..."
              rows={4}
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Cost:</span>
              <span className="text-lg font-bold">
                ${teacher.hourly_rate * (parseInt(formData.duration) / 60)}/lesson
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formData.frequency === 'weekly' && `About $${teacher.hourly_rate * (parseInt(formData.duration) / 60) * 4}/month`}
              {formData.frequency === 'bi-weekly' && `About $${teacher.hourly_rate * (parseInt(formData.duration) / 60) * 2}/month`}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Request...
              </>
            ) : (
              'Send Booking Request'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}