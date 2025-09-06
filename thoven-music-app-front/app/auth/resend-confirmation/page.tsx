'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function ResendConfirmationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm-email`
        }
      })

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        })
        return
      }

      setIsSuccess(true)
      toast({
        title: 'Confirmation email sent',
        description: 'Please check your inbox for the confirmation link',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/auth" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to sign in
          </Link>
          <CardTitle className="text-2xl font-bold">Resend confirmation email</CardTitle>
          <CardDescription>
            Enter your email to receive a new confirmation link
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSuccess ? (
            <form onSubmit={handleResendConfirmation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading || !email}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending confirmation...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend confirmation email
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Check your email</h3>
              <p className="text-gray-600 mb-4">
                We've sent a new confirmation link to {email}
              </p>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth')}
                className="w-full"
              >
                Back to sign in
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}