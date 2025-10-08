// TMDB API Service for Fantasy Flix
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

// Types for TMDB API responses
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  budget?: number;
  revenue?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface MovieCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }[];
}

export interface MovieDetails extends TMDBMovie {
  budget: number;
  revenue: number;
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  status: string;
  tagline?: string;
  imdb_id?: string;
  credits?: MovieCredits;
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  // Fantasy Flix specific fields
  boxOfficeProjection?: number;
  oscarPotential?: number;
  fantasyLeaguePosition?: string;
}

// Helper function to build image URLs
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.svg'; // Use placeholder for movies without posters
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format dates
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// API call wrapper with error handling
export async function tmdbFetch(endpoint: string): Promise<any> {
  if (!ACCESS_TOKEN && !API_KEY) {
    throw new Error('TMDB credentials not found. Please add NEXT_PUBLIC_TMDB_ACCESS_TOKEN or NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
  }

  // Use Bearer token if available, otherwise fall back to API key
  const url = ACCESS_TOKEN 
    ? `${TMDB_BASE_URL}${endpoint}`
    : `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
  
  const headers = ACCESS_TOKEN ? {
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  } : {};
  
  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw error;
  }
}

// Get upcoming movies (for drafting)
export async function getUpcomingMovies(page: number = 1): Promise<TMDBMovie[]> {
  const data = await tmdbFetch(`/movie/upcoming?page=${page}&region=US`);
  return data.results;
}

// Get biggest upcoming movies in the next 30 days (most anticipated)
export async function getBiggestUpcomingMovies(page: number = 1): Promise<TMDBMovie[]> {
  try {
    const today = new Date();
    const next90Days = new Date(); // Extended to 90 days to catch more movies
    next90Days.setDate(today.getDate() + 90);
    
    const todayStr = today.toISOString().split('T')[0];
    const next90DaysStr = next90Days.toISOString().split('T')[0];
    
    console.log('Fetching upcoming movies from', todayStr, 'to', next90DaysStr);
    
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=${todayStr}&primary_release_date.lte=${next90DaysStr}&page=${page}&region=US&sort_by=popularity.desc&vote_count.gte=5`);
    
    console.log('TMDB upcoming movies response:', data);
    
    if (data.results && data.results.length > 0) {
      return data.results.slice(0, 6); // Top 6 most anticipated
    } else {
      console.log('No upcoming movies found, using fallback');
      return FALLBACK_BIGGEST_UPCOMING_MOVIES;
    }
  } catch (error) {
    console.warn('TMDB API error, using fallback upcoming movies:', error);
    return FALLBACK_BIGGEST_UPCOMING_MOVIES;
  }
}

// Get now playing movies (for current scoring)
export async function getNowPlayingMovies(page: number = 1): Promise<TMDBMovie[]> {
  try {
    const data = await tmdbFetch(`/movie/now_playing?page=${page}&region=US`);
    return data.results;
  } catch (error) {
    console.warn('TMDB API unavailable, using fallback data');
    return FALLBACK_NOW_PLAYING_MOVIES;
  }
}

// Get popular movies (for featured content) - sorted by box office potential
export async function getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
  // Use discover for better control over commercial appeal
  const data = await tmdbFetch(`/discover/movie?page=${page}&region=US&sort_by=popularity.desc&vote_count.gte=100&vote_average.gte=6.0`);
  return data.results;
}

// Get comprehensive movie details including cast, crew, videos, and Fantasy Flix data
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    // Get basic movie details
    const [movieData, creditsData, videosData] = await Promise.all([
      tmdbFetch(`/movie/${movieId}`),
      tmdbFetch(`/movie/${movieId}/credits`),
      tmdbFetch(`/movie/${movieId}/videos`)
    ]);

    // Calculate Fantasy Flix specific metrics
    const boxOfficeProjection = calculateBoxOfficeProjection(movieData, creditsData);
    const oscarPotential = calculateOscarPotential(movieData, creditsData);
    const fantasyLeaguePosition = determineFantasyPosition(movieData);

    return {
      ...movieData,
      credits: creditsData,
      videos: videosData,
      boxOfficeProjection,
      oscarPotential,
      fantasyLeaguePosition
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    // Fallback to basic details
    const data = await tmdbFetch(`/movie/${movieId}`);
    return data;
  }
}

