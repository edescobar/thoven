import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    // Test database connection by checking if we can query profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Successfully connected to Supabase!',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
    })
  } catch (err: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Connection test failed',
      error: err.message 
    }, { status: 500 })
  }
}