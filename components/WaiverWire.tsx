'use client'

import { useState, useEffect } from 'react'
import { Movie, WaiverClaim } from '../lib/fantasy-league-types'

interface WaiverWireProps {
  leagueId?: string
  currentPeriod?: 1 | 2
  userId?: string
}

const WaiverWire = ({ leagueId = 'sample-league', currentPeriod = 1, userId = 'user-1' }: WaiverWireProps) => {
  const [availableMovies] = useState<Movie[]>([
    {
      id: 'blade-2025',
      tmdbId: 123456,
      title: "Blade",
      releaseDate: '2025-11-07',
      productionBudget: 200,
      isManualBudget: false,
      imdbRating: 8.2,
      boxOfficeData: [],
      genres: ['Action', 'Horror', 'Fantasy'],
      posterUrl: '/placeholder-movie.jpg',
      runtime: 118,
      director: 'Mahershala Ali',
      cast: ['Mahershala Ali']
    },
    {
      id: 'fantastic-four-2025',
      tmdbId: 234567,
      title: "The Fantastic Four: First Steps",
      releaseDate: '2025-05-02',
      productionBudget: 200,
      isManualBudget: false,
      imdbRating: 7.8,
      boxOfficeData: [],
      genres: ['Action', 'Adventure', 'Sci-Fi'],
      posterUrl: '/placeholder-movie.jpg',
      runtime: 125,
      director: 'Matt Shakman',
      cast: ['Pedro Pascal', 'Vanessa Kirby']
    },
    {
      id: 'shrek-5-2026',
      tmdbId: 345678,
      title: "Shrek 5",
      releaseDate: '2026-07-01',
      productionBudget: 120,
      isManualBudget: false,
      imdbRating: 8.0,
      boxOfficeData: [],
      genres: ['Animation', 'Comedy', 'Family'],
      posterUrl: '/placeholder-movie.jpg',
      runtime: 95,
      director: 'Walt Dohrn',
      cast: ['Mike Myers', 'Cameron Diaz']
    }
  ])

  const [myClaims, setMyClaims] = useState<WaiverClaim[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const [filter, setFilter] = useState<'all' | 'available' | 'claimed'>('all')
  const [showClaimModal, setShowClaimModal] = useState(false)

  const handleClaimMovie = (movie: Movie) => {
    setSelectedMovie(movie)
    setShowClaimModal(true)
  }

  const submitClaim = () => {
    if (!selectedMovie) return
    
    const newClaim: WaiverClaim = {
      id: `claim-${Date.now()}`,
      leagueId,
      userId,
      movieId: selectedMovie.id,
      period: currentPeriod,
      claimTime: new Date().toISOString(),
      processed: false
    }
    
    setMyClaims(prev => [...prev, newClaim])
    setShowClaimModal(false)
    setSelectedMovie(null)
  }

  const isMovieReleased = (releaseDate: string) => {
    return new Date(releaseDate) <= new Date()
  }

  const getProjectedScore = (movie: Movie) => {
    if (!movie.productionBudget || !movie.imdbRating) return 'TBD'
    
    // Simple projection: assume 3x budget in box office - budget cost + IMDB bonus
    const projectedBoxOffice = movie.productionBudget * 3
    const baseScore = projectedBoxOffice - movie.productionBudget
    
    let imdbBonus = 0
    if (movie.imdbRating >= 8.5) imdbBonus = 75
    else if (movie.imdbRating >= 8.0) imdbBonus = 37.5
    else if (movie.imdbRating >= 7.5) imdbBonus = 17.5
    
    return `+$${Math.round(baseScore + imdbBonus)}M`
  }

  return (
    <div className="px-4 py-6 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="glass-dark rounded-2xl p-6 mb-6 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gradient mb-2">🎬 Hollywood Waiver Wire</h1>
            <p className="text-gray-300">First-Come, First-Served • Period {currentPeriod} Active</p>
          </div>
          <div className="flex space-x-2">
            {[
              { key: 'all', label: '🎭 All Blockbusters' },
              { key: 'available', label: '🟢 Available' },
              { key: 'claimed', label: '📋 My Claims' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === key
                    ? 'gradient-blue text-white shadow-lg card-glow'
                    : 'glass hover:scale-105 transform'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4 relative z-10">
        {availableMovies
          .filter(movie => {
            if (filter === 'claimed') return myClaims.some(claim => claim.movieId === movie.id)
            if (filter === 'available') return !isMovieReleased(movie.releaseDate)
            return true
          })
          .map((movie) => {
            const isReleased = isMovieReleased(movie.releaseDate)
            const isClaimed = myClaims.some(claim => claim.movieId === movie.id)
            
            return (
              <div
                key={movie.id}
                className={`glass-dark rounded-2xl p-5 transition-all duration-300 transform hover:scale-105 ${
                  isReleased ? 'opacity-60' : 'hover:card-glow'
                }`}
              >
                {/* Movie Poster */}
                <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={movie.posterUrl || '/placeholder-movie.jpg'}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-movie.jpg'
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    {isReleased ? (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        RELEASED
                      </span>
                    ) : isClaimed ? (
                      <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                        CLAIMED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        AVAILABLE
                      </span>
                    )}
                  </div>
                  
                  {/* Movie Rating Overlay */}
                  {movie.imdbRating && (
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-black bg-opacity-80 px-2 py-1 rounded-lg">
                        <span className="text-yellow-400 font-bold text-sm">⭐ {movie.imdbRating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Movie Info */}
                <h3 className="text-lg font-black text-white mb-3 line-clamp-2">{movie.title}</h3>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Release Date:</span>
                    <span className="text-white font-medium">
                      {new Date(movie.releaseDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Budget:</span>
                    <span className="text-green-400 font-bold">
                      ${movie.productionBudget}M
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Period:</span>
                    <span className="text-blue-400 font-medium">Period {currentPeriod}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Projected:</span>
                    <span className="text-yellow-400 font-bold">{getProjectedScore(movie)}</span>
                  </div>
                </div>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {movie.genres.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                {isReleased ? (
                  <button disabled className="w-full py-3 bg-gray-600 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                    Already Released
                  </button>
                ) : isClaimed ? (
                  <button disabled className="w-full py-3 bg-yellow-600 text-black font-bold rounded-xl">
                    Claim Submitted ✓
                  </button>
                ) : (
                  <button 
                    onClick={() => handleClaimMovie(movie)}
                    className="w-full py-3 gradient-blue text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-200"
                  >
                    🎬 Claim This Blockbuster
                  </button>
                )}
              </div>
            )
          })}
      </div>

      {/* Rules Panel */}
      <div className="mt-8 glass-dark rounded-2xl p-6 relative z-10">
        <h3 className="text-2xl font-bold text-gradient mb-4">🎭 Hollywood Waiver Wire Rules</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white mb-2">📋 Claiming Process</h4>
            <div className="space-y-2 text-gray-300">
              <p>• <span className="text-blue-400">First-Come, First-Served</span> - No priority system</p>
              <p>• Claims are <span className="text-green-400">processed immediately</span></p>
              <p>• Must <span className="text-red-400">drop a movie</span> if roster is full (10 movies)</p>
              <p>• Only <span className="text-yellow-400">unreleased movies</span> can be claimed</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white mb-2">🏆 Strategic Tips</h4>
            <div className="space-y-2 text-gray-300">
              <p>• Monitor <span className="text-purple-400">IMDB ratings</span> for bonus potential</p>
              <p>• Look for <span className="text-green-400">low budget</span> high-potential films</p>
              <p>• Consider <span className="text-blue-400">release timing</span> vs periods</p>
              <p>• Track <span className="text-yellow-400">Oscar potential</span> for championship</p>
            </div>
          </div>
        </div>
        
        {myClaims.length > 0 && (
          <div className="mt-6 p-4 bg-blue-500 bg-opacity-20 rounded-xl">
            <h4 className="text-white font-bold mb-2">📋 Your Active Claims ({myClaims.length})</h4>
            <div className="space-y-1">
              {myClaims.map(claim => (
                <div key={claim.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">
                    {availableMovies.find(m => m.id === claim.movieId)?.title}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    claim.processed 
                      ? claim.successful 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {claim.processed 
                      ? claim.successful ? 'SUCCESS' : 'FAILED'
                      : 'PENDING'
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Claim Modal */}
      {showClaimModal && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gradient mb-4">🎬 Claim Movie</h3>
            
            <div className="mb-6">
              <h4 className="text-xl font-bold text-white mb-2">{selectedMovie.title}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Date:</span>
                  <span className="text-white">
                    {new Date(selectedMovie.releaseDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-green-400">${selectedMovie.productionBudget}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Projected Score:</span>
                  <span className="text-yellow-400">{getProjectedScore(selectedMovie)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500 bg-opacity-20 rounded-xl p-4 mb-6">
              <p className="text-blue-300 text-sm">
                This claim will be processed immediately. Make sure you have roster space 
                or are ready to drop a movie from your current lineup.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowClaimModal(false)}
                className="flex-1 py-3 glass rounded-xl text-white font-medium hover:scale-105 transform transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitClaim}
                className="flex-1 py-3 gradient-blue text-white font-bold rounded-xl hover:scale-105 transform transition-all"
              >
                Confirm Claim 🎯
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WaiverWire