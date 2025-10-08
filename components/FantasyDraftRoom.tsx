'use client'

import { useState, useEffect } from 'react'
import { DraftRoom as DraftRoomType, DraftPick, Movie, LeaguePlayer } from '../lib/fantasy-league-types'

interface FantasyDraftRoomProps {
  draftRoom: DraftRoomType
  currentUser: { id: string; username: string }
  leagueMembers: LeaguePlayer[]
  onDraftPick: (movieId: string) => void
  onSkipPick: () => void
}

const FantasyDraftRoom = ({ draftRoom, currentUser, leagueMembers, onDraftPick, onSkipPick }: FantasyDraftRoomProps) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(draftRoom.timePerPick)
  
  const isMyTurn = draftRoom.currentPlayer === currentUser.id
  const currentPickPlayer = leagueMembers.find(p => p.userId === draftRoom.currentPlayer)
  
  // Mock data for demonstration
  const recentPicks: DraftPick[] = draftRoom.picks.slice(-5).reverse()
  const filteredMovies = draftRoom.availableMovies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20)

  useEffect(() => {
    if (draftRoom.status === 'active' && draftRoom.currentPickStartTime) {
      const interval = setInterval(() => {
        const startTime = new Date(draftRoom.currentPickStartTime!).getTime()
        const elapsed = (Date.now() - startTime) / 1000
        const remaining = Math.max(0, draftRoom.timePerPick - elapsed)
        setTimeRemaining(remaining)
        
        if (remaining === 0) {
          // Auto-skip on timeout
          clearInterval(interval)
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [draftRoom.currentPickStartTime, draftRoom.timePerPick, draftRoom.status])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hollywood Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-blue-600 to-cyan-600 p-1">
        <div className="bg-slate-900 mx-1 mb-1 rounded-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">🎬</span>
              <div>
                <h1 className="text-2xl font-black text-gradient-premium">Draft Room</h1>
                <p className="text-gray-400">{draftRoom.draftType === 'initial' ? 'Initial Draft (May)' : 'Mid-Season Draft (October)'}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-4xl font-black mb-1 ${ 
                timeRemaining > 30 ? 'text-green-400' : 
                timeRemaining > 10 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {formatTime(timeRemaining)}
              </div>
              <p className="text-gray-400 text-sm">Time Remaining</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-400">Pick #{draftRoom.currentPick}</p>
              <p className="text-lg font-bold text-white">Round {Math.ceil(draftRoom.currentPick / draftRoom.draftOrder.length)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-6">
        
        {/* Left Panel: Draft Board & Recent Picks */}
        <div className="col-span-3 space-y-4">
          
          {/* Current Turn */}
          <div className={`glass-elegant rounded-2xl p-4 border-2 ${isMyTurn ? 'border-yellow-400 border-opacity-50' : 'border-gray-600'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                isMyTurn ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 'bg-gray-700 text-white'
              }`}>
                {currentPickPlayer?.username?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold text-white">{currentPickPlayer?.username || 'Unknown'}</p>
                <p className="text-sm text-gray-400">{isMyTurn ? 'Your Turn!' : 'On the Clock'}</p>
              </div>
            </div>
            
            {isMyTurn && (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => selectedMovie && onDraftPick(selectedMovie.id)}
                  disabled={!selectedMovie}
                  className="w-full gradient-premium py-2 rounded-xl font-bold disabled:opacity-50"
                >
                  🎬 Draft {selectedMovie?.title || 'Select Movie'}
                </button>
                {draftRoom.draftType === 'second' && (
                  <button
                    onClick={onSkipPick}
                    className="w-full glass border border-gray-500 py-2 rounded-xl text-gray-300 hover:text-white"
                  >
                    💰 Skip (+$25M)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Draft Order */}
          <div className="glass-elegant rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3 flex items-center space-x-2">
              <span>🐍</span>
              <span>Snake Draft Order</span>
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {draftRoom.draftOrder.map((userId, index) => {
                const player = leagueMembers.find(p => p.userId === userId)
                const isPicking = draftRoom.currentPlayer === userId
                return (
                  <div key={userId} className={`flex items-center space-x-3 p-2 rounded-lg ${
                    isPicking ? 'bg-yellow-400 bg-opacity-20 border border-yellow-400 border-opacity-50' : 'bg-gray-800 bg-opacity-50'
                  }`}>
                    <span className="text-sm font-bold w-6 text-center">{index + 1}</span>
                    <span className={`flex-1 ${isPicking ? 'text-yellow-300 font-bold' : 'text-gray-300'}`}>
                      {player?.username || 'Unknown'}
                    </span>
                    {isPicking && <span className="text-yellow-400 animate-pulse">⏰</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Picks */}
          <div className="glass-elegant rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3 flex items-center space-x-2">
              <span>📝</span>
              <span>Recent Picks</span>
            </h3>
            <div className="space-y-2">
              {recentPicks.map((pick) => (
                <div key={pick.pickNumber} className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">#{pick.pickNumber}</span>
                    <span className="text-xs text-gray-500">{formatTime(pick.timeUsed)}s</span>
                  </div>
                  <p className="font-bold text-white text-sm">{pick.username}</p>
                  {pick.isSkip ? (
                    <p className="text-yellow-400 text-sm">💰 Skipped (+$25M)</p>
                  ) : (
                    <p className="text-gray-300 text-sm">🎬 {pick.movie?.title}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel: Available Movies */}
        <div className="col-span-6">
          <div className="glass-elegant rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gradient-premium">🎭 Available Movies</h2>
              <div className="text-right">
                <span className="text-sm text-gray-400">{draftRoom.availableMovies.length} remaining</span>
                {draftRoom.draftType === 'initial' && (
                  <p className="text-xs text-yellow-400">Both periods available</p>
                )}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search movies..."
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Movie Grid */}
            <div className="grid grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
              {filteredMovies.map((movie) => {
                const isLowBudget = movie.productionBudget && movie.productionBudget < 50
                const isIndieBudget = movie.productionBudget && movie.productionBudget < 20
                
                return (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className={`cursor-pointer transition-all transform hover:scale-105 rounded-xl overflow-hidden border-2 ${
                      selectedMovie?.id === movie.id 
                        ? 'border-yellow-400 border-opacity-80 shadow-xl shadow-yellow-400/20' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="aspect-[2/3] bg-gray-800 relative">
                      {movie.posterUrl ? (
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
                          🎬
                        </div>
                      )}
                      
                      {/* Release Date Badge */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-80 rounded-lg px-2 py-1">
                        <span className="text-xs text-white font-bold">
                          {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {/* Budget Badge */}
                      {movie.productionBudget && (
                        <div className={`absolute bottom-2 left-2 rounded-lg px-2 py-1 ${
                          isIndieBudget ? 'bg-blue-600 bg-opacity-90' :
                          isLowBudget ? 'bg-blue-600 bg-opacity-90' : 'bg-green-600 bg-opacity-90'
                        }`}>
                          <span className="text-xs text-white font-bold">
                            ${movie.productionBudget}M
                          </span>
                          {isIndieBudget && <span className="text-xs block">🎭 INDIE</span>}
                          {isLowBudget && !isIndieBudget && <span className="text-xs block">💎 LOW</span>}
                        </div>
                      )}

                      {/* IMDB Rating Badge */}
                      {movie.imdbRating && movie.imdbRating >= 7.5 && (
                        <div className="absolute top-2 left-2 bg-yellow-600 bg-opacity-90 rounded-lg px-2 py-1">
                          <span className="text-xs text-white font-bold">
                            ⭐ {movie.imdbRating}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-2 bg-gray-900">
                      <p className="text-sm font-bold text-white drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{movie.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(movie.releaseDate).getFullYear()}
                      </p>
                      
                      {/* Potential Bonuses Hint */}
                      <div className="flex items-center space-x-1 mt-1">
                        {isIndieBudget && <span className="text-xs text-blue-400">🚀</span>}
                        {isLowBudget && !isIndieBudget && <span className="text-xs text-blue-400">⚡</span>}
                        {movie.imdbRating && movie.imdbRating >= 8.5 && <span className="text-xs text-yellow-400">💰</span>}
                        {movie.imdbRating && movie.imdbRating >= 8.0 && movie.imdbRating < 8.5 && <span className="text-xs text-green-400">💵</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Movie Details & Team Rosters */}
        <div className="col-span-3 space-y-4">
          
          {/* Selected Movie Details */}
          {selectedMovie && (
            <div className="glass-elegant rounded-2xl p-4">
              <h3 className="font-bold text-yellow-400 mb-3 flex items-center space-x-2">
                <span>🎬</span>
                <span>Movie Details</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-white">{selectedMovie.title}</p>
                  <p className="text-sm text-gray-400">
                    📅 {new Date(selectedMovie.releaseDate).toLocaleDateString()}
                  </p>
                </div>
                
                {selectedMovie.productionBudget && (
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">Production Budget</p>
                    <p className="font-bold text-green-400">💰 ${selectedMovie.productionBudget}M</p>
                    {selectedMovie.productionBudget < 20 && (
                      <p className="text-xs text-blue-400 mt-1">🚀 High Multiplier Bonus!</p>
                    )}
                    {selectedMovie.productionBudget < 50 && selectedMovie.productionBudget >= 20 && (
                      <p className="text-xs text-blue-400 mt-1">⚡ Multiplier Bonus!</p>
                    )}
                  </div>
                )}
                
                {selectedMovie.imdbRating && (
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                    <p className="text-sm text-gray-400">IMDB Rating</p>
                    <p className="font-bold text-yellow-400">⭐ {selectedMovie.imdbRating}/10</p>
                    {selectedMovie.imdbRating >= 8.5 && (
                      <p className="text-xs text-yellow-400 mt-1">💰 +$50-100M Bonus!</p>
                    )}
                    {selectedMovie.imdbRating >= 8.0 && selectedMovie.imdbRating < 8.5 && (
                      <p className="text-xs text-green-400 mt-1">💵 +$25-50M Bonus!</p>
                    )}
                    {selectedMovie.imdbRating >= 7.5 && selectedMovie.imdbRating < 8.0 && (
                      <p className="text-xs text-blue-400 mt-1">💎 +$10-25M Bonus!</p>
                    )}
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-400">Genres</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMovie.genres.map(genre => (
                      <span key={genre} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scoring Potential */}
                <div className="bg-gradient-to-r from-yellow-900 to-orange-900 bg-opacity-30 rounded-lg p-3 border border-yellow-600 border-opacity-30">
                  <p className="text-sm font-bold text-yellow-400 mb-2">🎯 Scoring Potential</p>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-300">📊 Base: Box Office - Budget</p>
                    {selectedMovie.imdbRating && selectedMovie.imdbRating >= 7.5 && (
                      <p className="text-yellow-300">⭐ IMDB Bonus Eligible</p>
                    )}
                    {selectedMovie.productionBudget && selectedMovie.productionBudget < 50 && (
                      <p className="text-blue-300">🚀 Multiplier Bonus Eligible</p>
                    )}
                    <p className="text-blue-300">🏆 Oscar Points: 5 wins, 2 nominations</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team Rosters Summary */}
          <div className="glass-elegant rounded-2xl p-4">
            <h3 className="font-bold text-white mb-3 flex items-center space-x-2">
              <span>👥</span>
              <span>Roster Status</span>
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {leagueMembers.map((player) => {
                const pickCount = draftRoom.picks.filter(p => p.userId === player.userId && !p.isSkip).length
                const skipCount = draftRoom.picks.filter(p => p.userId === player.userId && p.isSkip).length
                const targetPicks = draftRoom.draftType === 'initial' ? 10 : Math.max(0, 10 - pickCount)
                
                return (
                  <div key={player.userId} className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{player.username}</span>
                      <div className="text-right">
                        <span className="text-sm text-gray-400">{pickCount}/10 movies</span>
                        {skipCount > 0 && (
                          <p className="text-xs text-yellow-400">💰 ${skipCount * 25}M bonus</p>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((pickCount / 10) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FantasyDraftRoom