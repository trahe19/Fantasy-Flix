import { tmdbFetch, getImageUrl } from './tmdb'
import { getComprehensiveMoviePool, UpcomingMovie } from './upcoming-movies'
import { getAvailableMovies, draftMovie } from './drafted-movies'

export interface ProjectionConfidence {
  level: 'high' | 'medium' | 'low'
  color: string
  percentage: number
  factors: string[]
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high'
  factors: {
    competition: 'low' | 'medium' | 'high'
    budget: 'low' | 'medium' | 'high'
    timing: 'low' | 'medium' | 'high'
    cast: 'low' | 'medium' | 'high'
  }
  notes: string[]
}

export interface OscarPotential {
  score: number // 0-100
  categories: string[]
  likelihood: 'low' | 'medium' | 'high'
  factors: string[]
}

export interface FranchiseStrength {
  score: number // 0-100
  isSequel: boolean
  franchiseName?: string
  previousSuccess: boolean
  brandRecognition: 'low' | 'medium' | 'high'
}

export interface ScoutingReport {
  summary: string
  strengths: string[]
  concerns: string[]
  comparisons: string[]
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid'
}

export interface DraftMovie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  genre_ids: number[]
  vote_average: number
  vote_count: number
  popularity: number

  // Financial Projections
  estimated_budget: number
  production_budget?: number
  domestic_projection: number
  worldwide_projection: number
  profit_projection: number
  opening_weekend_projection: number

  // Movie Details
  main_cast: string[]
  director: string | null
  production_companies: string[]
  runtime?: number

  // Draft-Specific Data
  draftRank: number
  isDrafted: boolean
  draftedBy?: string
  draftPosition?: number

  // Enhanced Analysis
  projection_confidence: ProjectionConfidence
  risk_assessment: RiskAssessment
  oscar_potential: OscarPotential
  franchise_strength: FranchiseStrength
  scouting_report: ScoutingReport
}

export interface DraftPick {
  id: string
  movieId: number
  playerId: string
  playerName: string
  round: number
  pick: number
  overallPick: number
  timestamp: Date
  timeRemaining?: number
}

export interface DraftPlayer {
  id: string
  name: string
  avatar?: string
  isReady: boolean
}

export interface DraftSettings {
  pickTimeLimit: number // seconds
  pauseBetweenPicks: number // seconds
  autoStart: boolean
  allowCommissioner: boolean
}

// Get draft-ready movies from comprehensive pool (synced with vault)
export async function getDraftEligibleMovies(leagueId: string = 'sample-league'): Promise<DraftMovie[]> {
  try {
    console.log('Getting draft eligible movies from comprehensive pool...')
    
    // Get the comprehensive movie pool (same as vault)
    const comprehensiveMovies = await getComprehensiveMoviePool()
    console.log(`Got ${comprehensiveMovies.length} movies from comprehensive pool`)
    
    // Filter to only available (non-drafted) movies
    const availableMovies = getAvailableMovies(comprehensiveMovies, leagueId)
    console.log(`${availableMovies.length} movies available for draft`)
    
    // Convert UpcomingMovie to DraftMovie format
    const draftMovies: DraftMovie[] = availableMovies.map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      release_date: movie.release_date,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      genre_ids: movie.genre_ids || [],
      vote_average: movie.vote_average || 6.0,
      vote_count: movie.vote_count || 0,
      popularity: movie.popularity,
      estimated_budget: movie.estimated_budget || 50000000,
      production_budget: movie.production_budget,
      domestic_projection: movie.domestic_total_projection || movie.estimated_budget * 2,
      worldwide_projection: movie.worldwide_projection || movie.estimated_budget * 3,
      profit_projection: movie.profit_projection || movie.estimated_budget,
      opening_weekend_projection: movie.opening_weekend_projection || movie.estimated_budget * 0.3,
      main_cast: movie.main_cast || [],
      director: movie.director || null,
      production_companies: movie.production_companies?.map(c => c.name) || [],
      runtime: undefined,
      draftRank: index + 1,
      isDrafted: false,
      projection_confidence: createProjectionConfidenceFromUpcoming(movie),
      risk_assessment: createRiskAssessmentFromUpcoming(movie),
      oscar_potential: createOscarPotentialFromUpcoming(movie),
      franchise_strength: createFranchiseStrengthFromUpcoming(movie),
      scouting_report: createScoutingReportFromUpcoming(movie)
    }))
    
    // Sort by draft potential/value and return ALL movies (no artificial limits)
    const sortedMovies = draftMovies.sort((a, b) => {
      const aScore = (a.domestic_projection * 0.4) + 
                     (a.oscar_potential.score * 1000000 * 0.25) +
                     (a.franchise_strength.score * 1000000 * 0.2) +
                     (a.projection_confidence.percentage * 1000000 * 0.15)
      
      const bScore = (b.domestic_projection * 0.4) + 
                     (b.oscar_potential.score * 1000000 * 0.25) +
                     (b.franchise_strength.score * 1000000 * 0.2) +
                     (b.projection_confidence.percentage * 1000000 * 0.15)
      
      return bScore - aScore
    })
    
    console.log(`Returning ${sortedMovies.length} draft eligible movies (no limits applied)`)
    return sortedMovies
    
  } catch (error) {
    console.error('Error getting draft eligible movies:', error)
    return getFallbackDraftMovies()
  }
}