// Search for movies (US only) - sorted by commercial appeal
export async function searchMovies(query: string, page: number = 1): Promise<TMDBMovie[]> {
  const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&page=${page}&region=US&include_adult=false`);
  
  // Sort results by commercial appeal (popularity + vote_count + revenue potential)
  const sortedResults = data.results
    .filter((movie: TMDBMovie) => movie.vote_count > 10) // Filter out obscure movies
    .sort((a: TMDBMovie, b: TMDBMovie) => {
      // Commercial Appeal Score = popularity * 0.4 + vote_count * 0.3 + vote_average * 20
      const scoreA = (a.popularity * 0.4) + (a.vote_count * 0.3) + (a.vote_average * 20);
      const scoreB = (b.popularity * 0.4) + (b.vote_count * 0.3) + (b.vote_average * 20);
      return scoreB - scoreA; // Descending order
    });
    
  return sortedResults;
}

// Search for actors/people
export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: TMDBMovie[];
  popularity: number;
  adult: boolean;
  gender: number;
}

export interface TMDBPersonDetails extends TMDBPerson {
  birthday: string | null;
  deathday: string | null;
  biography: string;
  place_of_birth: string | null;
  also_known_as: string[];
  homepage: string | null;
  imdb_id: string | null;
  // Fantasy Flix specific metrics
  boxOfficeTotal?: number;
  averageMovieRating?: number;
  oscarWins?: number;
  oscarNominations?: number;
  starPowerScore?: number;
  fantasyValue?: number;
}

export interface PersonMovieCredits {
  cast: {
    id: number;
    title: string;
    character: string;
    release_date: string;
    poster_path: string | null;
    vote_average: number;
    vote_count: number;
    popularity: number;
    revenue?: number;
    budget?: number;
    genre_ids: number[];
    overview: string;
  }[];
  crew: {
    id: number;
    title: string;
    job: string;
    department: string;
    release_date: string;
    poster_path: string | null;
    vote_average: number;
    vote_count: number;
    popularity: number;
    genre_ids: number[];
  }[];
}

export async function searchActors(query: string, page: number = 1): Promise<TMDBPerson[]> {
  const data = await tmdbFetch(`/search/person?query=${encodeURIComponent(query)}&page=${page}&include_adult=false&region=US`);
  
  // Filter and sort actors by star power and commercial success
  const sortedResults = data.results
    .filter((person: TMDBPerson) => {
      // Keep actors who have popular US movies in their known_for list
      return person.known_for && person.known_for.length > 0 && 
             person.known_for.some(movie => movie.popularity > 10) &&
             person.popularity > 5; // Minimum popularity threshold
    })
    .sort((a: TMDBPerson, b: TMDBPerson) => {
      // Star Power Score = popularity * 0.6 + avg_known_for_popularity * 0.4
      const avgPopularityA = a.known_for.reduce((sum, movie) => sum + movie.popularity, 0) / a.known_for.length;
      const avgPopularityB = b.known_for.reduce((sum, movie) => sum + movie.popularity, 0) / b.known_for.length;
      
      const starPowerA = (a.popularity * 0.6) + (avgPopularityA * 0.4);
      const starPowerB = (b.popularity * 0.6) + (avgPopularityB * 0.4);
      
      return starPowerB - starPowerA; // Descending order
    });
    
  return sortedResults;
}

// Combined search for both movies and actors
export interface SearchResults {
  movies: TMDBMovie[];
  actors: TMDBPerson[];
}

export async function searchAll(query: string, page: number = 1): Promise<SearchResults> {
  try {
    const [movieResults, actorResults] = await Promise.all([
      searchMovies(query, page),
      searchActors(query, page)
    ]);

    return {
      movies: movieResults,
      actors: actorResults
    };
  } catch (error) {
    console.error('Error in combined search:', error);
    return {
      movies: [],
      actors: []
    };
  }
}

// Get movies by genre
export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBMovie[]> {
  const data = await tmdbFetch(`/discover/movie?with_genres=${genreId}&page=${page}&region=US`);
  return data.results;
}

// Get 2025 blockbuster movies (high budget, popular studios)
export async function get2025BlockbusterMovies(page: number = 1): Promise<TMDBMovie[]> {
  try {
    // Target blockbusters with high vote counts and popularity from major studios
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=2025-01-01&primary_release_date.lte=2025-12-31&page=${page}&region=US&sort_by=popularity.desc&vote_count.gte=100&with_companies=420|2|3|4|5|7|174|711|1632|2301`);
    return data.results;
  } catch (error) {
    console.warn('TMDB API unavailable, using fallback 2025 blockbuster movies');
    return FALLBACK_2025_MOVIES.filter(movie => movie.popularity > 3000);
  }
}

// Get all 2025 movies (comprehensive list) - sorted by commercial potential
export async function get2025Movies(page: number = 1): Promise<TMDBMovie[]> {
  try {
    // Sort by popularity for maximum commercial appeal, with vote count filter
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=2025-01-01&primary_release_date.lte=2025-12-31&page=${page}&region=US&sort_by=popularity.desc&vote_count.gte=5`);
    return data.results;
  } catch (error) {
    console.warn('TMDB API unavailable, using fallback 2025 movies');
    return FALLBACK_2025_MOVIES;
  }
}

// Get 2025 Oscar contenders - sorted by combined quality and commercial appeal
export async function get2025OscarContenders(page: number = 1): Promise<TMDBMovie[]> {
  try {
    // Use popularity.desc for commercial viability of Oscar contenders
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=2025-09-01&primary_release_date.lte=2025-12-31&page=${page}&region=US&sort_by=popularity.desc&vote_count.gte=25&with_genres=18&vote_average.gte=6.5`);
    return data.results;
  } catch (error) {
    console.warn('TMDB API unavailable, using fallback Oscar contenders');
    return FALLBACK_2025_MOVIES.filter(movie => movie.vote_average >= 7.5);
  }
}

