'use client'

import { useState } from 'react'

interface SeasonResult {
  year: string
  winner: string
  runnerUp: string
  thirdPlace: string
  lastPlace: string
  winningScore: number
  losingScore: number
  totalParticipants: number
}

const LeagueHistory = () => {
  // This would be your actual historical data
  const [seasonResults] = useState<SeasonResult[]>([
    {
      year: "2024",
      winner: "Grant",
      runnerUp: "Will", 
      thirdPlace: "Josh",
      lastPlace: "Tyler",
      winningScore: 337,
      losingScore: -494,
      totalParticipants: 4
    }
  ])

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">League History</h2>
        <div className="glass px-4 py-2">
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {seasonResults.length} Season{seasonResults.length !== 1 ? 's' : ''} Completed
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {seasonResults.map((season) => (
          <div key={season.year} className="glass-elegant p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {season.year} Season
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {season.totalParticipants} participants
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Score Range</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {season.winningScore} to {season.losingScore}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Winner */}
              <div className="glass p-4 border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    CHAMPION
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {season.winner}
                </div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {season.winningScore} points
                </div>
              </div>

              {/* Runner Up */}
              <div className="glass p-4 border-2 border-gray-400 bg-gray-50 dark:bg-gray-800/20">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    2ND PLACE
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {season.runnerUp}
                </div>
              </div>

              {/* Third Place */}
              <div className="glass p-4 border-2 border-orange-400 bg-orange-50 dark:bg-orange-900/20">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    3RD PLACE
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {season.thirdPlace}
                </div>
              </div>

              {/* Last Place */}
              <div className="glass p-4 border-2 border-red-400 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    LAST PLACE
                  </span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {season.lastPlace}
                </div>
                <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                  {season.losingScore} points
                </div>
              </div>
            </div>

            {/* Season Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Season Highlights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Point Spread:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {season.winningScore - season.losingScore} points
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Average Score:</span>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                    {Math.round((season.winningScore + season.losingScore) / 2)} points
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Competition Level:</span>
                  <span className="ml-2 font-semibold text-red-600 dark:text-red-400">
                    High Volatility
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Stats */}
      <div className="mt-8 glass-elegant p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">All-Time Records</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Championships</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Grant</span>
                <span className="font-semibold text-gray-900 dark:text-white">1</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Last Place Finishes</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tyler</span>
                <span className="font-semibold text-gray-900 dark:text-white">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeagueHistory