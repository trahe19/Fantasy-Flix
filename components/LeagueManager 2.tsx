'use client'

import { useState, useEffect } from 'react'
import { League, createLeague, getUserLeagues, getCurrentUser } from '../lib/auth'

const LeagueManager = () => {
  const [leagues, setLeagues] = useState<League[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [formData, setFormData] = useState({
    name: '',
    season: '2025-Fall',
    maxPlayers: 10,
    entryFee: 0,
    budget: 1000,
    positions: ['Blockbuster', 'Indie', 'Action', 'Drama', 'Horror'],
    scoringPeriod: 'weekend' as const
  })

  useEffect(() => {
    if (currentUser) {
      const userLeagues = getUserLeagues(currentUser.id)
      setLeagues(userLeagues)
    }
  }, [currentUser])

  const handleCreateLeague = () => {
    if (!currentUser) return

    const newLeague = createLeague({
      name: formData.name,
      createdBy: currentUser.id,
      season: formData.season,
      status: 'draft',
      maxPlayers: formData.maxPlayers,
      currentPlayers: 0,
      entryFee: formData.entryFee,
      prizePool: formData.entryFee * formData.maxPlayers,
      rules: {
        budget: formData.budget,
        positions: formData.positions,
        scoringPeriod: formData.scoringPeriod
      }
    })

    setLeagues([...leagues, newLeague])
    setShowCreateModal(false)
    
    // Reset form
    setFormData({
      name: '',
      season: '2025-Fall',
      maxPlayers: 10,
      entryFee: 0,
      budget: 1000,
      positions: ['Blockbuster', 'Indie', 'Action', 'Drama', 'Horror'],
      scoringPeriod: 'weekend'
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPlayers' || name === 'entryFee' || name === 'budget' ? parseInt(value) || 0 : value
    }))
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-gradient-silver mb-2">
            League Management
          </h1>
          <p className="text-gray-300">Create and manage your fantasy movie leagues</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="gradient-premium text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all"
        >
          Create New League
        </button>
      </div>

      {/* Current Leagues */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {leagues.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-3">No Leagues Yet</h3>
            <p className="text-gray-400 text-lg mb-6">Create your first fantasy movie league to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="gradient-blue text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all"
            >
              Create Your First League 🚀
            </button>
          </div>
        ) : (
          leagues.map((league) => (
            <div key={league.id} className="glass-elegant rounded-2xl p-6 hover:card-glow transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{league.name}</h3>
                  <p className="text-gray-400 text-sm">{league.season}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  league.status === 'draft' 
                    ? 'bg-yellow-500 bg-opacity-20 text-yellow-300'
                    : league.status === 'active'
                    ? 'bg-green-500 bg-opacity-20 text-green-300'
                    : 'bg-gray-500 bg-opacity-20 text-gray-300'
                }`}>
                  {league.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Players:</span>
                  <span className="font-bold text-white">
                    {league.currentPlayers}/{league.maxPlayers}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Entry Fee:</span>
                  <span className="font-bold text-green-400">
                    ${league.entryFee}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Prize Pool:</span>
                  <span className="font-bold text-gradient-gold">
                    ${league.prizePool}
                  </span>
                </div>

                <div className="flex justify-between text-gray-300">
                  <span>Budget:</span>
                  <span className="font-bold text-blue-400">
                    ${league.rules.budget}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-600">
                  <p className="text-gray-400 text-xs mb-2">Positions:</p>
                  <div className="flex flex-wrap gap-1">
                    {league.rules.positions.map((position) => (
                      <span
                        key={position}
                        className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded text-xs"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button className="w-full gradient-blue text-white py-2 rounded-lg font-medium hover:opacity-90 transition-all">
                  Manage League
                </button>
                
                {league.status === 'draft' && (
                  <button className="w-full glass border border-gray-500 text-gray-300 hover:text-white py-2 rounded-lg font-medium hover:card-glow transition-all">
                    Add Players
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create League Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="glass-elegant rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gradient-premium">Create New League</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  League Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., Friends Championship 2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Season
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="2025-Fall">2025 Fall</option>
                    <option value="2025-Winter">2025 Winter</option>
                    <option value="2026-Spring">2026 Spring</option>
                    <option value="2026-Summer">2026 Summer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Players
                  </label>
                  <input
                    type="number"
                    name="maxPlayers"
                    value={formData.maxPlayers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400"
                    min="2"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Entry Fee ($)
                  </label>
                  <input
                    type="number"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400"
                    min="0"
                    step="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Draft Budget ($)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400"
                    min="100"
                    step="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Scoring Period
                </label>
                <select
                  name="scoringPeriod"
                  value={formData.scoringPeriod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="weekend">Weekend</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Draft Positions ({formData.positions.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.positions.map((position, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-full text-sm"
                    >
                      {position}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Default positions: Blockbuster, Indie, Action, Drama, Horror
                </p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 glass border border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateLeague}
                  disabled={!formData.name}
                  className="flex-1 gradient-premium text-white py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all disabled:opacity-50"
                >
                  Create League
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeagueManager