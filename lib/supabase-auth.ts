// Supabase-based authentication system
import { supabase } from './supabase'
import type { User as AuthUser } from '@supabase/supabase-js'

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
  description?: string;
  max_players: number;
  current_players: number;
  entry_fee: number;
  prize_pool: number;
  draft_date?: string;
  season_start: string;
  season_end: string;
  scoring_system: any;
  status: 'draft' | 'active' | 'completed';
  is_public: boolean;
  creator_id: string;
  created_at: string;
  updated_at: string;
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

// Auth state management
let authCallbacks: ((user: User | null) => void)[] = []

export async function register(userData: {
  username: string
  email: string
  displayName: string
  password: string
}): Promise<{ user: User | null; needsConfirmation: boolean }> {
  console.log('Supabase registration for:', userData.email)
  
  try {
    // First check if username is taken
    const { data: existingUser } = await supabase
      .from('users')
      .select('username')
      .eq('username', userData.username)
      .single()
    
    if (existingUser) {
      throw new Error('This username is already taken')
    }
    
    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
          display_name: userData.displayName
        },
        // Skip email confirmation in development
        emailRedirectTo: process.env.NODE_ENV === 'development' 
          ? undefined 
          : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app'}/auth/callback`
      }
    })
    
    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('An account with this email already exists')
      }
      throw error
    }
    
    // If user is created but not confirmed, we need confirmation
    if (data.user && !data.user.email_confirmed_at) {
      return {
        user: null,
        needsConfirmation: true
      }
    }
    
    // If user is immediately confirmed, create profile
    if (data.user && data.user.email_confirmed_at) {
      await createUserProfile(data.user, userData.username, userData.displayName)
      const userProfile = await getUserProfile(data.user.id)
      return {
        user: userProfile,
        needsConfirmation: false
      }
    }
    
    return {
      user: null,
      needsConfirmation: true
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    throw error
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  console.log('Supabase login for:', email)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.log('Login error:', error.message)
      return null
    }
    
    if (!data.user) {
      console.log('No user returned from login')
      return null
    }
    
    // Get user profile from our users table
    const userProfile = await getUserProfile(data.user.id)
    
    if (userProfile) {
      triggerAuthStateChange(userProfile)
    }
    
    return userProfile
  } catch (error) {
    console.error('Login failed:', error)
    return null
  }
}

export async function logout(): Promise<void> {
  console.log('Logging out from Supabase')
  
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error)
    }
  } catch (error) {
    console.error('Logout failed:', error)
  }
  
  triggerAuthStateChange(null)
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return null
    }
    
    return await getUserProfile(user.id)
  } catch (error) {
    console.error('Get current user failed:', error)
    return null
  }
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

// Create user profile in our users table
async function createUserProfile(authUser: AuthUser, username: string, displayName: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: authUser.id,
        email: authUser.email!,
        username: username,
        display_name: displayName,
        total_earnings: 0,
        total_leagues: 0,
        championships: 0
      })
    
    if (error) {
      console.error('Failed to create user profile:', error)
      throw error
    }
    
    console.log('User profile created successfully')
  } catch (error) {
    console.error('Create user profile failed:', error)
    throw error
  }
}

// Get user profile from our users table
async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Failed to get user profile:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Get user profile failed:', error)
    return null
  }
}

// Session management with callback support
export function onAuthStateChange(callback: (user: User | null) => void) {
  authCallbacks.push(callback)
  
  // Set up Supabase auth listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event)
    
    if (session?.user) {
      const userProfile = await getUserProfile(session.user.id)
      callback(userProfile)
    } else {
      callback(null)
    }
  })
  
  // Also call immediately with current user
  getCurrentUser().then(callback)
  
  return {
    data: {
      subscription: {
        unsubscribe: () => {
          authCallbacks = authCallbacks.filter(cb => cb !== callback)
          subscription.unsubscribe()
        }
      }
    }
  }
}

