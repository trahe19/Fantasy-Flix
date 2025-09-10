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

  const handleAuthBack = () => {
    setShowAuth(false)
  }

  if (showAuth) {
    return <Auth onLogin={handleAuthSuccess} onBack={handleAuthBack} defaultMode={authMode} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Elegant Header */}
      <header className="absolute top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <img src="/images/logo.png" alt="Fantasy Flix" className="w-12 h-12 drop-shadow-2xl object-contain" style={{aspectRatio: '1/1'}} />
              <span className="text-2xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Fantasy Flix
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-white/80 hover:text-amber-400 font-medium transition-all duration-300">Features</a>
              <a href="#experience" className="text-white/80 hover:text-amber-400 font-medium transition-all duration-300">Experience</a>
              <a href="#about" className="text-white/80 hover:text-amber-400 font-medium transition-all duration-300">About</a>
              <a href="#join" className="text-white/80 hover:text-amber-400 font-medium transition-all duration-300">Join</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleAuthOpen('login')}
                className="text-white/90 hover:text-amber-400 font-medium px-6 py-2 rounded-full border border-white/20 hover:border-amber-400/50 transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => handleAuthOpen('signup')}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold px-6 py-2 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/hero-background.png)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
        
        <div className="relative z-10 text-center px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in-up">
            <img src="/images/logo.png" alt="Fantasy Flix Logo" className="w-24 h-24 mx-auto mb-8 drop-shadow-2xl animate-pulse-glow object-contain" style={{aspectRatio: '1/1'}} />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
              Fantasy
            </span>
            <span className="block bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
              Flix
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed font-light">
            Step onto the red carpet of fantasy sports. Draft blockbusters, predict box office magic, 
            and compete for the ultimate prize in entertainment's most exclusive league.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => handleAuthOpen('signup')}
              className="group bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-500 text-white font-bold px-12 py-4 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-red-400/50 hover:border-red-300"
            >
              <span className="flex items-center space-x-2">
                <span>Enter the Experience</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
            <button
              onClick={() => handleAuthOpen('login')}
              className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-bold px-12 py-4 rounded-full text-lg transition-all duration-300 backdrop-blur-sm"
            >
              Member Access
            </button>
          </div>
        </div>
        
        {/* Elegant scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                The Ultimate
              </span>
              <br />
              <span className="text-white">Cinema Experience</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Where Hollywood glamour meets competitive strategy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-amber-500/20 hover:border-amber-400/50 transition-all duration-500 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-red-500/30 transition-all duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Draft Blockbusters</h3>
              <p className="text-white/70 text-center leading-relaxed">
                Curate your portfolio of cinematic gems. From indie darlings to summer blockbusters, 
                build a roster that captures the pulse of entertainment.
              </p>
            </div>
            
            <div className="group bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-amber-500/20 hover:border-amber-400/50 transition-all duration-500 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-amber-500/30 transition-all duration-500">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Predict Excellence</h3>
              <p className="text-white/70 text-center leading-relaxed">
                Harness the power of box office analytics, critical acclaim, and audience sentiment 
                to forecast the next entertainment phenomenon.
              </p>
            </div>
            
            <div className="group bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-amber-500/20 hover:border-amber-400/50 transition-all duration-500 transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-yellow-500/30 transition-all duration-500">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">Claim Victory</h3>
              <p className="text-white/70 text-center leading-relaxed">
                Rise through the ranks in exclusive leagues. Compete with fellow cinephiles 
                and establish your legacy as the ultimate entertainment mogul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Gallery */}
      <section id="experience" className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Behind the Scenes
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Immerse yourself in the world where entertainment meets competition
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900 to-red-800 h-64 transform hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white mb-2">Real-Time Analytics</h3>
                <p className="text-white/80 text-sm">Live box office tracking and performance metrics</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-800 to-yellow-800 h-64 transform hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white mb-2">Expert Insights</h3>
                <p className="text-white/80 text-sm">Industry analysis and prediction tools</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-700 h-64 md:col-span-2 lg:col-span-1 transform hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white mb-2">Global Community</h3>
                <p className="text-white/80 text-sm">Connect with cinema enthusiasts worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Elegant Design */}
      <section id="about" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black text-white mb-8">
                Where Cinema
                <span className="block bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Meets Strategy
                </span>
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Fantasy Flix transforms the art of entertainment into the science of prediction. 
                We've created the most sophisticated platform for cinema enthusiasts who understand 
                that great movies are more than art—they're cultural phenomena waiting to be discovered.
              </p>
              <p className="text-lg text-white/60 mb-10 leading-relaxed">
                Our proprietary algorithms combine real-time box office data, critical reception metrics, 
                social sentiment analysis, and historical performance patterns to deliver insights that 
                put you ahead of the curve in entertainment's most exclusive competition.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">25K+</div>
                  <div className="text-white/60 text-sm uppercase tracking-wide">Elite Players</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">1,200+</div>
                  <div className="text-white/60 text-sm uppercase tracking-wide">Films Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">$2M+</div>
                  <div className="text-white/60 text-sm uppercase tracking-wide">Prize Awarded</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl border border-amber-500/20 shadow-2xl">
                <img src="/images/logo.png" alt="Fantasy Flix" className="w-20 h-20 mx-auto mb-8 animate-pulse-glow object-contain" style={{aspectRatio: '1/1'}} />
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Ready to Join the Elite?</h3>
                <p className="text-white/70 mb-8 text-center leading-relaxed">
                  Step into the world's most sophisticated entertainment competition. 
                  Your journey to cinematic mastery begins with a single click.
                </p>
                <button
                  onClick={() => handleAuthOpen('signup')}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Begin Your Legacy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="join" className="py-24 bg-gradient-to-r from-red-900 via-black to-amber-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="mb-12">
            <img src="/images/logo.png" alt="Fantasy Flix" className="w-24 h-24 mx-auto mb-8 animate-pulse-glow object-contain" style={{aspectRatio: '1/1'}} />
          </div>
          <h2 className="text-6xl md:text-7xl font-black text-white mb-8">
            Your Seat
            <span className="block bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Awaits
            </span>
          </h2>
          <p className="text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            The red carpet is rolled out. The spotlight is ready. 
            All that's missing is you.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => handleAuthOpen('signup')}
              className="group bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black px-16 py-5 rounded-full text-xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-yellow-400"
            >
              <span className="flex items-center justify-center space-x-3">
                <span>Claim Your Spot</span>
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">★</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-black border-t border-amber-500/20 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <img src="/images/logo.png" alt="Fantasy Flix" className="w-12 h-12 object-contain" style={{aspectRatio: '1/1'}} />
                <span className="text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                  Fantasy Flix
                </span>
              </div>
              <p className="text-white/60 text-lg max-w-md leading-relaxed">
                The premier destination for entertainment connoisseurs who understand 
                that cinema is both art and opportunity.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Platform</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Features</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Analytics</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Leagues</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Community</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Discord</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Twitter</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Reddit</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors duration-300">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-white/40">© 2025 Fantasy Flix. All rights reserved. Crafted with passion for cinema.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.3));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(251, 191, 36, 0.5));
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LandingPage