// Fallback draft movies if API fails
function getFallbackDraftMovies(): DraftMovie[] {
  return [] // Return empty array - could add hardcoded movies here
}

// Convert UpcomingMovie data to DraftMovie interfaces
function createProjectionConfidenceFromUpcoming(movie: UpcomingMovie): ProjectionConfidence {
  const baseConfidence = movie.popularity > 50 ? 70 : movie.popularity > 20 ? 55 : 40
  
  return {
    level: baseConfidence >= 70 ? 'high' : baseConfidence >= 50 ? 'medium' : 'low',
    color: baseConfidence >= 70 ? '#22c55e' : baseConfidence >= 50 ? '#f59e0b' : '#ef4444',
    percentage: baseConfidence,
    factors: ['Derived from comprehensive movie analysis']
  }
}

function createRiskAssessmentFromUpcoming(movie: UpcomingMovie): RiskAssessment {
  const budget = movie.estimated_budget || 50000000
  const releaseMonth = new Date(movie.release_date).getMonth() + 1
  
  return {
    overall: budget > 150000000 ? 'high' : budget > 100000000 ? 'medium' : 'low',
    factors: {
      competition: releaseMonth === 12 ? 'high' : releaseMonth === 6 || releaseMonth === 7 ? 'medium' : 'low',
      budget: budget > 200000000 ? 'high' : budget > 100000000 ? 'medium' : 'low',
      timing: releaseMonth === 1 ? 'high' : 'low',
      cast: (movie.main_cast?.length || 0) < 2 ? 'high' : 'low'
    },
    notes: ['Risk assessment based on comprehensive analysis']
  }
}

function createOscarPotentialFromUpcoming(movie: UpcomingMovie): OscarPotential {
  const oscarPred = movie.oscar_predictions
  
  return {
    score: oscarPred?.overall_potential || 20,
    categories: oscarPred?.categories || [],
    likelihood: oscarPred?.overall_potential > 60 ? 'high' : oscarPred?.overall_potential > 30 ? 'medium' : 'low',
    factors: ['Based on genre, cast, director, and release timing']
  }
}

function createFranchiseStrengthFromUpcoming(movie: UpcomingMovie): FranchiseStrength {
  const title = movie.title.toLowerCase()
  const isSequel = /\b(2|ii|part|chapter|returns|rises)\b/.test(title)
  
  return {
    score: isSequel ? 75 : movie.popularity > 50 ? 60 : 40,
    isSequel,
    franchiseName: isSequel ? 'Sequel/Franchise' : undefined,
    previousSuccess: isSequel,
    brandRecognition: movie.popularity > 50 ? 'high' : movie.popularity > 20 ? 'medium' : 'low'
  }
}

function createScoutingReportFromUpcoming(movie: UpcomingMovie): ScoutingReport {
  const domesticProj = movie.domestic_total_projection || movie.estimated_budget * 2
  
  return {
    summary: `${movie.title} projects $${Math.round(domesticProj / 1000000)}M domestic with strong franchise appeal.`,
    strengths: [`$${Math.round(domesticProj / 1000000)}M domestic projection`, 'Strong cast lineup'],
    concerns: ['Market competition', 'Budget requirements'],
    comparisons: ['Similar genre blockbusters'],
    recommendation: domesticProj > 300000000 ? 'strong_buy' : domesticProj > 200000000 ? 'buy' : 'hold'
  }
}