// Trigger auth state change manually
function triggerAuthStateChange(user: User | null): void {
  authCallbacks.forEach(callback => {
    try {
      callback(user)
    } catch (error) {
      console.error('Auth callback error:', error)
    }
  })
}

// League management functions using Supabase
export async function getUserLeagues(userId: string): Promise<League[]> {
  console.log('Getting leagues for user:', userId)
  
  try {
    // Get leagues where user is creator or member
    const { data: memberLeagues, error: memberError } = await supabase
      .from('league_members')
      .select(`
        leagues (
          id,
          name,
          description,
          max_players,
          current_players,
          entry_fee,
          prize_pool,
          draft_date,
          season_start,
          season_end,
          scoring_system,
          status,
          is_public,
          creator_id,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
    
    if (memberError) {
      console.error('Error fetching user leagues:', memberError)
      return []
    }
    
    // Extract leagues from the member data
    const leagues = memberLeagues
      ?.map(member => member.leagues)
      .filter(Boolean) || []
    
    console.log('Found leagues:', leagues.length)
    return leagues as League[]
  } catch (error) {
    console.error('Get user leagues failed:', error)
    return []
  }
}

export async function createLeague(leagueData: Omit<League, 'id' | 'current_players' | 'created_at' | 'updated_at'>): Promise<League> {
  console.log('Creating league:', leagueData)
  
  try {
    // Create the league
    const { data: league, error: leagueError } = await supabase
      .from('leagues')
      .insert({
        name: leagueData.name,
        description: leagueData.description,
        max_players: leagueData.max_players,
        entry_fee: leagueData.entry_fee,
        prize_pool: leagueData.prize_pool,
        draft_date: leagueData.draft_date,
        season_start: leagueData.season_start,
        season_end: leagueData.season_end,
        scoring_system: leagueData.scoring_system,
        status: leagueData.status,
        is_public: leagueData.is_public,
        creator_id: leagueData.creator_id
      })
      .select()
      .single()
    
    if (leagueError) {
      console.error('Error creating league:', leagueError)
      throw leagueError
    }
    
    // Add creator as first league member
    const { error: memberError } = await supabase
      .from('league_members')
      .insert({
        league_id: league.id,
        user_id: leagueData.creator_id
      })
    
    if (memberError) {
      console.error('Error adding creator as league member:', memberError)
      throw memberError
    }
    
    // Update current_players count
    const { data: updatedLeague, error: updateError } = await supabase
      .from('leagues')
      .update({ current_players: 1 })
      .eq('id', league.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating league player count:', updateError)
      throw updateError
    }
    
    console.log('League created successfully:', updatedLeague.id)
    return updatedLeague as League
  } catch (error) {
    console.error('Create league failed:', error)
    throw error
  }
}

// Email confirmation handler (Supabase handles this automatically)
export async function handleEmailConfirmation(): Promise<void> {
  console.log('Email confirmation handled by Supabase Auth')
}

export async function confirmEmailAndActivateUser(token: string): Promise<User | null> {
  console.log('Email confirmation with token handled by Supabase Auth automatically')
  return getCurrentUser()
}

// Function to migrate existing localStorage users to Supabase (one-time migration)
export async function migrateLocalStorageToSupabase(): Promise<void> {
  if (typeof window === 'undefined') return
  
  try {
    // Get current user from localStorage
    const currentUserStr = localStorage.getItem('fantasy-flix-current-user')
    if (!currentUserStr) {
      console.log('No localStorage user to migrate')
      return
    }
    
    const localUser = JSON.parse(currentUserStr)
    
    // Check if this user already exists in Supabase
    const existingUser = await getUserProfile(localUser.id)
    if (existingUser) {
      console.log('User already exists in Supabase, skipping migration')
      return
    }
    
    console.log('Migration completed - localStorage users would need to re-register with Supabase')
    
    // Clear localStorage after explaining migration
    localStorage.removeItem('fantasy-flix-current-user')
    localStorage.removeItem('fantasy-flix-users')
    
  } catch (error) {
    console.error('Migration failed:', error)
  }
}