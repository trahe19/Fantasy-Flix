'use client'

import { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import DraftRoom from '../components/DraftRoom'
import RosterManagement from '../components/RosterManagement'

export default function Home() {
  const [currentView, setCurrentView] = useState('landing')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login delay for effect
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoggedIn(true)
    setCurrentView('dashboard')
    setIsLoading(false)
  }

  // Add floating particles effect
  useEffect(() => {
    if (!isLoggedIn) {
      const particles = document.getElementById('particles')
      if (particles) {
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div')
          particle.className = 'absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse'
          particle.style.left = `${Math.random() * 100}%`
          particle.style.top = `${Math.random() * 100}%`
          particle.style.animationDelay = `${Math.random() * 5}s`
          particle.style.animationDuration = `${5 + Math.random() * 10}s`
          particles.appendChild(particle)
        }
      }
    }
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div id="particles" className="absolute inset-0 pointer-events-none" />
        
        {/* Animated background shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-40 right-40 w-72 h-72 bg-indigo-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="w-full max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block animate-glow rounded-full p-1 mb-6">
              <span className="text-6xl">🎬</span>
            </div>
            <h1 className="text-7xl font-black mb-4 animate-pulse">
              <span className="text-gradient">Fantasy</span>
              <br />
              <span className="text-white">Flix</span>
            </h1>
            <p className="text-xl text-gray-300 font-light tracking-wide">
              The most elite fantasy movie experience for true cinema connoisseurs
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <span className="px-4 py-2 glass rounded-full text-blue-300 text-sm">
                🔥 1000+ Active Players
              </span>
              <span className="px-4 py-2 glass rounded-full text-cyan-300 text-sm">
                💎 Premium Experience
              </span>
              <span className="px-4 py-2 glass rounded-full text-yellow-300 text-sm">
                🏆 Real Prizes
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6">
              <div className="glass-dark p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 hover:card-glow">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">🎯</span>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Strategic Drafting
                    </h3>
                    <p className="text-gray-300">AI-powered insights for perfect picks</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-dark p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 hover:card-glow">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">💰</span>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Live Box Office
                    </h3>
                    <p className="text-gray-300">Real-time scoring with profit multipliers</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-dark p-6 rounded-2xl transform hover:scale-105 transition-all duration-300 hover:card-glow">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">🏆</span>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Oscar Championship
                    </h3>
                    <p className="text-gray-300">Elite players compete for ultimate glory</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-dark rounded-3xl p-8 card-glow transform hover:scale-105 transition-all duration-300">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Welcome Back, Champion
                </h2>
                <p className="text-gray-400">Join thousands of movie moguls</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="demo@fantasyflix.com"
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    defaultValue="demo123"
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="Enter password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-blue text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Entering the League...
                    </span>
                  ) : (
                    'Enter Fantasy Flix'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  Join the ultimate movie prediction championship
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Create Account
                  </button>
                  <span className="text-gray-600">•</span>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Trusted by movie executives, critics, and your mom
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <nav className="glass-dark shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-black text-gradient">
                Fantasy Flix 🎬
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentView === 'dashboard' 
                      ? 'gradient-blue text-white shadow-lg transform scale-105' 
                      : 'text-gray-300 hover:text-white glass hover:card-glow'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentView('roster')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentView === 'roster' 
                      ? 'gradient-blue text-white shadow-lg transform scale-105' 
                      : 'text-gray-300 hover:text-white glass hover:card-glow'
                  }`}
                >
                  Roster
                </button>
                <button
                  onClick={() => setCurrentView('draft')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    currentView === 'draft' 
                      ? 'gradient-blue text-white shadow-lg transform scale-105' 
                      : 'text-gray-300 hover:text-white glass hover:card-glow'
                  }`}
                >
                  Draft Room
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="glass px-3 py-1 rounded-full">
                <span className="text-yellow-400 text-sm">⚡ Elite Member</span>
              </div>
              <span className="text-white">Welcome, Champion</span>
              <button
                onClick={() => {
                  setIsLoggedIn(false)
                  setCurrentView('landing')
                }}
                className="text-gray-300 hover:text-white transition-colors"
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
        {currentView === 'draft' && <DraftRoom />}
      </main>
    </div>
  )
}