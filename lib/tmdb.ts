// TMDB API Service for Fantasy Flix
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

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

export interface MovieDetails extends TMDBMovie {
  budget: number;
  revenue: number;
  runtime: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  status: string;
}

// Helper function to build image URLs
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg'; // You can add a placeholder image
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
async function tmdbFetch(endpoint: string): Promise<any> {
  if (!API_KEY) {
    throw new Error('TMDB API key not found. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file.');
  }

  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    
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

// Get popular movies (for featured content)
export async function getPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
  const data = await tmdbFetch(`/movie/popular?page=${page}&region=US`);
  return data.results;
}

// Get detailed movie information including box office
export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const data = await tmdbFetch(`/movie/${movieId}`);
  return data;
}

// Search for movies
export async function searchMovies(query: string, page: number = 1): Promise<TMDBMovie[]> {
  const data = await tmdbFetch(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  return data.results;
}

// Get movies by genre
export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBMovie[]> {
  const data = await tmdbFetch(`/discover/movie?with_genres=${genreId}&page=${page}&region=US`);
  return data.results;
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

// Get trending movies for this week
export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  try {
    const data = await tmdbFetch('/trending/movie/week');
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

// Generate mock fantasy league data combining real movies with game mechanics
export function generateLeagueData(movies: TMDBMovie[]) {
  const positions = ['Blockbuster', 'Indie Darling', 'Action Hero', 'Drama Queen', 'Comedy Gold'];
  
  return movies.slice(0, 5).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    position: positions[index],
    poster: getImageUrl(movie.poster_path),
    projectedEarnings: Math.round((movie.popularity * 1000000) + Math.random() * 50000000),
    currentEarnings: movie.revenue || 0,
    releaseDate: movie.release_date,
    inTheaters: isInTheaters(movie.release_date),
    tmdbData: movie,
  }));
}