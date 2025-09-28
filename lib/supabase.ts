import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client with placeholder values for development
export const supabase = supabaseUrl.includes('placeholder') ? null : createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  username: string
  display_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface League {
  id: string
  name: string
  description?: string
  max_players: number
  entry_fee?: number
  prize_pool?: number
  draft_date?: string
  season_start: string
  season_end: string
  status: 'draft' | 'active' | 'completed'
  creator_id: string
  created_at: string
  updated_at: string
}

export interface Movie {
  id: number // TMDB ID
  title: string
  release_date: string
  poster_path?: string
  overview?: string
  budget?: number
  revenue?: number
  runtime?: number
  vote_average?: number
  tmdb_data: any // Store full TMDB response
  created_at: string
  updated_at: string
}

export interface Draft {
  id: string
  league_id: string
  user_id: string
  movie_id: number
  pick_number: number
  round: number
  timestamp: string
  created_at: string
}

export interface Roster {
  id: string
  user_id: string
  league_id: string
  movie_id: number
  position: 'starter' | 'bench'
  is_locked: boolean
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const db = {
  // User operations
  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUser(id: string) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // League operations
  async createLeague(league: Omit<League, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('leagues')
      .insert([league])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getLeagues() {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('leagues')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async joinLeague(leagueId: string, userId: string) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('league_members')
      .insert([{ league_id: leagueId, user_id: userId }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Draft operations
  async draftMovie(draft: Omit<Draft, 'id' | 'created_at'>) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('drafts')
      .insert([draft])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getDrafts(leagueId: string) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('league_id', leagueId)
      .order('pick_number', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Roster operations
  async getRoster(userId: string, leagueId: string) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('rosters')
      .select(`
        *,
        movies (*)
      `)
      .eq('user_id', userId)
      .eq('league_id', leagueId)
    
    if (error) throw error
    return data
  },

  async updateRoster(rosterId: string, updates: Partial<Roster>) {
    if (!supabase) throw new Error('Supabase not configured')
    const { data, error } = await supabase
      .from('rosters')
      .update(updates)
      .eq('id', rosterId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}