'use client'

import { useState, useEffect, memo } from 'react'
import MovieDetail from './MovieDetail'

const DraftRoom = memo(function DraftRoom() {
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showMovieDetail, setShowMovieDetail] = useState<any>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return 60
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const movies = [
    { id: 1, title: 'Dune: Part Three', budget: 190, period: 2, releaseDate: '2025-12-20' },
    { id: 2, title: 'Avatar 4', budget: 250, period: 2, releaseDate: '2025-12-18' },
    { id: 3, title: 'Marvel Phase 7', budget: 200, period: 1, releaseDate: '2025-05-02' },
    { id: 4, title: 'Pixar Original', budget: 175, period: 1, releaseDate: '2025-06-15' },
    { id: 5, title: 'DC Universe Reboot', budget: 185, period: 1, releaseDate: '2025-07-20' },
    { id: 6, title: 'Star Wars: New Era', budget: 220, period: 2, releaseDate: '2025-12-22' },
  ]

  const recentPicks = [
    { team: 'BoxOfficeLegend', movie: 'Guaranteed Blockbuster', round: 1, pick: 1 },
    { team: 'MovieMaster99', movie: 'Top Gun 3', round: 1, pick: 2 },
    { team: 'BoxOfficePro', movie: 'Frozen 3', round: 1, pick: 3 },
  ]

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="px-4 py-6">
      {/* Draft Header */}
      <div className="glass-dark rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gradient mb-2">Elite Draft Room</h1>
            <p className="text-gray-300">Round 3 • Pick 21</p>
          </div>
          
          <div className="text-center">
            <div className={`text-6xl font-black ${
              timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-gradient'
            }`}>
              {timeRemaining}
            </div>
            <p className="text-sm text-gray-400">seconds</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-400">Currently Picking</p>
            <p className="text-2xl font-bold text-gradient animate-pulse">Your Turn!</p>
            <span className="inline-block mt-2 px-4 py-2 gradient-blue text-white text-sm rounded-full animate-bounce">
              Make Your Pick, Champion
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Movies */}
        <div className="lg:col-span-2">
          <div className="glass-dark rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Available Blockbusters</h2>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className={`p-4 glass rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
                    selectedMovie?.id === movie.id 
                      ? 'border-2 border-yellow-400 card-glow' 
                      : 'border border-gray-600 hover:border-cyan-500'
                  }`}
                >
                  <div 
                    onClick={() => setSelectedMovie(movie)}
                    className="text-4xl text-center mb-2"
                  >🎬</div>
                  <h3 
                    className="font-bold text-white text-sm hover:text-blue-400 cursor-pointer"
                    onClick={() => setShowMovieDetail(movie)}
                  >
                    {movie.title}
                  </h3>
                  <p 
                    className="text-xs text-gray-400"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    ${movie.budget}M • Period {movie.period}
                  </p>
                  <p 
                    className="text-xs text-gray-500"
                    onClick={() => setSelectedMovie(movie)}
                  >{movie.releaseDate}</p>
                </div>
              ))}
            </div>

            {selectedMovie && (
              <div className="mt-6 p-6 gradient-blue rounded-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-2xl text-white">{selectedMovie.title}</h3>
                    <p className="text-white opacity-90">
                      Budget: ${selectedMovie.budget}M • Release: {selectedMovie.releaseDate}
                    </p>
                    <p className="text-yellow-300 text-sm mt-2">
                      Projected Profit: +${(selectedMovie.budget * 3.5).toFixed(0)}M 🚀
                    </p>
                  </div>
                  <button className="px-8 py-4 bg-white text-blue-900 rounded-xl font-black text-lg hover:scale-110 transform transition-all">
                    DRAFT THIS WINNER
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Recent Picks */}
          <div className="glass-dark rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">🔥 Recent Picks</h2>
            <div className="space-y-2">
              {recentPicks.map((pick, idx) => (
                <div key={idx} className="flex justify-between text-sm py-2 glass rounded-xl px-3">
                  <span className="font-bold text-blue-400">{pick.team}</span>
                  <span className="text-gray-300">{pick.movie}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Team */}
          <div className="glass-dark rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Elite Squad</h2>
            <div className="space-y-2">
              <div className="p-3 gradient-blue rounded-xl">
                <span className="text-xs font-bold text-white">R1P4</span>
                <span className="text-white ml-2">Indiana Jones 6</span>
              </div>
              <div className="p-3 gradient-blue rounded-xl">
                <span className="text-xs font-bold text-white">R2P12</span>
                <span className="text-white ml-2">Fast & Furious 11</span>
              </div>
              <div className="text-center mt-4">
                <p className="text-gray-400 text-sm">8 picks remaining</p>
                <p className="text-yellow-400 text-xs mt-2">Projected Rank: Top 10 🏆</p>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="glass-dark rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">💬 Draft Chat</h2>
            <div className="space-y-2 text-sm">
              <div className="text-blue-400">
                <span className="font-bold">BoxOfficeLegend:</span> Easy money 💰
              </div>
              <div className="text-gray-300">
                <span className="font-bold">MovieFan22:</span> The legend strikes again...
              </div>
              <div className="text-gray-300">
                <span className="font-bold">BoxOfficeKing:</span> This draft is 🔥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Detail Modal */}
      {showMovieDetail && (
        <MovieDetail 
          movie={showMovieDetail} 
          onClose={() => setShowMovieDetail(null)}
          onDraft={() => {
            setSelectedMovie(showMovieDetail)
            setShowMovieDetail(null)
          }}
        />
      )}
    </div>
  )
})

export default DraftRoom