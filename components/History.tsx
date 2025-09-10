'use client'

import { memo } from 'react'

const History = memo(function History() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(/images/hero-background.png)',
          filter: 'brightness(0.3)'
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black" />
      
      <div className="relative z-10 px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent leading-tight py-2 mb-4">
            🎬 History Coming Soon
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            The complete Fantasy Flix story will be available soon
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-12 border border-amber-500/20 shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
              <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Under Construction</h3>
            <p className="text-gray-400 text-lg mb-6">
              We're crafting an amazing timeline of Fantasy Flix's journey. Check back soon for the full story!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default History