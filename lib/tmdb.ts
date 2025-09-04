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
  const data = await tmdbFetch(`/movie/now_playing?page=${page}&region=US`);
  return data.results;
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

// Get trending movies for this week
export async function getTrendingMovies(): Promise<TMDBMovie[]> {
  const data = await tmdbFetch('/trending/movie/week');
  return data.results.slice(0, 10); // Top 10 trending
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