// Simple local authentication - no external dependencies required
import { 
  User, 
  login as localLogin, 
  logout as localLogout, 
  register as localRegister, 
  getCurrentUser as getLocalCurrentUser, 
  isLoggedIn as isLocalLoggedIn, 
  onAuthStateChange as localOnAuthStateChange 
} from './local-auth'

// Re-export User interface
export type { User }

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

// Simple local authentication functions
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

// Handle email confirmation (not needed for local auth)
export async function handleEmailConfirmation(): Promise<void> {
  // No-op for local authentication
  console.log('Email confirmation not required for local auth')
}

// League management functions (local storage implementation)
const LEAGUES_KEY = 'fantasy-flix-leagues'

function getStoredLeagues(): League[] {
  if (typeof window === 'undefined') return []
  
  try {
    const leagues = localStorage.getItem(LEAGUES_KEY)
    return leagues ? JSON.parse(leagues) : []
  } catch {
    return []
  }
}

function saveLeagues(leagues: League[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(LEAGUES_KEY, JSON.stringify(leagues))
  } catch (error) {
    console.error('Failed to save leagues:', error)
  }
}

export async function getUserLeagues(userId: string): Promise<League[]> {
  console.log('Getting leagues for user:', userId)
  
  const allLeagues = getStoredLeagues()
  // Return leagues where user is the creator or a participant
  const userLeagues = allLeagues.filter(league => 
    league.createdBy === userId || 
    league.players.some(player => player.userId === userId)
  )
  
  return userLeagues
}

export async function createLeague(leagueData: Omit<League, 'id' | 'currentPlayers' | 'players'>): Promise<League> {
  console.log('Creating league:', leagueData)
  
  // Get the current user to add their display name
  const currentUser = await getCurrentUser()
  const creatorDisplayName = currentUser?.display_name || currentUser?.username || 'League Creator'
  
  // Create a basic league structure
  const newLeague: League = {
    ...leagueData,
    id: 'league-' + Date.now(),
    currentPlayers: 1,
    players: [{
      userId: leagueData.createdBy,
      username: creatorDisplayName,
      joinDate: new Date().toISOString(),
      roster: [],
      totalScore: 0,
      rank: 1,
      weeklyScores: []
    }]
  }
  
  // Save to localStorage
  const existingLeagues = getStoredLeagues()
  const updatedLeagues = [...existingLeagues, newLeague]
  saveLeagues(updatedLeagues)
  
  console.log('League saved successfully:', newLeague.id)
  return newLeague
}

// Function to update existing leagues with proper display names
export async function updateLeaguePlayerNames(): Promise<void> {
  const currentUser = await getCurrentUser()
  if (!currentUser) return
  
  const allLeagues = getStoredLeagues()
  let updated = false
  
  const updatedLeagues = allLeagues.map(league => {
    // Update league creator's display name if it's currently "League Creator"
    const updatedPlayers = league.players.map(player => {
      if (player.userId === currentUser.id && player.username === 'League Creator') {
        updated = true
        return {
          ...player,
          username: currentUser.display_name || currentUser.username || 'League Creator'
        }
      }
      return player
    })
    
    return {
      ...league,
      players: updatedPlayers
    }
  })
  
  if (updated) {
    saveLeagues(updatedLeagues)
    console.log('Updated league player names with current user display name')
  }
}