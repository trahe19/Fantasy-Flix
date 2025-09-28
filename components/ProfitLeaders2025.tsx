'use client'

import { useState } from 'react'
import { getTop2025Movies } from '../lib/top-2025-box-office'
import { formatBoxOfficeAmount } from '../lib/box-office'
import Top2025BoxOfficeLineChart from './Top2025BoxOfficeLineChart'

export default function ProfitLeaders2025() {
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null)
  const top2025Movies = getTop2025Movies(100)

  return (
    <div className="space-y-8 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent mb-4">
          🏆 2025 Domestic Profit Leaders
        </h1>
        <p className="text-white/70 text-lg">
          The top 100 highest-grossing movies of 2025 in the US domestic market
        </p>
      </div>

      {/* Leaderboard */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-amber-500/20 backdrop-blur-sm overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-12 gap-4 text-sm font-bold text-amber-300 border-b border-gray-700/50 pb-4 mb-4">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Movie Title</div>
            <div className="col-span-2">Release Date</div>
            <div className="col-span-2">Domestic US Total</div>
            <div className="col-span-2">Studio</div>
            <div className="col-span-1">Status</div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {top2025Movies.map((movie) => (
              <div
                key={movie.tmdbId}
                className={`grid grid-cols-12 gap-4 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedMovie === movie.tmdbId
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'hover:bg-gray-700/30 border border-transparent'
                }`}
                onClick={() => setSelectedMovie(selectedMovie === movie.tmdbId ? null : movie.tmdbId)}
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    movie.rank <= 3
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                      : movie.rank <= 10
                      ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black'
                      : 'bg-gray-700 text-white'
                  }`}>
                    {movie.rank}
                  </div>
                </div>

                {/* Movie Title */}
                <div className="col-span-4 flex items-center">
                  <div>
                    <div className="text-white font-semibold">{movie.title}</div>
                    <div className="text-gray-400 text-xs">{movie.genre.join(', ')}</div>
                  </div>
                </div>

                {/* Release Date */}
                <div className="col-span-2 flex items-center text-gray-300 text-sm">
                  {new Date(movie.releaseDate).toLocaleDateString()}
                </div>

                {/* Domestic US Total */}
                <div className="col-span-2 flex items-center">
                  <div className="text-green-400 font-bold">
                    {formatBoxOfficeAmount(movie.domesticTotal)}
                  </div>
                </div>

                {/* Studio */}
                <div className="col-span-2 flex items-center text-gray-300 text-sm">
                  {movie.studio}
                </div>

                {/* Status */}
                <div className="col-span-1 flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    movie.status === 'current'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {movie.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Movie Chart */}
      {selectedMovie && (
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl border border-amber-500/20 backdrop-blur-sm p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Weekly Box Office Performance
          </h3>
          <div className="flex justify-center">
            <Top2025BoxOfficeLineChart
              movieId={selectedMovie}
              title={top2025Movies.find(m => m.tmdbId === selectedMovie)?.title || ''}
              className="w-full max-w-2xl"
            />
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-xl border border-green-500/20 p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {formatBoxOfficeAmount(top2025Movies.reduce((sum, movie) => sum + movie.domesticTotal, 0))}
          </div>
          <div className="text-green-300 text-sm">Total 2025 US Revenue</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-xl border border-blue-500/20 p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {top2025Movies.filter(m => m.status === 'current').length}
          </div>
          <div className="text-blue-300 text-sm">Still in Theaters</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 rounded-xl border border-purple-500/20 p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">
            {formatBoxOfficeAmount(
              top2025Movies.reduce((sum, movie) => sum + movie.domesticTotal, 0) / top2025Movies.length
            )}
          </div>
          <div className="text-purple-300 text-sm">Average Domestic Box Office</div>
        </div>
      </div>
    </div>
  )
}