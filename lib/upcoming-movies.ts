// Upcoming Movies Service for The Vault
// Specifically for movies releasing from now until February 2026

import { MovieDetails, TMDBMovie, getMovieDetails, tmdbFetch, getImageUrl, calculateBoxOfficeProjection, calculateOscarPotential } from './tmdb';

export interface UpcomingMovie extends TMDBMovie {
  // Enhanced fields for The Vault
  detailed_overview?: string;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  production_budget?: number;
  estimated_budget?: number;
  studio?: string;
  director?: string;
  main_cast?: string[];
  trailer_key?: string;

  // Draft Potential Analysis
  draft_potential?: DraftPotential;
  competition_analysis?: CompetitionAnalysis;
  risk_factors?: RiskFactor[];
  oscar_predictions?: OscarPrediction;

  // Projections
  opening_weekend_projection?: number;
  domestic_total_projection?: number;
  worldwide_projection?: number;
  profit_projection?: number;

  // Metadata
  last_updated?: string;
  fantasy_score?: number;
  recommended_draft_round?: number;
}

export interface DraftPotential {
  overall_score: number; // 1-100
  opening_weekend_potential: number; // Projected millions
  total_box_office_potential: number; // Projected millions
  profit_potential: number; // Revenue - Budget
  genre_multiplier: number; // Based on 2025 trends
  star_power_rating: number; // 1-10
  director_rating: number; // 1-10
  studio_confidence: number; // 1-10
  release_date_advantage: number; // 1-10 (based on competition)
  marketing_budget_estimate: number; // Estimated millions
}

export interface CompetitionAnalysis {
  release_month: string;
  competing_movies: string[]; // Other big releases that month
  market_saturation: 'Low' | 'Medium' | 'High';
  genre_saturation: 'Low' | 'Medium' | 'High';
  advantage_level: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  notes: string;
}

export interface RiskFactor {
  type: 'Budget' | 'Genre' | 'Competition' | 'Director' | 'Cast' | 'Franchise' | 'Release' | 'Studio';
  level: 'Low' | 'Medium' | 'High';
  description: string;
  impact_on_box_office: string;
}

export interface OscarPrediction {
  overall_potential: number; // 1-100
  categories: string[]; // Likely nomination categories
  release_timing_score: number; // How good is the release timing for Oscar consideration
  genre_advantage: boolean; // Is it an Oscar-friendly genre
  director_pedigree: boolean; // Has the director won/been nominated before
  cast_pedigree: boolean; // Do lead actors have Oscar history
  predicted_nominations: number; // 0-10
  best_picture_odds: number; // 1-100
}

