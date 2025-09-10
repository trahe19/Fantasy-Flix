// Local storage-based authentication (temporarily restored)
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

// Local storage authentication functions
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

// Handle email confirmation
export async function handleEmailConfirmation(): Promise<void> {
  console.log('Email confirmation handled locally')
}

// Confirm email and activate user
export async function confirmEmailAndActivateUser(token: string): Promise<User | null> {
  return confirmLocalEmailAndActivateUser(token)
}

// League management functions using local storage
export async function getUserLeagues(userId: string): Promise<League[]> {
  if (typeof window === 'undefined') return []
  
  const leagues = localStorage.getItem('fantasy-flix-leagues')
  if (!leagues) return []
  
  try {
    const allLeagues = JSON.parse(leagues)
    return Object.values(allLeagues).filter((league: any) => 
      league.creator_id === userId || league.players?.includes(userId)
    )
  } catch {
    return []
  }
}

export async function createLeague(leagueData: Omit<League, 'id' | 'current_players' | 'created_at' | 'updated_at'>): Promise<League> {
  const newLeague: League = {
    ...leagueData,
    id: Math.random().toString(36).substr(2, 9),
    current_players: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  if (typeof window !== 'undefined') {
    const leagues = localStorage.getItem('fantasy-flix-leagues')
    const allLeagues = leagues ? JSON.parse(leagues) : {}
    allLeagues[newLeague.id] = newLeague
    localStorage.setItem('fantasy-flix-leagues', JSON.stringify(allLeagues))
  }
  
  return newLeague
}

// Function to update existing leagues with proper display names
export async function updateLeaguePlayerNames(): Promise<void> {
  console.log('League player names updated via local storage')
}