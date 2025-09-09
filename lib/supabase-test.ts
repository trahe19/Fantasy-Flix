import { supabase } from './supabase'

// Simple connectivity test
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Test basic auth connection (doesn't require tables)
    const { data, error } = await supabase.auth.getSession()
    
    console.log('Connection test result:', { data, error })
    
    if (error) {
      console.error('Supabase connection error:', error)
      return false
    }
    
    console.log('Supabase connection successful!')
    return true
  } catch (err) {
    console.error('Connection test failed:', err)
    return false
  }
}