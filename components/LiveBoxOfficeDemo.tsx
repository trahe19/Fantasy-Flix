'use client'

import { useState, useEffect } from 'react'
import BoxOfficeChart from './BoxOfficeChart'

interface LiveMovie {
  tmdbId: number
  title: string
  releaseDate: string
  isInTheaters: boolean
  daysInTheaters: number
  estimatedTheaterCount: number
}

export default function LiveBoxOfficeDemo() {
  const [liveMovies, setLiveMovies] = useState<LiveMovie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<LiveMovie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLiveMovies()
  }, [])

  const fetchLiveMovies = async () => {
    try {
      const response = await fetch('/api/box-office?action=live-movies')
      const result = await response.json()

      if (result.success) {
        setLiveMovies(result.data.slice(0, 6)) // Show top 6 movies
        if (result.data.length > 0) {
          setSelectedMovie(result.data[0]) // Auto-select first movie
        }
      }
    } catch (error) {
      console.error('Error fetching live movies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-amber-500/20">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4 w-64"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Movies List */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-amber-300">🎬 Live Box Office Data</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">Real-time Updates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {liveMovies.map((movie) => (
            <button
              key={movie.tmdbId}
              onClick={() => setSelectedMovie(movie)}
              className={`p-4 rounded-xl border transition-all text-left ${
                selectedMovie?.tmdbId === movie.tmdbId
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-700/30 hover:bg-gray-700/50'
              }`}
            >
              <h3 className="font-bold text-white text-sm mb-2 line-clamp-2">{movie.title}</h3>
              <div className="space-y-1 text-xs text-gray-400">
                <div>📅 Released: {new Date(movie.releaseDate).toLocaleDateString()}</div>
                <div>🎪 {movie.estimatedTheaterCount.toLocaleString()} theaters</div>
                <div>⏱️ Day {movie.daysInTheaters} in theaters</div>
              </div>
            </button>
          ))}
        </div>

        {liveMovies.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v10h6V6H9z" />
              </svg>
            </div>
            <p className="text-gray-400">No movies currently playing with box office data</p>
          </div>
        )}
      </div>

      {/* Selected Movie Box Office Chart */}
      {selectedMovie && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-2">{selectedMovie.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>📅 Released: {new Date(selectedMovie.releaseDate).toLocaleDateString()}</span>
              <span>🎪 {selectedMovie.estimatedTheaterCount.toLocaleString()} theaters</span>
              <span>⏱️ Day {selectedMovie.daysInTheaters}</span>
            </div>
          </div>

          <BoxOfficeChart
            movieId={selectedMovie.tmdbId}
            title={selectedMovie.title}
            releaseDate={selectedMovie.releaseDate}
            className="w-full"
          />
        </div>
      )}

      {/* Demo Info */}
      <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-bold text-blue-300 mb-3">🚀 Enhanced Box Office Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-2">📊 Live Data Sources:</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• TMDB financial data</li>
              <li>• OMDb box office numbers</li>
              <li>• Real-time theater counts</li>
              <li>• Weekly earnings tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">⚡ Auto-Updates:</h4>
            <ul className="space-y-1 text-gray-300">
              <li>• Refreshes every 5 minutes</li>
              <li>• Current theatrical releases</li>
              <li>• 30-day performance window</li>
              <li>• Real vs. estimated data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}