// Original function preserved for backwards compatibility
export async function getDraftEligibleMoviesOriginal(): Promise<DraftMovie[]> {
  try {
    const startDate = new Date('2025-10-01')
    const endDate = new Date('2026-01-15')

    // Fetch upcoming movies from multiple pages to get comprehensive list
    const moviePromises = []
    for (let page = 1; page <= 15; page++) {
      moviePromises.push(tmdbFetch(`/movie/upcoming?page=${page}&region=US`))
    }

    const responses = await Promise.all(moviePromises)
    let allMovies: any[] = []

    responses.forEach(response => {
      if (response?.results) {
        allMovies = allMovies.concat(response.results)
      }
    })

    // Filter movies for the draft window
    const eligibleMovies = allMovies
      .filter(movie => {
        const releaseDate = new Date(movie.release_date)
        return releaseDate >= startDate &&
               releaseDate <= endDate &&
               movie.poster_path && // Must have poster
               movie.popularity > 10 // Basic threshold
      })

    // Enhance movies with detailed data and comprehensive analysis
    const enhancedMoviesPromises = eligibleMovies.map(async (movie) => {
      try {
        // Get detailed movie info
        const [details, credits] = await Promise.all([
          tmdbFetch(`/movie/${movie.id}`),
          tmdbFetch(`/movie/${movie.id}/credits`)
        ])

        // Get main cast and director
        const mainCast = credits.cast?.slice(0, 8).map((c: any) => c.name) || []
        const director = credits.crew?.find((c: any) => c.job === 'Director')?.name || null

        // Enhanced budget estimation
        const estimatedBudget = details.budget || estimateBudgetFromFactors(movie, mainCast, director)

        // Calculate comprehensive projections
        const projections = calculateComprehensiveProjections(movie, details, mainCast, director, estimatedBudget)

        // Analyze franchise strength
        const franchiseStrength = analyzeFranchiseStrength(movie, details)

        // Calculate Oscar potential
        const oscarPotential = calculateOscarPotential(movie, details, mainCast, director)

        // Assess projection confidence
        const projectionConfidence = assessProjectionConfidence(movie, details, mainCast, director, estimatedBudget)

        // Create risk assessment
        const riskAssessment = createRiskAssessment(movie, details, projections, estimatedBudget)

        // Generate scouting report
        const scoutingReport = generateScoutingReport(movie, details, projections, franchiseStrength, oscarPotential, riskAssessment)

        const draftMovie: DraftMovie = {
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          genre_ids: movie.genre_ids || [],
          vote_average: movie.vote_average || 6.0,
          vote_count: movie.vote_count || 0,
          popularity: movie.popularity,
          estimated_budget: estimatedBudget,
          production_budget: details.budget,
          domestic_projection: projections.domestic,
          worldwide_projection: projections.worldwide,
          profit_projection: projections.profit,
          opening_weekend_projection: projections.openingWeekend,
          main_cast: mainCast,
          director,
          production_companies: details.production_companies?.map((c: any) => c.name) || [],
          runtime: details.runtime,
          draftRank: 0, // Will be set after sorting
          isDrafted: false,
          projection_confidence: projectionConfidence,
          risk_assessment: riskAssessment,
          oscar_potential: oscarPotential,
          franchise_strength: franchiseStrength,
          scouting_report: scoutingReport
        }

        return draftMovie
      } catch (error) {
        console.error(`Error enhancing movie ${movie.id}:`, error)
        return null
      }
    })

    const enhancedMovies = (await Promise.all(enhancedMoviesPromises))
      .filter(movie => movie !== null) as DraftMovie[]

    // Sort by comprehensive scoring system
    const sortedMovies = enhancedMovies
      .sort((a, b) => {
        // Weighted scoring: 40% domestic projection, 25% Oscar potential, 20% franchise strength, 15% confidence
        const aScore = (a.domestic_projection * 0.4) +
                       (a.oscar_potential.score * 1000000 * 0.25) +
                       (a.franchise_strength.score * 1000000 * 0.2) +
                       (a.projection_confidence.percentage * 1000000 * 0.15)

        const bScore = (b.domestic_projection * 0.4) +
                       (b.oscar_potential.score * 1000000 * 0.25) +
                       (b.franchise_strength.score * 1000000 * 0.2) +
                       (b.projection_confidence.percentage * 1000000 * 0.15)

        return bScore - aScore
      })
      // Return ALL movies, no artificial limit
      .map((movie, index) => ({
        ...movie,
        draftRank: index + 1
      }))

    return sortedMovies

  } catch (error) {
    console.error('Error fetching draft eligible movies:', error)
    return []
  }
}