// Get seasonal movies for current season with 2025 focus
export async function getSeasonalMovies(page: number = 1): Promise<TMDBMovie[]> {
  try {
    // Current season appropriate genres: Horror (27), Thriller (53), Drama (18), Mystery (9648)
    const seasonGenres = [27, 53, 18, 9648];
    const genreIds = seasonGenres.join(',');
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=2025-01-01&primary_release_date.lte=2025-12-31&with_genres=${genreIds}&page=${page}&region=US&sort_by=popularity.desc`);
    return data.results;
  } catch (error) {
    console.warn('TMDB API unavailable, using fallback seasonal movies');
    return FALLBACK_SEASONAL_MOVIES;
  }
}

// Get movie genres
export async function getGenres(): Promise<{ id: number; name: string }[]> {
  const data = await tmdbFetch('/genre/movie/list');
  return data.genres;
}

// Calculate fantasy score based on box office performance
export function calculateFantasyScore(movie: MovieDetails): number {
  const boxOfficeScore = Math.max(0, movie.revenue - movie.budget) / 1000000; // Profit in millions
  const ratingBonus = movie.vote_average >= 8.0 ? 50 : movie.vote_average >= 7.0 ? 25 : 0;
  const popularityBonus = movie.popularity > 100 ? 25 : 0;
  
  return Math.round(boxOfficeScore + ratingBonus + popularityBonus);
}

// Calculate projected box office based on various factors
export function calculateBoxOfficeProjection(movieData: any, creditsData: MovieCredits): number {
  let projection = 0;
  
  // Base projection from budget
  if (movieData.budget > 0) {
    projection = movieData.budget * 2.5; // Typical multiplier for successful films
  } else {
    // Estimate budget based on genre and cast
    projection = estimateBudgetFromGenre(movieData.genres) * 2.5;
  }
  
  // Star power multiplier
  const starPowerMultiplier = calculateStarPower(creditsData.cast?.slice(0, 5) || []);
  projection *= starPowerMultiplier;
  
  // Genre multiplier for 2025
  const genreMultiplier = getGenreMultiplier2025(movieData.genres);
  projection *= genreMultiplier;
  
  return Math.round(projection);
}

// Calculate Oscar potential based on genre, cast, crew, and release timing
export function calculateOscarPotential(movieData: any, creditsData: MovieCredits): number {
  let potential = 0;
  
  // Genre scoring (Drama and Biography score higher)
  const oscarGenres = [18, 36, 10752]; // Drama, History, War
  const hasOscarGenre = movieData.genres?.some((g: any) => oscarGenres.includes(g.id));
  if (hasOscarGenre) potential += 30;
  
  // Release timing (fall releases score higher)
  const releaseMonth = new Date(movieData.release_date).getMonth();
  if (releaseMonth >= 8 && releaseMonth <= 11) potential += 20; // Sep-Dec
  
  // Director recognition
  const director = creditsData.crew?.find(c => c.job === 'Director');
  if (director) {
    // Award-winning directors (simplified check)
    const oscarDirectors = ['Christopher Nolan', 'Martin Scorsese', 'Denis Villeneuve', 'Chloé Zhao'];
    if (oscarDirectors.includes(director.name)) potential += 25;
  }
  
  // Cast recognition
  const leadActors = creditsData.cast?.slice(0, 3) || [];
  const oscarActors = ['Leonardo DiCaprio', 'Meryl Streep', 'Denzel Washington', 'Frances McDormand'];
  const hasOscarActor = leadActors.some(actor => oscarActors.includes(actor.name));
  if (hasOscarActor) potential += 20;
  
  // Runtime (longer films often considered more "serious")
  if (movieData.runtime > 120) potential += 10;
  
  return Math.min(100, potential); // Cap at 100
}

// Determine fantasy league position based on movie characteristics
export function determineFantasyPosition(movieData: any): string {
  const genres = movieData.genres?.map((g: any) => g.id) || [];
  const budget = movieData.budget || 0;
  
  if (genres.includes(28) && budget > 100000000) return 'Blockbuster Hero';
  if (genres.includes(18) && budget < 50000000) return 'Indie Darling';
  if (genres.includes(35)) return 'Comedy Gold';
  if (genres.includes(27) || genres.includes(53)) return 'Thriller/Horror Specialist';
  if (genres.includes(878)) return 'Sci-Fi Visionary';
  if (genres.includes(16)) return 'Animation Ace';
  
  return 'Wildcard Pick';
}

// Helper functions
function estimateBudgetFromGenre(genres: any[]): number {
  const genreIds = genres?.map(g => g.id) || [];
  
  if (genreIds.includes(28)) return 150000000; // Action
  if (genreIds.includes(878)) return 120000000; // Sci-Fi
  if (genreIds.includes(12)) return 100000000; // Adventure
  if (genreIds.includes(16)) return 80000000;  // Animation
  if (genreIds.includes(35)) return 50000000;  // Comedy
  if (genreIds.includes(18)) return 30000000;  // Drama
  
  return 60000000; // Default
}

function calculateStarPower(cast: any[]): number {
  // Simplified star power calculation
  const starNames = ['Ryan Reynolds', 'Dwayne Johnson', 'Scarlett Johansson', 'Robert Downey Jr.'];
  const hasAStar = cast.some(actor => starNames.includes(actor.name));
  return hasAStar ? 1.3 : 1.0;
}

function getGenreMultiplier2025(genres: any[]): number {
  const genreIds = genres?.map(g => g.id) || [];
  
  // 2025 trends: Superhero fatigue, horror revival, sci-fi strong
  if (genreIds.includes(27)) return 1.2; // Horror is hot
  if (genreIds.includes(878)) return 1.1; // Sci-Fi still strong
  if (genreIds.includes(28) && genreIds.includes(878)) return 0.9; // Superhero fatigue
  if (genreIds.includes(35)) return 1.15; // Comedy rebound
  
  return 1.0; // Default
}

// Fallback movie data when API is unavailable
const FALLBACK_TRENDING_MOVIES: TMDBMovie[] = [
  {
    id: 912649,
    title: "Venom: The Last Dance",
    overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
    release_date: "2024-10-22",
    poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
    backdrop_path: "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
    genre_ids: [878, 53, 28],
    vote_average: 6.8,
    vote_count: 1205,
    popularity: 3876.433
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
    release_date: "2024-07-24",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTfA3R0jFYba4zF1kmufbfeD.jpg",
    genre_ids: [28, 35, 878],
    vote_average: 7.7,
    vote_count: 5234,
    popularity: 2845.123
  },
  {
    id: 845781,
    title: "Red One",
    overview: "After Santa Claus—Code Name: RED ONE—is kidnapped, the North Pole's Head of Security must team up with the world's most infamous tracker in a globe-trotting, action-packed mission to save Christmas.",
    release_date: "2024-10-31",
    poster_path: "/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
    backdrop_path: "/tElnmtQ6yz1PjN1kePNl8yMSb59.jpg",
    genre_ids: [28, 35, 14],
    vote_average: 6.9,
    vote_count: 892,
    popularity: 2234.567
  },
  {
    id: 1034541,
    title: "Terrifier 3",
    overview: "Five years after surviving Art the Clown's Halloween massacre, Sienna and Jonathan are still struggling to rebuild their shattered lives. As the holiday season approaches, they try to embrace the Christmas spirit and leave the horrors of the past behind.",
    release_date: "2024-10-09",
    poster_path: "/63xYQj1BwRFielxsBDXvHIJyXVm.jpg",
    backdrop_path: "/18TSJF1WLA4CkymvVUcKDBwUJ9F.jpg",
    genre_ids: [27, 53],
    vote_average: 6.9,
    vote_count: 634,
    popularity: 1876.234
  }
];

// Fallback 2025 movies data with accurate descriptions and placeholder poster paths
const FALLBACK_2025_MOVIES: TMDBMovie[] = [
  {
    id: 83533, // Real TMDB ID for Avatar: Fire and Ash
    title: "Avatar: Fire and Ash",
    overview: "The third installment in James Cameron's groundbreaking Avatar saga takes Jake Sully and Neytiri to uncharted territories of Pandora. As the Sully family faces a devastating new threat from the Ash People—a violent Na'vi tribe led by the ruthless Varang—they must unite with old allies and forge new alliances to protect their way of life. Set against the breathtaking backdrop of Pandora's volcanic ash lands, this epic adventure explores themes of family, survival, and the eternal struggle between harmony and conquest. With revolutionary visual effects and Cameron's visionary storytelling, Fire and Ash promises to push the boundaries of cinematic experience while deepening the rich mythology of Pandora.",
    release_date: "2025-12-19",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", // Avatar: The Way of Water poster (working)
    backdrop_path: "/198vrF8k7mfQ4FjDJsBmdQcaiyq.jpg",
    genre_ids: [878, 12, 28],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 4500.0
  },
  {
    id: 617126, // Real TMDB ID for The Fantastic 4: First Steps
    title: "The Fantastic 4: First Steps",
    overview: "Marvel's First Family finally joins the Marvel Cinematic Universe in this retro-futuristic adventure set in an alternate 1960s timeline. When brilliant scientist Reed Richards, his wife Sue Storm, her brother Johnny, and pilot Ben Grimm are exposed to cosmic radiation during a space mission, they gain extraordinary powers that will change their lives forever. As Mr. Fantastic, Invisible Woman, Human Torch, and The Thing, they must learn to work together as a team while facing their greatest challenge yet: the world-devouring Galactus and their herald, the Silver Surfer. Set in a vibrant, optimistic version of the Space Age, this film promises to capture the wonder and scientific discovery that defined the original comics while delivering spectacular action and heartfelt family dynamics.",
    release_date: "2025-07-25",
    poster_path: "/6P3c80EOm7BodndGBUAJHHsHKrp.jpg", // Fantastic Four 2015 poster
    backdrop_path: "/4cLbIUaon8Q1pWCAXC1tGLuWMkr.jpg",
    genre_ids: [28, 12, 878],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 3800.0
  },
  {
    id: 1061474, // Real TMDB ID for Superman (2025)
    title: "Superman",
    overview: "James Gunn's bold new vision for the Man of Steel brings Superman back to his roots in this heartfelt origin story for the DC Universe. David Corenswet embodies Clark Kent as he grapples with his dual identity as both the last son of Krypton and Earth's greatest protector. When a mysterious threat emerges that challenges everything Superman believes in, he must learn to embrace both his alien heritage and his human heart. Rachel Brosnahan brings depth and intelligence to Lois Lane, while Nicholas Hoult delivers a complex portrayal of Lex Luthor. This film explores themes of hope, identity, and what it truly means to be a hero in a world that desperately needs one. With Gunn's signature blend of emotion and spectacle, this Superman story promises to inspire a new generation while honoring the character's legacy.",
    release_date: "2025-07-11",
    poster_path: "/7rIPjn5TUK04O25ZkMyHrGNPgLx.jpg", // Man of Steel poster (working)
    backdrop_path: "/7d6EY00g1c39SGZOoCJ5Py9noko.jpg",
    genre_ids: [28, 12, 878],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 4200.0
  },
  {
    id: 1234821, // Real TMDB ID for Jurassic World Rebirth
    title: "Jurassic World Rebirth",
    overview: "Five years after the cataclysmic events of Jurassic World Dominion, the ecosystem has stabilized and dinosaurs now coexist with humans across the globe. But this fragile balance faces a new threat when Scarlett Johansson's character leads a covert mission to a remote island where a rogue genetics corporation has been conducting illegal experiments. What they discover could change the future of both species forever. With the original park long destroyed, this isolated facility holds secrets that could either save humanity or unleash an even deadlier generation of prehistoric predators. The film explores the complex relationship between scientific advancement and moral responsibility, while delivering the spectacular action and jaw-dropping creature encounters fans expect from the franchise.",
    release_date: "2025-07-02",
    poster_path: "/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg", // Jurassic World Dominion poster
    backdrop_path: "/3NyXd04rmSAhJNcsg4swj7mMkwr.jpg",
    genre_ids: [28, 12, 53],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 3200.0
  },
  {
    id: 575265, // Real TMDB ID for Mission: Impossible - The Final Reckoning
    title: "Mission: Impossible - The Final Reckoning",
    overview: "Tom Cruise returns as Ethan Hunt in what could be his final impossible mission, bringing the legendary franchise to an explosive conclusion. After decades of death-defying stunts and world-saving operations, Hunt faces his most personal and dangerous challenge yet. When a shadowy organization threatens to expose every IMF agent worldwide, Hunt must go completely off the grid to protect his team and complete one last mission that will determine the fate of the entire agency. With returning favorites Hayley Atwell, Ving Rhames, and Simon Pegg, plus new allies and enemies, this film promises to deliver the most ambitious action sequences ever attempted. As Hunt confronts his past and the consequences of a lifetime spent in the shadows, he must decide what he's willing to sacrifice to save the world one final time.",
    release_date: "2025-05-23",
    poster_path: "/NNxYkU70HPurnNCSiCjYAmacwm.jpg", // Mission: Impossible – Dead Reckoning Part One poster
    backdrop_path: "/628Dep6AxEtDxjZoGP78TsOxYbK.jpg",
    genre_ids: [28, 53, 12],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 3900.0
  },
  {
    id: 900006,
    title: "Zootopia 2",
    overview: "Judy Hopps and Nick Wilde return to the vibrant mammalian metropolis of Zootopia for their most ambitious adventure yet. When a mysterious threat emerges that could destroy the delicate harmony between predator and prey, the unlikely partners must venture beyond Zootopia's borders to uncover a conspiracy that reaches into the highest levels of government. Along the way, they discover new districts filled with marine mammals, arctic animals, and desert dwellers, each with their own unique cultures and challenges. With the help of familiar faces like Chief Bogo and Clawhauser, plus exciting new characters, Judy and Nick must navigate complex social dynamics while solving a case that will test not only their detective skills but their friendship. This heartwarming sequel promises to deliver the same clever social commentary, stunning animation, and uplifting message about unity and understanding that made the original a modern classic.",
    release_date: "2025-11-26",
    poster_path: "/hlK0e0wAQ3VLuJcsfIYPvTLS9NIjy.jpg", // Original Zootopia poster
    backdrop_path: "/mhdeE1yShHTaDbJVdWyTlzFvNkr.jpg",
    genre_ids: [16, 35, 12, 10751],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 3400.0
  },
  {
    id: 900007,
    title: "Captain America: Brave New World",
    overview: "Anthony Mackie officially takes up the shield as the new Captain America in this politically charged thriller that explores what it means to be a hero in modern America. When Sam Wilson uncovers a dangerous conspiracy involving the newly elected President Ross (Harrison Ford), he must navigate a complex web of international intrigue while proving himself worthy of Steve Rogers' legacy. With no super-soldier serum to rely on, Sam must use his military training, tactical expertise, and the support of allies like Joaquin Torres and War Machine to stop a threat that could destabilize the entire world. This film tackles contemporary issues of leadership, representation, and the price of doing what's right, even when the system works against you.",
    release_date: "2025-02-14",
    poster_path: "/76AKQAdmUviLYV1FgM3o8MdqECJ.jpg", // The Falcon and the Winter Soldier poster
    backdrop_path: "/b6ZdvTUIifvXu9JdQMntGkzDPyI.jpg",
    genre_ids: [28, 80, 18],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 5200.0
  },
  {
    id: 900008,
    title: "Blade",
    overview: "Mahershala Ali finally brings the legendary Daywalker to the Marvel Cinematic Universe in this supernatural action thriller that reimagines the vampire hunter for a new generation. Born with all the strengths of a vampire but none of their weaknesses, Blade wages a relentless war against the undead creatures that prey on humanity. When an ancient vampire prophecy threatens to plunge the world into eternal darkness, Blade must ally with unlikely partners—including a young vampire trying to resist her nature—to prevent an apocalyptic uprising. Set in the grittier, darker corners of the MCU, this film combines intense martial arts combat with cutting-edge weaponry and explores themes of identity, redemption, and the thin line between monster and hero.",
    release_date: "2025-09-06",
    poster_path: "/dBNAswRmCzSK70l4P4KLNnvp5CL.jpg", // Original Blade 1998 poster
    backdrop_path: "/9CrosjiBEqM6m0VNbG1WRqI5eaz.jpg",
    genre_ids: [28, 27, 14],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 2800.0
  },
  {
    id: 900009,
    title: "How to Train Your Dragon",
    overview: "DreamWorks Animation's beloved tale comes to life in this live-action adaptation that promises to capture all the heart, humor, and adventure of the original. In the Viking village of Berk, young Hiccup Haddock III struggles to live up to his father's expectations as a dragon slayer. But when he encounters Toothless, a rare Night Fury dragon, everything changes. Instead of killing the creature, Hiccup befriends him, discovering that dragons aren't the monsters everyone believes them to be. As their unlikely bond grows stronger, Hiccup must find a way to bridge the gap between his people and the dragons, challenging centuries of tradition and fear. With cutting-edge visual effects bringing the dragons to breathtaking life, this adaptation explores themes of friendship, acceptance, and finding the courage to stand up for what you believe in, even when the whole world is against you.",
    release_date: "2025-06-13",
    poster_path: "/ygGmAO60t8GyqUo9UgQZ4TGzejM.jpg", // Original How to Train Your Dragon poster
    backdrop_path: "/lRhLg0dTdDe8pLDQTOLUYQTGzq7.jpg",
    genre_ids: [12, 14, 10751],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 2600.0
  },
  {
    id: 986056, // Real TMDB ID for Thunderbolts*
    title: "Thunderbolts*",
    overview: "Marvel Studios presents an unlikely team of antiheroes in this morally complex action-comedy that redefines what it means to be heroic. When a covert government operation brings together a group of reformed villains—including Bucky Barnes (Winter Soldier), Yelena Belova (Black Widow), John Walker (U.S. Agent), Ghost, and Taskmaster—they must learn to trust each other while confronting their dark pasts. Led by the enigmatic Valentina Allegra de Fontaine, this dysfunctional team takes on missions too dangerous for traditional heroes. But as they begin to question their handler's true motives, they discover that redemption might come at a higher cost than they ever imagined. Blending intense action with sharp humor and genuine character development, Thunderbolts* explores themes of second chances, family, and finding purpose in an morally ambiguous world.",
    release_date: "2025-05-02",
    poster_path: "/xvzjFuODRkd8oza9zIa6oRz7kL0.jpg", // Suicide Squad poster as placeholder
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    genre_ids: [28, 12, 35],
    vote_average: 0, // Not released yet
    vote_count: 0,
    popularity: 2900.0
  }
];

// Fallback seasonal movies data (fall appropriate genres with real posters)
const FALLBACK_SEASONAL_MOVIES: TMDBMovie[] = [
  {
    id: 900003,
    title: "Terrifier 3",
    overview: "Art the Clown returns for another night of terror in this spine-chilling horror sequel.",
    release_date: "2025-10-31",
    poster_path: "/63xYQj1BwRFielxsBDXvHIJyXVm.jpg", // Real Terrifier poster
    backdrop_path: "/18TSJF1WLA4CkymvVUcKDBwUJ9F.jpg",
    genre_ids: [27, 53],
    vote_average: 6.9,
    vote_count: 1200,
    popularity: 2200.0
  },
  {
    id: 900005,
    title: "A Quiet Place: Day One",
    overview: "Experience the terrifying origins of the alien invasion in this prequel to the acclaimed horror franchise.",
    release_date: "2025-09-15",
    poster_path: "/hU42CRk14JuPEdqZG3AWmagiPAP.jpg", // Real Quiet Place poster
    backdrop_path: "/2RVcJbWFmICRDsVxRI8F5xRmRsK.jpg",
    genre_ids: [27, 53, 18],
    vote_average: 7.8,
    vote_count: 2100,
    popularity: 3100.0
  },
  {
    id: 900006,
    title: "Scream 7",
    overview: "The Ghostface killer returns to terrorize a new generation in Woodsboro.",
    release_date: "2025-11-22",
    poster_path: "/wDWwtvkRRlgTiUr6TyLSMX8FCuZ.jpg", // Real Scream poster
    backdrop_path: "/yOm993lsJyPmBodlYjgpPwMfUC.jpg",
    genre_ids: [27, 53, 9648],
    vote_average: 7.2,
    vote_count: 1800,
    popularity: 2800.0
  }
];

// Fallback biggest upcoming movies data (next 30 days)
const FALLBACK_BIGGEST_UPCOMING_MOVIES: TMDBMovie[] = [
  {
    id: 558449,
    title: "Gladiator II",
    overview: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
    release_date: "2024-11-13",
    poster_path: "/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdrop_path: "/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg",
    genre_ids: [28, 18, 36],
    vote_average: 6.8,
    vote_count: 1432,
    popularity: 2543.876
  },
  {
    id: 402431,
    title: "Wicked",
    overview: "Elphaba, an ostracized but defiant girl born with green skin, and Glinda, a privileged aristocrat born popular, become extremely unlikely friends in the magical Land of Oz.",
    release_date: "2024-11-20",
    poster_path: "/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg",
    backdrop_path: "/uKb22E0nlzr914bA9KyA5CVCOlV.jpg",
    genre_ids: [18, 14, 10402],
    vote_average: 8.6,
    vote_count: 987,
    popularity: 3456.789
  },
  {
    id: 1241982,
    title: "Moana 2",
    overview: "After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
    release_date: "2024-11-27",
    poster_path: "/yh64qw9mgXBvlaWDi7Q9tpUBAvH.jpg",
    backdrop_path: "/tElnmtQ6yz1PjN1kePNl8yMSb59.jpg",
    genre_ids: [16, 12, 35, 10751],
    vote_average: 7.0,
    vote_count: 1876,
    popularity: 4567.890
  },
  {
    id: 762441,
    title: "A Complete Unknown",
    overview: "Set in the influential New York music scene of the early 60s, follow 19-year-old Minnesota musician Bob Dylan's meteoric rise as a folk singer to concert halls and the top of the charts.",
    release_date: "2024-12-25",
    poster_path: "/wfzjpy6giNKHbJfvpDCkhWgHrcd.jpg",
    backdrop_path: "/4zlOPT9CrtIX05bBIkYxNZsm5zN.jpg",
    genre_ids: [18, 10402],
    vote_average: 7.2,
    vote_count: 234,
    popularity: 1234.567
  },
  {
    id: 912649,
    title: "Venom: The Last Dance",
    overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
    release_date: "2024-10-22",
    poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
    backdrop_path: "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
    genre_ids: [878, 53, 28],
    vote_average: 6.8,
    vote_count: 1205,
    popularity: 3876.433
  },
  {
    id: 845781,
    title: "Red One",
    overview: "After Santa Claus—Code Name: RED ONE—is kidnapped, the North Pole's Head of Security must team up with the world's most infamous tracker in a globe-trotting, action-packed mission to save Christmas.",
    release_date: "2024-10-31",
    poster_path: "/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
    backdrop_path: "/tElnmtQ6yz1PjN1kePNl8yMSb59.jpg",
    genre_ids: [28, 35, 14],
    vote_average: 6.9,
    vote_count: 892,
    popularity: 2234.567
  }
];

const FALLBACK_NOW_PLAYING_MOVIES: TMDBMovie[] = [
  {
    id: 558449,
    title: "Gladiator II",
    overview: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
    release_date: "2024-11-13",
    poster_path: "/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdrop_path: "/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg",
    genre_ids: [28, 18, 36],
    vote_average: 6.8,
    vote_count: 1432,
    popularity: 2543.876
  },
  {
    id: 402431,
    title: "Wicked",
    overview: "Elphaba, an ostracized but defiant girl born with green skin, and Glinda, a privileged aristocrat born popular, become extremely unlikely friends in the magical Land of Oz.",
    release_date: "2024-11-20",
    poster_path: "/c5Tqxeo1UpBvnAc3csUm7j3hlQl.jpg",
    backdrop_path: "/uKb22E0nlzr914bA9KyA5CVCOlV.jpg",
    genre_ids: [18, 14, 10402],
    vote_average: 8.6,
    vote_count: 987,
    popularity: 3456.789
  },
  {
    id: 762441,
    title: "A Complete Unknown",
    overview: "Set in the influential New York music scene of the early 60s, follow 19-year-old Minnesota musician Bob Dylan's meteoric rise as a folk singer to concert halls and the top of the charts.",
    release_date: "2024-12-25",
    poster_path: "/wfzjpy6giNKHbJfvpDCkhWgHrcd.jpg",
    backdrop_path: "/4zlOPT9CrtIX05bBIkYxNZsm5zN.jpg",
    genre_ids: [18, 10402],
    vote_average: 7.2,
    vote_count: 234,
    popularity: 1234.567
  },
  {
    id: 1241982,
    title: "Moana 2",
    overview: "After receiving an unexpected call from her wayfinding ancestors, Moana journeys alongside Maui and a new crew to the far seas of Oceania and into dangerous, long-lost waters for an adventure unlike anything she's ever faced.",
    release_date: "2024-11-27",
    poster_path: "/yh64qw9mgXBvlaWDi7Q9tpUBAvH.jpg",
    backdrop_path: "/tElnmtQ6yz1PjN1kePNl8yMSb59.jpg",
    genre_ids: [16, 12, 35, 10751],
    vote_average: 7.0,
    vote_count: 1876,
    popularity: 4567.890
  }
];

// Get trending movies for this week (US region)
export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  try {
    // Use discover endpoint with trending parameters for US region filtering
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStr = today.toISOString().split('T')[0];
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=${weekAgoStr}&primary_release_date.lte=${todayStr}&page=1&region=US&sort_by=popularity.desc&vote_count.gte=50`);
    return data.results.slice(0, 10); // Top 10 trending
  } catch (error) {
    console.warn('TMDB API unavailable, using fallback data');
    return FALLBACK_TRENDING_MOVIES;
  }
}

