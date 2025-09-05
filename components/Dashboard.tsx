'use client'

import { useState, useEffect, memo } from 'react'
import UserProfile from './UserProfile'
import PerformanceChart, { generateMockChartData } from './PerformanceChart'
import TabbedChart from './TabbedChart'
import ActivityFeed, { generateMockActivity } from './ActivityFeed'
import MovieDetailModal from './MovieDetailModal'
import { getSeasonalMovies, get2025Movies, getImageUrl, formatCurrency, TMDBMovie } from '../lib/tmdb'
import { getUserLeagues, getCurrentUser } from '../lib/auth'
import { realLeagueData, getLeagueStandings, generateRealChartData } from '../lib/realLeagueData'

const Dashboard = memo(function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showBrowseLeagues, setShowBrowseLeagues] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState<any>(null)
  const [seasonalMovies, setSeasonalMovies] = useState<TMDBMovie[]>([])
  const [movies2025, setMovies2025] = useState<TMDBMovie[]>([])
  const [isLoadingMovies, setIsLoadingMovies] = useState(true)
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [userLeagues, setUserLeagues] = useState<any[]>([])
  const [chartData, setChartData] = useState(() => generateRealChartData().find(player => player.player === 'Grant')?.data || generateMockChartData())
  const [liveActivity, setLiveActivity] = useState(generateMockActivity())
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)

  const handleMovieClick = (movie: TMDBMovie) => {
    setSelectedMovie(movie)
    setShowMovieModal(true)
  }

  // Fetch 2025 seasonal movies from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoadingMovies(true)
        const [seasonal, movies2025Data] = await Promise.all([
          getSeasonalMovies(),
          get2025Movies()
        ])
        
        setSeasonalMovies(seasonal.slice(0, 6)) // Top 6 seasonal movies
        setMovies2025(movies2025Data.slice(0, 6)) // Top 6 2025 movies
      } catch (error) {
        console.error('Error fetching movies:', error)
        // Keep the UI working even if API fails
      } finally {
        setIsLoadingMovies(false)
      }
    }

    fetchMovies()
  }, [])

  // Load user leagues
  useEffect(() => {
    if (currentUser) {
      const leagues = getUserLeagues(currentUser.id)
      setUserLeagues(leagues)
    }
  }, [currentUser])

  return (
    <div className="px-4 py-6">
      {/* League Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass-elegant rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 original:text-slate-400 text-sm font-medium">League Players</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white original:text-white">4</p>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="glass-elegant rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 original:text-slate-400 text-sm font-medium">Your Position</p>
              <p className="text-2xl font-bold text-emerald-400">#1</p>
            </div>
            <div className="w-12 h-12 bg-emerald-900 bg-opacity-30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="glass-elegant rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 original:text-slate-400 text-sm font-medium">Your Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white original:text-white">337</p>
            </div>
            <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
        <div className="glass-elegant rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 original:text-slate-400 text-sm font-medium">Profit/Movie</p>
              <p className="text-2xl font-bold text-emerald-400">125.5</p>
            </div>
            <div className="w-12 h-12 bg-emerald-900 bg-opacity-30 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Section - Near Top */}
      {userLeagues.length > 0 && (
        <div className="mb-8">
          <TabbedChart data={chartData} />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white original:text-white">Your Leagues</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="gradient-blue text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
          >
            Create Elite League
          </button>
          <button 
            onClick={() => setShowBrowseLeagues(true)}
            className="glass-dark text-white px-6 py-3 rounded-xl font-bold hover:card-glow transition-all">
            Browse Public Leagues
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {userLeagues.length > 0 ? userLeagues.map((league) => (
          <div key={league.id} className="glass-dark rounded-2xl p-6 hover:card-glow transition-all transform hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{league.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  {league.trending === 'hot' && <span className="text-red-500 text-xs font-bold">HOT</span>}
                  {league.trending === 'up' && <span className="text-green-500 text-xs font-bold">RISING</span>}
                  {league.trending === 'new' && <span className="text-blue-500 text-xs font-bold">NEW</span>}
                </div>
              </div>
              <span className="px-3 py-1 gradient-blue rounded-full text-white text-xs font-bold">
                {league.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Players:</span>
                <span className="font-bold">{league.currentPlayers}/{league.maxPlayers}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Entry Fee:</span>
                <span className="font-bold text-green-400">${league.entryFee}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Prize Pool:</span>
                <span className="font-bold text-gradient-gold">${league.prizePool}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Season:</span>
                <span className="font-bold text-blue-400">{league.season}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedLeague(league)}
              className="mt-4 w-full py-3 gradient-blue text-white rounded-xl font-bold hover:opacity-90 transition-all">
              Enter League →
            </button>
          </div>
        )) : (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white original:text-white mb-3">No Leagues Yet</h3>
            <p className="text-gray-400 text-lg mb-6">Ready to start your fantasy movie journey?</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="gradient-blue text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all text-lg"
            >
              Create Your First League
            </button>
          </div>
        )}
      </div>

      {/* Seasonal 2025 Movies - TMDB Integration */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white original:text-white">Seasonal Movies</h2>
          <span className="text-sm text-gray-400">2025-2026 • Horror • Thriller • Drama • Mystery</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {isLoadingMovies ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="glass-dark rounded-xl p-4 animate-pulse">
                <div className="bg-gray-700 rounded-lg h-32 mb-3"></div>
                <div className="bg-gray-700 rounded h-4 mb-2"></div>
                <div className="bg-gray-700 rounded h-3"></div>
              </div>
            ))
          ) : (
            seasonalMovies.map((movie) => (
              <div
                key={movie.id}
                className="glass-dark rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group"
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
                      {movie.revenue && (
                        <span className="text-green-400 text-xs">{formatCurrency(movie.revenue)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 2025-2026 Movies Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white original:text-white mb-4">2025-2026 Movies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingMovies ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="glass-dark rounded-xl p-4 animate-pulse">
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
                  className="glass-dark rounded-xl p-4 hover:card-glow transition-all cursor-pointer"
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


      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live Activity Feed */}
        <ActivityFeed
          activities={liveActivity}
          showFilters={true}
          maxItems={8}
        />

        {/* League Standings */}
        <div className="glass-elegant rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">League Standings</h3>
            <span className="text-sm text-slate-400">Current Season</span>
          </div>
          
          <div className="space-y-3">
            {getLeagueStandings().map((player, index) => (
              <div key={player.name} className="flex items-center justify-between p-4 bg-slate-800 bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-emerald-500 text-white' :
                    index === 1 ? 'bg-slate-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {player.rank}
                  </div>
                  <div>
                    <p className="text-white font-medium">{player.name}</p>
                    <p className="text-slate-400 text-sm">{player.profitableMovies}/{player.totalMovies} profitable</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${player.score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {player.score > 0 ? '+' : ''}{player.score}
                  </p>
                  <p className="text-slate-400 text-sm">{player.profitPerMovie}/movie</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create League Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-3xl p-8 w-full max-w-md transform scale-100">
            <h3 className="text-2xl font-black text-gradient mb-6">Create Elite League</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="League Name (e.g., Champions League)"
                className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
              />
              <select className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400">
                <option>Max Players: 100</option>
                <option>Max Players: 500</option>
                <option>Max Players: 1000</option>
                <option>Max Players: Unlimited</option>
              </select>
              <select className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400">
                <option>Entry Fee: Free</option>
                <option>Entry Fee: $10</option>
                <option>Entry Fee: $25</option>
                <option>Entry Fee: $100</option>
              </select>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 glass border border-gray-500 rounded-xl text-gray-300 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 gradient-blue text-white px-4 py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all"
                >
                  Create League
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <p className="text-gray-400 mb-6">Be the first to create a public league!</p>
              <button 
                onClick={() => {
                  setShowBrowseLeagues(false)
                  setShowCreateModal(true)
                }}
                className="gradient-blue text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all"
              >
                Create First League
              </button>
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