// Enhanced budget estimation based on multiple factors
function estimateBudgetFromFactors(movie: any, cast: string[], director: string | null): number {
  let baseBudget = 50000000 // $50M baseline

  // Genre-based adjustments
  const genreMap: { [key: number]: number } = {
    878: 1.8, // Science Fiction
    28: 1.5,  // Action
    12: 1.4,  // Adventure
    14: 1.6,  // Fantasy
    16: 1.2,  // Animation
    18: 0.8,  // Drama
    35: 0.9,  // Comedy
    27: 0.7,  // Horror
    53: 1.0,  // Thriller
    10749: 0.8, // Romance
  }

  if (movie.genre_ids) {
    const avgMultiplier = movie.genre_ids.reduce((sum: number, genreId: number) => {
      return sum + (genreMap[genreId] || 1.0)
    }, 0) / movie.genre_ids.length
    baseBudget *= avgMultiplier
  }

  // A-list cast multiplier
  const aListActors = [
    'Tom Cruise', 'Dwayne Johnson', 'Ryan Reynolds', 'Chris Hemsworth', 'Robert Downey Jr.',
    'Scarlett Johansson', 'Will Smith', 'Leonardo DiCaprio', 'Brad Pitt', 'Tom Hanks',
    'Margot Robbie', 'Ryan Gosling', 'Emma Stone', 'Jennifer Lawrence', 'Chris Evans',
    'Mark Wahlberg', 'Vin Diesel', 'Jason Statham', 'Kevin Hart', 'The Rock'
  ]

  const aListCount = cast.filter(actor => aListActors.includes(actor)).length
  if (aListCount > 0) {
    baseBudget *= (1 + (aListCount * 0.3)) // 30% increase per A-lister
  }

  // Director multiplier
  const topDirectors = [
    'Christopher Nolan', 'James Cameron', 'Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino',
    'Denis Villeneuve', 'Ryan Coogler', 'Taika Waititi', 'Greta Gerwig', 'Jordan Peele',
    'Rian Johnson', 'Matt Reeves', 'James Gunn', 'Jon Favreau', 'Joss Whedon'
  ]

  if (director && topDirectors.includes(director)) {
    baseBudget *= 1.4 // 40% increase for top directors
  }

  // Popularity multiplier
  if (movie.popularity > 100) baseBudget *= 1.5
  else if (movie.popularity > 50) baseBudget *= 1.3
  else if (movie.popularity > 30) baseBudget *= 1.1

  return Math.min(baseBudget, 400000000) // Cap at $400M
}

// Calculate comprehensive box office projections
function calculateComprehensiveProjections(movie: any, details: any, cast: string[], director: string | null, budget: number) {
  // Base domestic projection using budget multipliers
  let domesticProjection = budget * 1.5 // Conservative 1.5x budget baseline

  // Genre performance multipliers for domestic box office
  const domesticGenreMultipliers: { [key: number]: number } = {
    28: 2.8,   // Action - strong domestic performance
    12: 2.5,   // Adventure
    878: 2.3,  // Science Fiction
    14: 2.2,   // Fantasy
    35: 2.0,   // Comedy - solid domestic
    16: 2.4,   // Animation - family appeal
    53: 1.8,   // Thriller
    27: 1.6,   // Horror - lower budget, good returns
    18: 1.2,   // Drama - awards potential
    10749: 1.4, // Romance
  }

  if (movie.genre_ids && movie.genre_ids.length > 0) {
    const genreMultiplier = movie.genre_ids.reduce((sum: number, genreId: number) => {
      return sum + (domesticGenreMultipliers[genreId] || 1.5)
    }, 0) / movie.genre_ids.length
    domesticProjection = budget * genreMultiplier
  }

  // Star power adjustment for domestic appeal
  const domesticStars = [
    'Tom Cruise', 'Dwayne Johnson', 'Ryan Reynolds', 'Will Smith', 'Kevin Hart',
    'Leonardo DiCaprio', 'Tom Hanks', 'Denzel Washington', 'Mark Wahlberg',
    'Chris Evans', 'Scarlett Johansson', 'Jennifer Lawrence', 'Emma Stone'
  ]

  const domesticStarCount = cast.filter(actor => domesticStars.includes(actor)).length
  if (domesticStarCount > 0) {
    domesticProjection *= (1 + (domesticStarCount * 0.25))
  }

  // Release timing adjustment
  const releaseDate = new Date(movie.release_date)
  const month = releaseDate.getMonth() + 1

  // Holiday/Summer multipliers
  if (month === 12 || month === 11) { // November/December - holiday season
    domesticProjection *= 1.4
  } else if (month === 6 || month === 7) { // June/July - summer
    domesticProjection *= 1.3
  } else if (month === 1) { // January - dump month
    domesticProjection *= 0.7
  } else if (month === 10) { // October - good for horror/thriller
    if (movie.genre_ids?.includes(27)) domesticProjection *= 1.2
  }

  // Calculate worldwide (typically 2.5-3x domestic for blockbusters)
  const worldwideMultiplier = movie.genre_ids?.some((id: number) => [28, 878, 14, 12].includes(id)) ? 2.8 : 2.2
  const worldwideProjection = domesticProjection * worldwideMultiplier

  // Opening weekend (typically 25-35% of domestic total)
  const openingWeekendProjection = domesticProjection * 0.3

  // Profit calculation
  const marketingCost = budget * 0.5 // Assume 50% of budget for marketing
  const totalCost = budget + marketingCost
  const profit = worldwideProjection - totalCost

  return {
    domestic: Math.round(domesticProjection),
    worldwide: Math.round(worldwideProjection),
    openingWeekend: Math.round(openingWeekendProjection),
    profit: Math.round(profit)
  }
}

