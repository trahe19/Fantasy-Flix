'use client'

import { useState } from 'react'
import Dashboard from './Dashboard'
import DraftRoom from './DraftRoom'
import RosterManagement from './RosterManagement'
import History from './History'
import LeagueManager from './LeagueManager'
import WaiverWire from './WaiverWire'
import LeagueHistory from './LeagueHistory'
import ThemeToggle from './ThemeToggle'
import { User, logout } from '../lib/auth'

interface UserDashboardProps {
  user: User
  onLogout: () => void
}

const UserDashboard = ({ user, onLogout }: UserDashboardProps) => {
  const [currentView, setCurrentView] = useState('dashboard')
  const [activeDrafts, setActiveDrafts] = useState<any[]>([])

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/logo.png" 
                  alt="Fantasy Flix" 
                  className="w-20 h-20 animate-pulse object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))',
                    aspectRatio: '1/1'
                  }}
                />
                <h1 className="text-2xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent leading-tight py-1">
                  Fantasy Flix
                </h1>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'dashboard' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-2xl' 
                      : 'text-white/80 hover:text-amber-400 hover:bg-white/5 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('roster')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'roster' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-2xl' 
                      : 'text-white/80 hover:text-amber-400 hover:bg-white/5 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  My Roster
                </button>
                <button
                  onClick={() => setCurrentView('leagues')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'leagues' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-2xl' 
                      : 'text-white/80 hover:text-amber-400 hover:bg-white/5 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  My Leagues
                </button>
                <button
                  onClick={() => setCurrentView('history')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'history' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-2xl' 
                      : 'text-white/80 hover:text-amber-400 hover:bg-white/5 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => setCurrentView('waiver')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    currentView === 'waiver' 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-2xl' 
                      : 'text-white/80 hover:text-amber-400 hover:bg-white/5 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  Waiver Wire
                </button>
                {activeDrafts.length > 0 && (
                  <button
                    onClick={() => setCurrentView('draft')}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 relative ${
                      currentView === 'draft' 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-2xl' 
                        : 'text-white/80 hover:text-amber-400 hover:bg-white/5 backdrop-blur-sm border border-white/10'
                    }`}
                  >
                    Draft Room
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                      {activeDrafts.length}
                    </span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-black font-black text-lg shadow-xl">
                  {user?.display_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">
                    {user?.display_name || user?.username || 'Champion'}
                  </span>
                  <span className="text-amber-400 text-xs font-medium">League Member</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/70 hover:text-red-400 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-red-500/10 border border-white/10 hover:border-red-400/30 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'roster' && <RosterManagement />}
        {currentView === 'leagues' && <LeagueManager />}
        {currentView === 'history' && <LeagueHistory />}
        {currentView === 'waiver' && <WaiverWire />}
        {currentView === 'draft' && activeDrafts.length > 0 && <DraftRoom />}
        {currentView === 'draft' && activeDrafts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent leading-tight py-2">No Active Drafts</h2>
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
    </div>
  )
}

export default UserDashboard