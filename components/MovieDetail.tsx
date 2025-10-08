'use client'

import { memo } from 'react'
import { BoxOfficeGrid, BoxOfficeProjectionBar } from './ResponsiveBoxOfficeDisplay'

interface MovieDetailProps {
  movie: any
  onClose: () => void
  onDraft?: () => void
}

const MovieDetail = memo(function MovieDetail({ movie, onClose, onDraft }: MovieDetailProps) {
  const movieDetails = {
    'Dune: Part Three': {
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Florence Pugh'],
      synopsis: 'The epic conclusion to the Dune saga. Paul Atreides must face his ultimate destiny as the universe hangs in the balance.',
      rating: 'PG-13',
      runtime: '165 min',
      distributor: 'Warner Bros',
      budget: 190000000,
      projectedOpening: 85000000,
      projectedTotal: 650000000
    },
    'Avatar: Fire and Ash': {
      director: 'James Cameron',
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      synopsis: 'The next chapter in the Avatar saga brings new challenges and adventures to Pandora.',
      rating: 'PG-13',
      runtime: '180 min',
      distributor: '20th Century Studios',
      budget: 350000000,
      projectedOpening: 180000000,
      projectedTotal: 2300000000
    },
    'Mission: Impossible - The Final Reckoning': {
      director: 'Christopher McQuarrie',
      cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames'],
      synopsis: 'Ethan Hunt faces his most dangerous mission yet in this explosive finale.',
      rating: 'PG-13',
      runtime: '155 min',
      distributor: 'Paramount Pictures',
      budget: 290000000,
      projectedOpening: 85000000,
      projectedTotal: 750000000
    }
  }

  const details = movieDetails[movie.title] || {
    director: 'Unknown',
    cast: [],
    synopsis: 'Details coming soon...',
    rating: 'Not Rated',
    runtime: 'TBD',
    distributor: 'TBD',
    budget: 0,
    projectedOpening: 0,
    projectedTotal: 0
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20">

        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors"
          >
            ×
          </button>

          <div className="flex items-start gap-6">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/media/w500${movie.poster_path}` : '/placeholder-movie.jpg'}
              alt={movie.title}
              className="w-32 h-48 object-cover rounded-lg border border-amber-500/30"
            />

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-amber-300 mb-2">{movie.title}</h2>
              <p className="text-gray-300 text-lg mb-4 leading-relaxed">{movie.overview || details.synopsis}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-amber-400 font-semibold">Director:</span>
                  <span className="ml-2 text-gray-300">{details.director}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold">Rating:</span>
                  <span className="ml-2 text-gray-300">{details.rating}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold">Runtime:</span>
                  <span className="ml-2 text-gray-300">{details.runtime}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold">Distributor:</span>
                  <span className="ml-2 text-gray-300">{details.distributor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Box Office Section */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-amber-300 mb-6">📊 Box Office Projections</h3>

          {/* Main Box Office Grid */}
          <BoxOfficeGrid
            budget={details.budget}
            projectedOpening={details.projectedOpening}
            projectedTotal={details.projectedTotal}
            className="mb-8"
          />

          {/* Performance Projections */}
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h4 className="text-xl font-bold text-amber-300 mb-4">Performance Projections</h4>
            <div className="space-y-4">
              <BoxOfficeProjectionBar
                label="Opening Weekend"
                amount={details.projectedOpening}
                percentage={60}
                color="from-green-500 to-green-400"
              />
              <BoxOfficeProjectionBar
                label="First Month"
                amount={details.projectedTotal * 0.4}
                percentage={80}
                color="from-yellow-500 to-yellow-400"
              />
              <BoxOfficeProjectionBar
                label="Total Lifetime"
                amount={details.projectedTotal}
                percentage={100}
                color="from-blue-500 to-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Cast */}
        {details.cast.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="text-xl font-bold text-amber-300 mb-3">🎭 Starring</h3>
            <div className="flex flex-wrap gap-2">
              {details.cast.map((actor, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm border border-amber-500/20"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-700 flex gap-4">
          {onDraft && (
            <button
              onClick={onDraft}
              className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-700 hover:to-amber-600 transition-all duration-200 shadow-lg"
            >
              🎯 Draft This Movie
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
})

export default MovieDetail