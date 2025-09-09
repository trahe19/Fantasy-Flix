// Fantasy Movie League - Scoring Engine
// Calculates scores based on box office performance, IMDB ratings, budget multipliers, and Oscar points

import { Movie, ScoringRules, RosterSlot, BoxOfficeData, OscarNomination, OscarWin } from './fantasy-league-types'

export interface ScoreCalculation {
  movieId: string
  movieTitle: string
  
  // Base scoring components
  totalBoxOffice: number
  productionBudget: number
  baseScore: number // Box Office - Budget
  
  // Bonus components
  imdbBonus: number
  budgetMultiplier: number
  budgetBonusAmount: number
  oscarPoints: number
  
  // Final score
  totalScore: number
  
  // Metadata
  imdbRating?: number
  oscarNominations: number
  oscarWins: number
  isReleased: boolean
  lastUpdated: string
}

export class FantasyMovieLeagueScoringEngine {
  private scoringRules: ScoringRules

  constructor(scoringRules: ScoringRules) {
    this.scoringRules = scoringRules
  }

  /**
   * Calculate comprehensive score for a single movie
   */
  calculateMovieScore(
    movie: Movie, 
    oscarNominations: OscarNomination[] = [], 
    oscarWins: OscarWin[] = []
  ): ScoreCalculation {
    const totalBoxOffice = this.getTotalBoxOffice(movie.boxOfficeData)
    const productionBudget = movie.productionBudget || 0
    const baseScore = totalBoxOffice - productionBudget
    
    // IMDB Rating Bonus
    const imdbBonus = this.calculateImdbBonus(movie.imdbRating)
    
    // Budget Multiplier Bonus
    const { multiplier, bonusAmount } = this.calculateBudgetMultiplier(productionBudget)
    const budgetBonusAmount = bonusAmount
    
    // Oscar Points
    const movieOscarNoms = oscarNominations.filter(nom => nom.movieId === movie.id)
    const movieOscarWins = oscarWins.filter(win => win.movieId === movie.id)
    const oscarPoints = this.calculateOscarPoints(movieOscarNoms, movieOscarWins)
    
    // Calculate final score
    const totalScore = baseScore + imdbBonus + budgetBonusAmount + oscarPoints
    
    return {
      movieId: movie.id,
      movieTitle: movie.title,
      totalBoxOffice,
      productionBudget,
      baseScore,
      imdbBonus,
      budgetMultiplier: multiplier,
      budgetBonusAmount,
      oscarPoints,
      totalScore,
      imdbRating: movie.imdbRating,
      oscarNominations: movieOscarNoms.length,
      oscarWins: movieOscarWins.length,
      isReleased: this.isMovieReleased(movie),
      lastUpdated: new Date().toISOString()
    }
  }

  /**
   * Calculate roster score for a player
   */
  calculateRosterScore(
    rosterSlots: RosterSlot[], 
    oscarNominations: OscarNomination[] = [], 
    oscarWins: OscarWin[] = [],
    includeReserves: boolean = false
  ): {
    starterScores: ScoreCalculation[]
    reserveScores: ScoreCalculation[]
    totalStarterScore: number
    totalReserveScore: number
    totalRosterScore: number
    moviesReleased: number
    moviesUnreleased: number
  } {
    const starterSlots = rosterSlots.filter(slot => slot.slotType === 'starter')
    const reserveSlots = rosterSlots.filter(slot => slot.slotType === 'reserve')
    
    const starterScores = starterSlots.map(slot => 
      this.calculateMovieScore(slot.movie, oscarNominations, oscarWins)
    )
    
    const reserveScores = reserveSlots.map(slot => 
      this.calculateMovieScore(slot.movie, oscarNominations, oscarWins)
    )
    
    const totalStarterScore = starterScores.reduce((sum, calc) => sum + calc.totalScore, 0)
    const totalReserveScore = reserveScores.reduce((sum, calc) => sum + calc.totalScore, 0)
    const totalRosterScore = includeReserves ? totalStarterScore + totalReserveScore : totalStarterScore
    
    const allScores = [...starterScores, ...reserveScores]
    const moviesReleased = allScores.filter(score => score.isReleased).length
    const moviesUnreleased = allScores.filter(score => !score.isReleased).length
    
    return {
      starterScores,
      reserveScores,
      totalStarterScore,
      totalReserveScore,
      totalRosterScore,
      moviesReleased,
      moviesUnreleased
    }
  }

  /**
   * Calculate period standings for all players
   */
  calculatePeriodStandings(
    playersRosters: Array<{ userId: string, username: string, displayName: string, roster: RosterSlot[] }>,
    period: 1 | 2,
    oscarNominations: OscarNomination[] = [],
    oscarWins: OscarWin[] = []
  ): Array<{
    userId: string
    username: string
    displayName: string
    rank: number
    score: number
    moviesLeft: number
    projectedScore: number
    scoreBreakdown: {
      starterScores: ScoreCalculation[]
      totalStarterScore: number
      moviesReleased: number
      moviesUnreleased: number
    }
  }> {
    const standings = playersRosters.map(player => {
      // Filter roster to only include movies from this period
      const periodRoster = player.roster.filter(slot => slot.period === period)
      const rosterScore = this.calculateRosterScore(periodRoster, oscarNominations, oscarWins, false)
      
      // Simple projection: assume unreleased movies will hit 2.5x their budget
      const projectedAdditionalScore = rosterScore.starterScores
        .filter(score => !score.isReleased)
        .reduce((sum, score) => sum + (score.productionBudget * 1.5), 0) // Conservative projection
      
      return {
        userId: player.userId,
        username: player.username,
        displayName: player.displayName,
        rank: 0, // Will be set after sorting
        score: rosterScore.totalStarterScore,
        moviesLeft: rosterScore.moviesUnreleased,
        projectedScore: rosterScore.totalStarterScore + projectedAdditionalScore,
        scoreBreakdown: {
          starterScores: rosterScore.starterScores,
          totalStarterScore: rosterScore.totalStarterScore,
          moviesReleased: rosterScore.moviesReleased,
          moviesUnreleased: rosterScore.moviesUnreleased
        }
      }
    })

    // Sort by score (descending) and assign ranks
    standings.sort((a, b) => b.score - a.score)
    standings.forEach((standing, index) => {
      standing.rank = index + 1
    })

    return standings
  }

