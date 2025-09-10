'use client'

import { useState, useEffect, memo } from 'react'
import UserProfile from './UserProfile'
import PerformanceChart, { generateMockChartData } from './PerformanceChart'
import TabbedChart from './TabbedChart'
import ActivityFeed, { generateMockActivity } from './ActivityFeed'
import MovieDetailModal from './MovieDetailModal'
import { getBiggestUpcomingMovies, get2025Movies, getImageUrl, formatCurrency, TMDBMovie } from '../lib/tmdb'
import { getCurrentUser, getUserLeagues } from '../lib/auth'
import { db } from '../lib/supabase'
import { realLeagueData, getLeagueStandings, generateRealChartData } from '../lib/realLeagueData'

const Dashboard = memo(function Dashboard() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showBrowseLeagues, setShowBrowseLeagues] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState<any>(null)
  const [upcomingMovies, setUpcomingMovies] = useState<TMDBMovie[]>([])
  const [movies2025, setMovies2025] = useState<TMDBMovie[]>([])
  const [isLoadingMovies, setIsLoadingMovies] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userLeagues, setUserLeagues] = useState<any[]>([])
  const [chartData, setChartData] = useState(() => generateRealChartData().find(player => player.player === 'Grant')?.data || generateMockChartData())
  const [liveActivity, setLiveActivity] = useState(generateMockActivity())
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  const handleMovieClick = (movie: TMDBMovie) => {
    setSelectedMovie(movie)
    setShowMovieModal(true)
  }

  // Generate league-specific chart data for the current user
  const generateLeagueChartData = (league: any, userId: string) => {
    // Find the current user's player data in this specific league
    const userPlayer = league.players.find((player: any) => player.userId === userId)
    
    // Calculate current week based on league start (draft date + 1 day)
    // For now, since we're still in draft status, show Week 1 (pre-season)
    const getCurrentWeek = () => {
      if (league.status === 'draft') {
        return 1 // Pre-season, showing just Week 1 placeholder
      }
      
      // In a real implementation, this would calculate weeks since league.draftDate + 1 day
      // For example: Math.ceil((Date.now() - new Date(league.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000))
      return 1 // Will be dynamic once season starts
    }
    
    const currentWeek = getCurrentWeek()
    
    if (!userPlayer) {
      // User not found in league, return empty data for current weeks
      return Array.from({ length: currentWeek }, (_, i) => ({
        week: `W${i + 1}`,
        score: 0,
        boxOffice: 0,
        rank: league.currentPlayers,
        totalEarnings: 0
      }))
    }

    // Use the user's actual weekly scores and performance data for all weeks since season start
    return Array.from({ length: currentWeek }, (_, i) => {
      const weekData = userPlayer.weeklyScores.find((ws: any) => ws.week === i + 1)
      
      return {
        week: `W${i + 1}`,
        score: weekData?.score || 0,
        boxOffice: weekData?.boxOffice || 0,
        rank: weekData?.rank || userPlayer.rank || league.currentPlayers,
        totalEarnings: userPlayer.totalScore || 0
      }
    })
  }

  // Fetch user leagues and movies
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingMovies(true)
        
        // Debug localStorage directly
        console.log('Dashboard - localStorage leagues:', localStorage.getItem('fantasy-flix-leagues'))
        console.log('Dashboard - localStorage user:', localStorage.getItem('fantasy-flix-current-user'))
        
        // Small delay to ensure localStorage operations complete
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Get current user and their leagues
        const user = await getCurrentUser()
        console.log('Dashboard - Current user:', user)
        if (user) {
          setCurrentUser(user)
          const leagues = await getUserLeagues(user.id)
          setUserLeagues(leagues)
          console.log('Dashboard loaded leagues:', leagues)
          console.log('User leagues count:', leagues.length)
          
          // Force re-render
          setTimeout(() => {
            setUserLeagues([...leagues])
          }, 100)
        } else {
          console.log('Dashboard - No current user found')
        }
        
        // Fetch movies from TMDB
        const [upcomingData, movies2025Data] = await Promise.all([
          getBiggestUpcomingMovies(),
          get2025Movies()
        ])
        
        setUpcomingMovies(upcomingData) // Top 6 upcoming movies (next 30 days)
        setMovies2025(movies2025Data.slice(0, 6)) // Top 6 2025 movies
      } catch (error) {
        console.error('Error fetching data:', error)
        // Keep the UI working even if API fails
      } finally {
        setIsLoadingMovies(false)
      }
    }

    loadData()
  }, [])

  // Load user leagues
  useEffect(() => {
    if (currentUser) {
      // TODO: Load real user leagues from database
      setUserLeagues([]) // No leagues until user creates/joins them
    }
  }, [currentUser])

  return (
    <div className="px-4 py-6 min-h-screen">
      {/* League Stats - Only show if user has leagues */}
      {userLeagues.length > 0 ? (
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-2">League Players</p>
                <p className="text-3xl font-black text-white">
                  {userLeagues[0]?.currentPlayers || 0}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-2">Your Position</p>
                <p className="text-3xl font-black text-amber-400">-</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-2">Your Score</p>
                <p className="text-3xl font-black text-white">-</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium mb-2">Profit/Movie</p>
                <p className="text-3xl font-black text-green-400">-</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent leading-tight py-2">Your Leagues</h2>
        <div className="space-x-4">
          <button 
            onClick={() => setShowBrowseLeagues(true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-8 py-3 rounded-2xl font-bold hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Browse Public Leagues
          </button>
        </div>
      </div>

      {userLeagues.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {userLeagues.map((league) => (
            <div key={league.id} className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              {/* League Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{league.name}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-sm font-bold rounded">
                      {league.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {league.currentPlayers}/{league.maxPlayers} Players
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Chart */}
              <div className="h-96 w-full mb-6">
                <TabbedChart 
                  data={generateLeagueChartData(league, currentUser?.id)} 
                  title={`${league.name} Performance`}
                  league={league}
                />
              </div>

              {/* Enter League Button */}
              <button 
                onClick={() => setSelectedLeague(league)}
                className="w-full py-3 gradient-blue text-white rounded-xl font-bold hover:opacity-90 transition-all">
                Enter League →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl border border-amber-500/20 shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent leading-tight py-2">No Leagues Yet</h3>
          <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">Head to "My Leagues" to create your first league and start your cinematic journey!</p>
        </div>
      )}

      {/* Biggest Upcoming Movies - Next 30 Days */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent leading-tight py-2">Biggest Upcoming Movies</h2>
          <span className="text-sm text-amber-400 font-medium bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm border border-amber-500/20">Next 30 Days • Most Anticipated</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {isLoadingMovies ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl overflow-hidden animate-pulse border border-white/5">
                <div className="bg-gray-700/50 aspect-[2/3]"></div>
              </div>
            ))
          ) : (
            upcomingMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group border border-amber-500/10 hover:border-amber-500/30 shadow-xl hover:shadow-amber-500/20"
                onClick={() => handleMovieClick(movie)}
              >
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-movie.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-2 left-2 right-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-sm truncate">{movie.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-yellow-400 text-xs">{movie.vote_average.toFixed(1)}/10</span>
                      <span className="text-blue-400 text-xs">{new Date(movie.release_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Hottest Movies Out Now Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-6 bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent leading-tight py-1">Hottest Movies Out Now</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingMovies ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 animate-pulse border border-white/5">
                  <div className="flex space-x-4">
                    <div className="bg-gray-700 rounded w-16 h-24"></div>
                    <div className="flex-1">
                      <div className="bg-gray-700 rounded h-4 mb-2"></div>
                      <div className="bg-gray-700 rounded h-3 mb-2"></div>
                      <div className="bg-gray-700 rounded h-3 w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              upcomingMovies.slice(0, 3).map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 hover:shadow-amber-500/20 transition-all cursor-pointer border border-amber-500/10 hover:border-amber-500/30 shadow-xl"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="flex space-x-4">
                    <img
                      src={getImageUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.jpg'
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm mb-1 line-clamp-2">{movie.title}</h4>
                      <p className="text-gray-400 text-xs mb-2 line-clamp-2">{movie.overview}</p>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-yellow-400">{movie.vote_average.toFixed(1)}/10</span>
                        <span className="text-red-400">🔥 Now Playing</span>
                        {movie.revenue && movie.revenue > 0 && (
                          <span className="text-green-400">{formatCurrency(movie.revenue)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>


      {/* Fantasy Flix News Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent leading-tight py-2">Fantasy Flix News</h2>
          <span className="text-sm text-amber-400 font-medium bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm border border-amber-500/20">Latest Updates</span>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured Article */}
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 0v1.93a2 2 0 00.78 1.58l4.44 3.67A2 2 0 0118 15.93V18a2 2 0 11-4 0v-2.07a2 2 0 00-.78-1.58L9.78 10.68A2 2 0 018 9.1V6a2 2 0 112 0v2z" />
                </svg>
              </div>
              <span className="text-red-400 font-bold text-sm">TRENDING</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Box Office Predictions: Horror Movies Dominating Fall Season</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              With October around the corner, horror films are expected to drive massive box office numbers. Our analysis shows that fantasy league players should focus on psychological thrillers and supernatural horror for maximum returns.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">FF</span>
                </div>
                <span className="text-gray-400 text-sm">Fantasy Flix Editorial</span>
              </div>
              <button className="text-amber-400 hover:text-amber-300 text-sm font-medium">Read More →</button>
            </div>
          </div>

          {/* News Articles Grid */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-blue-400 text-sm font-medium">STRATEGY</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">4 hours ago</span>
              </div>
              <h4 className="text-white font-bold mb-2">Budget vs. Blockbuster: Finding Hidden Gems</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Learn how to identify low-budget films that could become surprise hits and boost your fantasy league score.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm font-medium">INDUSTRY</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">6 hours ago</span>
              </div>
              <h4 className="text-white font-bold mb-2">Streaming vs. Theatrical: Impact on Fantasy Scoring</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                How the hybrid release model affects box office performance and what it means for your fantasy picks.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-purple-400 text-sm font-medium">ANALYSIS</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 text-sm">1 day ago</span>
              </div>
              <h4 className="text-white font-bold mb-2">International Markets: The New Frontier</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Why global box office numbers are becoming increasingly important for fantasy league success.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfile username={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Browse Leagues Modal */}
      {showBrowseLeagues && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-3xl p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gradient">Browse Public Leagues</h3>
              <button onClick={() => setShowBrowseLeagues(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-white font-bold text-xl mb-2">No Public Leagues Yet</h4>
              <p className="text-gray-400 mb-6">Head to "My Leagues" to create public leagues!</p>
            </div>
          </div>
        </div>
      )}

      {/* League Details Modal */}
      {selectedLeague && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-3xl p-8 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gradient">{selectedLeague.name}</h3>
              <button onClick={() => setSelectedLeague(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm">Current Status</p>
                <p className="text-white font-bold">{selectedLeague.status}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Players</p>
                  <p className="text-white font-bold">{selectedLeague.teams}/{selectedLeague.maxTeams}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Your Rank</p>
                  <p className="text-gradient font-bold">#{selectedLeague.myRank || 'N/A'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLeague(null)}
                className="w-full gradient-blue text-white py-3 rounded-xl font-bold"
              >
                Enter League Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

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
})

export default Dashboard