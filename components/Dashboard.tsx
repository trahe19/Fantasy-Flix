'use client'

import { useState, useEffect, memo } from 'react'
import UserProfile from './UserProfile'
import PerformanceChart, { generateMockChartData } from './PerformanceChart'
import TabbedChart from './TabbedChart'
import ActivityFeed, { generateMockActivity } from './ActivityFeed'
import MovieDetailModal from './MovieDetailModal'
import { getBiggestUpcomingMovies, get2025Movies, get2025BlockbusterMovies, getFantasyLeagueRoster, getImageUrl, formatCurrency, TMDBMovie } from '../lib/tmdb'
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
  // Grant's exact portfolio data from spreadsheet with compact labels
  const grantPortfolioData = [
    { title: 'Wicked: For Good', shortTitle: 'Wicked', budget: 165, revenue: 0, profit: -165, position: 1 },
    { title: 'Superman', shortTitle: 'Superman', budget: 225, revenue: 329, profit: 104, position: 2 },
    { title: 'A Minecraft Movie', shortTitle: 'Minecraft', budget: 150, revenue: 394, profit: 244, position: 3 },
    { title: '28 Years Later', shortTitle: '28 Years', budget: 60, revenue: 68, profit: 8, position: 4 },
    { title: 'Sinners', shortTitle: 'Sinners', budget: 90, revenue: 236, profit: 146, position: 5 },
    { title: 'Five Nights at Freddy 2 (Sixth Man)', shortTitle: 'FNAF2 (6th)', budget: 51, revenue: 0, profit: -51, position: 6 }
  ]

  const [chartData, setChartData] = useState(grantPortfolioData)
  const [liveActivity, setLiveActivity] = useState(generateMockActivity())
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  // League transaction log data
  const leagueTransactions = [
    {
      date: '1/16/2025',
      player: 'Will',
      action: 'Adds Dog Man, Swaps Michael for Mission Impossible: Final Reckoning',
      penalty: null
    },
    {
      date: '1/18/2025',
      player: 'Grant',
      action: 'Adds Sinners to starting lineup, moves FNAF2 to sixth man',
      penalty: null
    },
    {
      date: '1/22/2025',
      player: 'Josh',
      action: 'Trades Thunderbolts to Tyler for Beyond the Spiderverse',
      penalty: null
    },
    {
      date: '2/03/2025',
      player: 'Tyler',
      action: 'Drops Mission Impossible: Final Reckoning, adds The Conjuring: Last Rites',
      penalty: null
    },
    {
      date: '2/14/2025',
      player: 'Will',
      action: 'Claims Moana from waiver wire, drops Karate Kid',
      penalty: null
    },
    {
      date: '3/01/2025',
      player: 'Josh',
      action: 'Swaps Captain America 4 for How to Train Your Dragon in starting lineup',
      penalty: null
    },
    {
      date: '3/07/2025',
      player: 'Grant',
      action: 'Activates Sinners (release day), locked in starting lineup',
      penalty: null
    },
    {
      date: '3/15/2025',
      player: 'Tyler',
      action: 'Late roster swap attempt blocked - Avatar locked',
      penalty: '$25 Fine'
    },
    {
      date: '4/04/2025',
      player: 'Grant',
      action: 'A Minecraft Movie activates (release day), locked in starting lineup',
      penalty: null
    },
    {
      date: '4/10/2025',
      player: 'Will',
      action: 'Emergency drop: Lilo & Stitch (production issues), adds Sonic 3',
      penalty: null
    },
    {
      date: '5/22/2025',
      player: 'Tyler',
      action: 'Swaps Conjuring: Last Rites for Spiderman: Beyond the Spiderverse',
      penalty: null
    },
    {
      date: '6/20/2025',
      player: 'Grant',
      action: '28 Years Later activates (release day), locked in starting lineup',
      penalty: null
    },
    {
      date: '7/11/2025',
      player: 'Grant',
      action: 'Superman activates (release day), locked in starting lineup',
      penalty: null
    },
    {
      date: '7/18/2025',
      player: 'Josh',
      action: 'Captain America 4 activates, How to Train Your Dragon to bench',
      penalty: null
    },
    {
      date: '8/15/2025',
      player: 'Will',
      action: 'Jurassic World activates (release day), locked in starting lineup',
      penalty: null
    },
    {
      date: '8/18/2025',
      player: 'Tyler',
      action: 'Missed roster deadline for Fantastic 4 activation',
      penalty: '$50 Fine'
    },
    {
      date: '9/12/2025',
      player: 'Josh',
      action: 'Mickey 17 activates (release day), locked in starting lineup',
      penalty: null
    },
    {
      date: '10/15/2025',
      player: 'Will',
      action: 'Claims surprise hit "The Wild Robot 2" from waiver wire',
      penalty: null
    },
    {
      date: '11/21/2025',
      player: 'Grant',
      action: 'Wicked: For Good activates (release day), locked in starting lineup',
      penalty: null
    },
    {
      date: '12/05/2025',
      player: 'Grant',
      action: 'Activates FNAF2 from sixth man for final stretch',
      penalty: null
    }
  ]

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

        // Set Grant as current user with active league
        const user = { id: 'grant-user-id', username: 'grantgeyer', display_name: 'Grant Geyer' }
        setCurrentUser(user)

        // Create Father Flix League with demo data
        const demoLeague = {
          id: 'father-flix-league',
          name: 'Father Flix League',
          status: 'active',
          maxPlayers: 4,
          currentPlayers: 4,
          season: '2025 Season',
          prizePool: 200,
          createdBy: user.id,
          draftDate: '2024-12-15T19:00:00.000Z'
        }

        setUserLeagues([demoLeague])

        // Fetch movies from TMDB - prioritize 2025 blockbusters
        const [upcomingData, movies2025Data] = await Promise.all([
          get2025BlockbusterMovies(), // Changed to 2025 blockbusters
          get2025Movies()
        ])

        setUpcomingMovies(upcomingData.slice(0, 6)) // Top 6 2025 blockbuster movies
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


  return (
    <div className="px-4 py-6 min-h-screen">
      {/* Grant's Portfolio Performance - Main Feature */}
      {userLeagues.length > 0 && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/20 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  Portfolio Performance
                </h2>
                <p className="text-white/70 text-sm mt-1">30-Day Revenue Tracking</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-green-400">+$336M</div>
                <div className="text-white/70 text-sm">Total Profit</div>
              </div>
            </div>

            {/* Compact Portfolio Line Graph */}
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <div className="h-48">
                <svg width="100%" height="100%" viewBox="0 0 700 192" className="overflow-visible">
                  <defs>
                    <linearGradient id="profitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  <g stroke="rgba(156, 163, 175, 0.08)" strokeWidth="1">
                    {/* Horizontal lines */}
                    {[-200, -100, 0, 100, 200].map((value, i) => {
                      const y = 96 - (value / 300) * 70
                      return (
                        <line key={i} x1="60" y1={y} x2="640" y2={y} />
                      )
                    })}
                    {/* Vertical lines */}
                    {grantPortfolioData.map((_, i) => {
                      const x = 60 + (i * 116)
                      return (
                        <line key={i} x1={x} y1="26" x2={x} y2="166" />
                      )
                    })}
                  </g>

                  {/* Zero line */}
                  <line x1="60" y1="96" x2="640" y2="96" stroke="white" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.4" />

                  {/* Data line */}
                  <polyline
                    points={grantPortfolioData.map((movie, i) => {
                      const x = 60 + (i * 116)
                      const y = 96 - (movie.profit / 300) * 70
                      return `${x},${y}`
                    }).join(' ')}
                    fill="none"
                    stroke="url(#profitGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {grantPortfolioData.map((movie, i) => {
                    const x = 60 + (i * 116)
                    const y = 96 - (movie.profit / 300) * 70
                    const isProfit = movie.profit > 0

                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill={isProfit ? "#10B981" : "#EF4444"}
                          stroke="white"
                          strokeWidth="1.5"
                        />

                        {/* Compact movie labels */}
                        <text
                          x={x}
                          y="180"
                          textAnchor="middle"
                          className="fill-gray-300 text-xs font-medium"
                        >
                          {movie.shortTitle}
                        </text>

                        {/* Compact profit/loss values */}
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          className={`text-xs font-bold ${isProfit ? 'fill-green-400' : 'fill-red-400'}`}
                        >
                          {isProfit ? '+' : ''}${movie.profit}M
                        </text>
                      </g>
                    )
                  })}

                  {/* Compact Y-axis labels */}
                  {[-200, 0, 200].map((value) => {
                    const y = 96 - (value / 300) * 70
                    return (
                      <text
                        key={value}
                        x="50"
                        y={y + 3}
                        textAnchor="end"
                        className="fill-gray-400 text-xs"
                      >
                        ${value}M
                      </text>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Compact Portfolio Summary */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">{grantPortfolioData.length}</div>
                <div className="text-gray-400 text-xs">Movies</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">${grantPortfolioData.reduce((sum, movie) => sum + movie.budget, 0)}M</div>
                <div className="text-gray-400 text-xs">Budget</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-white">${grantPortfolioData.reduce((sum, movie) => sum + movie.revenue, 0)}M</div>
                <div className="text-gray-400 text-xs">Revenue</div>
              </div>
              <div className="bg-green-900/30 rounded-lg p-3 text-center border border-green-500/30">
                <div className="text-lg font-bold text-green-400">+${grantPortfolioData.reduce((sum, movie) => sum + movie.profit, 0)}M</div>
                <div className="text-green-400 text-xs">Profit</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">League Details</h2>
      </div>

      {/* Grant's Movie Roster Breakdown */}
      {userLeagues.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-2xl mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Your Movie Roster</h3>
          <div className="grid gap-4">
            {grantPortfolioData.map((movie, index) => (
              <div key={index} className={`p-4 rounded-xl border transition-all ${
                movie.profit > 0 ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      movie.title.includes('Sixth Man')
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {movie.title.includes('Sixth Man') ? 'SIXTH MAN' : `MOVIE ${movie.position}`}
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{movie.title.replace(' (Sixth Man)', '')}</h4>
                      <p className="text-gray-400 text-sm">
                        Budget: ${movie.budget}M • Revenue: {movie.revenue > 0 ? `$${movie.revenue}M` : 'Not released'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      movie.profit > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {movie.profit > 0 ? '+' : ''}${movie.profit}M
                    </div>
                    <div className="text-gray-400 text-sm">
                      {movie.revenue > 0 ? `${((movie.profit / movie.budget) * 100).toFixed(1)}% ROI` : 'Awaiting release'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2025 Blockbuster Movies */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">2025 Blockbuster Movies</h2>
          <span className="text-sm text-amber-400 font-medium bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm border border-amber-500/20">High-Budget • Box Office Potential</span>
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
                      e.currentTarget.src = '/placeholder-movie.svg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-white font-bold text-xs leading-tight drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{movie.title}</p>
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

        {/* Additional 2025 Movies Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white mb-6 bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">More 2025 Movies</h3>
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
              movies2025.slice(0, 3).map((movie) => (
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
                        e.currentTarget.src = '/placeholder-movie.svg'
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-sm mb-1 drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{movie.title}</h4>
                      <p className="text-gray-400 text-xs mb-2 line-clamp-2">{movie.overview}</p>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-yellow-400">{movie.vote_average.toFixed(1)}/10</span>
                        <span className="text-blue-400">{new Date(movie.release_date).toLocaleDateString()}</span>
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

      {/* League Transaction Log */}
      {currentUser && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">League Activity & Transactions</h2>
            <span className="text-sm text-amber-400 font-medium bg-black/30 px-4 py-2 rounded-xl backdrop-blur-sm border border-amber-500/20">Father Flix League • Live Updates</span>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-600/30 shadow-2xl">
            {/* Transaction Log Header */}
            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-b-2 border-amber-500/40 px-8 py-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-base font-bold text-amber-300">
                <div className="tracking-wide">DATE</div>
                <div className="tracking-wide">PLAYER</div>
                <div className="md:col-span-2 tracking-wide">ACTION</div>
                <div className="hidden md:block tracking-wide">PENALTY</div>
              </div>
            </div>

            {/* Transaction List */}
            <div className="max-h-96 overflow-y-auto">
              {leagueTransactions.slice().reverse().map((transaction, index) => (
                <div key={index} className={`px-8 py-5 border-b border-gray-600/40 hover:bg-gray-700/40 transition-all duration-200 ${
                  transaction.penalty ? 'bg-red-900/20 border-red-500/30 hover:bg-red-900/30' :
                  index % 2 === 0 ? 'bg-gray-700/20' : 'bg-gray-800/20'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-base leading-relaxed">
                    {/* Date */}
                    <div className="text-gray-200 font-semibold tracking-wide">
                      {transaction.date}
                    </div>

                    {/* Player */}
                    <div className={`font-bold text-lg ${
                      transaction.player === 'Grant' ? 'text-blue-300' :
                      transaction.player === 'Will' ? 'text-green-300' :
                      transaction.player === 'Josh' ? 'text-purple-300' :
                      'text-orange-300'
                    }`}>
                      {transaction.player}
                    </div>

                    {/* Action */}
                    <div className="md:col-span-2 text-gray-100 font-medium leading-relaxed">
                      {transaction.action}
                      {transaction.penalty && (
                        <div className="mt-3 md:hidden">
                          <span className="text-red-200 font-bold text-sm bg-red-500/25 px-3 py-1.5 rounded-lg border border-red-400/30">
                            {transaction.penalty}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Penalty (Desktop) */}
                    <div className="hidden md:block">
                      {transaction.penalty ? (
                        <span className="text-red-200 font-bold text-sm bg-red-500/25 px-3 py-1.5 rounded-lg border border-red-400/30 inline-block">
                          {transaction.penalty}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm font-medium">—</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Transaction Summary Footer */}
            <div className="bg-gradient-to-r from-gray-700/70 to-gray-800/70 px-8 py-6 border-t border-gray-600/30">
              <div className="flex flex-wrap items-center justify-between text-base gap-4">
                <div className="text-gray-200 font-medium">
                  Total Transactions: <span className="text-white font-bold text-lg">{leagueTransactions.length}</span>
                </div>
                <div className="text-gray-200 font-medium">
                  Penalties: <span className="text-red-300 font-bold text-lg">
                    {leagueTransactions.filter(t => t.penalty).length}
                  </span>
                </div>
                <div className="text-gray-200 font-medium">
                  Most Active: <span className="text-amber-300 font-bold text-lg">
                    {Object.entries(
                      leagueTransactions.reduce((acc, t) => {
                        acc[t.player] = (acc[t.player] || 0) + 1
                        return acc
                      }, {} as Record<string, number>)
                    ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-600/30 hover:border-amber-500/30 transition-colors">
              <div className="text-3xl mb-3">📈</div>
              <div className="text-white font-bold text-lg mb-2">Most Trades</div>
              <div className="text-amber-300 text-base font-semibold">Tyler (6 moves)</div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-600/30 hover:border-green-500/30 transition-colors">
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-white font-bold text-lg mb-2">Latest Activity</div>
              <div className="text-green-300 text-base font-semibold">Grant: FNAF2 activated</div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-6 text-center border border-gray-600/30 hover:border-red-500/30 transition-colors">
              <div className="text-3xl mb-3">🚨</div>
              <div className="text-white font-bold text-lg mb-2">Rule Violations</div>
              <div className="text-red-300 text-base font-semibold">Tyler: $75 in fines</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live Activity Feed - Only show if there are leagues */}
        {userLeagues.length > 0 ? (
          <ActivityFeed
            activities={[]} // Empty until real activity exists
            showFilters={true}
            maxItems={8}
          />
        ) : (
          <div className="glass-elegant rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Live Activity</h3>
            </div>
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Join a league to see live activity!</p>
            </div>
          </div>
        )}

        {/* League Standings - Only show if there are leagues */}
        {userLeagues.length > 0 ? (
          <div className="glass-elegant rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">League Standings</h3>
              <span className="text-sm text-slate-400">Current Season</span>
            </div>
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Draft your roster to see standings!</p>
            </div>
          </div>
        ) : (
          <div className="glass-elegant rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">League Standings</h3>
            </div>
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-slate-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Set up a league to start!</p>
            </div>
          </div>
        )}
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