  /**
   * Calculate skip bonus for second draft
   */
  calculateSkipBonus(): number {
    return this.scoringRules.skipBonusAmount
  }

  /**
   * Get total box office from box office data array
   */
  private getTotalBoxOffice(boxOfficeData: BoxOfficeData[]): number {
    if (!boxOfficeData || boxOfficeData.length === 0) return 0
    
    // Get the latest cumulative gross
    const sortedData = boxOfficeData.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    return sortedData[0]?.cumulativeGross || 0
  }

  /**
   * Calculate IMDB rating bonus based on scoring rules
   */
  private calculateImdbBonus(imdbRating?: number): number {
    if (!imdbRating) return 0
    
    if (imdbRating >= 8.5) {
      return this.scoringRules.imdbBonus_85Plus
    } else if (imdbRating >= 8.0) {
      return this.scoringRules.imdbBonus_80to84
    } else if (imdbRating >= 7.5) {
      return this.scoringRules.imdbBonus_75to79
    }
    
    return 0
  }

  /**
   * Calculate budget multiplier and bonus amount
   */
  private calculateBudgetMultiplier(budget: number): { multiplier: number, bonusAmount: number } {
    if (budget < 20) {
      return { 
        multiplier: this.scoringRules.budgetMultiplier_Under20M, 
        bonusAmount: budget * (this.scoringRules.budgetMultiplier_Under20M - 1) 
      }
    } else if (budget < 50) {
      return { 
        multiplier: this.scoringRules.budgetMultiplier_Under50M, 
        bonusAmount: budget * (this.scoringRules.budgetMultiplier_Under50M - 1) 
      }
    }
    
    return { multiplier: 1, bonusAmount: 0 }
  }

  /**
   * Calculate Oscar points
   */
  private calculateOscarPoints(nominations: OscarNomination[], wins: OscarWin[]): number {
    const nominationPoints = nominations.length * this.scoringRules.oscarNominationPoints
    const winPoints = wins.length * this.scoringRules.oscarWinPoints
    return nominationPoints + winPoints
  }

  /**
   * Check if movie has been released
   */
  private isMovieReleased(movie: Movie): boolean {
    return new Date(movie.releaseDate) <= new Date()
  }

  /**
   * Get default scoring rules
   */
  static getDefaultScoringRules(): ScoringRules {
    return {
      imdbBonus_85Plus: 75,
      imdbBonus_80to84: 37.5,
      imdbBonus_75to79: 17.5,
      budgetMultiplier_Under50M: 1.2,
      budgetMultiplier_Under20M: 1.4,
      oscarWinPoints: 5,
      oscarNominationPoints: 2,
      skipBonusAmount: 25
    }
  }
}

/**
 * Utility function to format currency for display
 */
export const formatScore = (score: number): string => {
  const absScore = Math.abs(score)
  const sign = score >= 0 ? '+' : '-'
  
  if (absScore >= 1000) {
    return `${sign}$${(absScore / 1000).toFixed(1)}B`
  } else {
    return `${sign}$${absScore.toFixed(0)}M`
  }
}

/**
 * Utility function to get score color class
 */
export const getScoreColorClass = (score: number): string => {
  if (score >= 500) return 'text-green-400'
  if (score >= 200) return 'text-lime-400'
  if (score >= 0) return 'text-yellow-400'
  if (score >= -100) return 'text-orange-400'
  return 'text-red-400'
}

/**
 * Calculate projected score for unreleased movie
 */
export const calculateProjectedScore = (
  movie: Movie, 
  scoringRules: ScoringRules = FantasyMovieLeagueScoringEngine.getDefaultScoringRules()
): number => {
  if (!movie.productionBudget) return 0
  
  // Conservative projection: 2.5x budget box office
  const projectedBoxOffice = movie.productionBudget * 2.5
  const baseScore = projectedBoxOffice - movie.productionBudget
  
  // Add potential IMDB bonus (use current rating if available)
  let imdbBonus = 0
  if (movie.imdbRating) {
    if (movie.imdbRating >= 8.5) {
      imdbBonus = scoringRules.imdbBonus_85Plus
    } else if (movie.imdbRating >= 8.0) {
      imdbBonus = scoringRules.imdbBonus_80to84
    } else if (movie.imdbRating >= 7.5) {
      imdbBonus = scoringRules.imdbBonus_75to79
    }
  }
  
  // Add budget multiplier bonus
  let budgetBonus = 0
  if (movie.productionBudget < 20) {
    budgetBonus = movie.productionBudget * (scoringRules.budgetMultiplier_Under20M - 1)
  } else if (movie.productionBudget < 50) {
    budgetBonus = movie.productionBudget * (scoringRules.budgetMultiplier_Under50M - 1)
  }
  
  return baseScore + imdbBonus + budgetBonus
}