'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { RosterSlot, Movie, LeaguePlayer } from '../lib/fantasy-league-types'

interface RosterManagerProps {
  leagueId: string
  currentUser: LeaguePlayer
  currentPeriod: 1 | 2
  roster: RosterSlot[]
  onRosterMove: (fromIndex: number, toIndex: number, fromSection: string, toSection: string) => void
  onStarterChange: (movieId: string, makeStarter: boolean) => void
}

const RosterManager = ({ leagueId, currentUser, currentPeriod, roster, onRosterMove, onStarterChange }: RosterManagerProps) => {
  const [selectedMovie, setSelectedMovie] = useState<RosterSlot | null>(null)
  const [viewPeriod, setViewPeriod] = useState<1 | 2>(currentPeriod)

  // Filter roster by period
  const periodRoster = roster.filter(slot => slot.period === viewPeriod)
  const starters = periodRoster.filter(slot => slot.slotType === 'starter')
  const reserves = periodRoster.filter(slot => slot.slotType === 'reserve')

  // Calculate total scores
  const startersScore = starters.reduce((sum, slot) => sum + (slot.totalScore || 0), 0)
  const reservesScore = reserves.reduce((sum, slot) => sum + (slot.totalScore || 0), 0)
  const totalScore = startersScore + reservesScore

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    onRosterMove(source.index, destination.index, source.droppableId, destination.droppableId)
  }

  const formatScore = (score: number) => {
    if (score >= 1000000000) return `$${(score / 1000000000).toFixed(1)}B`
    if (score >= 1000000) return `$${(score / 1000000).toFixed(1)}M`
    if (score >= 1000) return `$${(score / 1000).toFixed(1)}K`
    return `$${score}`
  }

  const getMovieStatusColor = (slot: RosterSlot) => {
    if (slot.isLocked) return 'border-red-500 bg-red-500 bg-opacity-10'
    if (slot.movie.releaseDate && new Date(slot.movie.releaseDate) > new Date()) return 'border-blue-500 bg-blue-500 bg-opacity-10'
    return 'border-green-500 bg-green-500 bg-opacity-10'
  }

  const getMovieStatusIcon = (slot: RosterSlot) => {
    if (slot.isLocked) return '🔒'
    if (slot.movie.releaseDate && new Date(slot.movie.releaseDate) > new Date()) return '⏳'
    return '✅'
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hollywood Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full opacity-8 animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full opacity-10 animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black text-gradient-premium mb-2">🎬 My Roster</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Period {viewPeriod} • {starters.length}/5 Starters • {reserves.length}/5 Reserves</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewPeriod(1)}
                    className={`px-3 py-1 rounded-lg font-medium ${viewPeriod === 1 ? 'gradient-premium text-white' : 'glass text-gray-300'}`}
                  >
                    Period 1
                  </button>
                  <button
                    onClick={() => setViewPeriod(2)}
                    className={`px-3 py-1 rounded-lg font-medium ${viewPeriod === 2 ? 'gradient-premium text-white' : 'glass text-gray-300'}`}
                  >
                    Period 2
                  </button>
                </div>
              </div>
            </div>
            
            {/* Score Summary */}
            <div className="text-right">
              <p className="text-sm text-gray-400">Period {viewPeriod} Score</p>
              <p className="text-3xl font-black text-gradient-gold">{formatScore(totalScore)}</p>
              <div className="flex space-x-4 text-xs mt-1">
                <span className="text-green-400">Starters: {formatScore(startersScore)}</span>
                <span className="text-blue-400">Reserves: {formatScore(reservesScore)}</span>
              </div>
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-12 gap-6">
              
              {/* Starters Section */}
              <div className="col-span-8">
                <div className="glass-elegant rounded-3xl p-6 border border-yellow-400 border-opacity-30">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gradient-premium flex items-center space-x-2">
                      <span>⭐</span>
                      <span>Starting Lineup</span>
                    </h2>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-green-400">Active Score: {formatScore(startersScore)}</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <Droppable droppableId="starters">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] p-4 rounded-2xl transition-all ${
                          snapshot.isDraggingOver ? 'bg-yellow-400 bg-opacity-10 border-2 border-yellow-400 border-dashed' : 'bg-black bg-opacity-20'
                        }`}
                      >
                        {starters.map((slot, index) => (
                          <Draggable key={slot.movieId} draggableId={slot.movieId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedMovie(slot)}
                                className={`${getMovieStatusColor(slot)} border-2 rounded-2xl p-4 cursor-pointer transition-all hover:scale-105 ${
                                  snapshot.isDragging ? 'shadow-2xl rotate-3 z-50' : 'hover:shadow-xl'
                                } ${selectedMovie?.movieId === slot.movieId ? 'ring-2 ring-yellow-400' : ''}`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-16 h-24 rounded-lg overflow-hidden bg-gray-800">
                                    {slot.movie.posterUrl ? (
                                      <img src={slot.movie.posterUrl} alt={slot.movie.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">🎬</div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <p className="font-bold text-white text-lg">{slot.movie.title}</p>
                                      <span className="text-lg">{getMovieStatusIcon(slot)}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 text-sm mt-1">
                                      <span className="text-gray-400">
                                        📅 {new Date(slot.movie.releaseDate).toLocaleDateString()}
                                      </span>
                                      {slot.movie.productionBudget && (
                                        <span className="text-green-400">💰 ${slot.movie.productionBudget}M</span>
                                      )}
                                      {slot.movie.imdbRating && (
                                        <span className="text-yellow-400">⭐ {slot.movie.imdbRating}</span>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="flex space-x-2">
                                        {slot.movie.genres.slice(0, 3).map(genre => (
                                          <span key={genre} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                            {genre}
                                          </span>
                                        ))}
                                      </div>
                                      
                                      {!slot.isLocked && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            onStarterChange(slot.movieId, false)
                                          }}
                                          className="text-xs glass border border-gray-500 px-3 py-1 rounded-lg text-gray-300 hover:text-white"
                                        >
                                          Move to Reserves
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="text-right">
                                    {slot.totalScore ? (
                                      <div>
                                        <p className="font-bold text-xl text-gradient-gold">{formatScore(slot.totalScore)}</p>
                                        <div className="text-xs space-y-1">
                                          {slot.baseScore && <p className="text-gray-300">Base: {formatScore(slot.baseScore)}</p>}
                                          {slot.bonusScore && <p className="text-yellow-400">Bonus: +{formatScore(slot.bonusScore)}</p>}
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-gray-400 text-lg">TBD</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* Empty Starter Slots */}
                        {Array.from({ length: 5 - starters.length }).map((_, index) => (
                          <div key={`empty-starter-${index}`} className="border-2 border-dashed border-gray-600 rounded-2xl p-4 flex items-center justify-center h-24">
                            <span className="text-gray-500">⭐ Empty Starter Slot</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>

              {/* Reserves Section */}
              <div className="col-span-4">
                <div className="glass-elegant rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                      <span>🪑</span>
                      <span>Reserves</span>
                    </h2>
                    <span className="text-sm text-blue-400">{formatScore(reservesScore)}</span>
                  </div>

                  <Droppable droppableId="reserves">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] p-3 rounded-2xl transition-all ${
                          snapshot.isDraggingOver ? 'bg-blue-400 bg-opacity-10 border-2 border-blue-400 border-dashed' : 'bg-black bg-opacity-10'
                        }`}
                      >
                        {reserves.map((slot, index) => (
                          <Draggable key={slot.movieId} draggableId={slot.movieId} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => setSelectedMovie(slot)}
                                className={`${getMovieStatusColor(slot)} border rounded-xl p-3 cursor-pointer transition-all hover:scale-105 ${
                                  snapshot.isDragging ? 'shadow-2xl rotate-2 z-50' : 'hover:shadow-lg'
                                } ${selectedMovie?.movieId === slot.movieId ? 'ring-2 ring-blue-400' : ''}`}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-15 rounded overflow-hidden bg-gray-800">
                                    {slot.movie.posterUrl ? (
                                      <img src={slot.movie.posterUrl} alt={slot.movie.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-500">🎬</div>
                                    )}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-1">
                                      <p className="font-bold text-white text-sm truncate">{slot.movie.title}</p>
                                      <span>{getMovieStatusIcon(slot)}</span>
                                    </div>
                                    
                                    <p className="text-xs text-gray-400">
                                      {new Date(slot.movie.releaseDate).toLocaleDateString()}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-1">
                                      {slot.totalScore ? (
                                        <span className="text-sm font-bold text-blue-400">{formatScore(slot.totalScore)}</span>
                                      ) : (
                                        <span className="text-xs text-gray-500">TBD</span>
                                      )}
                                      
                                      {!slot.isLocked && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            onStarterChange(slot.movieId, true)
                                          }}
                                          className="text-xs gradient-blue px-2 py-1 rounded text-white hover:opacity-80"
                                        >
                                          Start
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* Empty Reserve Slots */}
                        {Array.from({ length: 5 - reserves.length }).map((_, index) => (
                          <div key={`empty-reserve-${index}`} className="border border-dashed border-gray-600 rounded-xl p-3 flex items-center justify-center h-16">
                            <span className="text-gray-500 text-xs">🪑 Reserve</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </div>
          </DragDropContext>

          {/* Selected Movie Detail Panel */}
          {selectedMovie && (
            <div className="fixed bottom-4 right-4 glass-elegant rounded-2xl p-4 w-80 border border-yellow-400 border-opacity-30 shadow-2xl">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-yellow-400">🎬 {selectedMovie.movie.title}</h3>
                <button
                  onClick={() => setSelectedMovie(null)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={selectedMovie.isLocked ? 'text-red-400' : 'text-green-400'}>
                    {selectedMovie.isLocked ? '🔒 Locked' : '✅ Active'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Position:</span>
                  <span className="text-white font-bold">
                    {selectedMovie.slotType === 'starter' ? '⭐ Starter' : '🪑 Reserve'}
                  </span>
                </div>
                
                {selectedMovie.draftedRound && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Drafted:</span>
                    <span className="text-blue-400">Round {selectedMovie.draftedRound}</span>
                  </div>
                )}
                
                {selectedMovie.totalScore && (
                  <div className="bg-black bg-opacity-40 rounded-lg p-3 mt-3">
                    <p className="text-gradient-gold font-bold text-lg">{formatScore(selectedMovie.totalScore)}</p>
                    {selectedMovie.baseScore && (
                      <p className="text-xs text-gray-300">Base: {formatScore(selectedMovie.baseScore)}</p>
                    )}
                    {selectedMovie.bonusScore && (
                      <p className="text-xs text-yellow-400">Bonus: +{formatScore(selectedMovie.bonusScore)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RosterManager