// Check if a movie is still in theaters (released but revenue might still be growing)
export function isInTheaters(releaseDate: string): boolean {
  const release = new Date(releaseDate);
  const now = new Date();
  const daysSinceRelease = (now.getTime() - release.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceRelease >= 0 && daysSinceRelease <= 45; // Assume 45 days in theaters
}

// Get Fantasy Flix league roster movies (top picks for fantasy leagues)
export async function getFantasyLeagueRoster(page: number = 1): Promise<TMDBMovie[]> {
  try {
    // Get high-potential 2025 movies perfect for fantasy leagues
    const data = await tmdbFetch(`/discover/movie?primary_release_date.gte=2025-01-01&primary_release_date.lte=2025-12-31&page=${page}&region=US&sort_by=popularity.desc&vote_count.gte=10`);
    return data.results.slice(0, 20); // Top 20 fantasy picks
  } catch (error) {
    console.warn('TMDB API unavailable, using fallback fantasy roster');
    return FALLBACK_2025_MOVIES;
  }
}

// Get movie cast information
export async function getMovieCast(movieId: number): Promise<MovieCredits> {
  try {
    const data = await tmdbFetch(`/movie/${movieId}/credits`);
    return data;
  } catch (error) {
    console.error('Error fetching movie cast:', error);
    return { cast: [], crew: [] };
  }
}

// Video interface for TMDB video data
export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
  size: number;
}

