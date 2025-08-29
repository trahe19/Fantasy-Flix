'use client'

import { memo } from 'react'

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
      projectedOpening: '$185M',
      projectedTotal: '$750M',
      profitPotential: '⭐⭐⭐⭐⭐',
      competition: ['Avatar 5', 'Star Wars'],
      riskLevel: 'Medium',
      expertTake: "Villeneuve never misses. Lock this in!",
    },
    'Avatar 4': {
      director: 'James Cameron',
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      synopsis: 'Jake and Neytiri explore new regions of Pandora and encounter different Na\'vi tribes.',
      rating: 'PG-13',
      runtime: '180 min',
      distributor: 'Disney',
      projectedOpening: '$250M',
      projectedTotal: '$2.1B',
      profitPotential: '⭐⭐⭐⭐⭐',
      competition: ['Dune 3'],
      riskLevel: 'Low',
      expertTake: "Cameron = Money printer. Draft immediately!",
    },
  }

  const details = movieDetails[movie.title as keyof typeof movieDetails] || {
    director: 'TBD',
    cast: ['Cast not announced'],
    synopsis: 'Plot details are under wraps. This highly anticipated film is expected to be a major blockbuster.',
    rating: 'Not Rated',
    runtime: 'TBD',
    distributor: 'Major Studio',
    projectedOpening: `$${(movie.budget * 0.8).toFixed(0)}M`,
    projectedTotal: `$${(movie.budget * 3.5).toFixed(0)}M`,
    profitPotential: '⭐⭐⭐⭐',
    competition: ['Other blockbusters'],
    riskLevel: 'Medium',
    expertTake: "Solid pick with good upside potential.",
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="glass-dark rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform scale-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-4xl font-black text-gradient mb-2">{movie.title}</h2>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>{details.rating}</span>
              <span>•</span>
              <span>{details.runtime}</span>
              <span>•</span>
              <span>{movie.releaseDate}</span>
              <span>•</span>
              <span className="text-blue-400">{details.distributor}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">×</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Synopsis</p>
              <p className="text-white">{details.synopsis}</p>
            </div>

            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Director</p>
              <p className="text-white font-bold text-xl">{details.director}</p>
            </div>

            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Cast</p>
              <div className="flex flex-wrap gap-2">
                {details.cast.map((actor, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-900/50 rounded-full text-white text-sm">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="gradient-blue rounded-xl p-4">
              <p className="text-white/80 text-sm mb-2">Expert Analysis 🔥</p>
              <p className="text-white font-bold">{details.expertTake}</p>
              <div className="mt-3">
                <span className="text-yellow-300">Profit Potential: {details.profitPotential}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm">Production Budget</p>
                <p className="text-2xl font-bold text-white">${movie.budget}M</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm">Projected Opening</p>
                <p className="text-2xl font-bold text-green-400">{details.projectedOpening}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm">Projected Total</p>
                <p className="text-2xl font-bold text-yellow-400">{details.projectedTotal}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm">Risk Level</p>
                <p className="text-xl font-bold text-orange-400">{details.riskLevel}</p>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-2">Competition</p>
              <div className="flex flex-wrap gap-2">
                {details.competition.map((comp, idx) => (
                  <span key={idx} className="text-red-400 text-sm">⚔️ {comp}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-4 mb-6">
          <p className="text-gray-400 text-sm mb-3">Box Office Projections</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white">Week 1</span>
              <div className="flex-1 mx-4 h-4 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{width: '60%'}}></div>
              </div>
              <span className="text-green-400">{details.projectedOpening}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Month 1</span>
              <div className="flex-1 mx-4 h-4 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400" style={{width: '80%'}}></div>
              </div>
              <span className="text-yellow-400">$450M</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white">Total Run</span>
              <div className="flex-1 mx-4 h-4 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{width: '100%'}}></div>
              </div>
              <span className="text-blue-400">{details.projectedTotal}</span>
            </div>
          </div>
        </div>

        {onDraft && (
          <button 
            onClick={onDraft}
            className="w-full gradient-blue text-white py-4 rounded-xl font-black text-xl hover:scale-105 transform transition-all"
          >
            DRAFT THIS BLOCKBUSTER 🚀
          </button>
        )}
      </div>
    </div>
  )
})

export default MovieDetail