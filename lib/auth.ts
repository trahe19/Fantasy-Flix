import { supabase } from './supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

// Fantasy Flix User interface matching our database schema
export interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  total_earnings?: number;
  total_leagues?: number;
  championships?: number;
  created_at: string;
  updated_at: string;
}

export interface League {
  id: string;
  name: string;
  createdBy: string;
  season: string;
  status: 'draft' | 'active' | 'completed';
  maxPlayers: number;
  currentPlayers: number;
  entryFee: number;
  prizePool: number;
  draftDate?: string;
  rules: {
    budget: number;
    positions: string[];
    scoringPeriod: 'weekend' | 'week' | 'month';
  };
  players: LeaguePlayer[];
}

export interface LeaguePlayer {
  userId: string;
  username: string;
  joinDate: string;
  roster: MoviePick[];
  totalScore: number;
  rank: number;
  weeklyScores: { week: number; score: number }[];
}

export interface MoviePick {
  movieId: number;
  movieTitle: string;
  position: string;
  draftedDate: string;
  cost: number;
  currentScore: number;
  weeklyScores: { week: number; score: number; boxOffice?: number }[];
}

// Authentication functions using Supabase
export async function login(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      return null
    }

    if (data.user) {
      // Get user profile from our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.user.email)
        .single()

      if (profile && !profileError) {
        return profile
      }
    }

    return null
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function register(userData: { 
  username: string; 
  email: string; 
  displayName: string;
  password: string;
}): Promise<{ user: User | null; needsConfirmation: boolean }> {
  try {
    // First, create auth user with email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          display_name: userData.displayName,
        }
      }
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (authData.user) {
      // If email confirmation is required, user won't be automatically confirmed
      if (!authData.user.email_confirmed_at) {
        // Create user profile in our users table (will be activated after confirmation)
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: userData.email,
            username: userData.username,
            display_name: userData.displayName,
            total_earnings: 0,
            total_leagues: 0,
            championships: 0
          }])

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw here as the auth user was created successfully
        }

        return { user: null, needsConfirmation: true }
      } else {
        // User is confirmed, create/get profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .upsert([{
            id: authData.user.id,
            email: userData.email,
            username: userData.username,
            display_name: userData.displayName,
            total_earnings: 0,
            total_leagues: 0,
            championships: 0
          }])
          .select()
          .single()

        if (profileError) {
          throw new Error(profileError.message)
        }

        return { user: profile, needsConfirmation: false }
      }
    }

    throw new Error('Failed to create user')
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error.message)
    throw error
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Get user profile from our users table
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()

      if (profile && !error) {
        return profile
      }
    }

    return null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

// Session management
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.email)
    
    if (event === 'SIGNED_IN' && session?.user) {
      // Handle email confirmation
      if (session.user.email_confirmed_at) {
        // User just confirmed their email, create/update their profile
        const { error: profileError } = await supabase
          .from('users')
          .upsert([{
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
            display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.username || 'User',
            total_earnings: 0,
            total_leagues: 0,
            championships: 0
          }])

        if (profileError) {
          console.error('Profile upsert error:', profileError)
        }
      }
      
      const user = await getCurrentUser()
      callback(user)
    } else if (event === 'SIGNED_OUT') {
      callback(null)
    }
  })
}

// Handle email confirmation
export async function handleEmailConfirmation(): Promise<void> {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Session error:', error)
    return
  }
  
  if (data.session?.user?.email_confirmed_at) {
    // User is confirmed, ensure profile exists
    const { error: profileError } = await supabase
      .from('users')
      .upsert([{
        id: data.session.user.id,
        email: data.session.user.email!,
        username: data.session.user.user_metadata?.username || data.session.user.email!.split('@')[0],
        display_name: data.session.user.user_metadata?.display_name || data.session.user.user_metadata?.username || 'User',
        total_earnings: 0,
        total_leagues: 0,
        championships: 0
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }
  }
}

// Additional helper functions can be added here for Supabase integration
// League management will be handled through the database operations in supabase.ts