// Get movie videos (trailers, teasers, etc.)
export async function getMovieVideos(movieId: number): Promise<{ results: TMDBVideo[] }> {
  try {
    const data = await tmdbFetch(`/movie/${movieId}/videos`);
    return data;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    return { results: [] };
  }
}

// Get the single best official trailer for a movie
export async function getMovieTrailers(movieId: number): Promise<TMDBVideo[]> {
  try {
    const data = await getMovieVideos(movieId);
    
    // Filter to only official trailers on YouTube
    const officialTrailers = data.results
      .filter(video => 
        video.site === 'YouTube' && 
        video.type === 'Trailer' && 
        video.official === true
      );
    
    // If we have official trailers, pick the best one
    if (officialTrailers.length > 0) {
      const bestTrailer = officialTrailers
        .sort((a, b) => {
          // Prioritize by size (higher resolution first)
          if (a.size !== b.size) return b.size - a.size;
          
          // Prioritize by publish date (newer first)
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        })[0];
      
      return [bestTrailer]; // Return single trailer in array
    }
    
    // Fallback: Look for any trailer (official or not)
    const anyTrailers = data.results
      .filter(video => 
        video.site === 'YouTube' && 
        video.type === 'Trailer'
      );
    
    if (anyTrailers.length > 0) {
      const bestTrailer = anyTrailers
        .sort((a, b) => {
          // Prioritize official over fan-made
          if (a.official && !b.official) return -1;
          if (!a.official && b.official) return 1;
          
          // Prioritize by size (higher resolution first)  
          if (a.size !== b.size) return b.size - a.size;
          
          // Prioritize by publish date (newer first)
          return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
        })[0];
      
      return [bestTrailer]; // Return single trailer in array
    }
    
    // No trailers found
    return [];
  } catch (error) {
    console.error('Error fetching movie trailers:', error);
    return [];
  }
}

