'use client'

import { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import DraftRoom from '../components/DraftRoom'
import RosterManagement from '../components/RosterManagement'
import History from '../components/History'
import Auth from '../components/Auth'
import LeagueManager from '../components/LeagueManager'
import WaiverWire from '../components/WaiverWire'
import LeagueHistory from '../components/LeagueHistory'
import ThemeToggle from '../components/ThemeToggle'
import { User, getCurrentUser, logout, initializeMockData } from '../lib/auth'

export default function Home() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [activeDrafts, setActiveDrafts] = useState<any[]>([]) // Track active drafts

  // Check for existing user on mount
  useEffect(() => {
    const existingUser = getCurrentUser()
    if (existingUser) {
      setUser(existingUser)
      setIsLoggedIn(true)
    }
    
    // Initialize mock data
    initializeMockData()
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    setIsLoggedIn(true)
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    setIsLoggedIn(false)
    setCurrentView('dashboard')
  }

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 original:bg-gradient-to-br original:from-slate-900 original:via-slate-800 original:to-slate-900">
      <nav className="glass-dark shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img src="/logo-sleek.svg" alt="Fantasy Flix" className="w-8 h-8" />
                <h1 className="text-2xl font-black text-gray-900 dark:text-white original:text-white">
                  Fantasy Flix
                </h1>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                    currentView === 'dashboard' 
                      ? 'gradient-blue text-white' 
                      : 'text-gray-600 dark:text-gray-300 original:text-gray-300 hover:text-gray-900 dark:hover:text-white original:hover:text-white glass hover:card-glow'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('roster')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                    currentView === 'roster' 
                      ? 'gradient-blue text-white' 
                      : 'text-gray-600 dark:text-gray-300 original:text-gray-300 hover:text-gray-900 dark:hover:text-white original:hover:text-white glass hover:card-glow'
                  }`}
                >
                  Roster
                </button>
                <button
                  onClick={() => setCurrentView('leagues')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                    currentView === 'leagues' 
                      ? 'gradient-blue text-white' 
                      : 'text-gray-600 dark:text-gray-300 original:text-gray-300 hover:text-gray-900 dark:hover:text-white original:hover:text-white glass hover:card-glow'
                  }`}
                >
                  Leagues
                </button>
                <button
                  onClick={() => setCurrentView('history')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                    currentView === 'history' 
                      ? 'gradient-blue text-white' 
                      : 'text-gray-600 dark:text-gray-300 original:text-gray-300 hover:text-gray-900 dark:hover:text-white original:hover:text-white glass hover:card-glow'
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => setCurrentView('waiver')}
                  className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                    currentView === 'waiver' 
                      ? 'gradient-blue text-white' 
                      : 'text-gray-600 dark:text-gray-300 original:text-gray-300 hover:text-gray-900 dark:hover:text-white original:hover:text-white glass hover:card-glow'
                  }`}
                >
                  Waiver Wire
                </button>
                {activeDrafts.length > 0 && (
                  <button
                    onClick={() => setCurrentView('draft')}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 relative ${
                      currentView === 'draft' 
                        ? 'gradient-blue text-white' 
                        : 'text-gray-600 dark:text-gray-300 original:text-gray-300 hover:text-gray-900 dark:hover:text-white original:hover:text-white glass hover:card-glow'
                    }`}
                  >
                    Draft Room
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {activeDrafts.length}
                    </span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-900 dark:text-white original:text-white">Welcome, {user?.displayName || 'Champion'}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-400 original:text-gray-300 hover:text-gray-900 dark:hover:text-white original:hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'roster' && <RosterManagement />}
        {currentView === 'leagues' && <LeagueManager />}
        {currentView === 'history' && <LeagueHistory />}
        {currentView === 'waiver' && <WaiverWire />}
        {currentView === 'draft' && activeDrafts.length > 0 && <DraftRoom />}
        {currentView === 'draft' && activeDrafts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white original:text-white mb-3">No Active Drafts</h2>
            <p className="text-gray-600 dark:text-gray-400 original:text-gray-400 text-lg mb-6">Draft rooms will appear here when leagues start drafting</p>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="gradient-blue text-white px-6 py-3 rounded font-bold hover:opacity-90 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  )
}