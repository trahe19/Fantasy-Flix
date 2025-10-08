// Drafted Movies State Management
// This manages which movies have been drafted and by whom

export interface DraftedMovie {
  movieId: number
  movieTitle: string
  draftedBy: string
  draftedAt: Date
  leagueId: string
  round?: number
  pick?: number
}

// In-memory store for drafted movies (in production, this would be in database/Supabase)
let draftedMoviesStore: DraftedMovie[] = [
  // Sample drafted movies for demonstration
  {
    movieId: 83533, // Avatar: Fire and Ash
    movieTitle: 'Avatar: Fire and Ash',
    draftedBy: 'user-2',
    draftedAt: new Date('2024-10-01'),
    leagueId: 'sample-league',
    round: 1,
    pick: 3
  },
  {
    movieId: 1061474, // Superman
    movieTitle: 'Superman',
    draftedBy: 'user-3', 
    draftedAt: new Date('2024-10-01'),
    leagueId: 'sample-league',
    round: 1,
    pick: 5
  },
  {
    movieId: 558449, // Gladiator II
    movieTitle: 'Gladiator II',
    draftedBy: 'user-4',
    draftedAt: new Date('2024-10-02'),
    leagueId: 'sample-league',
    round: 2,
    pick: 2
  },
  {
    movieId: 762441, // A Complete Unknown
    movieTitle: 'A Complete Unknown',
    draftedBy: 'user-1',
    draftedAt: new Date('2024-10-02'),
    leagueId: 'sample-league',
    round: 2,
    pick: 4
  },
  {
    movieId: 845781, // Red One
    movieTitle: 'Red One',
    draftedBy: 'user-2',
    draftedAt: new Date('2024-10-03'),
    leagueId: 'sample-league',
    round: 3,
    pick: 1
  },
  {
    movieId: 933260, // The Substance
    movieTitle: 'The Substance',
    draftedBy: 'user-3',
    draftedAt: new Date('2024-10-03'),
    leagueId: 'sample-league',
    round: 3,
    pick: 3
  },
  {
    movieId: 1034541, // Terrifier 3
    movieTitle: 'Terrifier 3',
    draftedBy: 'user-4',
    draftedAt: new Date('2024-10-04'),
    leagueId: 'sample-league',
    round: 4,
    pick: 2
  },
  {
    movieId: 1079091, // It's What's Inside
    movieTitle: "It's What's Inside",
    draftedBy: 'user-1',
    draftedAt: new Date('2024-10-04'),
    leagueId: 'sample-league',
    round: 4,
    pick: 4
  }
]

// Get all drafted movies for a specific league
export function getDraftedMovies(leagueId: string = 'sample-league'): DraftedMovie[] {
  return draftedMoviesStore.filter(movie => movie.leagueId === leagueId)
}

// Check if a specific movie is drafted
export function isMovieDrafted(movieId: number, leagueId: string = 'sample-league'): boolean {
  return draftedMoviesStore.some(movie => 
    movie.movieId === movieId && movie.leagueId === leagueId
  )
}

// Get who drafted a specific movie
export function getMovieDraftedBy(movieId: number, leagueId: string = 'sample-league'): string | null {
  const draftedMovie = draftedMoviesStore.find(movie => 
    movie.movieId === movieId && movie.leagueId === leagueId
  )
  return draftedMovie ? draftedMovie.draftedBy : null
}

// Draft a movie (add to drafted list)
export function draftMovie(
  movieId: number, 
  movieTitle: string, 
  draftedBy: string, 
  leagueId: string = 'sample-league',
  round?: number,
  pick?: number
): boolean {
  // Check if already drafted
  if (isMovieDrafted(movieId, leagueId)) {
    return false
  }

  // Add to drafted movies
  draftedMoviesStore.push({
    movieId,
    movieTitle,
    draftedBy,
    draftedAt: new Date(),
    leagueId,
    round,
    pick
  })

  return true
}

// Remove a movie from drafted list (for testing/admin purposes)
export function undraftMovie(movieId: number, leagueId: string = 'sample-league'): boolean {
  const initialLength = draftedMoviesStore.length
  draftedMoviesStore = draftedMoviesStore.filter(movie => 
    !(movie.movieId === movieId && movie.leagueId === leagueId)
  )
  return draftedMoviesStore.length < initialLength
}

// Get draft summary statistics
export function getDraftSummary(leagueId: string = 'sample-league') {
  const draftedMovies = getDraftedMovies(leagueId)
  const playerCounts = draftedMovies.reduce((acc, movie) => {
    acc[movie.draftedBy] = (acc[movie.draftedBy] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalDrafted: draftedMovies.length,
    playerCounts,
    lastDrafted: draftedMovies.length > 0 ? 
      draftedMovies.sort((a, b) => b.draftedAt.getTime() - a.draftedAt.getTime())[0] : null
  }
}

// Get available movies from a pool (filtering out drafted ones)
export function getAvailableMovies<T extends { id: number }>(
  moviePool: T[], 
  leagueId: string = 'sample-league'
): T[] {
  const draftedIds = new Set(getDraftedMovies(leagueId).map(movie => movie.movieId))
  return moviePool.filter(movie => !draftedIds.has(movie.id))
}

// For debugging - reset all drafted movies
export function resetDraftedMovies(leagueId?: string): void {
  if (leagueId) {
    draftedMoviesStore = draftedMoviesStore.filter(movie => movie.leagueId !== leagueId)
  } else {
    draftedMoviesStore = []
  }
}

// Export the store for direct access if needed (mainly for debugging)
export function getDraftedMoviesStore(): DraftedMovie[] {
  return [...draftedMoviesStore] // Return a copy
}