'use client'

import { useState } from 'react'
import MovieDetailModal from './MovieDetailModal'
import { TMDBMovie } from '../lib/tmdb'

export default function NavigationTest() {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  // Sample movies with real TMDB data for testing navigation
  const testMovies: TMDBMovie[] = [
    {
      id: 533535,
      title: "Deadpool & Wolverine",
      overview: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.",
      release_date: "2024-07-24",
      poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
      backdrop_path: "/yDHYTfA3R0jFYba4zF1kmufbfeD.jpg",
      genre_ids: [28, 35, 878],
      vote_average: 7.7,
      vote_count: 5234,
      popularity: 2845.123
    },
    {
      id: 912649,
      title: "Venom: The Last Dance",
      overview: "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision.",
      release_date: "2024-10-22",
      poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
      backdrop_path: "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
      genre_ids: [878, 53, 28],
      vote_average: 6.8,
      vote_count: 1205,
      popularity: 3876.433
    },
    {
      id: 558449,
      title: "Gladiator II",
      overview: "Years after witnessing the death of the revered hero Maximus, Lucius is forced to enter the Colosseum after his home is conquered.",
      release_date: "2024-11-13",
      poster_path: "/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
      backdrop_path: "/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg",
      genre_ids: [28, 18, 36],
      vote_average: 6.8,
      vote_count: 1432,
      popularity: 2543.876
    }
  ]

  const handleMovieClick = (movie: TMDBMovie) => {
    setSelectedMovie(movie)
    setShowMovieModal(true)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">🎬 Navigation Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-amber-300">Test Movie-to-Actor Navigation</h2>
        <p className="text-gray-300 mb-6">
          Click on any movie below → Click on actor names in the cast list → Navigate to actor profiles with back navigation
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {testMovies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => handleMovieClick(movie)}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-amber-500/50 shadow-xl"
          >
            <div className="aspect-[2/3] relative">
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.svg'}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-movie.svg'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="text-white font-bold text-base mb-1 drop-shadow-lg leading-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9)'}}>{movie.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-300 text-sm font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>⭐ {movie.vote_average.toFixed(1)}</span>
                  <span className="text-blue-300 text-sm font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-300 text-sm line-clamp-3">{movie.overview}</p>
              <button className="mt-3 w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 px-4 rounded-lg transition-colors">
                View Details & Cast
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-amber-300 mb-4">🧭 Navigation Features:</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Real Cast Data:</strong> Movie details fetch actual actors from TMDB API
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Clickable Actor Names:</strong> Actor names are amber-colored links with hover effects
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Context-Aware Navigation:</strong> Stores where you came from for smart back buttons
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Back Navigation:</strong> Actor profiles show "Back to [Movie Title]" when coming from movies
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Full Actor Profiles:</strong> Complete filmography, Fantasy Flix metrics, and awards data
          </li>
        </ul>
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