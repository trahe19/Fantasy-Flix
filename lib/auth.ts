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
}): Promise<User> {
  try {
    // First, create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) {
      throw new Error(authError.message)
    }

    if (authData.user) {
      // Create user profile in our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([{
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

      return profile
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
    if (session?.user) {
      const user = await getCurrentUser()
      callback(user)
    } else {
      callback(null)
    }
  })
}

// Additional helper functions can be added here for Supabase integration
// League management will be handled through the database operations in supabase.ts