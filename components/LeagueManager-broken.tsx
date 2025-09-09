'use client'

// Hollywood Themed League Manager - Fixed

import { useState, useEffect } from 'react'
import { getCurrentUser, createLeague, getUserLeagues } from '../lib/auth'

interface LeagueFormData {
  name: string
  maxPlayers: number
  draftDate: string
  draftTime: string
  isPublic: boolean
}

const LeagueManager = () => {
  const [leagues, setLeagues] = useState<any[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<LeagueFormData>({
    name: '',
    maxPlayers: 6,
    draftDate: '',
    draftTime: '',
    isPublic: false
  })

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser()
      setCurrentUser(user)
      
      if (user) {
        const userLeagues = await getUserLeagues(user.id)
        setLeagues(userLeagues)
      }
    }
    
    loadUser()
  }, [])

  const handleCreateLeague = async () => {
    if (!currentUser || !formData.name.trim()) return

    try {
      const draftDateTime = formData.draftDate && formData.draftTime 
        ? new Date(`${formData.draftDate}T${formData.draftTime}`).toISOString()
        : null

      const newLeague = await createLeague({
        name: formData.name.trim(),
        createdBy: currentUser.id,
        season: '2025-2026',
        status: 'draft',
        maxPlayers: formData.maxPlayers,
        currentPlayers: 1,
        entryFee: 0,
        prizePool: 0,
        draftDate: draftDateTime,
        rules: {
          budget: 1000,
          positions: ['Blockbuster', 'Indie', 'Action', 'Drama', 'Horror'],
          scoringPeriod: 'weekend'
        },
        players: [{
          userId: currentUser.id,
          username: currentUser.username,
          joinDate: new Date().toISOString(),
          roster: [],
          totalScore: 0,
          rank: 1,
          weeklyScores: []
        }]
      })

      const updatedLeagues = await getUserLeagues(currentUser.id)
      setLeagues(updatedLeagues)
      
      setShowCreateModal(false)
      setCurrentStep(1)
      setFormData({
        name: '',
        maxPlayers: 6,
        draftDate: '',
        draftTime: '',
        isPublic: false
      })

    } catch (error) {
      console.error('Error creating league:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPlayers' ? parseInt(value) || 0 : value
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hollywood Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-32 right-20 w-48 h-48 bg-gradient-to-br from-red-500 to-pink-600 rounded-full opacity-8 animate-float" />
        <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full opacity-6 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-12 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }} />
        
        {/* Film Strip Decoration */}
        <div className="absolute top-0 left-1/3 w-2 h-full bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-20" />
        <div className="absolute top-0 right-1/3 w-2 h-full bg-gradient-to-b from-transparent via-gray-600 to-transparent opacity-15" />
        
        {/* Spotlight Effects */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-200 via-transparent to-transparent opacity-5 transform -skew-y-3" />
        <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-blue-200 via-transparent to-transparent opacity-5 transform skew-y-3" />
      </div>
      
      <div className="relative z-10 px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-black text-gradient-premium mb-2">🎬 Your Hollywood Leagues 🎬</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span className="text-2xl">🎬</span>
              <span>Lights, Camera, Action!</span>
              <div className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" />
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="relative overflow-hidden gradient-premium text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transform hover:scale-105 transition-all shadow-2xl border border-yellow-400 border-opacity-30"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span>Create Epic League</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 hover:opacity-20 transition-opacity" />
          </button>
        </div>

        {/* Leagues Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {leagues.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-6xl animate-bounce" style={{ animationDuration: '2s' }}>🎭</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-yellow-400 border-opacity-30 rounded-full animate-pulse" />
              </div>
              
              <h3 className="text-4xl font-black text-gradient-premium mb-4">Ready for Your Close-Up?</h3>
              <p className="text-gray-300 text-xl mb-8 max-w-md mx-auto leading-relaxed">
                The spotlight awaits! Create your first fantasy movie league and become the next 
                <span className="text-gradient-gold font-bold"> Box Office Champion</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span className="text-lg">🌟</span>
                  <span>Draft Movies</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span className="text-lg">📊</span>
                  <span>Track Box Office</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <span className="text-lg">🏆</span>
                  <span>Win Glory</span>
                </div>
              </div>
            </div>
          ) : (
            leagues.map((league) => (
              <div key={league.id} className="relative glass-elegant rounded-3xl p-6 hover:card-glow transition-all transform hover:scale-105 border border-gray-700 hover:border-yellow-400 hover:border-opacity-50">
                {/* Movie Reel Decoration */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs">🎬</span>
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gradient-premium">{league.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-gray-400 text-sm">2025-2026 Season</p>
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <span className="px-4 py-2 gradient-premium rounded-full text-white text-xs font-bold shadow-lg border border-yellow-400 border-opacity-30">
                    <span className="mr-1">🎪</span>
                    {league.status}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-300 bg-black bg-opacity-30 rounded-lg px-3 py-2">
                    <span className="flex items-center space-x-2">
                      <span>👥</span>
                      <span>Cast:</span>
                    </span>
                    <span className="font-bold text-blue-400">{league.currentPlayers}/{league.maxPlayers} Stars</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-300 bg-black bg-opacity-30 rounded-lg px-3 py-2">
                    <span className="flex items-center space-x-2">
                      <span>💎</span>
                      <span>Access:</span>
                    </span>
                    <span className="font-bold text-green-400">
                      Free to Play
                    </span>
                  </div>

                  {league.draftDate && (
                    <div className="flex justify-between text-gray-300 bg-black bg-opacity-30 rounded-lg px-3 py-2">
                      <span className="flex items-center space-x-2">
                        <span>🎯</span>
                        <span>Draft:</span>
                      </span>
                      <span className="font-bold text-yellow-400">
                        {new Date(league.draftDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full gradient-premium text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg border border-yellow-400 border-opacity-30">
                    <span className="flex items-center justify-center space-x-2">
                      <span>🎪</span>
                      <span>Manage League</span>
                    </span>
                  </button>
                  
                  {league.status === 'draft' && (
                    <button className="w-full glass-elegant border border-gray-600 hover:border-yellow-400 hover:border-opacity-50 text-gray-300 hover:text-white py-3 rounded-xl font-medium hover:card-glow transition-all">
                      <span className="flex items-center justify-center space-x-2">
                        <span>🎬</span>
                        <span>Invite Cast & Set Up Draft</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create League Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="relative glass-elegant rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-yellow-400 border-opacity-30 shadow-2xl">
            {/* Hollywood Modal Decorations */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-t-3xl" />
            <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-xs">⭐</span>
            </div>

            <div className="flex justify-between items-center mb-6 pt-2">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">🎬</span>
                  <h3 className="text-3xl font-black text-gradient-premium">Create Epic League</h3>
                </div>
                <div className="flex items-center mt-3">
                  <div className="flex space-x-3">
                    {[1, 2].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            step === currentStep ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' : 
                            step < currentStep ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {step < currentStep ? '✓' : step}
                        </div>
                        {step < 2 && (
                          <div className={`w-8 h-1 mx-2 rounded ${
                            step < currentStep ? 'bg-green-400' : 'bg-gray-600'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-yellow-400 ml-4 font-medium">🎪 Act {currentStep} of 2</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowCreateModal(false)
                  setCurrentStep(1)
                }}
                className="text-gray-400 hover:text-white text-3xl font-bold hover:rotate-90 transition-all duration-300"
              >
                ×
              </button>
            </div>

            {/* Step 1: Basic Settings */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-yellow-400 mb-3 flex items-center space-x-2">
                    <span>🎬</span>
                    <span>League Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-black bg-opacity-60 border-2 border-gray-600 hover:border-yellow-400 focus:border-yellow-400 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all font-medium text-lg"
                    placeholder="e.g., Hollywood Heroes Championship"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-yellow-400 mb-3 flex items-center space-x-2">
                    <span>🎭</span>
                    <span>Cast Size (3-10 Stars) *</span>
                  </label>
                  <select
                    name="maxPlayers"
                    value={formData.maxPlayers}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-black bg-opacity-60 border-2 border-gray-600 hover:border-yellow-400 focus:border-yellow-400 rounded-2xl text-white focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all font-medium text-lg"
                  >
                    <option value={3}>3 Stars ⭐⭐⭐</option>
                    <option value={4}>4 Stars ⭐⭐⭐⭐</option>
                    <option value={5}>5 Stars ⭐⭐⭐⭐⭐</option>
                    <option value={6}>6 Stars ⭐⭐⭐⭐⭐⭐</option>
                    <option value={7}>7 Stars ⭐⭐⭐⭐⭐⭐⭐</option>
                    <option value={8}>8 Stars (Epic Cast)</option>
                    <option value={9}>9 Stars (Blockbuster)</option>
                    <option value={10}>10 Stars (Oscar-Worthy)</option>
                  </select>
                </div>

                <div className="bg-black bg-opacity-40 rounded-2xl p-4 border border-gray-700">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleCheckboxChange}
                      className="w-6 h-6 text-yellow-500 bg-gray-800 border-gray-600 rounded-lg focus:ring-yellow-400 focus:ring-2"
                    />
                    <div className="flex items-center space-x-2">
                      <span>🌟</span>
                      <span className="text-gray-300 font-medium">Make this league public (Open Casting Call)</span>
                    </div>
                  </label>
                </div>

                <div className="bg-gradient-to-r from-yellow-900 via-orange-900 to-red-900 bg-opacity-30 rounded-2xl p-6 border border-yellow-600 border-opacity-30">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-2xl">📋</span>
                    <p className="font-bold text-yellow-400 text-lg">Fantasy Movie League Rules:</p>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="bg-black bg-opacity-30 rounded-lg p-3">
                      <p className="text-yellow-300 font-bold mb-2">🎬 Season Structure</p>
                      <ul className="space-y-1 text-gray-300 text-xs">
                        <li>• <span className="text-blue-400 font-bold">Two Drafts:</span> May (10 movies) & October (refill roster)</li>
                        <li>• <span className="text-green-400 font-bold">Two Periods:</span> Period 1 (Months 1-5) & Period 2 (Months 6-10)</li>
                        <li>• <span className="text-purple-400 font-bold">Championship:</span> Top performers advance to Oscar showdown</li>
                      </ul>
                    </div>
                    
                    <div className="bg-black bg-opacity-30 rounded-lg p-3">
                      <p className="text-yellow-300 font-bold mb-2">🏆 Scoring System</p>
                      <ul className="space-y-1 text-gray-300 text-xs">
                        <li>• <span className="text-green-400 font-bold">Base Score:</span> 30-day global box office - production budget</li>
                        <li>• <span className="text-blue-400 font-bold">IMDB Bonuses:</span> 8.5+ rating = +$50-100M bonus</li>
                        <li>• <span className="text-purple-400 font-bold">Budget Multipliers:</span> <$50M & <$20M films get bonus multipliers</li>
                        <li>• <span className="text-yellow-400 font-bold">Oscar Points:</span> 5pts per win, 2pts per nomination</li>
                      </ul>
                    </div>
                    
                    <div className="bg-black bg-opacity-30 rounded-lg p-3">
                      <p className="text-yellow-300 font-bold mb-2">🎯 Team Strategy</p>
                      <ul className="space-y-1 text-gray-300 text-xs">
                        <li>• <span className="text-cyan-400 font-bold">10 Movies:</span> 5 starters + 5 reserves per period</li>
                        <li>• <span className="text-orange-400 font-bold">Snake Draft:</span> Live drafts with strategic position picks</li>
                        <li>• <span className="text-pink-400 font-bold">Cross-Period:</span> Draft future blockbusters early for strategic advantage</li>
                        <li>• <span className="text-emerald-400 font-bold">Free Waivers:</span> Pick up undrafted movies anytime</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false)
                      setCurrentStep(1)
                    }}
                    className="flex-1 glass-elegant border-2 border-gray-600 hover:border-red-400 text-gray-300 hover:text-white py-4 rounded-2xl font-bold transition-all hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>❌</span>
                      <span>Cancel</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.name.trim()}
                    className="flex-1 gradient-premium text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg border border-yellow-400 border-opacity-30"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🎬</span>
                      <span>Next: Schedule Production</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Draft Scheduling */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">🎯</span>
                    <h4 className="text-2xl font-black text-gradient-premium">Schedule Your Draft</h4>
                  </div>
                  <p className="text-gray-300 text-base mb-6 leading-relaxed">
                    Set when your cast will draft their movie portfolios. The perfect timing for your <span className="text-yellow-400 font-bold">blockbuster debut!</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-yellow-400 mb-3 flex items-center space-x-2">
                      <span>📅</span>
                      <span>Premiere Date</span>
                    </label>
                    <input
                      type="date"
                      name="draftDate"
                      value={formData.draftDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      className="w-full px-6 py-4 bg-black bg-opacity-60 border-2 border-gray-600 hover:border-yellow-400 focus:border-yellow-400 rounded-2xl text-white focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all font-medium text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-yellow-400 mb-3 flex items-center space-x-2">
                      <span>⏰</span>
                      <span>Showtime</span>
                    </label>
                    <input
                      type="time"
                      name="draftTime"
                      value={formData.draftTime}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-black bg-opacity-60 border-2 border-gray-600 hover:border-yellow-400 focus:border-yellow-400 rounded-2xl text-white focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all font-medium text-lg"
                    />
                  </div>
                </div>

                {formData.draftDate && formData.draftTime && (
                  <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-opacity-20 border-2 border-yellow-400 border-opacity-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🎪</span>
                      <p className="text-yellow-300 font-bold text-lg">🎬 PREMIERE SCHEDULED! 🎬</p>
                    </div>
                    <p className="text-white text-base font-medium bg-black bg-opacity-40 rounded-lg p-3">
                      {new Date(`${formData.draftDate}T${formData.draftTime}`).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 bg-opacity-40 rounded-2xl p-6 border border-purple-600 border-opacity-30">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🎪</span>
                    <p className="font-bold text-purple-400 text-lg">Behind the Scenes:</p>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center space-x-2 text-gray-300">
                      <span>🎭</span>
                      <span>All <span className="text-yellow-400 font-bold">cast members</span> must be present for the draft</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-300">
                      <span>🎲</span>
                      <span>Draft order will be <span className="text-green-400 font-bold">randomized</span> for fairness</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-300">
                      <span>🎬</span>
                      <span>Each player picks <span className="text-blue-400 font-bold">movies within budget</span></span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-300">
                      <span>⚡</span>
                      <span>You can <span className="text-purple-400 font-bold">reschedule</span> before the draft starts</span>
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 glass-elegant border-2 border-gray-600 hover:border-yellow-400 text-gray-300 hover:text-white py-4 rounded-2xl font-bold transition-all hover:shadow-lg"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>👈</span>
                      <span>Back to Setup</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateLeague}
                    className="flex-1 gradient-premium text-white py-4 rounded-2xl font-bold hover:opacity-90 transform hover:scale-105 transition-all shadow-2xl border-2 border-yellow-400 border-opacity-50"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>Launch League!</span>
                    </span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

export default LeagueManager