// Analyze franchise strength and brand recognition
function analyzeFranchiseStrength(movie: any, details: any): FranchiseStrength {
  const title = movie.title.toLowerCase()

  // Check for sequel indicators
  const sequelIndicators = ['2', '3', '4', '5', 'ii', 'iii', 'iv', 'v', 'part', 'chapter', 'returns', 'rises', 'forever']
  const isSequel = sequelIndicators.some(indicator => title.includes(indicator))

  // Major franchises and their strength
  const franchises = {
    'avatar': { name: 'Avatar', score: 95, recognition: 'high' as const },
    'star wars': { name: 'Star Wars', score: 98, recognition: 'high' as const },
    'marvel': { name: 'Marvel', score: 92, recognition: 'high' as const },
    'dc': { name: 'DC', score: 85, recognition: 'high' as const },
    'batman': { name: 'Batman', score: 90, recognition: 'high' as const },
    'superman': { name: 'Superman', score: 88, recognition: 'high' as const },
    'fast': { name: 'Fast & Furious', score: 82, recognition: 'high' as const },
    'mission impossible': { name: 'Mission Impossible', score: 85, recognition: 'high' as const },
    'jurassic': { name: 'Jurassic', score: 80, recognition: 'high' as const },
    'transformers': { name: 'Transformers', score: 75, recognition: 'medium' as const },
    'disney': { name: 'Disney', score: 88, recognition: 'high' as const },
    'pixar': { name: 'Pixar', score: 85, recognition: 'high' as const },
  }

  let franchiseData = null
  for (const [key, data] of Object.entries(franchises)) {
    if (title.includes(key) || movie.overview?.toLowerCase().includes(key)) {
      franchiseData = data
      break
    }
  }

  // Check production companies for franchise indicators
  const companies = details.production_companies?.map((c: any) => c.name.toLowerCase()) || []
  if (!franchiseData) {
    if (companies.some((c: string) => c.includes('marvel') || c.includes('disney'))) {
      franchiseData = franchises['marvel']
    } else if (companies.some((c: string) => c.includes('warner') && (title.includes('dc') || title.includes('batman')))) {
      franchiseData = franchises['dc']
    }
  }

  if (franchiseData) {
    return {
      score: franchiseData.score,
      isSequel,
      franchiseName: franchiseData.name,
      previousSuccess: true,
      brandRecognition: franchiseData.recognition
    }
  }

  // Non-franchise scoring
  let score = 40 // Base score for non-franchise
  if (isSequel) score += 20 // Sequel bonus even if not major franchise
  if (movie.popularity > 50) score += 15 // High popularity
  if (movie.vote_count > 1000) score += 10 // Established property

  return {
    score: Math.min(score, 100),
    isSequel,
    franchiseName: undefined,
    previousSuccess: false,
    brandRecognition: movie.popularity > 50 ? 'medium' : 'low'
  }
}

