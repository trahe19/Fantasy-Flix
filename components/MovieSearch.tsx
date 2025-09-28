'use client'

import { useState, useEffect } from 'react'
import { searchMovies, searchAll, get2025Movies, getFantasyLeagueRoster, TMDBMovie, TMDBPerson, SearchResults, getImageUrl } from '../lib/tmdb'
import { navigateToActor } from '../lib/navigation'
import MovieDetailModal from './MovieDetailModal'

interface MovieSearchProps {
  isOpen: boolean
  onClose: () => void
}

export default function MovieSearch({ isOpen, onClose }: MovieSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResults>({ movies: [], actors: [] })
  const [featuredMovies, setFeaturedMovies] = useState<TMDBMovie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'search' | '2025' | 'fantasy'>('search')
  const [searchResultTab, setSearchResultTab] = useState<'movies' | 'actors'>('movies')

  // Load featured movies on open
  useEffect(() => {
    if (isOpen && activeTab !== 'search') {
      loadFeaturedMovies()
    }
  }, [isOpen, activeTab])

  const loadFeaturedMovies = async () => {
    try {
      if (activeTab === '2025') {
        const movies = await get2025Movies()
        setFeaturedMovies(movies.slice(0, 20))
      } else if (activeTab === 'fantasy') {
        const movies = await getFantasyLeagueRoster()
        setFeaturedMovies(movies.slice(0, 20))
      }
    } catch (error) {
      console.error('Error loading featured movies:', error)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ movies: [], actors: [] })
      return
    }

    setIsSearching(true)
    try {
      const results = await searchAll(query)
      setSearchResults({
        movies: results.movies.slice(0, 20),
        actors: results.actors.slice(0, 20)
      })
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults({ movies: [], actors: [] })
    } finally {
      setIsSearching(false)
    }
  }

  const handleMovieClick = (movie: TMDBMovie) => {
    setSelectedMovie(movie)
    setShowMovieModal(true)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleActorClick = (actor: TMDBPerson) => {
    // Navigate to actor profile with search context
    navigateToActor(actor.id, {
      from: 'search',
      fromTitle: `Search results for "${searchQuery}"`,
      fromPath: window.location.pathname + window.location.search
    })
  }

  if (!isOpen) return null

  const displayMovies = activeTab === 'search' 
    ? (searchResultTab === 'movies' ? searchResults.movies : [])
    : featuredMovies
  const displayActors = activeTab === 'search' && searchResultTab === 'actors' ? searchResults.actors : []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-amber-500/20 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-amber-500/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
              Movie Search & Browse
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'search' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Search Movies
            </button>
            <button
              onClick={() => { setActiveTab('2025'); loadFeaturedMovies(); }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === '2025' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              2025 Movies
            </button>
            <button
              onClick={() => { setActiveTab('fantasy'); loadFeaturedMovies(); }}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'fantasy' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              Fantasy Picks
            </button>
          </div>

          {/* Search Input */}
          {activeTab === 'search' && (
            <div>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search for movies, actors, directors..."
                  className="w-full px-6 py-4 bg-gray-800/50 border border-amber-500/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:bg-gray-800/70 transition-all"
                />
                <svg 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-amber-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Search Result Tabs */}
              {searchQuery && (
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setSearchResultTab('movies')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      searchResultTab === 'movies'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    Movies ({searchResults.movies.length})
                  </button>
                  <button
                    onClick={() => setSearchResultTab('actors')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                      searchResultTab === 'actors'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    Actors ({searchResults.actors.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'search' && !searchQuery && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Search Movies</h3>
              <p className="text-gray-400">Enter a movie title, actor name, or director to get started</p>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Searching movies...</p>
            </div>
          )}

          {/* Movie Results */}
          {displayMovies.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayMovies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-700/50 hover:border-amber-500/30"
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.svg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div className="absolute bottom-1 left-1 right-1">
                      <p className="text-white font-bold text-xs leading-tight mb-1 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{movie.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-yellow-300 text-xs font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{movie.vote_average.toFixed(1)}</span>
                        <span className="text-blue-300 text-xs font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actor Results */}
          {displayActors.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayActors.map((actor) => (
                <div
                  key={actor.id}
                  onClick={() => handleActorClick(actor)}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-700/50 hover:border-amber-500/30 group"
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/placeholder-movie.svg'}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.svg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    {/* View Profile Button */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-amber-500 text-black text-xs px-2 py-1 rounded-lg font-bold shadow-lg">
                        View Profile
                      </div>
                    </div>
                    
                    <div className="absolute bottom-1 left-1 right-1">
                      <p className="text-white font-bold text-xs leading-tight mb-1 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{actor.name}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-300 text-xs font-semibold drop-shadow-md truncate" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{actor.known_for_department}</span>
                        <span className="text-amber-300 text-xs font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>★ {actor.popularity.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'search' && searchQuery && searchResults.movies.length === 0 && searchResults.actors.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5.9-6.084 2.291" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-gray-400">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={showMovieModal}
          onClose={() => {
            setShowMovieModal(false)
            setSelectedMovie(null)
          }}
        />
      )}
    </div>
  )
}