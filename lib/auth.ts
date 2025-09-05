// Simple authentication system for Fantasy Flix
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  joinDate: string;
  leagues: string[];
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

// Mock user storage (in a real app, this would be a database)
let users: User[] = [
  {
    id: 'user1',
    username: 'grantgeyer',
    email: 'grant.geyer@icloud.com',
    displayName: 'Grant Geyer',
    joinDate: '2024-01-15',
    leagues: ['league1']
  }
];

let leagues: League[] = [];

let currentUser: User | null = null;

// Authentication functions
export function login(email: string, password: string): Promise<User | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      if (user) {
        currentUser = user;
        localStorage.setItem('fantasy-flix-user', JSON.stringify(user));
        resolve(user);
      } else {
        resolve(null);
      }
    }, 500); // Simulate network delay
  });
}

export function register(userData: Omit<User, 'id' | 'joinDate' | 'leagues'>): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        ...userData,
        id: `user${users.length + 1}`,
        joinDate: new Date().toISOString().split('T')[0],
        leagues: []
      };
      users.push(newUser);
      currentUser = newUser;
      localStorage.setItem('fantasy-flix-user', JSON.stringify(newUser));
      resolve(newUser);
    }, 500);
  });
}

export function logout(): void {
  currentUser = null;
  localStorage.removeItem('fantasy-flix-user');
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser;
  
  // Check localStorage
  const stored = localStorage.getItem('fantasy-flix-user');
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }
  
  return null;
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// League management functions
export function createLeague(leagueData: Omit<League, 'id' | 'players'>): League {
  const newLeague: League = {
    ...leagueData,
    id: `league${leagues.length + 1}`,
    players: []
  };
  
  leagues.push(newLeague);
  
  // Add league to current user
  if (currentUser) {
    currentUser.leagues.push(newLeague.id);
    // Update stored user
    localStorage.setItem('fantasy-flix-user', JSON.stringify(currentUser));
  }
  
  return newLeague;
}

export function getLeagues(): League[] {
  return leagues;
}

export function getUserLeagues(userId: string): League[] {
  return leagues.filter(league => 
    league.createdBy === userId || 
    league.players.some(player => player.userId === userId)
  );
}

export function getLeague(leagueId: string): League | null {
  return leagues.find(league => league.id === leagueId) || null;
}

export function joinLeague(leagueId: string, userId: string): boolean {
  const league = getLeague(leagueId);
  const user = users.find(u => u.id === userId);
  
  if (!league || !user || league.players.length >= league.maxPlayers) {
    return false;
  }
  
  // Check if user already in league
  if (league.players.some(player => player.userId === userId)) {
    return false;
  }
  
  // Add player to league
  league.players.push({
    userId,
    username: user.username,
    joinDate: new Date().toISOString().split('T')[0],
    roster: [],
    totalScore: 0,
    rank: league.players.length + 1,
    weeklyScores: []
  });
  
  league.currentPlayers = league.players.length;
  
  // Add league to user
  if (!user.leagues.includes(leagueId)) {
    user.leagues.push(leagueId);
  }
  
  return true;
}

// Mock data for testing
export function initializeMockData(): void {
  // Only initialize if no leagues exist
  if (leagues.length === 0) {
    const mockLeague = createLeague({
      name: 'Friends League 2025',
      createdBy: 'user1',
      season: '2025-Fall',
      status: 'active',
      maxPlayers: 10,
      currentPlayers: 4,
      entryFee: 25,
      prizePool: 250,
      draftDate: '2025-09-01',
      rules: {
        budget: 1000,
        positions: ['Blockbuster', 'Indie', 'Action', 'Drama', 'Horror'],
        scoringPeriod: 'weekend'
      }
    });
    
    // Add some mock players
    joinLeague(mockLeague.id, 'user1');
  }
}