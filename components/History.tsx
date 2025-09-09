'use client'

import { memo } from 'react'

const History = memo(function History() {
  return (
    <div className="px-4 py-6">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-gradient mb-4">
          The Fantasy Flix Legacy
        </h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
          From humble beginnings to the world's premier fantasy movie platform
        </p>
      </div>

      {/* Timeline Container */}
      <div className="max-w-6xl mx-auto">
        {/* Timeline Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full"></div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-12">
          {/* 2021 - The Beginning */}
          <div className="glass-dark rounded-2xl p-8 transform hover:scale-102 transition-all duration-300">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-black text-white">2021</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">The Founding</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  [Placeholder: Add founding story details here]
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-sm">
                    Concept
                  </span>
                  <span className="px-3 py-1 bg-cyan-500 bg-opacity-20 text-cyan-300 rounded-full text-sm">
                    Development
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2022 - Launch */}
          <div className="glass-dark rounded-2xl p-8 transform hover:scale-102 transition-all duration-300">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-black text-white">2022</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">The Launch</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  [Placeholder: Add launch details here]
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded-full text-sm">
                    Beta Launch
                  </span>
                  <span className="px-3 py-1 bg-emerald-500 bg-opacity-20 text-emerald-300 rounded-full text-sm">
                    First Users
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2023 - Growth */}
          <div className="glass-dark rounded-2xl p-8 transform hover:scale-102 transition-all duration-300">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-black text-white">2023</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Rapid Growth</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  [Placeholder: Add growth milestones here]
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-300 rounded-full text-sm">
                    10K Users
                  </span>
                  <span className="px-3 py-1 bg-pink-500 bg-opacity-20 text-pink-300 rounded-full text-sm">
                    Mobile App
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2024 - Expansion */}
          <div className="glass-dark rounded-2xl p-8 transform hover:scale-102 transition-all duration-300">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-black text-white">2024</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Global Expansion</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  [Placeholder: Add expansion details here]
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-300 rounded-full text-sm">
                    International
                  </span>
                  <span className="px-3 py-1 bg-red-500 bg-opacity-20 text-red-300 rounded-full text-sm">
                    50K Users
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2025 - Present */}
          <div className="glass-dark rounded-2xl p-8 transform hover:scale-102 transition-all duration-300 border-2 border-gradient-to-r from-blue-400 to-cyan-400">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-black text-white">2025</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">The Elite Era</h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  [Placeholder: Add current achievements here]
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-400 bg-opacity-20 text-blue-300 rounded-full text-sm">
                    Premium Platform
                  </span>
                  <span className="px-3 py-1 bg-cyan-400 bg-opacity-20 text-cyan-300 rounded-full text-sm">
                    Elite Community
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-blue-400 mb-2">100K+</div>
            <div className="text-gray-300">Active Players</div>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-cyan-400 mb-2">$5M+</div>
            <div className="text-gray-300">Prizes Awarded</div>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-green-400 mb-2">500+</div>
            <div className="text-gray-300">Movie Leagues</div>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <div className="text-3xl font-black text-yellow-400 mb-2">24/7</div>
            <div className="text-gray-300">Global Access</div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="mt-16 text-center">
          <div className="glass-dark rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-white mb-6">Looking Forward</h3>
            <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              [Placeholder: Add vision and future plans here]
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default History