// Alternative function name for clarity - gets single best trailer
export async function getOfficialTrailer(movieId: number): Promise<TMDBVideo | null> {
  const trailers = await getMovieTrailers(movieId);
  return trailers.length > 0 ? trailers[0] : null;
}

// Generate YouTube embed URL from video key
export function getYouTubeEmbedUrl(videoKey: string, autoplay: boolean = false): string {
  const params = new URLSearchParams({
    rel: '0', // Don't show related videos
    modestbranding: '1', // Reduce YouTube branding
    fs: '1', // Allow fullscreen
    cc_load_policy: '1', // Show captions by default
    iv_load_policy: '3', // Hide video annotations
    ...(autoplay && { autoplay: '1' })
  });
  
  return `https://www.youtube.com/embed/${videoKey}?${params.toString()}`;
}

// Generate YouTube thumbnail URL
export function getYouTubeThumbnailUrl(videoKey: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualityMap = {
    'default': 'default.jpg',
    'medium': 'mqdefault.jpg', 
    'high': 'hqdefault.jpg',
    'maxres': 'maxresdefault.jpg'
  };
  
  return `https://img.youtube.com/vi/${videoKey}/${qualityMap[quality]}`;
}

// Get detailed person/actor information
export async function getPersonDetails(personId: number): Promise<TMDBPersonDetails> {
  try {
    const [personData, creditsData] = await Promise.all([
      tmdbFetch(`/person/${personId}`),
      tmdbFetch(`/person/${personId}/movie_credits`)
    ]);

    // Calculate Fantasy Flix specific metrics
    const boxOfficeTotal = calculateActorBoxOffice(creditsData.cast);
    const averageMovieRating = calculateAverageRating(creditsData.cast);
    const starPowerScore = calculateStarPowerScore(personData, creditsData.cast);
    const fantasyValue = calculateActorFantasyValue(personData, creditsData.cast);
    
    // Note: Oscar data would require additional API calls or manual data
    const oscarWins = estimateOscarWins(personData.name);
    const oscarNominations = estimateOscarNominations(personData.name);

    return {
      ...personData,
      boxOfficeTotal,
      averageMovieRating,
      oscarWins,
      oscarNominations,
      starPowerScore,
      fantasyValue
    };
  } catch (error) {
    console.error('Error fetching person details:', error);
    throw error;
  }
}

