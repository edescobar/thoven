'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the token from URL
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'signup') {
          setStatus('error')
          setMessage('Invalid confirmation link')
          return
        }

        // Verify the email with the token
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        })

        if (error) {
          setStatus('error')
          setMessage(error.message || 'Failed to confirm email')
          return
        }

        setStatus('success')
        setMessage('Your email has been confirmed successfully!')

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/app/dashboard')
        }, 3000)
      } catch (err) {
        setStatus('error')
        setMessage('An unexpected error occurred')
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold">Confirming your email...</CardTitle>
              <CardDescription>Please wait while we verify your email address</CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Email confirmed!</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Confirmation failed</CardTitle>
              <CardDescription>{message}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {status === 'success' && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
              <Button onClick={() => router.push('/app/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <Button onClick={() => router.push('/auth')} className="w-full">
                Back to Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/auth/resend-confirmation')}
                className="w-full"
              >
                Resend Confirmation Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}