// Calculate Oscar potential based on multiple factors
function calculateOscarPotential(movie: any, details: any, cast: string[], director: string | null): OscarPotential {
  let score = 0
  const categories: string[] = []
  const factors: string[] = []

  // Genre analysis for Oscar potential
  const genreScores: { [key: number]: number } = {
    18: 40,    // Drama - highest Oscar potential
    36: 25,    // History
    10752: 30, // War
    80: 20,    // Crime
    9648: 15,  // Mystery
    53: 10,    // Thriller
    10749: 15, // Romance
    35: 8,     // Comedy (rare but possible)
    14: 5,     // Fantasy (technical awards)
    878: 5,    // Science Fiction (technical awards)
    28: 3,     // Action (technical awards)
    27: 2,     // Horror (very rare)
  }

  if (movie.genre_ids) {
    const genreScore = Math.max(...movie.genre_ids.map((id: number) => genreScores[id] || 0))
    score += genreScore

    if (movie.genre_ids.includes(18)) {
      categories.push('Best Picture', 'Best Director', 'Best Actor', 'Best Actress')
      factors.push('Drama genre historically strong in major categories')
    }
    if (movie.genre_ids.some((id: number) => [878, 14, 28].includes(id))) {
      categories.push('Visual Effects', 'Sound', 'Cinematography')
      factors.push('Genre suitable for technical awards')
    }
  }

  // Director Oscar history
  const oscarDirectors = [
    'Christopher Nolan', 'Martin Scorsese', 'Steven Spielberg', 'Quentin Tarantino',
    'Denis Villeneuve', 'Greta Gerwig', 'Jordan Peele', 'Chloé Zhao', 'Bong Joon-ho',
    'Damien Chazelle', 'Alejandro G. Iñárritu', 'Alfonso Cuarón'
  ]

  if (director && oscarDirectors.includes(director)) {
    score += 25
    factors.push(`${director} has Oscar pedigree`)
    if (!categories.includes('Best Director')) categories.push('Best Director')
  }

  // Cast Oscar potential
  const oscarActors = [
    'Leonardo DiCaprio', 'Brad Pitt', 'Joaquin Phoenix', 'Adam Driver', 'Oscar Isaac',
    'Frances McDormand', 'Saoirse Ronan', 'Margot Robbie', 'Emma Stone', 'Natalie Portman',
    'Denzel Washington', 'Gary Oldman', 'Christian Bale', 'Amy Adams', 'Meryl Streep'
  ]

  const oscarCastCount = cast.filter(actor => oscarActors.includes(actor)).length
  if (oscarCastCount > 0) {
    score += oscarCastCount * 15
    factors.push(`${oscarCastCount} Oscar-caliber performer(s) in cast`)
    if (!categories.includes('Best Actor')) categories.push('Best Actor')
    if (!categories.includes('Best Actress')) categories.push('Best Actress')
  }

  // Release timing (awards season)
  const releaseDate = new Date(movie.release_date)
  const month = releaseDate.getMonth() + 1

  if (month >= 10 && month <= 12) { // October-December
    score += 20
    factors.push('Released during awards season')
  } else if (month >= 8 && month <= 9) { // August-September (festival season)
    score += 15
    factors.push('Released during festival season')
  } else if (month >= 1 && month <= 3) { // Early year
    score += 10
    factors.push('Early year release for long campaign')
  }

  // Studio prestige
  const prestigeStudios = [
    'A24', 'Fox Searchlight', 'Sony Pictures Classics', 'Focus Features',
    'Neon', 'Amazon Studios', 'Netflix', 'Apple Studios', 'Paramount Pictures'
  ]

  const companies = details.production_companies?.map((c: any) => c.name) || []
  if (companies.some((company: string) => prestigeStudios.some(studio => company.includes(studio)))) {
    score += 10
    factors.push('Prestige studio backing')
  }

  // Runtime consideration (Oscar films tend to be longer)
  if (details.runtime && details.runtime > 120) {
    score += 5
    factors.push('Substantial runtime suggests serious dramatic intent')
  }

  // Calculate likelihood
  let likelihood: 'low' | 'medium' | 'high' = 'low'
  if (score >= 60) likelihood = 'high'
  else if (score >= 30) likelihood = 'medium'

  return {
    score: Math.min(score, 100),
    categories: categories.slice(0, 6), // Limit to top 6 categories
    likelihood,
    factors: factors.slice(0, 5) // Limit to top 5 factors
  }
}

