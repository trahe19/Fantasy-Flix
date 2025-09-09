// Fantasy Movie League - Core Data Structures

export interface Movie {
  id: string
  tmdbId: number
  title: string
  releaseDate: string
  productionBudget?: number // Can be null if not available
  isManualBudget: boolean // True if commissioner set manually
  imdbRating?: number
  imdbId?: string
  boxOfficeData: BoxOfficeData[]
  genres: string[]
  posterUrl?: string
  backdropUrl?: string
  runtime?: number
  director?: string
  cast?: string[]
}

export interface BoxOfficeData {
  date: string
  dailyGross: number
  cumulativeGross: number
  daysSinceRelease: number
  source: 'box-office-mojo' | 'the-numbers' | 'manual'
}

export interface User {
  id: string
  username: string
  email: string
  displayName: string
  avatarUrl?: string
  totalEarnings?: number
  totalLeagues?: number
  championships?: number
  createdAt: string
  updatedAt: string
}

export interface League {
  id: string
  name: string
  createdBy: string // User ID
  commissionerId: string // User ID
  season: string // e.g., "2025-2026"
  status: 'setup' | 'draft' | 'period-1' | 'mid-season' | 'period-2' | 'championship' | 'completed'
  
  // League Configuration
  maxPlayers: number
  currentPlayers: number
  isPublic: boolean
  
  // Draft Configuration
  initialDraftDate?: string // ISO string
  secondDraftDate?: string
  draftOrder: 'random' | 'manual'
  manualDraftOrder?: string[] // User IDs in draft order
  
  // Period Configuration
  period1StartDate: string
  period1EndDate: string
  period2StartDate: string
  period2EndDate: string
  
  // Championship Configuration
  championshipSeats: number // Must be even
  oscarCeremonyDate: string
  
  // Scoring Configuration
  scoringRules: ScoringRules
  
  // League Members
  players: LeaguePlayer[]
  
  createdAt: string
  updatedAt: string
}

export interface ScoringRules {
  // IMDB Rating Bonuses (in millions)
  imdbBonus_85Plus: number // Default: 50-100M
  imdbBonus_80to84: number // Default: 25-50M  
  imdbBonus_75to79: number // Default: 10-25M
  
  // Budget Multipliers
  budgetMultiplier_Under50M: number // Default: adjustable
  budgetMultiplier_Under20M: number // Default: higher than 50M
  
  // Oscar Points
  oscarWinPoints: number // Default: 5
  oscarNominationPoints: number // Default: 2
  
  // Skip Bonus (for second draft)
  skipBonusAmount: number // Default: 25M
}

export interface LeaguePlayer {
  userId: string
  username: string
  displayName: string
  joinDate: string
  role: 'commissioner' | 'player'
  
  // Draft Data
  draftPosition?: number
  
  // Period Scores
  period1Score: number
  period2Score: number
  totalScore: number
  
  // Championship Status
  championshipQualified: boolean
  oscarPoints: number
  
  // Roster Data
  currentRoster: RosterSlot[]
  archivedRoster: RosterSlot[] // Movies from completed periods
}

export interface RosterSlot {
  movieId: string
  movie: Movie
  slotType: 'starter' | 'reserve'
  period: 1 | 2
  isLocked: boolean // True after movie releases
  addedDate: string
  draftedRound?: number // Null if picked up from waivers
  
  // Calculated scores for this slot
  baseScore?: number // Box office - budget
  bonusScore?: number // IMDB + multiplier bonuses
  totalScore?: number
}

export interface DraftRoom {
  leagueId: string
  draftType: 'initial' | 'second'
  status: 'waiting' | 'active' | 'completed'
  currentPick: number
  currentPlayer?: string // User ID
  timePerPick: number // seconds
  currentPickStartTime?: string
  
  // Draft Results
  picks: DraftPick[]
  
  // Draft Order
  draftOrder: string[] // User IDs
  
  // Available Movies
  availableMovies: Movie[]
  
  createdAt: string
  startedAt?: string
  completedAt?: string
}

export interface DraftPick {
  pickNumber: number
  round: number
  userId: string
  username: string
  movieId?: string // Null if skipped
  movie?: Movie
  isSkip: boolean
  skipBonus?: number // 25M for second draft skips
  timestamp: string
  timeUsed: number // seconds
}

export interface Trade {
  id: string
  leagueId: string
  proposedBy: string // User ID
  proposedTo: string // User ID
  
  status: 'proposed' | 'accepted' | 'rejected' | 'commissioner-review'
  
  // Trade Components
  proposerGives: TradeComponent[]
  proposerReceives: TradeComponent[]
  
  // Approval Process
  proposedAt: string
  respondedAt?: string
  commissionerApprovedAt?: string
  commissionerNotes?: string
  
  expiresAt: string
}

export interface TradeComponent {
  type: 'movie' | 'draft-pick'
  movieId?: string
  draftRound?: number // For future draft picks
  draftType?: 'second' // Only second draft picks can be traded
}

export interface WaiverClaim {
  id: string
  leagueId: string
  userId: string
  movieId: string
  period: 1 | 2
  claimTime: string
  processed: boolean
  successful?: boolean
  failureReason?: string
}

export interface LeagueActivity {
  id: string
  leagueId: string
  type: 'draft-pick' | 'waiver-claim' | 'trade' | 'score-update' | 'roster-move'
  userId?: string
  description: string
  metadata?: Record<string, any>
  timestamp: string
}

// Utility types for API responses
export interface LeagueStandings {
  leagueId: string
  period: 1 | 2 | 'overall' | 'championship'
  standings: PlayerStanding[]
  lastUpdated: string
}

export interface PlayerStanding {
  userId: string
  username: string
  displayName: string
  rank: number
  score: number
  moviesLeft?: number // For period standings - movies not yet released
  projectedScore?: number
}

export interface PeriodSummary {
  leagueId: string
  period: 1 | 2
  winner?: string // User ID
  winnerScore: number
  topMovies: Array<{
    movieId: string
    title: string
    owner: string
    score: number
  }>
  isComplete: boolean
  endDate: string
}

export interface ChampionshipData {
  leagueId: string
  qualifiedPlayers: string[] // User IDs
  oscarNominations: OscarNomination[]
  oscarWins: OscarWin[]
  finalStandings?: PlayerStanding[]
  winner?: string // User ID
  isComplete: boolean
}

export interface OscarNomination {
  movieId: string
  category: string
  year: number
  isWin: boolean
}

export interface OscarWin {
  movieId: string
  category: string
  year: number
}