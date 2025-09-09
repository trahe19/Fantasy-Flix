'use client'

import { useState, useEffect } from 'react'
import { League, LeaguePlayer, PeriodSummary, PlayerStanding } from '../lib/fantasy-league-types'
import { FantasyMovieLeagueScoringEngine, formatScore, getScoreColorClass } from '../lib/scoring-engine'

interface PeriodManagerProps {
  league: League
  players: LeaguePlayer[]
  onPeriodTransition?: (newStatus: League['status']) => void
  isCommissioner?: boolean
}

const PeriodManager = ({ 
  league, 
  players, 
  onPeriodTransition = () => {}, 
  isCommissioner = false 
}: PeriodManagerProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'period1' | 'period2' | 'championship'>('overview')
  const [period1Summary, setPeriod1Summary] = useState<PeriodSummary | null>(null)
  const [period2Summary, setPeriod2Summary] = useState<PeriodSummary | null>(null)
  const [showTransitionModal, setShowTransitionModal] = useState(false)
  const [nextStatus, setNextStatus] = useState<League['status'] | null>(null)

  const getCurrentPeriod = (): 1 | 2 | null => {
    const now = new Date()
    const period1Start = new Date(league.period1StartDate)
    const period1End = new Date(league.period1EndDate)
    const period2Start = new Date(league.period2StartDate)
    const period2End = new Date(league.period2EndDate)

    if (now >= period1Start && now <= period1End) return 1
    if (now >= period2Start && now <= period2End) return 2
    return null
  }

  const getDaysUntilPeriod = (periodStart: string): number => {
    const now = new Date()
    const start = new Date(periodStart)
    const diffTime = start.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getPeriodProgress = (periodStart: string, periodEnd: string): number => {
    const now = new Date()
    const start = new Date(periodStart)
    const end = new Date(periodEnd)
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.max(0, Math.min(100, (elapsed / total) * 100))
  }

  const handleStatusTransition = (newStatus: League['status']) => {
    setNextStatus(newStatus)
    setShowTransitionModal(true)
  }

  const confirmTransition = () => {
    if (nextStatus) {
      onPeriodTransition(nextStatus)
      setShowTransitionModal(false)
      setNextStatus(null)
    }
  }

  const currentPeriod = getCurrentPeriod()
  const period1Progress = getPeriodProgress(league.period1StartDate, league.period1EndDate)
  const period2Progress = getPeriodProgress(league.period2StartDate, league.period2EndDate)

  // Mock standings for demonstration
  const period1Standings: PlayerStanding[] = players.map((player, idx) => ({
    userId: player.userId,
    username: player.username,
    displayName: player.displayName,
    rank: idx + 1,
    score: Math.floor(Math.random() * 600) + 200,
    moviesLeft: Math.floor(Math.random() * 3) + 1,
    projectedScore: Math.floor(Math.random() * 800) + 400
  })).sort((a, b) => b.score - a.score)

  const period2Standings: PlayerStanding[] = players.map((player, idx) => ({
    userId: player.userId,
    username: player.username,
    displayName: player.displayName,
    rank: idx + 1,
    score: Math.floor(Math.random() * 400) + 100,
    moviesLeft: Math.floor(Math.random() * 4) + 1,
    projectedScore: Math.floor(Math.random() * 600) + 250
  })).sort((a, b) => b.score - a.score)

  const overallStandings = players.map(player => {
    const p1Standing = period1Standings.find(s => s.userId === player.userId)
    const p2Standing = period2Standings.find(s => s.userId === player.userId)
    const totalScore = (p1Standing?.score || 0) + (p2Standing?.score || 0)
    
    return {
      userId: player.userId,
      username: player.username,
      displayName: player.displayName,
      rank: 0,
      score: totalScore,
      period1Score: p1Standing?.score || 0,
      period2Score: p2Standing?.score || 0,
      championshipQualified: player.championshipQualified
    }
  }).sort((a, b) => b.score - a.score).map((standing, idx) => ({ ...standing, rank: idx + 1 }))

  const tabs = [
    { key: 'overview', label: '📊 Overview', count: null },
    { key: 'period1', label: '🌟 Period 1', count: period1Standings.length },
    { key: 'period2', label: '🎭 Period 2', count: period2Standings.length },
    { key: 'championship', label: '🏆 Championship', count: overallStandings.filter(s => s.championshipQualified).length }
  ]

  return (
    <div className="px-4 py-6 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-red-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="glass-dark rounded-2xl p-6 mb-6 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gradient mb-2">📅 Period Management</h1>
            <p className="text-gray-300">{league.name} • Season {league.season}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient mb-1">
              {currentPeriod ? `Period ${currentPeriod} Active` : 'Between Periods'}
            </div>
            <p className="text-sm text-gray-400">
              Status: <span className="text-blue-400 capitalize">{league.status.replace('-', ' ')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Period Status Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-6 relative z-10">
        <div className="glass-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">🌟 Period 1 - Summer Season</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentPeriod === 1 ? 'bg-green-500 text-white' : 
              period1Progress >= 100 ? 'bg-blue-500 text-white' :
              'bg-gray-600 text-gray-300'
            }`}>
              {currentPeriod === 1 ? 'ACTIVE' : period1Progress >= 100 ? 'COMPLETED' : 'UPCOMING'}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">
                {new Date(league.period1StartDate).toLocaleDateString()} - {new Date(league.period1EndDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress:</span>
                <span className="text-white">{Math.round(period1Progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(period1Progress, 100)}%` }}
                ></div>
              </div>
            </div>

            {period1Progress < 100 && (
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {getDaysUntilPeriod(league.period1StartDate) > 0 
                    ? `Starts in ${getDaysUntilPeriod(league.period1StartDate)} days`
                    : `${Math.ceil((new Date(league.period1EndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">🎭 Period 2 - Awards Season</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentPeriod === 2 ? 'bg-green-500 text-white' : 
              period2Progress >= 100 ? 'bg-blue-500 text-white' :
              'bg-gray-600 text-gray-300'
            }`}>
              {currentPeriod === 2 ? 'ACTIVE' : period2Progress >= 100 ? 'COMPLETED' : 'UPCOMING'}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Duration:</span>
              <span className="text-white">
                {new Date(league.period2StartDate).toLocaleDateString()} - {new Date(league.period2EndDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress:</span>
                <span className="text-white">{Math.round(period2Progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(period2Progress, 100)}%` }}
                ></div>
              </div>
            </div>

            {period2Progress < 100 && (
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {getDaysUntilPeriod(league.period2StartDate) > 0 
                    ? `Starts in ${getDaysUntilPeriod(league.period2StartDate)} days`
                    : `${Math.ceil((new Date(league.period2EndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Commissioner Controls */}
      {isCommissioner && (
        <div className="glass-dark rounded-2xl p-6 mb-6 relative z-10">
          <h3 className="text-xl font-bold text-gradient mb-4">🎛️ Commissioner Controls</h3>
          <div className="flex flex-wrap gap-3">
            {league.status === 'setup' && (
              <button
                onClick={() => handleStatusTransition('draft')}
                className="px-4 py-2 gradient-blue text-white font-medium rounded-xl hover:scale-105 transform transition-all"
              >
                🎭 Start Draft
              </button>
            )}
            {league.status === 'draft' && (
              <button
                onClick={() => handleStatusTransition('period-1')}
                className="px-4 py-2 gradient-green text-white font-medium rounded-xl hover:scale-105 transform transition-all"
              >
                🌟 Begin Period 1
              </button>
            )}
            {league.status === 'period-1' && (
              <button
                onClick={() => handleStatusTransition('mid-season')}
                className="px-4 py-2 gradient-purple text-white font-medium rounded-xl hover:scale-105 transform transition-all"
              >
                ⏸️ Mid-Season Break
              </button>
            )}
            {league.status === 'mid-season' && (
              <button
                onClick={() => handleStatusTransition('period-2')}
                className="px-4 py-2 gradient-pink text-white font-medium rounded-xl hover:scale-105 transform transition-all"
              >
                🎭 Begin Period 2
              </button>
            )}
            {league.status === 'period-2' && (
              <button
                onClick={() => handleStatusTransition('championship')}
                className="px-4 py-2 gradient-gold text-black font-bold rounded-xl hover:scale-105 transform transition-all"
              >
                🏆 Start Championship
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="glass-dark rounded-2xl p-2 mb-6 relative z-10">
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'gradient-blue text-white shadow-lg'
                  : 'glass hover:scale-105 transform text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-dark rounded-2xl p-8 relative z-10">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gradient mb-6">📊 League Overview</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 gradient-blue rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">🏆 Overall Standings</h3>
                    <div className="space-y-3">
                      {overallStandings.slice(0, 5).map((standing) => (
                        <div key={standing.userId} className="flex items-center justify-between bg-black bg-opacity-30 rounded-xl p-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-yellow-400">#{standing.rank}</span>
                            <div>
                              <p className="font-bold text-white">{standing.displayName}</p>
                              <p className="text-sm text-gray-300">@{standing.username}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-lg ${getScoreColorClass(standing.score)}`}>
                              {formatScore(standing.score)}
                            </p>
                            <p className="text-xs text-gray-400">
                              P1: {formatScore(standing.period1Score)} | P2: {formatScore(standing.period2Score)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">📈 League Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gradient">{players.length}</p>
                        <p className="text-sm text-gray-400">Total Players</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">
                          {overallStandings.filter(s => s.championshipQualified).length}
                        </p>
                        <p className="text-sm text-gray-400">Championship Qualified</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">
                          {Math.round((period1Progress + period2Progress) / 2)}%
                        </p>
                        <p className="text-sm text-gray-400">Season Progress</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">
                          {Math.ceil((new Date(league.oscarCeremonyDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                        <p className="text-sm text-gray-400">Days to Oscars</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-yellow-500 bg-opacity-20 rounded-xl">
                    <h4 className="text-yellow-300 font-bold mb-3">🎯 Championship Race</h4>
                    <p className="text-yellow-200 text-sm mb-3">
                      Top {league.championshipSeats} players qualify for the championship round where Oscar points become crucial.
                    </p>
                    <div className="space-y-2">
                      {overallStandings.slice(0, league.championshipSeats).map((standing, idx) => (
                        <div key={standing.userId} className="flex items-center justify-between text-sm">
                          <span className="text-yellow-300">
                            #{idx + 1} {standing.displayName}
                          </span>
                          <span className="text-yellow-400 font-bold">
                            {formatScore(standing.score)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'period1' || activeTab === 'period2') && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">
              {activeTab === 'period1' ? '🌟 Period 1 - Summer Blockbusters' : '🎭 Period 2 - Awards Season'}
            </h2>
            
            <div className="space-y-4">
              {(activeTab === 'period1' ? period1Standings : period2Standings).map((standing, idx) => (
                <div key={standing.userId} className="flex items-center justify-between p-4 glass rounded-xl hover:card-glow transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <span className={`text-2xl font-black ${idx < 3 ? 'text-gradient' : 'text-gray-400'}`}>
                        #{standing.rank}
                      </span>
                      {idx < 3 && <div className="text-xs text-yellow-400">🏆</div>}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{standing.displayName}</h3>
                      <p className="text-sm text-gray-400">@{standing.username}</p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className={`font-black text-xl ${getScoreColorClass(standing.score)}`}>
                      {formatScore(standing.score)}
                    </p>
                    <div className="flex space-x-4 text-xs">
                      <span className="text-gray-400">
                        {standing.moviesLeft} movies left
                      </span>
                      <span className="text-blue-400">
                        Proj: {formatScore(standing.projectedScore!)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'championship' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">🏆 Championship Tracking</h2>
            
            <div className="p-6 gradient-gold rounded-2xl text-black">
              <h3 className="text-2xl font-bold mb-4">🎬 Oscar Ceremony: {new Date(league.oscarCeremonyDate).toLocaleDateString()}</h3>
              <p className="text-lg">
                Championship begins after Period 2 ends. Top {league.championshipSeats} players compete based on Oscar nominations and wins!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 glass rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">🥇 Qualified Players</h3>
                <div className="space-y-3">
                  {overallStandings.slice(0, league.championshipSeats).map((standing, idx) => (
                    <div key={standing.userId} className="flex items-center justify-between p-3 bg-green-500 bg-opacity-20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="font-bold text-white">{standing.displayName}</p>
                          <p className="text-sm text-gray-400">Rank #{standing.rank}</p>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold">
                        {formatScore(standing.score)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 glass rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">🎯 Championship Rules</h3>
                <div className="space-y-3 text-gray-300">
                  <p>• Oscar nominations: +{league.scoringRules.oscarNominationPoints} points each</p>
                  <p>• Oscar wins: +{league.scoringRules.oscarWinPoints} points each</p>
                  <p>• All period scores carry forward</p>
                  <p>• Final rankings determined post-Oscars</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transition Modal */}
      {showTransitionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gradient mb-4">⚠️ Period Transition</h3>
            <p className="text-white mb-6">
              Are you sure you want to transition the league to{' '}
              <span className="text-blue-400 font-bold">
                {nextStatus?.replace('-', ' ').toUpperCase()}
              </span>{' '}
              status? This action cannot be undone.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowTransitionModal(false)}
                className="flex-1 py-3 glass rounded-xl text-white font-medium hover:scale-105 transform transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransition}
                className="flex-1 py-3 gradient-blue text-white font-bold rounded-xl hover:scale-105 transform transition-all"
              >
                Confirm Transition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PeriodManager