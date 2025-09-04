'use client'

import { useState, useEffect, memo } from 'react'
import UserProfile from './UserProfile'
import { getTrendingMovies, getNowPlayingMovies, getImageUrl, formatCurrency, TMDBMovie } from '../lib/tmdb'

const Dashboard = memo(function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showBrowseLeagues, setShowBrowseLeagues] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState<any>(null)
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([])
  const [nowPlayingMovies, setNowPlayingMovies] = useState<TMDBMovie[]>([])
  const [isLoadingMovies, setIsLoadingMovies] = useState(true)

  // TODO: Replace with real leagues from database
  const [leagues, setLeagues] = useState<any[]>([]) // Start with no leagues

  // TODO: Replace with real activity from database
  const [liveActivity, setLiveActivity] = useState<any[]>([]) // Start with no activity

  // Fetch real movie data from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoadingMovies(true)
        const [trending, nowPlaying] = await Promise.all([
          getTrendingMovies(),
          getNowPlayingMovies()
        ])
        
        setTrendingMovies(trending.slice(0, 6)) // Top 6 trending
        setNowPlayingMovies(nowPlaying.slice(0, 6)) // Top 6 now playing
      } catch (error) {
        console.error('Error fetching movies:', error)
        // Keep the UI working even if API fails
      } finally {
        setIsLoadingMovies(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="px-4 py-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass-dark rounded-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Global Players</p>
              <p className="text-3xl font-bold text-white">12,847</p>
            </div>
            <span className="text-4xl">🌍</span>
          </div>
        </div>
        <div className="glass-dark rounded-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Prize Pool</p>
              <p className="text-3xl font-bold text-gradient">$50,000</p>
            </div>
            <span className="text-4xl">💎</span>
          </div>
        </div>
        <div className="glass-dark rounded-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Your Global Rank</p>
              <p className="text-3xl font-bold text-blue-400">#127</p>
            </div>
            <span className="text-4xl">🏆</span>
          </div>
        </div>
        <div className="glass-dark rounded-2xl p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Win Streak</p>
              <p className="text-3xl font-bold text-yellow-400">7 🔥</p>
            </div>
            <span className="text-4xl">⚡</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-white">Your Leagues</h2>
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
        {leagues.length > 0 ? leagues.map((league) => (
          <div key={league.id} className="glass-dark rounded-2xl p-6 hover:card-glow transition-all transform hover:scale-105">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{league.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  {league.trending === 'hot' && <span className="text-red-500 text-xs">🔥 HOT</span>}
                  {league.trending === 'up' && <span className="text-green-500 text-xs">📈 RISING</span>}
                  {league.trending === 'new' && <span className="text-blue-500 text-xs">✨ NEW</span>}
                </div>
              </div>
              <span className="px-3 py-1 gradient-blue rounded-full text-white text-xs font-bold">
                {league.status}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Players:</span>
                <span className="font-bold">{league.teams.toLocaleString()}/{league.maxTeams.toLocaleString()}</span>
              </div>
              {league.myRank && (
                <>
                  <div className="flex justify-between text-gray-300">
                    <span>Your Rank:</span>
                    <span className="font-bold text-gradient">#{league.myRank}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Your Score:</span>
                    <span className="font-bold text-green-400">${(league.myScore / 1000000).toFixed(1)}M</span>
                  </div>
                </>
              )}
            </div>
            <button 
              onClick={() => setSelectedLeague(league)}
              className="mt-4 w-full py-3 gradient-blue text-white rounded-xl font-bold hover:opacity-90 transition-all">
              Enter League →
            </button>
          </div>
        )) : (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-3">No Leagues Yet</h3>
            <p className="text-gray-400 text-lg mb-6">Ready to start your fantasy movie journey?</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="gradient-blue text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all text-lg"
            >
              Create Your First League 🚀
            </button>
          </div>
        )}
      </div>

      {/* Hot Movies Now - TMDB Integration */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-white">🔥 Hot Movies Now</h2>
          <span className="text-sm text-gray-400">Live from TMDB</span>
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
            trendingMovies.map((movie) => (
              <div
                key={movie.id}
                className="glass-dark rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => {/* TODO: Open movie details */}}
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
                      <span className="text-yellow-400 text-xs">⭐ {movie.vote_average.toFixed(1)}</span>
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

        {/* Now Playing Section */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-4">🎬 Now in Theaters</h3>
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
              nowPlayingMovies.slice(0, 3).map((movie) => (
                <div
                  key={movie.id}
                  className="glass-dark rounded-xl p-4 hover:card-glow transition-all cursor-pointer"
                  onClick={() => {/* TODO: Open movie details */}}
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
                        <span className="text-yellow-400">⭐ {movie.vote_average.toFixed(1)}</span>
                        <span className="text-blue-400">📅 {new Date(movie.release_date).toLocaleDateString()}</span>
                        {movie.revenue && movie.revenue > 0 && (
                          <span className="text-green-400">💰 {formatCurrency(movie.revenue)}</span>
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
        <div className="glass-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">🔴 Live Activity</h3>
            <span className="text-gray-500 text-sm">● WAITING FOR ACTIVITY</span>
          </div>
          <div className="space-y-3">
            {liveActivity.length > 0 ? (
              liveActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 glass rounded-xl hover:scale-105 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-white font-bold">
                      {activity.user[0]}
                    </div>
                    <div>
                      <p 
                        className="text-white font-medium cursor-pointer hover:text-blue-400"
                        onClick={() => setSelectedUser(activity.user)}
                      >
                        {activity.user}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {activity.action} {activity.movie || activity.league}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.profit && (
                      <p className="text-green-400 font-bold">{activity.profit}</p>
                    )}
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📡</div>
                <p className="text-gray-400 text-lg font-medium mb-2">No Activity Yet</p>
                <p className="text-gray-500 text-sm">Activity will appear here when players join leagues and make moves</p>
              </div>
            )}
          </div>
        </div>

        {/* Global Leaderboard */}
        <div className="glass-dark rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🏆 Global Leaderboard</h3>
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-gray-400 text-lg font-medium mb-2">No Rankings Yet</p>
            <p className="text-gray-500 text-sm mb-4">The leaderboard will populate as players compete in leagues</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="gradient-blue text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all"
            >
              Create First League 🚀
            </button>
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
                  Create League 🚀
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
              <div className="text-5xl mb-4">🏆</div>
              <h4 className="text-white font-bold text-xl mb-2">No Public Leagues Yet</h4>
              <p className="text-gray-400 mb-6">Be the first to create a public league!</p>
              <button 
                onClick={() => {
                  setShowBrowseLeagues(false)
                  setShowCreateModal(true)
                }}
                className="gradient-blue text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all"
              >
                Create First League 🚀
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
    </div>
  )
})

export default Dashboard