// Assess projection confidence based on available data
function assessProjectionConfidence(movie: any, details: any, cast: string[], director: string | null, budget: number): ProjectionConfidence {
  let confidence = 50 // Base confidence
  const factors: string[] = []

  // Director track record
  const provenDirectors = [
    'Christopher Nolan', 'James Cameron', 'Steven Spielberg', 'Ryan Coogler',
    'Denis Villeneuve', 'Taika Waititi', 'James Gunn', 'Jon Favreau'
  ]

  if (director && provenDirectors.includes(director)) {
    confidence += 20
    factors.push('Proven director with commercial track record')
  }

  // Star power reliability
  const bankableStars = [
    'Tom Cruise', 'Dwayne Johnson', 'Ryan Reynolds', 'Will Smith',
    'Leonardo DiCaprio', 'Tom Hanks', 'Denzel Washington'
  ]

  const bankableCount = cast.filter(actor => bankableStars.includes(actor)).length
  if (bankableCount > 0) {
    confidence += bankableCount * 15
    factors.push(`${bankableCount} bankable star(s) attached`)
  }

  // Franchise reliability
  if (movie.title.toLowerCase().includes('avatar') ||
      movie.title.toLowerCase().includes('star wars') ||
      movie.title.toLowerCase().includes('marvel')) {
    confidence += 25
    factors.push('Established franchise with proven audience')
  }

  // Budget confidence (higher budget = more marketing, but also more risk)
  if (budget > 150000000) {
    confidence += 10
    factors.push('High budget suggests studio confidence')
  } else if (budget < 50000000) {
    confidence -= 10
    factors.push('Lower budget increases profit potential but limits reach')
  }

  // Release slot confidence
  const releaseDate = new Date(movie.release_date)
  const month = releaseDate.getMonth() + 1

  if (month === 12 || month === 11) {
    confidence += 15
    factors.push('Premium holiday release slot')
  } else if (month === 6 || month === 7) {
    confidence += 10
    factors.push('Summer blockbuster slot')
  } else if (month === 1) {
    confidence -= 15
    factors.push('January release historically challenging')
  }

  // Genre predictability
  if (movie.genre_ids?.includes(28) || movie.genre_ids?.includes(878)) { // Action/Sci-Fi
    confidence += 5
    factors.push('Genre with predictable audience appeal')
  }

  // Data availability
  if (details.budget && details.budget > 0) {
    confidence += 10
    factors.push('Official budget information available')
  }

  if (movie.vote_count > 100) {
    confidence += 5
    factors.push('Strong early audience interest metrics')
  }

  // Cap confidence
  confidence = Math.max(20, Math.min(95, confidence))

  let level: 'high' | 'medium' | 'low' = 'low'
  let color = '#ef4444' // red

  if (confidence >= 70) {
    level = 'high'
    color = '#22c55e' // green
  } else if (confidence >= 50) {
    level = 'medium'
    color = '#f59e0b' // amber
  }

  return {
    level,
    color,
    percentage: confidence,
    factors: factors.slice(0, 4)
  }
}

// Create comprehensive risk assessment
function createRiskAssessment(movie: any, details: any, projections: any, budget: number): RiskAssessment {
  const factors = {
    competition: 'low' as 'low' | 'medium' | 'high',
    budget: 'low' as 'low' | 'medium' | 'high',
    timing: 'low' as 'low' | 'medium' | 'high',
    cast: 'low' as 'low' | 'medium' | 'high'
  }

  const notes: string[] = []

  // Budget risk assessment
  if (budget > 200000000) {
    factors.budget = 'high'
    notes.push('High budget requires massive audience to break even')
  } else if (budget > 100000000) {
    factors.budget = 'medium'
    notes.push('Moderate budget with manageable risk profile')
  } else {
    factors.budget = 'low'
    notes.push('Lower budget allows for higher profit margins')
  }

  // Competition risk (timing-based)
  const releaseDate = new Date(movie.release_date)
  const month = releaseDate.getMonth() + 1

  if (month === 12) {
    factors.competition = 'high'
    notes.push('December releases face heavy holiday competition')
  } else if (month === 6 || month === 7) {
    factors.competition = 'medium'
    notes.push('Summer season competitive but high-reward')
  } else if (month === 1) {
    factors.timing = 'high'
    notes.push('January historically weak for box office performance')
  }

  // Cast risk
  const unprovenCast = movie.main_cast?.length < 2
  if (unprovenCast) {
    factors.cast = 'high'
    notes.push('Limited star power may affect marketing appeal')
  } else {
    factors.cast = 'low'
    notes.push('Strong cast provides marketing leverage')
  }

  // Overall risk calculation
  const riskScores = {
    low: 1,
    medium: 2,
    high: 3
  }

  const avgRisk = (riskScores[factors.competition] + riskScores[factors.budget] +
                   riskScores[factors.timing] + riskScores[factors.cast]) / 4

  let overall: 'low' | 'medium' | 'high' = 'low'
  if (avgRisk > 2.5) overall = 'high'
  else if (avgRisk > 1.5) overall = 'medium'

  return {
    overall,
    factors,
    notes: notes.slice(0, 3)
  }
}