// Get upcoming movies from now until February 2026 with substantial budgets
export async function getUpcomingMoviesForVault(page: number = 1): Promise<UpcomingMovie[]> {
  try {
    const today = new Date();
    const endDate = new Date('2026-02-28'); // End of February 2026

    const todayStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    console.log('Fetching upcoming movies from', todayStr, 'to', endDateStr);

    // Get upcoming movies with filters for substantial releases
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=${todayStr}&primary_release_date.lte=${endDateStr}&page=${page}&region=US&sort_by=popularity.desc&vote_count.gte=1&with_runtime.gte=70`);

    if (data.results && data.results.length > 0) {
      // Filter for movies likely to have substantial budgets (high popularity/major studios)
      const substantialMovies = data.results.filter((movie: TMDBMovie) =>
        movie.popularity > 10 || // High popularity indicates studio backing
        movie.vote_count > 50 || // Some community interest
        isLikelyBlockbuster(movie) // Genre/title suggests big budget
      );

      // Enhance each movie with detailed data
      const enhancedMovies = await Promise.all(
        substantialMovies.slice(0, 20).map(async (movie: TMDBMovie) => {
          try {
            return await enhanceMovieForVault(movie);
          } catch (error) {
            console.warn(`Error enhancing movie ${movie.title}:`, error);
            return enhanceMovieBasic(movie);
          }
        })
      );

      return enhancedMovies.sort((a, b) => {
        // Sort by draft potential score, then by popularity
        const scoreA = a.draft_potential?.overall_score || 0;
        const scoreB = b.draft_potential?.overall_score || 0;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.popularity - a.popularity;
      });
    } else {
      console.log('No upcoming movies found, using fallback');
      return await getFallbackUpcomingMovies();
    }
  } catch (error) {
    console.warn('TMDB API error, using fallback upcoming movies:', error);
    return await getFallbackUpcomingMovies();
  }
}

// Enhanced movie details for The Vault
async function enhanceMovieForVault(movie: TMDBMovie): Promise<UpcomingMovie> {
  try {
    // Get detailed movie information
    const details = await getMovieDetails(movie.id);

    // Get additional data
    const [creditsData, videosData] = await Promise.all([
      tmdbFetch(`/movie/${movie.id}/credits`).catch(() => ({ cast: [], crew: [] })),
      tmdbFetch(`/movie/${movie.id}/videos`).catch(() => ({ results: [] }))
    ]);

    // Find trailer
    const trailer = videosData.results?.find((video: any) =>
      video.site === 'YouTube' && video.type === 'Trailer' && video.official
    );

    // Extract key personnel
    const director = creditsData.crew?.find((person: any) => person.job === 'Director')?.name;
    const mainCast = creditsData.cast?.slice(0, 5).map((actor: any) => actor.name) || [];
    const studio = details.production_companies?.[0]?.name || 'Independent';

    // Calculate projections and analysis
    const draftPotential = calculateDraftPotential(details, creditsData, director, mainCast);
    const competitionAnalysis = analyzeCompetition(details.release_date, details.genres);
    const riskFactors = assessRiskFactors(details, creditsData, director, studio);
    const oscarPredictions = predictOscarPotential(details, creditsData, director, mainCast);

    // Box office projections
    const estimatedBudget = details.budget || estimateBudgetFromGenreAndCast(details.genres, mainCast, director);
    const openingWeekendProjection = calculateOpeningWeekendProjection(estimatedBudget, draftPotential);
    const domesticTotalProjection = openingWeekendProjection * getDomesticMultiplier(details.genres);
    const worldwideProjection = domesticTotalProjection * getWorldwideMultiplier(details.genres, mainCast);
    const profitProjection = worldwideProjection - estimatedBudget;

    return {
      ...movie,
      detailed_overview: details.overview || movie.overview,
      production_companies: details.production_companies,
      production_budget: details.budget,
      estimated_budget: estimatedBudget,
      studio,
      director,
      main_cast: mainCast,
      trailer_key: trailer?.key,

      draft_potential: draftPotential,
      competition_analysis: competitionAnalysis,
      risk_factors: riskFactors,
      oscar_predictions: oscarPredictions,

      opening_weekend_projection: Math.round(openingWeekendProjection),
      domestic_total_projection: Math.round(domesticTotalProjection),
      worldwide_projection: Math.round(worldwideProjection),
      profit_projection: Math.round(profitProjection),

      last_updated: new Date().toISOString(),
      fantasy_score: calculateFantasyScore(draftPotential, profitProjection),
      recommended_draft_round: getRecommendedDraftRound(draftPotential.overall_score)
    };
  } catch (error) {
    console.error(`Error enhancing movie ${movie.title}:`, error);
    return enhanceMovieBasic(movie);
  }
}

// Basic enhancement when detailed API calls fail
function enhanceMovieBasic(movie: TMDBMovie): UpcomingMovie {
  const estimatedBudget = estimateBudgetFromGenre(movie.genre_ids);
  const basicDraftPotential = calculateBasicDraftPotential(movie, estimatedBudget);

  return {
    ...movie,
    estimated_budget: estimatedBudget,
    studio: 'Unknown',
    main_cast: [],

    draft_potential: basicDraftPotential,
    competition_analysis: {
      release_month: new Date(movie.release_date).toLocaleString('default', { month: 'long' }),
      competing_movies: [],
      market_saturation: 'Medium',
      genre_saturation: 'Medium',
      advantage_level: 'Fair',
      notes: 'Limited data available'
    },
    risk_factors: getBasicRiskFactors(movie.genre_ids, estimatedBudget),
    oscar_predictions: {
      overall_potential: getBasicOscarPotential(movie.genre_ids),
      categories: getBasicOscarCategories(movie.genre_ids),
      release_timing_score: getReleaseTimingScore(movie.release_date),
      genre_advantage: isOscarFriendlyGenre(movie.genre_ids),
      director_pedigree: false,
      cast_pedigree: false,
      predicted_nominations: 0,
      best_picture_odds: 0
    },

    opening_weekend_projection: Math.round(estimatedBudget * 0.3),
    domestic_total_projection: Math.round(estimatedBudget * 2),
    worldwide_projection: Math.round(estimatedBudget * 3.5),
    profit_projection: Math.round(estimatedBudget * 1.5),

    last_updated: new Date().toISOString(),
    fantasy_score: basicDraftPotential.overall_score,
    recommended_draft_round: getRecommendedDraftRound(basicDraftPotential.overall_score)
  };
}

// Check if movie is likely a blockbuster based on genre/title
function isLikelyBlockbuster(movie: TMDBMovie): boolean {
  const blockbusterGenres = [28, 12, 878, 14]; // Action, Adventure, Sci-Fi, Fantasy
  const hasBlockbusterGenre = movie.genre_ids.some(id => blockbusterGenres.includes(id));

  const blockbusterKeywords = ['avengers', 'superman', 'batman', 'spider', 'avatar', 'fast', 'furious',
    'mission impossible', 'transformers', 'star wars', 'marvel', 'dc', 'disney', 'pixar'];
  const hasBlockbusterKeyword = blockbusterKeywords.some(keyword =>
    movie.title.toLowerCase().includes(keyword)
  );

  return hasBlockbusterGenre || hasBlockbusterKeyword || movie.popularity > 100;
}

// Calculate comprehensive draft potential
function calculateDraftPotential(
  movie: any,
  credits: any,
  director?: string,
  cast: string[] = []
): DraftPotential {
  const budget = movie.budget || estimateBudgetFromGenreAndCast(movie.genres, cast, director);

  // Base scoring
  let overallScore = 50; // Start at 50/100

  // Genre multiplier for 2025 trends
  const genreMultiplier = getGenreMultiplier2025(movie.genres);
  overallScore *= genreMultiplier;

  // Star power rating
  const starPowerRating = calculateStarPowerRating(cast);
  overallScore += (starPowerRating - 5) * 5; // Adjust by star power

  // Director rating
  const directorRating = calculateDirectorRating(director);
  overallScore += (directorRating - 5) * 3;

  // Studio confidence (based on production companies)
  const studioConfidence = calculateStudioConfidence(movie.production_companies);
  overallScore += (studioConfidence - 5) * 2;

  // Release date advantage
  const releaseAdvantage = calculateReleaseAdvantage(movie.release_date);
  overallScore += (releaseAdvantage - 5) * 2;

  // Cap the score
  overallScore = Math.max(10, Math.min(100, overallScore));

  return {
    overall_score: Math.round(overallScore),
    opening_weekend_potential: calculateOpeningWeekendProjection(budget, { overall_score: overallScore } as DraftPotential),
    total_box_office_potential: calculateTotalBoxOfficeProjection(budget, overallScore),
    profit_potential: calculateTotalBoxOfficeProjection(budget, overallScore) - budget,
    genre_multiplier: genreMultiplier,
    star_power_rating: starPowerRating,
    director_rating: directorRating,
    studio_confidence: studioConfidence,
    release_date_advantage: releaseAdvantage,
    marketing_budget_estimate: Math.round(budget * 0.5) // Typically 50% of production budget
  };
}

// Analyze competition for release window
function analyzeCompetition(releaseDate: string, genres: any[]): CompetitionAnalysis {
  const month = new Date(releaseDate).toLocaleString('default', { month: 'long' });
  const monthNumber = new Date(releaseDate).getMonth();

  // Seasonal competition analysis
  let marketSaturation: 'Low' | 'Medium' | 'High' = 'Medium';
  let advantageLevel: 'Poor' | 'Fair' | 'Good' | 'Excellent' = 'Fair';
  let notes = '';

  // Summer blockbuster season (May-August)
  if (monthNumber >= 4 && monthNumber <= 7) {
    marketSaturation = 'High';
    notes = 'Summer blockbuster season - high competition for audience attention';
    if (genres.some(g => g.id === 28 || g.id === 12 || g.id === 878)) {
      advantageLevel = 'Fair';
    } else {
      advantageLevel = 'Poor';
    }
  }

  // Fall Oscar season (September-December)
  else if (monthNumber >= 8 && monthNumber <= 11) {
    marketSaturation = 'Medium';
    notes = 'Fall season - good for both blockbusters and Oscar contenders';
    if (genres.some(g => g.id === 18)) {
      advantageLevel = 'Good';
    } else {
      advantageLevel = 'Fair';
    }
  }

  // Early year (January-April)
  else {
    marketSaturation = 'Low';
    notes = 'Early year - less competition but historically lower box office';
    advantageLevel = 'Good';
  }

  return {
    release_month: month,
    competing_movies: [], // Would need additional API calls to populate
    market_saturation: marketSaturation,
    genre_saturation: 'Medium', // Simplified
    advantage_level: advantageLevel,
    notes
  };
}

// Assess risk factors
function assessRiskFactors(movie: any, credits: any, director?: string, studio?: string): RiskFactor[] {
  const factors: RiskFactor[] = [];
  const budget = movie.budget || 100000000; // Default if unknown

  // Budget risk
  if (budget > 200000000) {
    factors.push({
      type: 'Budget',
      level: 'High',
      description: 'Very high production budget requires massive box office success',
      impact_on_box_office: 'Needs $500M+ worldwide to be profitable'
    });
  } else if (budget > 100000000) {
    factors.push({
      type: 'Budget',
      level: 'Medium',
      description: 'High production budget requires strong performance',
      impact_on_box_office: 'Needs $250M+ worldwide to be profitable'
    });
  }

  // Genre risk based on 2025 trends
  const genreIds = movie.genres?.map((g: any) => g.id) || [];
  if (genreIds.includes(28) && genreIds.includes(878)) {
    factors.push({
      type: 'Genre',
      level: 'Medium',
      description: 'Superhero/sci-fi action experiencing audience fatigue',
      impact_on_box_office: 'May underperform compared to historical norms'
    });
  }

  // Director risk
  if (director && isFirstTimeBlockbusterDirector(director)) {
    factors.push({
      type: 'Director',
      level: 'Medium',
      description: 'Director has limited experience with large-scale productions',
      impact_on_box_office: 'May affect quality and audience confidence'
    });
  }

  // Studio risk
  if (studio && studio !== 'Disney' && studio !== 'Universal' && studio !== 'Warner Bros.' && studio !== 'Sony Pictures') {
    factors.push({
      type: 'Studio',
      level: 'Low',
      description: 'Smaller studio may have limited marketing reach',
      impact_on_box_office: 'May limit opening weekend potential'
    });
  }

  return factors;
}

// Predict Oscar potential
function predictOscarPotential(movie: any, credits: any, director?: string, cast: string[] = []): OscarPrediction {
  let overallPotential = 20; // Base 20%
  const categories: string[] = [];

  // Genre advantage
  const genreIds = movie.genres?.map((g: any) => g.id) || [];
  const isOscarGenre = genreIds.includes(18) || genreIds.includes(36) || genreIds.includes(10752); // Drama, History, War

  if (isOscarGenre) {
    overallPotential += 30;
    categories.push('Best Picture', 'Best Actor', 'Best Actress', 'Best Director');
  }

  // Always possible technical categories for big budget films
  if ((movie.budget || 0) > 50000000) {
    categories.push('Best Visual Effects', 'Best Cinematography', 'Best Sound');
  }

  // Release timing
  const releaseMonth = new Date(movie.release_date).getMonth();
  const releaseTimingScore = (releaseMonth >= 8 && releaseMonth <= 11) ? 8 : 3; // Fall releases

  if (releaseTimingScore >= 7) {
    overallPotential += 15;
  }

  // Director pedigree
  const directorPedigree = isOscarDirector(director);
  if (directorPedigree) {
    overallPotential += 20;
    categories.push('Best Director');
  }

  // Cast pedigree
  const castPedigree = cast.some(actor => isOscarActor(actor));
  if (castPedigree) {
    overallPotential += 15;
  }

  return {
    overall_potential: Math.min(100, overallPotential),
    categories: Array.from(new Set(categories)), // Remove duplicates
    release_timing_score: releaseTimingScore,
    genre_advantage: isOscarGenre,
    director_pedigree: directorPedigree,
    cast_pedigree: castPedigree,
    predicted_nominations: Math.round(overallPotential / 20),
    best_picture_odds: isOscarGenre && directorPedigree ? Math.round(overallPotential * 0.6) : Math.round(overallPotential * 0.2)
  };
}

// Helper functions
function estimateBudgetFromGenreAndCast(genres: any[], cast: string[], director?: string): number {
  let baseBudget = 60000000; // $60M base

  if (!genres) return baseBudget;

  const genreIds = genres.map(g => g.id || g);

  // Genre adjustments
  if (genreIds.includes(28)) baseBudget += 40000000; // Action
  if (genreIds.includes(878)) baseBudget += 50000000; // Sci-Fi
  if (genreIds.includes(12)) baseBudget += 30000000; // Adventure
  if (genreIds.includes(16)) baseBudget += 20000000; // Animation

  // Star power adjustment
  const majorStars = ['Robert Downey Jr.', 'Scarlett Johansson', 'Chris Evans', 'Dwayne Johnson', 'Ryan Reynolds'];
  const hasMajorStar = cast.some(actor => majorStars.includes(actor));
  if (hasMajorStar) baseBudget += 30000000;

  // Director adjustment
  const blockbusterDirectors = ['Christopher Nolan', 'James Cameron', 'Russo Brothers', 'J.J. Abrams'];
  const hasBlockbusterDirector = blockbusterDirectors.some(dir => director?.includes(dir));
  if (hasBlockbusterDirector) baseBudget += 50000000;

  return baseBudget;
}

function estimateBudgetFromGenre(genreIds: number[]): number {
  let baseBudget = 60000000;

  if (genreIds.includes(28)) baseBudget += 40000000; // Action
  if (genreIds.includes(878)) baseBudget += 50000000; // Sci-Fi
  if (genreIds.includes(12)) baseBudget += 30000000; // Adventure
  if (genreIds.includes(16)) baseBudget += 20000000; // Animation
  if (genreIds.includes(35)) baseBudget -= 20000000; // Comedy (typically cheaper)
  if (genreIds.includes(18)) baseBudget -= 30000000; // Drama (typically cheaper)

  return Math.max(20000000, baseBudget); // Minimum $20M
}

function getGenreMultiplier2025(genres: any[]): number {
  if (!genres) return 1.0;

  const genreIds = genres.map(g => g.id || g);

  // 2025 trends
  if (genreIds.includes(27)) return 1.2; // Horror is hot
  if (genreIds.includes(16)) return 1.15; // Animation strong
  if (genreIds.includes(35)) return 1.1; // Comedy rebound
  if (genreIds.includes(878)) return 1.05; // Sci-Fi still good
  if (genreIds.includes(28) && genreIds.includes(878)) return 0.85; // Superhero fatigue

  return 1.0;
}

function calculateStarPowerRating(cast: string[]): number {
  const alistStars = ['Dwayne Johnson', 'Ryan Reynolds', 'Scarlett Johansson', 'Robert Downey Jr.', 'Leonardo DiCaprio'];
  const blistStars = ['Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo', 'Paul Rudd', 'Jennifer Lawrence'];

  let rating = 5; // Base rating

  cast.forEach(actor => {
    if (alistStars.includes(actor)) rating += 2;
    else if (blistStars.includes(actor)) rating += 1;
  });

  return Math.min(10, rating);
}

function calculateDirectorRating(director?: string): number {
  if (!director) return 5;

  const alistDirectors = ['Christopher Nolan', 'James Cameron', 'Martin Scorsese', 'Steven Spielberg'];
  const blistDirectors = ['Denis Villeneuve', 'Jordan Peele', 'Greta Gerwig', 'Ryan Coogler'];

  if (alistDirectors.some(dir => director.includes(dir))) return 10;
  if (blistDirectors.some(dir => director.includes(dir))) return 8;

  return 5; // Unknown director
}

function calculateStudioConfidence(studios: any[]): number {
  if (!studios || studios.length === 0) return 5;

  const majorStudios = ['Walt Disney Pictures', 'Universal Pictures', 'Warner Bros.', 'Sony Pictures', 'Paramount Pictures'];
  const studio = studios[0]?.name || '';

  if (majorStudios.some(major => studio.includes(major))) return 9;
  return 6; // Smaller studio
}

function calculateReleaseAdvantage(releaseDate: string): number {
  const month = new Date(releaseDate).getMonth();

  // Best months for box office
  if (month === 4 || month === 5 || month === 6) return 9; // May-July (summer)
  if (month === 10 || month === 11) return 8; // Nov-Dec (holidays)
  if (month === 2 || month === 3) return 7; // Mar-Apr (spring break)
  if (month === 8 || month === 9) return 6; // Sep-Oct (fall)
  return 4; // Jan-Feb (dump months)
}

function calculateOpeningWeekendProjection(budget: number, draftPotential: DraftPotential): number {
  const basePercentage = 0.15; // Typically 15% of budget for opening weekend
  const multiplier = draftPotential.overall_score / 50; // Adjust based on potential
  return budget * basePercentage * multiplier;
}

function calculateTotalBoxOfficeProjection(budget: number, overallScore: number): number {
  const baseMultiplier = 2.5; // Typical 2.5x budget
  const scoreMultiplier = overallScore / 50; // Adjust based on score
  return budget * baseMultiplier * scoreMultiplier;
}

function getDomesticMultiplier(genres: any[]): number {
  // How much domestic total is compared to opening weekend
  const genreIds = genres?.map(g => g.id) || [];

  if (genreIds.includes(16)) return 4.5; // Animation has legs
  if (genreIds.includes(35)) return 4.0; // Comedy has legs
  if (genreIds.includes(18)) return 5.0; // Drama builds over time
  if (genreIds.includes(27)) return 2.8; // Horror front-loaded

  return 3.5; // Default multiplier
}

function getWorldwideMultiplier(genres: any[], cast: string[]): number {
  // How much worldwide total is compared to domestic
  const genreIds = genres?.map(g => g.id) || [];

  if (genreIds.includes(28)) return 2.2; // Action travels well
  if (genreIds.includes(878)) return 2.0; // Sci-fi travels well
  if (genreIds.includes(16)) return 1.8; // Animation travels well
  if (genreIds.includes(35)) return 1.3; // Comedy doesn't travel as well

  // Star power helps international
  const internationalStars = ['Dwayne Johnson', 'Fast & Furious', 'Marvel', 'DC'];
  const hasInternationalAppeal = cast.some(actor =>
    internationalStars.some(star => actor.includes(star))
  );

  return hasInternationalAppeal ? 2.5 : 1.6;
}

function calculateFantasyScore(draftPotential: DraftPotential, profitProjection: number): number {
  const profitScore = Math.max(0, profitProjection / 10000000); // $10M = 1 point
  const potentialScore = draftPotential.overall_score / 2;
  return Math.round(profitScore + potentialScore);
}

function getRecommendedDraftRound(overallScore: number): number {
  if (overallScore >= 80) return 1;
  if (overallScore >= 65) return 2;
  if (overallScore >= 50) return 3;
  if (overallScore >= 35) return 4;
  return 5;
}

// Basic calculation functions for when detailed data isn't available
function calculateBasicDraftPotential(movie: TMDBMovie, budget: number): DraftPotential {
  const popularityScore = Math.min(movie.popularity / 20, 5) + 5; // 5-10 range

  return {
    overall_score: Math.round(popularityScore * 10),
    opening_weekend_potential: budget * 0.2,
    total_box_office_potential: budget * 2.5,
    profit_potential: budget * 1.5,
    genre_multiplier: getGenreMultiplier2025(movie.genre_ids.map(id => ({ id }))),
    star_power_rating: 5,
    director_rating: 5,
    studio_confidence: 6,
    release_date_advantage: calculateReleaseAdvantage(movie.release_date),
    marketing_budget_estimate: budget * 0.5
  };
}

function getBasicRiskFactors(genreIds: number[], budget: number): RiskFactor[] {
  const factors: RiskFactor[] = [];

  if (budget > 150000000) {
    factors.push({
      type: 'Budget',
      level: 'High',
      description: 'High budget film requires strong performance',
      impact_on_box_office: 'Needs significant worldwide success'
    });
  }

  return factors;
}

function getBasicOscarPotential(genreIds: number[]): number {
  if (genreIds.includes(18)) return 40; // Drama
  if (genreIds.includes(36)) return 35; // History
  if (genreIds.includes(10752)) return 30; // War
  return 15; // Other genres
}

function getBasicOscarCategories(genreIds: number[]): string[] {
  const categories = ['Best Visual Effects', 'Best Cinematography'];

  if (genreIds.includes(18)) {
    categories.push('Best Picture', 'Best Actor', 'Best Actress');
  }

  return categories;
}

function getReleaseTimingScore(releaseDate: string): number {
  const month = new Date(releaseDate).getMonth();
  return (month >= 8 && month <= 11) ? 8 : 4; // Fall releases better for Oscars
}

function isOscarFriendlyGenre(genreIds: number[]): boolean {
  const oscarGenres = [18, 36, 10752]; // Drama, History, War
  return genreIds.some(id => oscarGenres.includes(id));
}

function isFirstTimeBlockbusterDirector(director: string): boolean {
  const experiencedDirectors = ['Christopher Nolan', 'James Cameron', 'Russo Brothers', 'J.J. Abrams', 'Zack Snyder'];
  return !experiencedDirectors.some(exp => director.includes(exp));
}

function isOscarDirector(director?: string): boolean {
  if (!director) return false;
  const oscarDirectors = ['Christopher Nolan', 'Martin Scorsese', 'Steven Spielberg', 'James Cameron', 'Denis Villeneuve'];
  return oscarDirectors.some(oscar => director.includes(oscar));
}

function isOscarActor(actor: string): boolean {
  const oscarActors = ['Leonardo DiCaprio', 'Matthew McConaughey', 'Jennifer Lawrence', 'Emma Stone', 'Frances McDormand'];
  return oscarActors.includes(actor);
}

// Fallback data for when API is unavailable
async function getFallbackUpcomingMovies(): Promise<UpcomingMovie[]> {
  const fallbackMovies: UpcomingMovie[] = [
    {
      id: 83533,
      title: "Avatar: Fire and Ash",
      overview: "The third installment in James Cameron's groundbreaking Avatar saga takes Jake Sully and Neytiri to uncharted territories of Pandora.",
      release_date: "2025-12-19",
      poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      backdrop_path: "/198vrF8k7mfQ4FjDJsBmdQcaiyq.jpg",
      genre_ids: [878, 12, 28],
      vote_average: 0,
      vote_count: 0,
      popularity: 4500.0,

      estimated_budget: 460000000,
      studio: "20th Century Studios",
      director: "James Cameron",
      main_cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],

      draft_potential: {
        overall_score: 95,
        opening_weekend_potential: 180000000,
        total_box_office_potential: 2000000000,
        profit_potential: 1540000000,
        genre_multiplier: 1.1,
        star_power_rating: 8,
        director_rating: 10,
        studio_confidence: 10,
        release_date_advantage: 8,
        marketing_budget_estimate: 230000000
      },

      opening_weekend_projection: 180000000,
      domestic_total_projection: 700000000,
      worldwide_projection: 2000000000,
      profit_projection: 1540000000,
      fantasy_score: 199,
      recommended_draft_round: 1
    },
    // Add more fallback movies as needed...
  ];

  return fallbackMovies;
}

// Export additional utility functions
export {
  getGenreMultiplier2025,
  calculateStarPowerRating,
  calculateDirectorRating,
  estimateBudgetFromGenre,
  isLikelyBlockbuster
};