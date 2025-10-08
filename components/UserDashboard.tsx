'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from './Dashboard'
import DraftRoom from './DraftRoom'
import RosterManagement from './RosterManagement'
import History from './History'
import LeagueManager from './LeagueManager'
import TheVault from './TheVault'
import LeagueHistory from './LeagueHistory'
import ThemeToggle from './ThemeToggle'
import MovieSearch from './MovieSearch'
import ProfitLeaders2025 from './ProfitLeaders2025'
import Rules from './Rules'
import { User, logout } from '../lib/auth'

interface UserDashboardProps {
  user: User
  onLogout: () => void
}

const UserDashboard = ({ user, onLogout }: UserDashboardProps) => {
  const router = useRouter()
  const [currentView, setCurrentView] = useState('dashboard')
  const [activeDrafts, setActiveDrafts] = useState<any[]>([])
  const [showMovieSearch, setShowMovieSearch] = useState(false)
  const [showLeagueDropdown, setShowLeagueDropdown] = useState(false)
  const [currentLeague, setCurrentLeague] = useState('father-flix')
  const [showCreateLeague, setShowCreateLeague] = useState(false)
  const [newLeagueName, setNewLeagueName] = useState('')

  const handleDraftNavigation = () => {
    router.push('/draft')
  }

  const handleLogout = async () => {
    try {
      await logout()
      onLogout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(/images/hero-background.png)',
          filter: 'brightness(0.3)'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />
      
      {/* Premium Navigation */}
      <nav className="relative z-50 bg-gradient-to-r from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl border-b border-amber-500/20 shadow-2xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo Section - More Prominent */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/images/logo.png"
                  alt="Fantasy Flix"
                  className="w-12 h-12 animate-pulse object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.4))',
                    aspectRatio: '1/1'
                  }}
                />
                <h1 className="text-3xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                  Fantasy Flix
                </h1>
              </div>
            </div>

            {/* Core Navigation - Streamlined */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg'
                    : 'text-white/80 hover:text-amber-400 hover:bg-white/10'
                }`}
              >
                Dashboard
              </button>

              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-amber-400 hover:bg-white/10 transition-all duration-200">
                  My Team
                  <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900/95 backdrop-blur-xl border border-amber-500/20 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={() => setCurrentView('roster')}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-amber-500/10 transition-colors first:rounded-t-lg ${
                      currentView === 'roster' ? 'text-amber-400 bg-amber-500/10' : 'text-white/80'
                    }`}
                  >
                    My Roster
                  </button>
                  <button
                    onClick={() => setCurrentView('leagues')}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-amber-500/10 transition-colors ${
                      currentView === 'leagues' ? 'text-amber-400 bg-amber-500/10' : 'text-white/80'
                    }`}
                  >
                    My Leagues
                  </button>
                  <button
                    onClick={() => setCurrentView('vault')}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-amber-500/10 transition-colors last:rounded-b-lg ${
                      currentView === 'vault' ? 'text-amber-400 bg-amber-500/10' : 'text-white/80'
                    }`}
                  >
                    🏛️ The Vault
                  </button>
                </div>
              </div>

              <button
                onClick={handleDraftNavigation}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative text-white/80 hover:text-blue-400 hover:bg-white/10"
              >
                🏆 Draft
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  •
                </span>
              </button>

              <button
                onClick={() => setCurrentView('2025-profit-leaders')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  currentView === '2025-profit-leaders'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg'
                    : 'text-white/80 hover:text-amber-400 hover:bg-white/10'
                }`}
              >
                2025 Leaders
              </button>

              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-sm font-semibold text-white/80 hover:text-amber-400 hover:bg-white/10 transition-all duration-200">
                  More
                  <svg className="w-4 h-4 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-1 w-40 bg-gray-900/95 backdrop-blur-xl border border-amber-500/20 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <button
                    onClick={() => setCurrentView('history')}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-amber-500/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      currentView === 'history' ? 'text-amber-400 bg-amber-500/10' : 'text-white/80'
                    }`}
                  >
                    History
                  </button>
                </div>
              </div>

              {activeDrafts.length > 0 && (
                <button
                  onClick={() => setCurrentView('draft')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 relative ml-2 ${
                    currentView === 'draft'
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                  }`}
                >
                  Draft Room
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                    {activeDrafts.length}
                  </span>
                </button>
              )}
            </div>

            {/* Right Side - Search & User */}
            <div className="flex items-center space-x-4">
              {/* Compact Search */}
              <button
                onClick={() => setShowMovieSearch(true)}
                className="p-2 text-white/70 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/10"
                title="Search movies"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* User Info with League Dropdown */}
              <div className="relative">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
                    {user?.display_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <button
                    onClick={() => setShowLeagueDropdown(!showLeagueDropdown)}
                    className="hidden md:flex flex-col items-start text-left hover:bg-white/10 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                  >
                    <span className="text-white/90 font-medium text-sm flex items-center">
                      {user?.display_name || user?.username || 'Champion'}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <span className="text-amber-400 text-xs">
                      {currentLeague === 'father-flix' ? 'Father Flix League' : 'Movie Masters League'}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white/50 hover:text-red-400 transition-all duration-200 p-2 rounded-lg hover:bg-red-500/10"
                    title="Sign out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>

                {/* League Dropdown Menu */}
                {showLeagueDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-gray-900/95 backdrop-blur-xl border border-amber-500/20 rounded-xl shadow-xl z-50">
                    <div className="p-4">
                      <h3 className="text-white font-bold text-sm mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Your Leagues
                      </h3>

                      {/* League List */}
                      <div className="space-y-2 mb-4">
                        <button
                          onClick={() => {
                            setCurrentLeague('father-flix')
                            setShowLeagueDropdown(false)
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-all hover:bg-amber-500/10 ${
                            currentLeague === 'father-flix'
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                              : 'bg-gray-800/30 text-white/80 hover:text-white'
                          }`}
                        >
                          <div className="font-medium">Father Flix League</div>
                          <div className="text-xs text-gray-400 mt-1">4 members • Active • $200 prize pool</div>
                        </button>

                        <button
                          onClick={() => {
                            setCurrentLeague('movie-masters')
                            setShowLeagueDropdown(false)
                          }}
                          className={`w-full text-left p-3 rounded-lg transition-all hover:bg-amber-500/10 ${
                            currentLeague === 'movie-masters'
                              ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                              : 'bg-gray-800/30 text-white/80 hover:text-white'
                          }`}
                        >
                          <div className="font-medium">Movie Masters League</div>
                          <div className="text-xs text-gray-400 mt-1">6 members • Draft • $500 prize pool</div>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-700/50 my-3"></div>

                      {/* League Rules */}
                      <button
                        onClick={() => {
                          setCurrentView('rules')
                          setShowLeagueDropdown(false)
                        }}
                        className="w-full text-left p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 transition-all mb-3"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <div className="font-medium">League Rules & Format</div>
                            <div className="text-xs text-blue-400 mt-1">Scoring, roster, draft rules & more</div>
                          </div>
                        </div>
                      </button>

                      {/* Create New League */}
                      <button
                        onClick={() => {
                          setShowCreateLeague(true)
                          setShowLeagueDropdown(false)
                        }}
                        className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-300 hover:from-amber-500/20 hover:to-yellow-500/20 transition-all"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="font-medium">Create New League</span>
                        </div>
                        <div className="text-xs text-amber-400/70 mt-1 ml-6">Start your own fantasy league</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Current League Indicator */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">Currently viewing:</span>
            <span className="text-amber-400 font-bold text-lg">
              {currentLeague === 'father-flix' ? 'Father Flix League' : 'Movie Masters League'}
            </span>
          </div>
          <div className="text-white/50 text-sm">
            {currentLeague === 'father-flix' ? '4 members • Rank #2' : '6 members • Draft pending'}
          </div>
        </div>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'roster' && <RosterManagement />}
        {currentView === 'leagues' && <LeagueManager />}
        {currentView === 'history' && <LeagueHistory />}
        {currentView === 'vault' && <TheVault />}
        {currentView === '2025-profit-leaders' && <ProfitLeaders2025 />}
        {currentView === 'rules' && <Rules />}
        {currentView === 'draft' && activeDrafts.length > 0 && <DraftRoom />}
        {currentView === 'draft' && activeDrafts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">No Active Drafts</h2>
            <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">Draft rooms will appear here when leagues start drafting. The real action begins soon.</p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-8 py-4 rounded-2xl font-bold hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>

      {/* Movie Search Modal */}
      <MovieSearch
        isOpen={showMovieSearch}
        onClose={() => setShowMovieSearch(false)}
      />

      {/* Create League Modal */}
      {showCreateLeague && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md border border-amber-500/20 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent mb-2">
                Create New League
              </h2>
              <p className="text-gray-400">Start your own fantasy movie league</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">League Name</label>
                <input
                  type="text"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  className="w-full p-4 bg-black/40 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-amber-500 transition-colors"
                  placeholder="Enter league name..."
                  autoFocus
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowCreateLeague(false)
                    setNewLeagueName('')
                  }}
                  className="flex-1 py-3 bg-gray-700/50 text-gray-300 rounded-xl font-medium hover:bg-gray-600/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newLeagueName.trim()) {
                      // TODO: Create new league logic
                      alert(`Created league: ${newLeagueName}`)
                      setShowCreateLeague(false)
                      setNewLeagueName('')
                    }
                  }}
                  disabled={!newLeagueName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black rounded-xl font-bold hover:from-amber-400 hover:to-yellow-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create League
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showLeagueDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLeagueDropdown(false)}
        />
      )}
    </div>
  )
}

export default UserDashboard