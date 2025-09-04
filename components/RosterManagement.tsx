'use client'

import { useState, useEffect, memo } from 'react'
import { getUpcomingMovies, getImageUrl, formatCurrency, TMDBMovie } from '../lib/tmdb'

const RosterManagement = memo(function RosterManagement() {
  const [currentPeriod, setCurrentPeriod] = useState(1)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [draggedFrom, setDraggedFrom] = useState<string>('')
  const [showSwapConfirm, setShowSwapConfirm] = useState(false)
  const [swapDetails, setSwapDetails] = useState<any>(null)
  const [upcomingMovies, setUpcomingMovies] = useState<TMDBMovie[]>([])
  const [isLoadingMovies, setIsLoadingMovies] = useState(true)

  // Real data - start with empty roster until user actually drafts
  const [starters, setStarters] = useState([
    { id: 1, movie: null, locked: false },
    { id: 2, movie: null, locked: false },
    { id: 3, movie: null, locked: false },
    { id: 4, movie: null, locked: false },
    { id: 5, movie: null, locked: false },
  ])

  const [reserves, setReserves] = useState([
    { id: 6, movie: null, locked: false },
    { id: 7, movie: null, locked: false },
    { id: 8, movie: null, locked: false },
    { id: 9, movie: null, locked: false },
    { id: 10, movie: null, locked: false },
  ])

  // Fetch real upcoming movies for waiver wire
  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setIsLoadingMovies(true)
        const movies = await getUpcomingMovies(1) // Get first page
        setUpcomingMovies(movies.slice(0, 20)) // Top 20 upcoming movies
      } catch (error) {
        console.error('Error fetching upcoming movies:', error)
      } finally {
        setIsLoadingMovies(false)
      }
    }

    fetchUpcomingMovies()
  }, [])

  const handleDragStart = (e: React.DragEvent, item: any, from: string) => {
    if (item.locked) {
      e.preventDefault()
      return
    }
    setDraggedItem(item)
    setDraggedFrom(from)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, target: any, targetType: string) => {
    e.preventDefault()
    
    if (!draggedItem) return

    // Show confirmation modal
    setSwapDetails({
      from: draggedFrom,
      to: targetType,
      draggedItem,
      targetItem: target
    })
    setShowSwapConfirm(true)
  }

  const confirmSwap = () => {
    const { from, to, draggedItem, targetItem } = swapDetails

    if (from === 'starter' && to === 'reserve') {
      // Swap starter with reserve
      const starterIndex = starters.findIndex(s => s.id === draggedItem.id)
      const reserveIndex = reserves.findIndex(r => r.id === targetItem.id)
      
      const newStarters = [...starters]
      const newReserves = [...reserves]
      
      newStarters[starterIndex] = { ...targetItem, id: draggedItem.id }
      newReserves[reserveIndex] = { ...draggedItem, id: targetItem.id }
      
      setStarters(newStarters)
      setReserves(newReserves)
    } else if (from === 'waiver' && to === 'reserve') {
      // Add from waiver to reserve
      const reserveIndex = reserves.findIndex(r => r.id === targetItem.id)
      const newReserves = [...reserves]
      newReserves[reserveIndex] = { 
        ...targetItem, 
        movie: { ...draggedItem, score: 0 }
      }
      setReserves(newReserves)
    } else if (from === 'waiver' && to === 'starter') {
      // Add from waiver to starter
      const starterIndex = starters.findIndex(s => s.id === targetItem.id)
      const newStarters = [...starters]
      newStarters[starterIndex] = { 
        ...targetItem, 
        movie: { ...draggedItem, score: 0 }
      }
      setStarters(newStarters)
    }

    setShowSwapConfirm(false)
    setDraggedItem(null)
    setDraggedFrom('')
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white">Roster Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPeriod(1)}
            className={`px-4 py-2 rounded-xl ${
              currentPeriod === 1 
                ? 'gradient-blue text-white' 
                : 'glass-dark text-gray-300 hover:text-white'
            }`}
          >
            Period 1
          </button>
          <button
            onClick={() => setCurrentPeriod(2)}
            className={`px-4 py-2 rounded-xl ${
              currentPeriod === 2 
                ? 'gradient-blue text-white' 
                : 'glass-dark text-gray-300 hover:text-white'
            }`}
          >
            Period 2
          </button>
        </div>
      </div>

      <div className="mb-4 glass-dark rounded-xl p-3">
        <p className="text-blue-400 text-sm">💡 Drag movies between slots to optimize your lineup! Locked movies (🔒) cannot be moved.</p>
      </div>

      {starters.every(slot => slot.movie === null) && reserves.every(slot => slot.movie === null) ? (
        // Empty roster state
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-3xl font-bold text-white mb-3">No Movies Drafted Yet</h2>
          <p className="text-gray-400 text-lg mb-6">Your roster will appear here once you draft movies from leagues</p>
          <div className="max-w-md mx-auto glass-dark rounded-2xl p-6">
            <h3 className="text-white font-bold mb-3">🎯 Upcoming Picks</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { 
                  title: "Avatar: Fire and Ash", 
                  projection: "$2.5B+", 
                  date: "Dec 2025",
                  confidence: "🔥 MEGA HIT"
                },
                { 
                  title: "Zootopia 2", 
                  projection: "$1.15B", 
                  date: "Nov 26, 2025",
                  confidence: "🎯 SURE BET"
                },
                { 
                  title: "Wicked: For Good", 
                  projection: "$800M+", 
                  date: "Nov 21, 2025",
                  confidence: "🎭 BROADWAY GOLD"
                },
                { 
                  title: "How to Train Your Dragon (Live)", 
                  projection: "$500M+", 
                  date: "Jun 13, 2025",
                  confidence: "🐉 REMAKE MAGIC"
                },
                { 
                  title: "Superman", 
                  projection: "$400M+", 
                  date: "Jul 11, 2025",
                  confidence: "🦸 DC REBOOT"
                }
              ].map((pick, i) => (
                <div key={i} className="text-sm p-3 glass rounded hover:card-glow transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-white font-medium">{pick.title}</div>
                    <div className="text-green-400 font-bold text-xs">{pick.projection}</div>
                  </div>
                  <div className="text-gray-400 text-xs mb-1">📅 {pick.date}</div>
                  <div className="text-xs text-blue-300">{pick.confidence}</div>
                </div>
              ))}
            
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-xs">Draft movies in leagues to build your roster</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Starting Lineup */}
          <div className="glass-dark rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Starting Lineup ⭐
            </h2>
            <div className="space-y-3">
              {starters.map((slot) => (
                <div
                  key={slot.id}
                  draggable={!slot.locked && slot.movie !== null}
                  onDragStart={(e) => handleDragStart(e, slot, 'starter')}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot, 'starter')}
                  className={`p-4 rounded-xl glass ${
                    slot.locked 
                      ? 'border border-red-500 opacity-75 cursor-not-allowed' 
                      : 'border border-gray-600 hover:card-glow cursor-move'
                  } ${slot.movie ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20' : ''} transition-all`}
                >
                  {slot.movie ? (
                    <div>
                      <div className="font-semibold text-white">{slot.movie.title}</div>
                      <div className="text-xs text-gray-400">
                        📅 {new Date(slot.movie.release_date).toLocaleDateString()}
                        {slot.locked && ' 🔒'}
                        {slot.movie.score && slot.movie.score > 0 && (
                          <span className="text-green-400 ml-2">
                            +${(slot.movie.score / 1000000).toFixed(0)}M
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">Empty Slot - Drop Here</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reserve Bench */}
          <div className="glass-dark rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white">
              Reserve Bench 🎬
            </h2>
            <div className="space-y-3">
              {reserves.map((slot) => (
                <div
                  key={slot.id}
                  draggable={slot.movie !== null}
                  onDragStart={(e) => handleDragStart(e, slot, 'reserve')}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, slot, 'reserve')}
                  className={`p-4 rounded-xl glass border border-gray-600 hover:card-glow transition-all cursor-move ${
                    slot.movie ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20' : ''
                  }`}
                >
                  {slot.movie ? (
                    <div>
                      <div className="font-semibold text-white">{slot.movie.title}</div>
                      <div className="text-xs text-gray-400">
                        📅 {new Date(slot.movie.release_date).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">Empty Slot - Drop Here</div>
                  )}
                </div>
              ))}
            </div>
          </div>

        {/* Waiver Wire */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            Waiver Wire 📋
          </h2>
          <div className="text-xs text-gray-400 mb-4">
            🎬 Real upcoming movies from TMDB
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {isLoadingMovies ? (
              // Loading skeleton
              [...Array(10)].map((_, i) => (
                <div key={i} className="p-3 glass border border-gray-600 rounded-xl animate-pulse">
                  <div className="bg-gray-700 rounded h-4 mb-2"></div>
                  <div className="bg-gray-700 rounded h-3 w-2/3"></div>
                </div>
              ))
            ) : (
              upcomingMovies.map((movie) => (
                <div
                  key={movie.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, movie, 'waiver')}
                  className="p-3 glass border border-gray-600 rounded-xl hover:card-glow hover:scale-105 transition-all cursor-move group"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={getImageUrl(movie.poster_path, 'w92')}
                      alt={movie.title}
                      className="w-8 h-12 object-cover rounded opacity-75 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.jpg'
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{movie.title}</div>
                      <div className="text-xs text-gray-400">
                        📅 {new Date(movie.release_date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-yellow-400">
                        ⭐ {movie.vote_average.toFixed(1)} • 🔥 {Math.round(movie.popularity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      )}

      {!starters.every(slot => slot.movie === null) || !reserves.every(slot => slot.movie === null) ? (
        <div className="mt-6 glass-dark rounded-2xl p-4">
          <h3 className="font-bold text-blue-400 mb-2">Pro Tips:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Drag movies between slots to optimize your lineup</li>
            <li>• Starting movies lock when released (🔒 = locked)</li>
            <li>• 5 starters count toward your box office earnings</li>
            <li>• Reserve movies = your backup strategy</li>
          </ul>
        </div>
      ) : null}

      {/* Swap Confirmation Modal */}
      {showSwapConfirm && swapDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Roster Move</h3>
            <p className="text-gray-300 mb-4">
              Move <span className="text-blue-400 font-bold">
                {swapDetails.draggedItem.movie?.title || swapDetails.draggedItem.title}
              </span> to {swapDetails.to} slot?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSwapConfirm(false)}
                className="flex-1 glass border border-gray-500 text-gray-300 py-2 rounded-xl hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwap}
                className="flex-1 gradient-blue text-white py-2 rounded-xl font-bold"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default RosterManagement