// Get person's movie credits (filmography)
export async function getPersonMovieCredits(personId: number): Promise<PersonMovieCredits> {
  try {
    const data = await tmdbFetch(`/person/${personId}/movie_credits`);
    
    // Sort cast by popularity and release date
    const sortedCast = data.cast
      .filter((movie: any) => movie.release_date) // Remove movies without release dates
      .sort((a: any, b: any) => {
        // First sort by popularity, then by release date
        const popularityDiff = b.popularity - a.popularity;
        if (Math.abs(popularityDiff) > 50) return popularityDiff;
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      });

    return {
      cast: sortedCast,
      crew: data.crew || []
    };
  } catch (error) {
    console.error('Error fetching person movie credits:', error);
    return { cast: [], crew: [] };
  }
}

// Calculate total box office for an actor's filmography
function calculateActorBoxOffice(movies: any[]): number {
  // This is an estimation based on movie popularity and vote counts
  // In a real app, you'd need additional API calls to get box office data
  return movies.reduce((total, movie) => {
    if (movie.popularity > 10 && movie.vote_count > 100) {
      // Rough estimation: popularity * vote_count * 1000
      return total + (movie.popularity * movie.vote_count * 1000);
    }
    return total;
  }, 0);
}

// Calculate average movie rating for an actor
function calculateAverageRating(movies: any[]): number {
  const ratedMovies = movies.filter(movie => movie.vote_average > 0 && movie.vote_count > 50);
  if (ratedMovies.length === 0) return 0;
  
  const total = ratedMovies.reduce((sum, movie) => sum + movie.vote_average, 0);
  return Math.round((total / ratedMovies.length) * 10) / 10;
}

