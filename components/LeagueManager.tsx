'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, createLeague, getUserLeagues, updateLeaguePlayerNames } from '../lib/auth'

interface LeagueFormData {
  name: string
  maxPlayers: number
  draftDate: string
  draftTime: string
  timezone: string
  isPublic: boolean
}

const LeagueManager = () => {
  const [leagues, setLeagues] = useState<any[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedLeague, setSelectedLeague] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [formData, setFormData] = useState<LeagueFormData>({
    name: '',
    maxPlayers: 6,
    draftDate: '',
    draftTime: '',
    timezone: 'America/New_York',
    isPublic: false
  })

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
        
        // Update existing leagues to show proper display names
        await updateLeaguePlayerNames()
        
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
        entryFee: 0,
        prizePool: 0,
        draftDate: draftDateTime,
        rules: {
          budget: 1000,
          positions: ['Blockbuster', 'Indie', 'Action', 'Drama', 'Horror'],
          scoringPeriod: 'weekend'
        }
      })

      // Refresh leagues list to show the new league with proper user display name
      const updatedLeagues = await getUserLeagues(currentUser.id)
      setLeagues(updatedLeagues)
      
      setShowCreateModal(false)
      setCurrentStep(1)
      setFormData({
        name: '',
        maxPlayers: 6,
        draftDate: '',
        draftTime: '',
        timezone: 'America/New_York',
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

  const sendInvite = async () => {
    if (!inviteEmail.trim() || !selectedLeague || !currentUser) {
      alert('Please enter a valid email address')
      return
    }

    setIsInviting(true)
    
    try {
      const response = await fetch('/api/send-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          leagueId: selectedLeague.id,
          leagueName: selectedLeague.name,
          inviterName: currentUser.display_name || currentUser.username || 'A friend'
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`✅ Invitation sent to ${inviteEmail}!`)
        setInviteEmail('')
      } else {
        alert(`❌ Failed to send invitation: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending invite:', error)
      alert('❌ Failed to send invitation. Please try again.')
    } finally {
      setIsInviting(false)
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleTimeChange = (hours: string, minutes: string, ampm: string) => {
    const time24 = ampm === 'PM' && hours !== '12' 
      ? `${parseInt(hours) + 12}:${minutes}` 
      : ampm === 'AM' && hours === '12' 
      ? `00:${minutes}` 
      : `${hours.padStart(2, '0')}:${minutes}`
    
    setFormData(prev => ({
      ...prev,
      draftTime: time24
    }))
  }

  const parseTime = (time24: string) => {
    if (!time24) return { hours: '12', minutes: '00', ampm: 'PM' }
    
    const [hours, minutes] = time24.split(':')
    const hour24 = parseInt(hours)
    const hour12 = hour24 === 0 ? '12' : hour24 > 12 ? (hour24 - 12).toString() : hours
    const ampm = hour24 >= 12 ? 'PM' : 'AM'
    
    return {
      hours: hour12.padStart(2, '0'),
      minutes: minutes,
      ampm: ampm
    }
  }

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  const handleEnterLeague = (league: any) => {
    console.log('Entering league:', league.name)
    // TODO: Navigate to league dashboard/draft room
    alert(`Entering ${league.name} - Draft room coming soon!`)
  }

  const handleLeagueSettings = (league: any) => {
    setSelectedLeague(league)
    setShowSettingsModal(true)
  }

  const handleInvitePlayers = (league: any) => {
    setSelectedLeague(league)
    setShowInviteModal(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hollywood Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-32 right-20 w-48 h-48 bg-gradient-to-br from-red-500 to-pink-600 rounded-full opacity-8 animate-float" />
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full opacity-6 animate-float-delayed" />
        
        {/* Film strip decoration */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 opacity-20">
          <div className="flex justify-evenly items-center h-full">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-2 h-4 bg-black opacity-40 rounded-sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-gradient mb-4">🎬 My Epic Leagues</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage your fantasy movie empire. Create leagues, draft blockbusters, and dominate the box office!
          </p>
        </div>

        {/* Create League Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 gradient-blue text-white font-black text-lg rounded-2xl hover:scale-110 transform transition-all duration-300 shadow-2xl animate-bounce-slow"
          >
            🎭 Create New League
          </button>
        </div>

        {/* Leagues Grid */}
        {leagues.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {leagues.map((league, index) => (
              <div key={league.id || index} className="glass-elegant p-6 rounded-2xl hover:card-glow transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{league.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    league.status === 'draft' ? 'bg-blue-500 text-white' :
                    league.status === 'active' ? 'bg-green-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {league.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Players:</span>
                    <span className="text-white">{league.currentPlayers || 1}/{league.maxPlayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Season:</span>
                    <span className="text-white">{league.season || '2025-2026'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prize Pool:</span>
                    <span className="text-green-400 font-bold">${league.prizePool || 0}</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-2">
                  <button 
                    onClick={() => handleEnterLeague(league)}
                    className="flex-1 py-2 gradient-blue text-white font-medium rounded-xl hover:scale-105 transform transition-all"
                  >
                    Enter League
                  </button>
                  <button 
                    onClick={() => handleLeagueSettings(league)}
                    className="px-4 py-2 glass rounded-xl text-white hover:scale-105 transform transition-all"
                    title="League Settings"
                  >
                    ⚙️
                  </button>
                  <button 
                    onClick={() => handleInvitePlayers(league)}
                    className="px-4 py-2 gradient-gold text-black font-medium rounded-xl hover:scale-105 transform transition-all"
                    title="Invite Players"
                  >
                    👥
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center max-w-2xl mx-auto glass-elegant p-12 rounded-3xl">
            <div className="text-8xl mb-6">🎬</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Leagues Yet</h2>
            <p className="text-gray-300 text-lg">
              Ready to become a movie mogul? Use the "Create New League" button above to start drafting the next blockbuster lineup!
            </p>
          </div>
        )}

        {/* Create League Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="relative glass-elegant rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-yellow-400 border-opacity-30 shadow-2xl">
              {/* Hollywood Modal Decorations */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-t-3xl" />
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gradient mb-2">🎬 Create Epic League</h2>
                <p className="text-gray-300">Build the ultimate fantasy movie experience</p>
              </div>

              <div className="space-y-6">
                {/* League Name */}
                <div>
                  <label className="block text-white font-bold mb-2 text-lg">League Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white text-lg placeholder-gray-500 focus:border-yellow-400 transition-colors"
                    placeholder="Hollywood Dream League"
                  />
                </div>

                {/* Players */}
                <div>
                  <label className="block text-white font-bold mb-2 text-lg">Number of Players</label>
                  <select
                    name="maxPlayers"
                    value={formData.maxPlayers}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white text-lg focus:border-yellow-400 transition-colors"
                  >
                    {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} Players</option>
                    ))}
                  </select>
                </div>

                {/* Draft Date */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-bold mb-2 text-lg">Draft Date</label>
                    <input
                      type="date"
                      name="draftDate"
                      value={formData.draftDate}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      className="w-full p-4 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white text-lg focus:border-yellow-400 transition-colors cursor-pointer"
                      style={{ 
                        colorScheme: 'dark',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-2 text-lg">Draft Time</label>
                    <div className="w-full p-4 bg-black bg-opacity-50 border border-gray-600 rounded-xl">
                      <div className="flex justify-center items-center space-x-4">
                        {/* Hours */}
                        <div className="flex flex-col items-center">
                          <select
                            value={parseTime(formData.draftTime).hours}
                            onChange={(e) => {
                              const { minutes, ampm } = parseTime(formData.draftTime)
                              handleTimeChange(e.target.value, minutes, ampm)
                            }}
                            className="bg-transparent text-white text-xl font-bold focus:outline-none cursor-pointer appearance-none text-center"
                            style={{ width: '60px' }}
                          >
                            {[...Array(12)].map((_, i) => {
                              const hour = (i + 1).toString().padStart(2, '0')
                              return <option key={hour} value={hour} className="bg-gray-800">{hour}</option>
                            })}
                          </select>
                        </div>
                        
                        <div className="text-white text-xl font-bold">:</div>
                        
                        {/* Minutes */}
                        <div className="flex flex-col items-center">
                          <select
                            value={parseTime(formData.draftTime).minutes}
                            onChange={(e) => {
                              const { hours, ampm } = parseTime(formData.draftTime)
                              handleTimeChange(hours, e.target.value, ampm)
                            }}
                            className="bg-transparent text-white text-xl font-bold focus:outline-none cursor-pointer appearance-none text-center"
                            style={{ width: '60px' }}
                          >
                            {[...Array(60)].map((_, i) => {
                              const minute = i.toString().padStart(2, '0')
                              return <option key={minute} value={minute} className="bg-gray-800">{minute}</option>
                            })}
                          </select>
                        </div>
                        
                        {/* AM/PM */}
                        <div className="flex flex-col items-center">
                          <select
                            value={parseTime(formData.draftTime).ampm}
                            onChange={(e) => {
                              const { hours, minutes } = parseTime(formData.draftTime)
                              handleTimeChange(hours, minutes, e.target.value)
                            }}
                            className="bg-transparent text-white text-xl font-bold focus:outline-none cursor-pointer appearance-none text-center"
                            style={{ width: '60px' }}
                          >
                            <option value="AM" className="bg-gray-800">AM</option>
                            <option value="PM" className="bg-gray-800">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-white font-bold mb-2 text-lg">Timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white text-lg focus:border-yellow-400 transition-colors"
                  >
                    <option value="America/New_York" className="bg-gray-800">Eastern Time (ET)</option>
                    <option value="America/Chicago" className="bg-gray-800">Central Time (CT)</option>
                    <option value="America/Denver" className="bg-gray-800">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles" className="bg-gray-800">Pacific Time (PT)</option>
                    <option value="America/Anchorage" className="bg-gray-800">Alaska Time (AKT)</option>
                    <option value="Pacific/Honolulu" className="bg-gray-800">Hawaii Time (HT)</option>
                    <option value="Europe/London" className="bg-gray-800">GMT (London)</option>
                    <option value="Europe/Paris" className="bg-gray-800">CET (Paris)</option>
                    <option value="Europe/Moscow" className="bg-gray-800">MSK (Moscow)</option>
                    <option value="Asia/Tokyo" className="bg-gray-800">JST (Tokyo)</option>
                    <option value="Asia/Shanghai" className="bg-gray-800">CST (Beijing)</option>
                    <option value="Australia/Sydney" className="bg-gray-800">AEDT (Sydney)</option>
                  </select>
                </div>

                {/* Public League */}
                <div className="flex items-center space-x-4 p-4 glass rounded-xl">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleCheckboxChange}
                    className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400"
                  />
                  <label htmlFor="isPublic" className="text-white font-medium text-lg">
                    🌍 Make league public (anyone can join)
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 glass rounded-xl text-white font-bold text-lg hover:scale-105 transform transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLeague}
                    disabled={!formData.name.trim()}
                    className="flex-1 py-4 gradient-gold text-black font-black text-lg rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    🚀 Create League
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* League Settings Modal */}
        {showSettingsModal && selectedLeague && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="relative glass-elegant rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-yellow-400 border-opacity-30 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-t-3xl" />
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gradient mb-2">⚙️ League Settings</h2>
                <p className="text-gray-300">{selectedLeague.name}</p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-bold mb-2">League Name</label>
                    <input
                      type="text"
                      defaultValue={selectedLeague.name}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-2">Max Players</label>
                    <input
                      type="number"
                      defaultValue={selectedLeague.maxPlayers}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-bold mb-2">Draft Date</label>
                    <input
                      type="date"
                      defaultValue={selectedLeague.draftDate?.split('T')[0] || ''}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-bold mb-2">Status</label>
                    <select
                      defaultValue={selectedLeague.status}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 transition-colors"
                    >
                      <option value="draft" className="bg-gray-800">Draft</option>
                      <option value="active" className="bg-gray-800">Active</option>
                      <option value="completed" className="bg-gray-800">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="flex-1 py-3 glass rounded-xl text-white font-bold hover:scale-105 transform transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Save settings
                      alert('Settings saved!')
                      setShowSettingsModal(false)
                    }}
                    className="flex-1 py-3 gradient-gold text-black font-black rounded-xl hover:scale-105 transform transition-all"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invite Players Modal */}
        {showInviteModal && selectedLeague && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="relative glass-elegant rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-yellow-400 border-opacity-30 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-t-3xl" />
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gradient mb-2">👥 Invite Players</h2>
                <p className="text-gray-300">{selectedLeague.name}</p>
              </div>

              <div className="space-y-6">
                {/* Share Link */}
                <div>
                  <label className="block text-white font-bold mb-2">Share Link</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/join/${selectedLeague.id}`}
                      className="flex-1 p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-gray-300 text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/join/${selectedLeague.id}`)
                        alert('Link copied!')
                      }}
                      className="px-4 py-3 gradient-blue text-white font-bold rounded-xl hover:scale-105 transform transition-all"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Email Invites */}
                <div>
                  <label className="block text-white font-bold mb-2">Invite by Email</label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className="flex-1 p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white focus:border-yellow-400 transition-colors"
                      disabled={isInviting}
                    />
                    <button
                      onClick={sendInvite}
                      disabled={isInviting || !inviteEmail.trim()}
                      className={`px-4 py-3 font-bold rounded-xl transition-all ${
                        isInviting || !inviteEmail.trim()
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'gradient-gold text-black hover:scale-105 transform'
                      }`}
                    >
                      {isInviting ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>

                {/* Current Players */}
                <div>
                  <h3 className="text-white font-bold mb-3">Current Players ({selectedLeague.currentPlayers}/{selectedLeague.maxPlayers})</h3>
                  <div className="space-y-2">
                    {selectedLeague.players?.map((player: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 glass rounded-xl">
                        <span className="text-white">{player.username}</span>
                        <span className="text-gray-400 text-sm">
                          {player.userId === selectedLeague.createdBy ? 'Commissioner' : 'Player'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 py-3 glass rounded-xl text-white font-bold hover:scale-105 transform transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeagueManager