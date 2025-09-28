'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UpcomingMovie, getUpcomingMoviesForVault } from '../lib/upcoming-movies'
import { getImageUrl } from '../lib/tmdb'

interface TheVaultProps {
  leagueId?: string
  currentPeriod?: 1 | 2
  userId?: string
}

interface FilterOptions {
  search: string
  genre: string
  minBudget: number
  maxBudget: number
  releaseYear: string
  sortBy: 'title' | 'release_date' | 'budget' | 'draft_potential' | 'box_office_projection' | 'profit_projection'
  sortOrder: 'asc' | 'desc'
}

interface RosterSlot {
  id: string
  userId: string
  movieId: string
}

const TheVault = ({ leagueId = 'sample-league', currentPeriod = 1, userId = 'user-1' }: TheVaultProps) => {
  const router = useRouter()

  // Live TMDB data for upcoming movies
  const [allMovies, setAllMovies] = useState<UpcomingMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock roster data - movies taken by league members
  const [takenMovies] = useState<RosterSlot[]>([
    { id: '1', userId: 'user-2', movieId: '83533' }, // Avatar: Fire and Ash
    { id: '2', userId: 'user-3', movieId: '1061474' } // Superman
  ])

  // Fetch upcoming movies on component mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const movies = await getUpcomingMoviesForVault()
        setAllMovies(movies)
      } catch (err) {
        setError('Failed to load upcoming movies. Please try again later.')
        console.error('Error loading movies:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    genre: '',
    minBudget: 0,
    maxBudget: 500,
    releaseYear: '',
    sortBy: 'draft_potential',
    sortOrder: 'desc'
  })

  const [selectedMovies, setSelectedMovies] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Unique genres for filter dropdown (using TMDB genre mapping)
  const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
  }

  const allGenres = Array.from(new Set(
    allMovies.flatMap(movie =>
      movie.genre_ids.map(id => genreMap[id as keyof typeof genreMap]).filter(Boolean)
    )
  )).sort()

  // Filter and sort movies
  const filteredMovies = allMovies
    .filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           movie.director?.toLowerCase().includes(filters.search.toLowerCase()) ||
                           movie.main_cast?.some(actor => actor.toLowerCase().includes(filters.search.toLowerCase()))

      const movieGenres = movie.genre_ids.map(id => genreMap[id as keyof typeof genreMap]).filter(Boolean)
      const matchesGenre = !filters.genre || movieGenres.includes(filters.genre)

      const budget = movie.estimated_budget || movie.production_budget || 0
      const matchesBudget = budget >= (filters.minBudget * 1000000) &&
                           budget <= (filters.maxBudget * 1000000)

      const matchesYear = !filters.releaseYear ||
                         new Date(movie.release_date).getFullYear().toString() === filters.releaseYear

      return matchesSearch && matchesGenre && matchesBudget && matchesYear
    })
    .sort((a, b) => {
      let aValue, bValue

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'release_date':
          aValue = new Date(a.release_date).getTime()
          bValue = new Date(b.release_date).getTime()
          break
        case 'budget':
          aValue = a.estimated_budget || a.production_budget || 0
          bValue = b.estimated_budget || b.production_budget || 0
          break
        case 'draft_potential':
          aValue = a.draft_potential?.overall_score || 0
          bValue = b.draft_potential?.overall_score || 0
          break
        case 'box_office_projection':
          aValue = a.worldwide_projection || 0
          bValue = b.worldwide_projection || 0
          break
        case 'profit_projection':
          aValue = a.profit_projection || 0
          bValue = b.profit_projection || 0
          break
        default:
          return 0
      }

      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }
    })

  const isMovieTaken = (movieId: number) => {
    return takenMovies.some(slot => slot.movieId === movieId.toString())
  }

  const getTakenByUser = (movieId: number) => {
    const slot = takenMovies.find(slot => slot.movieId === movieId.toString())
    return slot ? `User ${slot.userId.split('-')[1]}` : null
  }

  const handleMovieSelect = (movieId: number) => {
    const movieIdStr = movieId.toString()
    setSelectedMovies(prev =>
      prev.includes(movieIdStr)
        ? prev.filter(id => id !== movieIdStr)
        : [...prev, movieIdStr]
    )
  }

  const handleAddToWatchlist = (movieId: number) => {
    // In production, this would make an API call to add the movie to watchlist
    alert(`Added "${allMovies.find(m => m.id === movieId)?.title}" to your watchlist!`)
  }

  const handleTargetForDraft = (movieId: number) => {
    // In production, this would make an API call to target the movie for draft
    alert(`Targeted "${allMovies.find(m => m.id === movieId)?.title}" for draft!`)
  }

  const handleViewDetails = (movieId: number) => {
    router.push(`/vault/movie/${movieId}`)
  }

  const handleBulkAddToWatchlist = () => {
    const availableSelected = selectedMovies.filter(id => !isMovieTaken(parseInt(id)))
    if (availableSelected.length === 0) {
      alert('No available movies selected')
      return
    }

    // In production, this would make an API call to add multiple movies
    const movieTitles = availableSelected.map(id =>
      allMovies.find(m => m.id === parseInt(id))?.title
    ).join(', ')

    alert(`Added ${availableSelected.length} movies to your watchlist: ${movieTitles}`)
    setSelectedMovies([])
  }

  // Loading state
  if (loading) {
    return (
      <div className="px-4 py-6 relative min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading The Vault</h2>
            <p className="text-gray-400">Discovering upcoming blockbusters...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="px-4 py-6 relative min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Error Loading The Vault</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:from-amber-400 hover:to-yellow-400 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 relative min-h-screen">
      {/* Vault Ambiance Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header Section */}
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 mb-6 relative z-10 border border-amber-500/20 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent mb-2">
              🏛️ The Vault
            </h1>
            <p className="text-gray-300 text-lg">
              Exclusive archive of premium movie selections • Period {currentPeriod} Active
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-amber-500 text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                List
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showFilters
                  ? 'bg-amber-500 text-black shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🔍 Filters
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, director, or actor..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full p-4 pl-12 bg-black/40 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 mb-6 relative z-10 border border-amber-500/20 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">🎯 Advanced Filters</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Genre Filter */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-amber-500 transition-all"
              >
                <option value="">All Genres</option>
                {allGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Budget Range (M)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minBudget === 0 ? '' : filters.minBudget}
                  onChange={(e) => setFilters(prev => ({ ...prev, minBudget: Number(e.target.value) || 0 }))}
                  className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-amber-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxBudget === 500 ? '' : filters.maxBudget}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: Number(e.target.value) || 500 }))}
                  className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Release Year */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Release Year</label>
              <select
                value={filters.releaseYear}
                onChange={(e) => setFilters(prev => ({ ...prev, releaseYear: e.target.value }))}
                className="w-full p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-amber-500 transition-all"
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-gray-300 font-medium mb-2">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="flex-1 p-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-amber-500 transition-all"
                >
                  <option value="draft_potential">Draft Potential</option>
                  <option value="box_office_projection">Box Office Projection</option>
                  <option value="profit_projection">Profit Projection</option>
                  <option value="release_date">Release Date</option>
                  <option value="title">Title</option>
                  <option value="budget">Budget</option>
                </select>
                <button
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
                  }))}
                  className="px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-all"
                >
                  {filters.sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                search: '',
                genre: '',
                minBudget: 0,
                maxBudget: 500,
                releaseYear: '',
                sortBy: 'release_date',
                sortOrder: 'asc'
              })}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedMovies.length > 0 && (
        <div className="bg-amber-500/10 backdrop-blur-xl rounded-2xl p-4 mb-6 relative z-10 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-amber-200 font-medium">
              {selectedMovies.length} movie{selectedMovies.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedMovies([])}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
              >
                Clear Selection
              </button>
              <button
                onClick={handleBulkAddToWatchlist}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-lg hover:from-amber-400 hover:to-yellow-400 transition-all"
              >
                Add Selected to Watchlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movie Grid/List */}
      <div className="relative z-10">
        {filteredMovies.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">No Movies Found</h2>
            <p className="text-gray-400 text-lg mb-8">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setFilters({
                search: '',
                genre: '',
                minBudget: 0,
                maxBudget: 500,
                releaseYear: '',
                sortBy: 'release_date',
                sortOrder: 'asc'
              })}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:from-amber-400 hover:to-yellow-400 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredMovies.map((movie) => {
              const isTaken = isMovieTaken(movie.id)
              const takenBy = getTakenByUser(movie.id)
              const isSelected = selectedMovies.includes(movie.id.toString())

              return (
                <div
                  key={movie.id}
                  className={`group relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 border ${
                    isTaken
                      ? 'border-red-500/30 opacity-75'
                      : isSelected
                        ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                        : 'border-gray-700/50 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/10'
                  }`}
                >
                  {/* Selection Checkbox */}
                  {!isTaken && (
                    <button
                      onClick={() => handleMovieSelect(movie.id)}
                      className={`absolute top-3 left-3 z-20 w-6 h-6 rounded border-2 transition-all ${
                        isSelected
                          ? 'bg-amber-500 border-amber-500'
                          : 'border-gray-400 hover:border-amber-500'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-black mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}

                  {/* Movie Poster */}
                  <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.svg'
                      }}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {isTaken ? (
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                          TAKEN
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                          AVAILABLE
                        </span>
                      )}
                    </div>

                    {/* Draft Potential Overlay */}
                    {movie.draft_potential && (
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-500/30">
                          <span className="text-amber-400 font-bold text-sm">🎯 {movie.draft_potential.overall_score}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Movie Info */}
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {movie.title}
                  </h3>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Release:</span>
                      <span className="text-white font-medium">
                        {new Date(movie.release_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-green-400 font-bold">
                        ${Math.round((movie.estimated_budget || movie.production_budget || 0) / 1000000)}M
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Profit Proj:</span>
                      <span className="text-amber-400 font-bold">
                        ${Math.round((movie.profit_projection || 0) / 1000000)}M
                      </span>
                    </div>

                    {isTaken && takenBy && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Taken by:</span>
                        <span className="text-red-400 font-medium">{takenBy}</span>
                      </div>
                    )}
                  </div>

                  {/* Genre Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {movie.genre_ids.slice(0, 2).map((genreId, idx) => {
                      const genreName = genreMap[genreId as keyof typeof genreMap]
                      return genreName ? (
                        <span key={idx} className="px-2 py-1 bg-gray-800/60 text-gray-300 text-xs rounded-full border border-gray-600/50">
                          {genreName}
                        </span>
                      ) : null
                    })}
                  </div>

                  {/* Action Buttons */}
                  {isTaken ? (
                    <button disabled className="w-full py-3 bg-red-500/20 text-red-400 border border-red-500/30 font-medium rounded-xl cursor-not-allowed">
                      Unavailable
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleViewDetails(movie.id)}
                        className="w-full py-2 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-all"
                      >
                        📊 View Analysis
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToWatchlist(movie.id)}
                          className="py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all text-sm"
                        >
                          📋 Watchlist
                        </button>
                        <button
                          onClick={() => handleTargetForDraft(movie.id)}
                          className="py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-lg hover:from-amber-400 hover:to-yellow-400 transition-all text-sm"
                        >
                          🎯 Target
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredMovies.map((movie) => {
              const isTaken = isMovieTaken(movie.id)
              const takenBy = getTakenByUser(movie.id)
              const isSelected = selectedMovies.includes(movie.id.toString())

              return (
                <div
                  key={movie.id}
                  className={`bg-gray-900/80 backdrop-blur-xl rounded-xl p-6 transition-all duration-200 border ${
                    isTaken
                      ? 'border-red-500/30 opacity-75'
                      : isSelected
                        ? 'border-amber-500 shadow-lg shadow-amber-500/20'
                        : 'border-gray-700/50 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex gap-6">
                    {/* Selection Checkbox */}
                    {!isTaken && (
                      <button
                        onClick={() => handleMovieSelect(movie.id)}
                        className={`w-6 h-6 rounded border-2 transition-all flex-shrink-0 ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500'
                            : 'border-gray-400 hover:border-amber-500'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-black mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* Poster */}
                    <div className="w-20 h-28 flex-shrink-0">
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-movie.svg'
                        }}
                      />
                    </div>

                    {/* Movie Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-3">
                            <span>📅 {new Date(movie.release_date).toLocaleDateString()}</span>
                            <span>💰 ${Math.round((movie.estimated_budget || movie.production_budget || 0) / 1000000)}M</span>
                            {movie.vote_average && <span>⭐ {movie.vote_average.toFixed(1)}</span>}
                            {movie.director && <span>🎬 {movie.director}</span>}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {movie.genre_ids.slice(0, 3).map((genreId, idx) => {
                              const genreName = genreMap[genreId as keyof typeof genreMap]
                              return genreName ? (
                                <span key={idx} className="px-2 py-1 bg-gray-800/60 text-gray-300 text-xs rounded-full border border-gray-600/50">
                                  {genreName}
                                </span>
                              ) : null
                            })}
                          </div>
                        </div>

                        {/* Status and Action */}
                        <div className="flex flex-col items-end gap-3">
                          {isTaken ? (
                            <>
                              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                TAKEN
                              </span>
                              {takenBy && (
                                <span className="text-red-400 text-sm">by {takenBy}</span>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                AVAILABLE
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewDetails(movie.id)}
                                  className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all text-sm"
                                >
                                  📊 Analysis
                                </button>
                                <button
                                  onClick={() => handleTargetForDraft(movie.id)}
                                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-lg hover:from-amber-400 hover:to-yellow-400 transition-all text-sm"
                                >
                                  🎯 Target
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Results Footer */}
      <div className="mt-8 text-center">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 inline-block border border-gray-700/50">
          <p className="text-gray-300">
            Showing {filteredMovies.length} of {allMovies.length} movies in The Vault
          </p>
        </div>
      </div>
    </div>
  )
}

export default TheVault