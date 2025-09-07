'use client'

import { useState, useEffect } from 'react'
import { getImageUrl, TMDBMovie } from '../lib/tmdb'

interface MovieDetailModalProps {
  movie: TMDBMovie
  isOpen: boolean
  onClose: () => void
}

const MovieDetailModal = ({ movie, isOpen, onClose }: MovieDetailModalProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setTimeout(() => setIsVisible(false), 300)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isVisible) return null

  // Mock detailed data based on movie
  const movieDetails = {
    releaseDate: movie.release_date,
    studio: "Warner Bros.",
    budget: movie.budget || 190000000,
    director: "Denis Villeneuve",
    cast: [
      { name: "Timothée Chalamet", role: "1 Oscar nomination (Best Actor, Call Me By Your Name)" },
      { name: "Zendaya", role: "Emmy winner (though no Oscar noms yet, strong box office appeal)" },
      { name: "Josh Brolin", role: "1 Oscar nomination (Best Supporting Actor, Milk)" }
    ],
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    reception: {
      imdb: 8.5,
      rottenTomatoes: 92,
      letterboxd: 4.4
    },
    draftValue: {
      boxOffice: "High (global franchise momentum, strong cast, Villeneuve's proven scale)",
      oscarUpside: "Very High (prestige + craft categories + potential major awards)",
      riskFactor: "Medium (big budget = high bar for profit)"
    },
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w"
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 bg-black/50' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`glass-elegant max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg transform transition-all duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-movie.jpg'
              }}
            />
          </div>

          {/* Movie Details */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white original:text-white mb-2">
                  {movie.title}
                </h1>
                <div className="space-y-1 text-gray-600 dark:text-gray-400 original:text-gray-300">
                  <p><strong>Release Date:</strong> {new Date(movieDetails.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Studio:</strong> {movieDetails.studio}</p>
                  <p><strong>Budget:</strong> ${(movieDetails.budget / 1000000).toFixed(0)} million</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded glass hover:card-glow transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cast & Crew */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white original:text-white mb-3 flex items-center">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Cast & Crew
              </h2>
              <div className="space-y-2">
                {movieDetails.cast.map((person, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400 original:text-gray-300">
                    <strong className="text-gray-900 dark:text-white original:text-white">{person.name}</strong> – {person.role}
                  </div>
                ))}
                <div className="text-gray-600 dark:text-gray-400 original:text-gray-300">
                  <strong className="text-gray-900 dark:text-white original:text-white">Director:</strong> {movieDetails.director} – Oscar nominee (Best Director, Dune: Part One)
                </div>
              </div>
            </div>

            {/* Two Column Layout for Synopsis and Stats */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Synopsis */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white original:text-white mb-2">
                  Synopsis:
                </h3>
                <p className="text-gray-600 dark:text-gray-400 original:text-gray-300 leading-relaxed">
                  {movieDetails.synopsis}
                </p>

                {/* Reception */}
                <div className="mt-4">
                  <h4 className="font-bold text-gray-900 dark:text-white original:text-white mb-2">
                    Reception:
                  </h4>
                  <div className="space-y-1 text-gray-600 dark:text-gray-400 original:text-gray-300">
                    <p><strong>{movieDetails.reception.imdb}/10</strong> IMDb</p>
                    <p><strong>{movieDetails.reception.rottenTomatoes}%</strong> Rotten Tomatoes</p>
                    <p><strong>{movieDetails.reception.letterboxd}/5</strong> Letterboxd</p>
                  </div>
                </div>
              </div>

              {/* Draft Value */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white original:text-white mb-3">
                  Draft Value
                </h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white original:text-white">Box Office Potential:</h4>
                    <p className="text-sm text-green-600 dark:text-green-400 original:text-green-400">
                      High (global franchise momentum, strong cast, Villeneuve's proven scale)
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white original:text-white">Oscar Upside:</h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400 original:text-purple-400">
                      Very High (prestige + craft categories + potential major awards)
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white original:text-white">Risk Factor:</h4>
                    <p className="text-sm text-orange-600 dark:text-orange-400 original:text-orange-400">
                      Medium (big budget = high bar for profit)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trailer */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white original:text-white mb-3">
                Official Trailer
              </h3>
              <div className="aspect-video glass rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 original:text-gray-300">
                    Trailer Preview
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4 border-t border-[#8e8e93]/20">
              <button className="gradient-blue text-white px-6 py-2 rounded font-medium hover:opacity-90 transition-all">
                Add to Roster
              </button>
              <button className="glass px-6 py-2 rounded font-medium hover:card-glow transition-all">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailModal