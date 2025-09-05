'use client'

import { useState } from 'react'
import { get2025Movies, getImageUrl, formatCurrency, TMDBMovie } from '../lib/tmdb'

const WaiverWire = () => {
  const [availableMovies] = useState<TMDBMovie[]>([
    {
      id: 1,
      title: "Blade",
      overview: "The vampire hunter returns in this highly anticipated reboot.",
      poster_path: "/placeholder.jpg",
      backdrop_path: null,
      release_date: "2025-11-07",
      vote_average: 8.2,
      vote_count: 1500,
      popularity: 85.5,
      revenue: 0,
      budget: 200000000,
      genre_ids: [28, 14, 27]
    },
    {
      id: 2,
      title: "The Fantastic Four: First Steps",
      overview: "Marvel's first family gets a fresh start in the MCU.",
      poster_path: "/placeholder.jpg",
      backdrop_path: null,
      release_date: "2025-05-02",
      vote_average: 7.8,
      vote_count: 2200,
      popularity: 92.1,
      revenue: 256000000,
      budget: 200000000,
      genre_ids: [28, 12, 878]
    },
    {
      id: 3,
      title: "Shrek 5",
      overview: "The ogre is back for one more adventure.",
      poster_path: "/placeholder.jpg",
      backdrop_path: null,
      release_date: "2026-07-01",
      vote_average: 8.0,
      vote_count: 1800,
      popularity: 78.3,
      revenue: 0,
      budget: 120000000,
      genre_ids: [16, 35, 10751]
    }
  ])

  const [filter, setFilter] = useState<'all' | 'available' | 'claimed'>('all')

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">Waiver Wire</h2>
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Movies' },
            { key: 'available', label: 'Available' },
            { key: 'claimed', label: 'Recently Claimed' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                filter === key
                  ? 'gradient-blue text-white shadow-sm border border-gray-300 dark:border-gray-600'
                  : 'glass hover:card-glow'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {availableMovies.map((movie) => (
          <div
            key={movie.id}
            className="glass-elegant p-4 hover:card-glow transition-all cursor-pointer"
          >
            <div className="aspect-[2/3] relative overflow-hidden mb-3">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-movie.jpg'
                }}
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                  AVAILABLE
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
              {movie.title}
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Release:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {new Date(movie.release_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {movie.vote_average.toFixed(1)}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(movie.budget)}
                </span>
              </div>
            </div>

            <button className="w-full mt-4 py-2 gradient-blue text-white font-medium rounded hover:opacity-90 transition-all">
              Claim Movie
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-elegant p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Waiver Wire Rules</h3>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>• Claims process every Wednesday at 12:00 AM EST</p>
          <p>• Priority based on reverse standings (worst record gets first pick)</p>
          <p>• You must drop a movie to claim a new one if your roster is full</p>
          <p>• Movies can only be claimed if they haven't been released yet</p>
        </div>
      </div>
    </div>
  )
}

export default WaiverWire