// Generate comprehensive scouting report
function generateScoutingReport(movie: any, details: any, projections: any, franchise: FranchiseStrength, oscar: OscarPotential, risk: RiskAssessment): ScoutingReport {
  const strengths: string[] = []
  const concerns: string[] = []
  const comparisons: string[] = []

  // Analyze strengths
  if (projections.domestic > 300000000) {
    strengths.push('Projected for $300M+ domestic performance')
  } else if (projections.domestic > 200000000) {
    strengths.push('Solid $200M+ domestic projection')
  }

  if (franchise.score > 80) {
    strengths.push(`Strong franchise appeal (${franchise.franchiseName})`)
  }

  if (oscar.likelihood === 'high') {
    strengths.push('High awards season potential')
  }

  if (risk.overall === 'low') {
    strengths.push('Low-risk investment profile')
  }

  // Analyze concerns
  if (risk.factors.budget === 'high') {
    concerns.push('High budget increases break-even requirements')
  }

  if (risk.factors.competition === 'high') {
    concerns.push('Challenging release window with heavy competition')
  }

  if (oscar.likelihood === 'low' && !franchise.isSequel) {
    concerns.push('Limited awards appeal and no franchise support')
  }

  if (projections.domestic < 150000000) {
    concerns.push('Modest domestic projection may limit upside')
  }

  // Generate comparisons based on genre and scope
  if (movie.genre_ids?.includes(878)) { // Sci-Fi
    if (projections.domestic > 400000000) {
      comparisons.push('Avatar-level blockbuster potential')
    } else if (projections.domestic > 250000000) {
      comparisons.push('Dune/Blade Runner 2049 caliber sci-fi')
    }
  }

  if (movie.genre_ids?.includes(28)) { // Action
    if (projections.domestic > 300000000) {
      comparisons.push('Top Gun: Maverick level success potential')
    } else {
      comparisons.push('John Wick franchise trajectory')
    }
  }

  if (movie.genre_ids?.includes(18) && oscar.likelihood === 'high') { // Drama
    comparisons.push('Everything Everywhere All at Once awards potential')
  }

  // Determine recommendation
  let recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid' = 'hold'

  const score = (projections.domestic / 1000000) + (franchise.score * 2) + (oscar.score * 1.5)

  if (score > 600 && risk.overall !== 'high') {
    recommendation = 'strong_buy'
  } else if (score > 400 && risk.overall === 'low') {
    recommendation = 'buy'
  } else if (score < 200 || risk.overall === 'high') {
    recommendation = 'avoid'
  }

  // Generate summary
  const summary = `${movie.title} projects $${Math.round(projections.domestic / 1000000)}M domestic with ${risk.overall} risk profile. ${franchise.score > 70 ? 'Strong franchise appeal' : 'Original property'} ${oscar.likelihood === 'high' ? 'with awards potential' : 'targeting commercial success'}.`

  return {
    summary,
    strengths: strengths.slice(0, 4),
    concerns: concerns.slice(0, 3),
    comparisons: comparisons.slice(0, 2),
    recommendation
  }
}

// Generate snake draft order for 4 players
export function generateSnakeDraftOrder(players: DraftPlayer[], totalRounds: number = 8): number[][] {
  const draftOrder: number[][] = []

  for (let round = 1; round <= totalRounds; round++) {
    if (round % 2 === 1) {
      // Odd rounds: normal order (1, 2, 3, 4)
      draftOrder.push([0, 1, 2, 3])
    } else {
      // Even rounds: reverse order (4, 3, 2, 1)
      draftOrder.push([3, 2, 1, 0])
    }
  }

  return draftOrder
}

// Get current pick info based on draft state
export function getCurrentPickInfo(
  picks: DraftPick[],
  players: DraftPlayer[],
  draftOrder: number[][]
): {
  currentPlayer: DraftPlayer | null
  round: number
  pick: number
  overallPick: number
  isComplete: boolean
} {
  const totalPicks = picks.length
  const totalRounds = draftOrder.length
  const playersPerRound = players.length

  if (totalPicks >= totalRounds * playersPerRound) {
    return {
      currentPlayer: null,
      round: totalRounds,
      pick: playersPerRound,
      overallPick: totalPicks,
      isComplete: true
    }
  }

  const currentRound = Math.floor(totalPicks / playersPerRound)
  const pickInRound = totalPicks % playersPerRound
  const playerIndex = draftOrder[currentRound][pickInRound]

  return {
    currentPlayer: players[playerIndex],
    round: currentRound + 1,
    pick: pickInRound + 1,
    overallPick: totalPicks + 1,
    isComplete: false
  }
}

// Shuffle array for randomizing draft order
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}