// Calculate star power score
function calculateStarPowerScore(person: any, movies: any[]): number {
  const popularityScore = Math.min(person.popularity / 10, 10); // Cap at 10
  const filmographyScore = Math.min(movies.length / 10, 5); // Cap at 5
  const bigMovieScore = movies.filter(m => m.popularity > 50).length / 2; // Big movies bonus
  
  return Math.round((popularityScore + filmographyScore + bigMovieScore) * 10) / 10;
}

// Calculate Fantasy Flix value
function calculateActorFantasyValue(person: any, movies: any[]): number {
  const recentBigMovies = movies.filter(m => {
    const releaseYear = new Date(m.release_date).getFullYear();
    return releaseYear >= 2020 && m.popularity > 30;
  }).length;
  
  const popularityFactor = Math.min(person.popularity / 20, 5);
  const recentActivityFactor = Math.min(recentBigMovies / 2, 5);
  
  return Math.round((popularityFactor + recentActivityFactor) * 10) / 10;
}

// Estimate Oscar wins (simplified - would need external data)
function estimateOscarWins(name: string): number {
  const oscarWinners: { [key: string]: number } = {
    'Leonardo DiCaprio': 1,
    'Matthew McConaughey': 1,
    'Jennifer Lawrence': 1,
    'Brie Larson': 1,
    'Emma Stone': 2,
    'Frances McDormand': 3,
    'Daniel Day-Lewis': 3,
    'Meryl Streep': 3,
    'Katharine Hepburn': 4,
    // Add more as needed
  };
  
  return oscarWinners[name] || 0;
}

// Estimate Oscar nominations (simplified)
function estimateOscarNominations(name: string): number {
  const oscarNominees: { [key: string]: number } = {
    'Leonardo DiCaprio': 7,
    'Brad Pitt': 4,
    'Margot Robbie': 3,
    'Saoirse Ronan': 4,
    'Amy Adams': 6,
    'Glenn Close': 8,
    'Meryl Streep': 21,
    // Add more as needed
  };
  
  return oscarNominees[name] || 0;
}

// Generate mock fantasy league data combining real movies with game mechanics
export function generateLeagueData(movies: TMDBMovie[]) {
  const positions = ['Blockbuster Hero', 'Indie Darling', 'Action Specialist', 'Drama Queen', 'Comedy Gold', 'Horror Master', 'Sci-Fi Visionary', 'Animation Ace'];
  
  return movies.slice(0, 8).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    position: positions[index] || determineFantasyPosition(movie),
    poster: getImageUrl(movie.poster_path),
    projectedEarnings: Math.round((movie.popularity * 1000000) + Math.random() * 50000000),
    currentEarnings: movie.revenue || 0,
    releaseDate: movie.release_date,
    inTheaters: isInTheaters(movie.release_date),
    boxOfficeProjection: calculateBoxOfficeProjection(movie, { cast: [], crew: [] }),
    oscarPotential: calculateOscarPotential(movie, { cast: [], crew: [] }),
    fantasyPoints: calculateFantasyScore(movie as MovieDetails),
    tmdbData: movie,
  }));
}