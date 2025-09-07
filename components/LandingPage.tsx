'use client'

import { useState } from 'react'
import Auth from './Auth'
import { User } from '../lib/auth'

interface LandingPageProps {
  onLogin: (user: User) => void
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const handleAuthOpen = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleAuthSuccess = (user: User) => {
    setShowAuth(false)
    onLogin(user)
  }

  if (showAuth) {
    return <Auth onLogin={handleAuthSuccess} defaultMode={authMode} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo-sleek.svg" alt="Fantasy Flix" className="w-8 h-8" />
              <span className="text-2xl font-black text-gray-900">Fantasy Flix</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#news" className="text-gray-600 hover:text-gray-900 font-medium">Movie News</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
            </nav>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAuthOpen('login')}
                className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => handleAuthOpen('signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Fantasy <span className="text-yellow-400">Flix</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Draft your favorite movies, predict box office success, and compete with friends in the ultimate fantasy movie league.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleAuthOpen('signup')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 rounded-xl text-lg transition-colors"
              >
                Start Playing Free
              </button>
              <button
                onClick={() => handleAuthOpen('login')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your fantasy movie lineup and watch your predictions come to life
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                🎬
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Draft Movies</h3>
              <p className="text-gray-600">
                Build your roster by drafting upcoming blockbusters, indie gems, and everything in between.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                💰
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Predict Success</h3>
              <p className="text-gray-600">
                Earn points based on box office performance, critic scores, and audience reception.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Win Championships</h3>
              <p className="text-gray-600">
                Compete with friends in leagues and climb the leaderboards to become the ultimate movie mogul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Movie News Section */}
      <section id="news" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Latest Movie News</h2>
            <p className="text-xl text-gray-600">Stay ahead of the box office with the latest updates</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">🎬</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Holiday Box Office Predictions</h3>
                <p className="text-gray-600 mb-4">
                  Which holiday releases will dominate the box office? Our analysts break down the competition.
                </p>
                <span className="text-blue-600 font-medium">Read More →</span>
              </div>
            </article>
            
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <span className="text-6xl">🦸‍♂️</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Superhero Fatigue or Revival?</h3>
                <p className="text-gray-600 mb-4">
                  New data shows surprising trends in superhero movie performance this year.
                </p>
                <span className="text-blue-600 font-medium">Read More →</span>
              </div>
            </article>
            
            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Streaming vs Theater Impact</h3>
                <p className="text-gray-600 mb-4">
                  How simultaneous streaming releases are changing fantasy movie strategy.
                </p>
                <span className="text-blue-600 font-medium">Read More →</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">About Fantasy Flix</h2>
              <p className="text-xl text-gray-300 mb-6">
                Born from a love of movies and competition, Fantasy Flix transforms how you experience cinema. 
                We're not just watching movies—we're predicting the future of entertainment.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                Our platform combines real-time box office data, critical reception metrics, and audience scores 
                to create the most comprehensive fantasy movie experience available.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-bold text-yellow-400">10K+</div>
                  <div className="text-gray-400">Active Players</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400">500+</div>
                  <div className="text-gray-400">Movies Tracked</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of movie fans who are already playing Fantasy Flix. 
                Create your account and start your first league today.
              </p>
              <button
                onClick={() => handleAuthOpen('signup')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Sign Up Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-black text-gray-900 mb-6">$0<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-3">✓</span>
                  Join up to 3 leagues
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-3">✓</span>
                  Basic movie tracking
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-3">✓</span>
                  Standard support
                </li>
              </ul>
              <button 
                onClick={() => handleAuthOpen('signup')}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Get Started Free
              </button>
            </div>
            
            <div className="bg-blue-600 p-8 rounded-xl shadow-lg text-white relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-black mb-6">$9<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  Unlimited leagues
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-3">✓</span>
                  Custom league options
                </li>
              </ul>
              <button 
                onClick={() => handleAuthOpen('signup')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Start Pro Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo-sleek.svg" alt="Fantasy Flix" className="w-8 h-8" />
                <span className="text-2xl font-black">Fantasy Flix</span>
              </div>
              <p className="text-gray-400">
                The ultimate fantasy movie league experience.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Fantasy Flix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage