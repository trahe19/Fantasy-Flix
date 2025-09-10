// localStorage-based authentication for immediate functionality
import { 
  User, 
  login as localLogin, 
  logout as localLogout, 
  register as localRegister, 
  getCurrentUser as getLocalCurrentUser, 
  isLoggedIn as isLocalLoggedIn, 
  onAuthStateChange as localOnAuthStateChange,
  confirmEmailAndActivateUser as confirmLocalEmailAndActivateUser
} from './local-auth'

// Re-export User interface
export type { User }

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

// localStorage authentication functions
export async function login(email: string, password: string): Promise<User | null> {
  return localLogin(email, password)
}

export async function register(userData: { 
  username: string; 
  email: string; 
  displayName: string;
  password: string;
}): Promise<{ user: User | null; needsConfirmation: boolean }> {
  return localRegister(userData)
}

export async function logout(): Promise<void> {
  return localLogout()
}

export async function getCurrentUser(): Promise<User | null> {
  return getLocalCurrentUser()
}

export async function isLoggedIn(): Promise<boolean> {
  return isLocalLoggedIn()
}

// Session management
export function onAuthStateChange(callback: (user: User | null) => void) {
  return localOnAuthStateChange(callback)
}

// Handle email confirmation - placeholder for localStorage system
export async function handleEmailConfirmation(): Promise<void> {
  console.log('Email confirmation handling - localStorage system')
}

// Confirm email and activate user
export async function confirmEmailAndActivateUser(token: string): Promise<User | null> {
  return confirmLocalEmailAndActivateUser(token)
}

// League management functions using localStorage
export async function getUserLeagues(userId: string): Promise<League[]> {
  console.log('Getting leagues for user:', userId)
  // For now, return empty array - can be enhanced later
  return []
}

export async function createLeague(leagueData: Omit<League, 'id' | 'current_players' | 'created_at' | 'updated_at'>): Promise<League> {
  console.log('Creating league:', leagueData.name)
  
  const newLeague: League = {
    ...leagueData,
    id: 'league-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    current_players: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // For now, just return the league without storing
  // Can be enhanced with localStorage storage later
  console.log('League created:', newLeague)
  return newLeague
}

// Function to update existing leagues with proper display names  
export async function updateLeaguePlayerNames(): Promise<void> {
  console.log('League player names managed by localStorage system')
}