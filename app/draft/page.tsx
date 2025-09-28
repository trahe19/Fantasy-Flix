'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  DraftMovie,
  DraftPick,
  DraftPlayer,
  DraftSettings,
  getDraftEligibleMovies,
  generateSnakeDraftOrder,
  getCurrentPickInfo,
  shuffleArray
} from '../../lib/draft-movies'
import { getImageUrl } from '../../lib/tmdb'

const DraftPage = () => {
  const router = useRouter()

  // Draft State
  const [movies, setMovies] = useState<DraftMovie[]>([])
  const [players, setPlayers] = useState<DraftPlayer[]>([
    { id: 'grant', name: 'Grant', isReady: false },
    { id: 'josh', name: 'Josh', isReady: false },
    { id: 'will', name: 'Will', isReady: false },
    { id: 'tyler', name: 'Tyler', isReady: false }
  ])
  const [picks, setPicks] = useState<DraftPick[]>([])
  const [draftOrder, setDraftOrder] = useState<number[][]>([])

  // Draft Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(120) // 2 minutes default
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isTimerPaused, setIsTimerPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Draft Settings
  const [settings, setSettings] = useState<DraftSettings>({
    pickTimeLimit: 120, // 2 minutes
    pauseBetweenPicks: 5, // 5 seconds
    autoStart: false,
    allowCommissioner: true
  })

  // UI State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draftStarted, setDraftStarted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<DraftMovie | null>(null)
  const [showMovieDetails, setShowMovieDetails] = useState(false)

  // Load draft eligible movies
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const draftMovies = await getDraftEligibleMovies()
        setMovies(draftMovies)

        // Generate initial draft order
        const initialOrder = generateSnakeDraftOrder(players, 8)
        setDraftOrder(initialOrder)
      } catch (err) {
        setError('Failed to load draft movies. Please try again.')
        console.error('Error loading draft movies:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  // Timer effect
  useEffect(() => {
    if (isTimerActive && !isTimerPaused && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time expired - auto-pick if enabled or skip turn
            handleTimeExpired()
            return settings.pickTimeLimit
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isTimerActive, isTimerPaused, timeRemaining])

  const currentPickInfo = getCurrentPickInfo(picks, players, draftOrder)

  const handleStartDraft = () => {
    setDraftStarted(true)
    setIsTimerActive(true)
    setTimeRemaining(settings.pickTimeLimit)
  }

  const handleRandomizeOrder = () => {
    if (draftStarted) return
    const shuffledPlayers = shuffleArray(players)
    setPlayers(shuffledPlayers)
    const newOrder = generateSnakeDraftOrder(shuffledPlayers, 8)
    setDraftOrder(newOrder)
  }

  const handleMovieSelect = (movie: DraftMovie) => {
    if (!draftStarted || currentPickInfo.isComplete || movie.isDrafted) {
      // Show movie details if not drafting or movie is unavailable
      setSelectedMovie(movie)
      setShowMovieDetails(true)
      return
    }

    const pick: DraftPick = {
      id: `pick-${picks.length + 1}`,
      movieId: movie.id,
      playerId: currentPickInfo.currentPlayer!.id,
      playerName: currentPickInfo.currentPlayer!.name,
      round: currentPickInfo.round,
      pick: currentPickInfo.pick,
      overallPick: currentPickInfo.overallPick,
      timestamp: new Date(),
      timeRemaining: timeRemaining
    }

    setPicks(prev => [...prev, pick])

    // Mark movie as drafted
    setMovies(prev => prev.map(m =>
      m.id === movie.id
        ? { ...m, isDrafted: true, draftedBy: currentPickInfo.currentPlayer!.name, draftPosition: currentPickInfo.overallPick }
        : m
    ))

    // Reset timer for next pick
    setTimeRemaining(settings.pickTimeLimit)

    // Add pause between picks if enabled
    if (settings.pauseBetweenPicks > 0) {
      setIsTimerPaused(true)
      setTimeout(() => {
        setIsTimerPaused(false)
      }, settings.pauseBetweenPicks * 1000)
    }
  }

  const handleTimeExpired = () => {
    if (!currentPickInfo.currentPlayer || currentPickInfo.isComplete) return

    // Auto-skip turn (could implement auto-pick logic here)
    const pick: DraftPick = {
      id: `pick-${picks.length + 1}`,
      movieId: -1, // Special ID for skipped pick
      playerId: currentPickInfo.currentPlayer.id,
      playerName: currentPickInfo.currentPlayer.name,
      round: currentPickInfo.round,
      pick: currentPickInfo.pick,
      overallPick: currentPickInfo.overallPick,
      timestamp: new Date(),
      timeRemaining: 0
    }

    setPicks(prev => [...prev, pick])
  }

  const handlePauseTimer = () => {
    setIsTimerPaused(!isTimerPaused)
  }

  const handleExtendTime = (seconds: number) => {
    setTimeRemaining(prev => prev + seconds)
  }

  const handleResetTimer = () => {
    setTimeRemaining(settings.pickTimeLimit)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Draft Board</h2>
          <p className="text-gray-400">Preparing your draft room...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Draft</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-b border-blue-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                🏆 October 2025 Draft
              </h1>
              <p className="text-gray-400 mt-1">
                Fantasy Flix Live Draft • October 1st, 2025 • 4 Players
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Draft Status */}
              <div className="bg-slate-800/80 rounded-lg px-4 py-2 border border-slate-600/50">
                <div className="text-sm text-gray-400">Status</div>
                <div className={`font-bold ${draftStarted ? 'text-green-400' : 'text-yellow-400'}`}>
                  {draftStarted ? (currentPickInfo.isComplete ? 'Complete' : 'In Progress') : 'Pre-Draft'}
                </div>
              </div>

              {/* Timer */}
              {draftStarted && !currentPickInfo.isComplete && (
                <div className="bg-slate-800/80 rounded-lg px-4 py-2 border border-slate-600/50">
                  <div className="text-sm text-gray-400">Pick Timer</div>
                  <div className={`font-bold text-2xl ${timeRemaining <= 10 ? 'text-red-400' : 'text-blue-400'}`}>
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              )}

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
                disabled={draftStarted}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Draft Order & Controls */}
          <div className="col-span-3 space-y-6">
            {/* Current Pick */}
            {draftStarted && !currentPickInfo.isComplete && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20">
                <h3 className="text-lg font-bold text-white mb-4">🎯 Current Pick</h3>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">
                      {currentPickInfo.currentPlayer?.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">
                    {currentPickInfo.currentPlayer?.name}
                  </div>
                  <div className="text-gray-400 text-sm">
                    Round {currentPickInfo.round} • Pick {currentPickInfo.pick}
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    Overall Pick #{currentPickInfo.overallPick}
                  </div>
                </div>
              </div>
            )}

            {/* Draft Order */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Draft Order</h3>
                {!draftStarted && (
                  <button
                    onClick={handleRandomizeOrder}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all"
                  >
                    🎲 Random
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      draftStarted && currentPickInfo.currentPlayer?.id === player.id
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-slate-700/50 border-slate-600/50'
                    }`}
                  >
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{player.name}</div>
                      <div className="text-gray-400 text-xs">
                        {picks.filter(p => p.playerId === player.id).length} picks
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timer Controls */}
            {draftStarted && !currentPickInfo.isComplete && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50">
                <h3 className="text-lg font-bold text-white mb-4">Timer Controls</h3>
                <div className="space-y-3">
                  <button
                    onClick={handlePauseTimer}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                      isTimerPaused
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                  >
                    {isTimerPaused ? '▶️ Resume' : '⏸️ Pause'}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleExtendTime(30)}
                      className="py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                    >
                      +30s
                    </button>
                    <button
                      onClick={() => handleExtendTime(60)}
                      className="py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                    >
                      +1m
                    </button>
                  </div>
                  <button
                    onClick={handleResetTimer}
                    className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-medium"
                  >
                    🔄 Reset Timer
                  </button>
                </div>
              </div>
            )}

            {/* Draft Controls */}
            {!draftStarted && (
              <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-green-500/20">
                <h3 className="text-lg font-bold text-white mb-4">Draft Controls</h3>
                <button
                  onClick={handleStartDraft}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-blue-500 transition-all text-lg"
                >
                  🚀 Start Draft
                </button>
              </div>
            )}
          </div>

          {/* Center Panel - Draft Board */}
          <div className="col-span-6">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  📊 Draft Board ({movies.length} Movies)
                </h3>
                <div className="text-sm text-gray-400">
                  Oct 1, 2025 - Jan 15, 2026 Releases
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 overflow-y-auto h-[calc(100%-80px)] pr-2">
                {movies.map((movie) => (
                  <div
                    key={movie.id}
                    className={`group relative cursor-pointer transition-all duration-200 ${
                      movie.isDrafted
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:scale-105 hover:z-10 hover:shadow-2xl'
                    }`}
                    onClick={() => handleMovieSelect(movie)}
                    title={movie.scouting_report.summary}
                  >
                    <div className={`aspect-[2/3] relative overflow-hidden rounded-lg border-2 transition-all ${
                      movie.isDrafted
                        ? 'border-red-500/50'
                        : movie.projection_confidence.level === 'high'
                          ? 'border-green-500/50 hover:border-green-400'
                          : movie.projection_confidence.level === 'medium'
                            ? 'border-yellow-500/50 hover:border-yellow-400'
                            : 'border-red-500/50 hover:border-red-400'
                    }`}>
                      <img
                        src={getImageUrl(movie.poster_path)}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-movie.svg'
                        }}
                      />

                      {/* Draft Status Overlay */}
                      {movie.isDrafted && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-red-400 font-bold text-sm mb-1">DRAFTED</div>
                            <div className="text-white text-xs">{movie.draftedBy}</div>
                            <div className="text-gray-400 text-xs">#{movie.draftPosition}</div>
                          </div>
                        </div>
                      )}

                      {/* Draft Rank Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded shadow-lg ${
                          movie.draftRank <= 10
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                            : movie.draftRank <= 25
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-gray-800/90 text-yellow-400'
                        }`}>
                          #{movie.draftRank}
                        </span>
                      </div>

                      {/* Projection Confidence Badge */}
                      <div className="absolute top-2 right-2">
                        <div className={`text-xs font-bold px-2 py-1 rounded shadow-lg text-white`}
                             style={{ backgroundColor: movie.projection_confidence.color }}>
                          {movie.projection_confidence.percentage}%
                        </div>
                      </div>

                      {/* Franchise Badge */}
                      {movie.franchise_strength.isSequel && (
                        <div className="absolute top-10 left-2">
                          <span className="bg-purple-600/90 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                            {movie.franchise_strength.franchiseName || 'SEQUEL'}
                          </span>
                        </div>
                      )}

                      {/* Oscar Potential Badge */}
                      {movie.oscar_potential.likelihood !== 'low' && (
                        <div className="absolute top-10 right-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded shadow-lg ${
                            movie.oscar_potential.likelihood === 'high'
                              ? 'bg-gold-500 text-black'
                              : 'bg-amber-600 text-white'
                          }`}>
                            🏆 {movie.oscar_potential.score}
                          </span>
                        </div>
                      )}

                      {/* Movie Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3">
                        <h4 className="text-white text-sm font-bold line-clamp-2 mb-2">
                          {movie.title}
                        </h4>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Release:</span>
                            <span className="text-white font-medium">
                              {new Date(movie.release_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Domestic:</span>
                            <span className="text-green-400 font-bold">
                              ${Math.round(movie.domestic_projection / 1000000)}M
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Budget:</span>
                            <span className="text-blue-400 font-medium">
                              ${Math.round(movie.estimated_budget / 1000000)}M
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Risk:</span>
                            <span className={`font-bold ${
                              movie.risk_assessment.overall === 'low'
                                ? 'text-green-400'
                                : movie.risk_assessment.overall === 'medium'
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                            }`}>
                              {movie.risk_assessment.overall.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Rating:</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              movie.scouting_report.recommendation === 'strong_buy'
                                ? 'bg-green-600 text-white'
                                : movie.scouting_report.recommendation === 'buy'
                                  ? 'bg-blue-600 text-white'
                                  : movie.scouting_report.recommendation === 'hold'
                                    ? 'bg-yellow-600 text-black'
                                    : 'bg-red-600 text-white'
                            }`}>
                              {movie.scouting_report.recommendation.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Draft History */}
          <div className="col-span-3">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50 h-full">
              <h3 className="text-lg font-bold text-white mb-4">
                📝 Draft History ({picks.length})
              </h3>

              <div className="space-y-3 overflow-y-auto h-[calc(100%-60px)]">
                {picks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-sm">No picks yet</div>
                    <div className="text-gray-500 text-xs mt-1">Draft will begin soon</div>
                  </div>
                ) : (
                  picks.slice().reverse().map((pick) => {
                    const movie = movies.find(m => m.id === pick.movieId)
                    return (
                      <div
                        key={pick.id}
                        className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {pick.overallPick}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white font-medium text-sm">
                                {pick.playerName}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {pick.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            {movie ? (
                              <>
                                <div className="text-gray-300 text-sm font-medium mb-1">
                                  {movie.title}
                                </div>
                                <div className="text-gray-400 text-xs">
                                  Rank #{movie.draftRank} • {new Date(movie.release_date).toLocaleDateString()}
                                </div>
                              </>
                            ) : (
                              <div className="text-gray-500 text-sm italic">
                                Pick skipped (time expired)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Draft Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Pick Time Limit (seconds)
                </label>
                <input
                  type="number"
                  value={settings.pickTimeLimit}
                  onChange={(e) => setSettings(prev => ({ ...prev, pickTimeLimit: Number(e.target.value) }))}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500"
                  min="30"
                  max="600"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Pause Between Picks (seconds)
                </label>
                <input
                  type="number"
                  value={settings.pauseBetweenPicks}
                  onChange={(e) => setSettings(prev => ({ ...prev, pauseBetweenPicks: Number(e.target.value) }))}
                  className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500"
                  min="0"
                  max="30"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm font-medium">Auto Start Timer</span>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, autoStart: !prev.autoStart }))}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.autoStart ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                    settings.autoStart ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      {showMovieDetails && selectedMovie && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
            <div className="relative">
              {/* Header */}
              <div className="flex items-start gap-6 p-6 border-b border-slate-700">
                <div className="w-40 h-60 flex-shrink-0">
                  <img
                    src={getImageUrl(selectedMovie.poster_path)}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-movie.svg'
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedMovie.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                        <span>#{selectedMovie.draftRank} Overall</span>
                        <span>•</span>
                        <span>{new Date(selectedMovie.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                        <span>•</span>
                        <span>{selectedMovie.runtime && `${selectedMovie.runtime} min`}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowMovieDetails(false)}
                      className="text-gray-400 hover:text-white p-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        ${Math.round(selectedMovie.domestic_projection / 1000000)}M
                      </div>
                      <div className="text-xs text-gray-400">Domestic Projection</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        ${Math.round(selectedMovie.estimated_budget / 1000000)}M
                      </div>
                      <div className="text-xs text-gray-400">Budget</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {selectedMovie.oscar_potential.score}
                      </div>
                      <div className="text-xs text-gray-400">Oscar Score</div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3 text-center"
                         style={{ backgroundColor: `${selectedMovie.projection_confidence.color}20` }}>
                      <div className="text-2xl font-bold" style={{ color: selectedMovie.projection_confidence.color }}>
                        {selectedMovie.projection_confidence.percentage}%
                      </div>
                      <div className="text-xs text-gray-400">Confidence</div>
                    </div>
                  </div>

                  {/* Overview */}
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedMovie.overview}</p>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="p-6 space-y-8">
                {/* Scouting Report */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    📊 Scouting Report
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      selectedMovie.scouting_report.recommendation === 'strong_buy'
                        ? 'bg-green-600 text-white'
                        : selectedMovie.scouting_report.recommendation === 'buy'
                          ? 'bg-blue-600 text-white'
                          : selectedMovie.scouting_report.recommendation === 'hold'
                            ? 'bg-yellow-600 text-black'
                            : 'bg-red-600 text-white'
                    }`}>
                      {selectedMovie.scouting_report.recommendation.replace('_', ' ').toUpperCase()}
                    </span>
                  </h3>

                  <div className="bg-slate-800 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 italic">{selectedMovie.scouting_report.summary}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-green-400 mb-3">💪 Strengths</h4>
                      <ul className="space-y-2">
                        {selectedMovie.scouting_report.strengths.map((strength, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-400 mb-3">⚠️ Concerns</h4>
                      <ul className="space-y-2">
                        {selectedMovie.scouting_report.concerns.map((concern, idx) => (
                          <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {selectedMovie.scouting_report.comparisons.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold text-blue-400 mb-2">📈 Comparisons</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.scouting_report.comparisons.map((comparison, idx) => (
                          <span key={idx} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            {comparison}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Financial Projections */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">💰 Financial Projections</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Opening Weekend</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        ${Math.round(selectedMovie.opening_weekend_projection / 1000000)}M
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Worldwide Total</div>
                      <div className="text-2xl font-bold text-cyan-400">
                        ${Math.round(selectedMovie.worldwide_projection / 1000000)}M
                      </div>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">Profit Projection</div>
                      <div className={`text-2xl font-bold ${selectedMovie.profit_projection > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${Math.round(selectedMovie.profit_projection / 1000000)}M
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cast & Crew */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">🎬 Cast & Crew</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-300 mb-2">Director</h4>
                      <p className="text-gray-400">{selectedMovie.director || 'TBA'}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-300 mb-2">Main Cast</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.main_cast.slice(0, 6).map((actor, idx) => (
                          <span key={idx} className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm">
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">⚖️ Risk Assessment</h3>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-gray-400">Overall Risk:</span>
                      <span className={`px-3 py-1 rounded-full font-bold ${
                        selectedMovie.risk_assessment.overall === 'low'
                          ? 'bg-green-500/20 text-green-400'
                          : selectedMovie.risk_assessment.overall === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedMovie.risk_assessment.overall.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {Object.entries(selectedMovie.risk_assessment.factors).map(([factor, level]) => (
                        <div key={factor} className="text-center">
                          <div className="text-gray-400 text-xs capitalize mb-1">{factor}</div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            level === 'low' ? 'bg-green-500/20 text-green-400'
                              : level === 'medium' ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}>
                            {level.toUpperCase()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <ul className="space-y-1">
                      {selectedMovie.risk_assessment.notes.map((note, idx) => (
                        <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Oscar Potential */}
                {selectedMovie.oscar_potential.likelihood !== 'low' && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">🏆 Awards Potential</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-gray-400">Oscar Likelihood:</span>
                        <span className={`px-3 py-1 rounded-full font-bold ${
                          selectedMovie.oscar_potential.likelihood === 'high'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {selectedMovie.oscar_potential.likelihood.toUpperCase()}
                        </span>
                        <span className="text-2xl font-bold text-yellow-400">
                          {selectedMovie.oscar_potential.score}/100
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-yellow-400 mb-2">Potential Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMovie.oscar_potential.categories.map((category, idx) => (
                              <span key={idx} className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-yellow-400 mb-2">Key Factors</h4>
                          <ul className="space-y-1">
                            {selectedMovie.oscar_potential.factors.map((factor, idx) => (
                              <li key={idx} className="text-gray-300 text-sm">• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Franchise Information */}
                {selectedMovie.franchise_strength.score > 50 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">🎯 Franchise Analysis</h3>
                    <div className="bg-slate-800 rounded-lg p-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{selectedMovie.franchise_strength.score}/100</div>
                          <div className="text-xs text-gray-400">Franchise Strength</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${selectedMovie.franchise_strength.isSequel ? 'text-green-400' : 'text-gray-400'}`}>
                            {selectedMovie.franchise_strength.isSequel ? 'YES' : 'NO'}
                          </div>
                          <div className="text-xs text-gray-400">Is Sequel</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${
                            selectedMovie.franchise_strength.brandRecognition === 'high' ? 'text-green-400'
                              : selectedMovie.franchise_strength.brandRecognition === 'medium' ? 'text-yellow-400'
                                : 'text-gray-400'
                          }`}>
                            {selectedMovie.franchise_strength.brandRecognition.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-400">Brand Recognition</div>
                        </div>
                      </div>
                      {selectedMovie.franchise_strength.franchiseName && (
                        <div className="mt-4 text-center">
                          <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full font-bold">
                            {selectedMovie.franchise_strength.franchiseName} Franchise
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-700 p-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowMovieDetails(false)}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                >
                  Close
                </button>
                {!selectedMovie.isDrafted && draftStarted && !currentPickInfo.isComplete && (
                  <button
                    onClick={() => {
                      setShowMovieDetails(false)
                      handleMovieSelect(selectedMovie)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all"
                  >
                    Draft This Movie
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DraftPage