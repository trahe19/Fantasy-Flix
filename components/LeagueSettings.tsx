'use client'

import { useState } from 'react'
import { League, ScoringRules } from '../lib/fantasy-league-types'
import { FantasyMovieLeagueScoringEngine } from '../lib/scoring-engine'

interface LeagueSettingsProps {
  league?: Partial<League>
  onSave?: (settings: Partial<League>) => void
  onCancel?: () => void
  isCommissioner?: boolean
}

const LeagueSettings = ({ 
  league, 
  onSave = () => {}, 
  onCancel = () => {}, 
  isCommissioner = true 
}: LeagueSettingsProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'periods' | 'scoring' | 'draft'>('general')
  const [settings, setSettings] = useState<Partial<League>>({
    name: league?.name || '',
    maxPlayers: league?.maxPlayers || 8,
    isPublic: league?.isPublic || false,
    period1StartDate: league?.period1StartDate || '2025-05-01',
    period1EndDate: league?.period1EndDate || '2025-08-31',
    period2StartDate: league?.period2StartDate || '2025-09-01',
    period2EndDate: league?.period2EndDate || '2026-04-30',
    championshipSeats: league?.championshipSeats || 4,
    oscarCeremonyDate: league?.oscarCeremonyDate || '2026-03-08',
    initialDraftDate: league?.initialDraftDate || '2025-04-15T19:00:00',
    secondDraftDate: league?.secondDraftDate || '2025-08-15T19:00:00',
    draftOrder: league?.draftOrder || 'random',
    scoringRules: league?.scoringRules || FantasyMovieLeagueScoringEngine.getDefaultScoringRules(),
    ...league
  })

  const updateSettings = (key: keyof League, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateScoringRule = (key: keyof ScoringRules, value: number) => {
    setSettings(prev => ({
      ...prev,
      scoringRules: {
        ...prev.scoringRules!,
        [key]: value
      }
    }))
  }

  const handleSave = () => {
    onSave(settings)
  }

  const tabs = [
    { key: 'general', label: '🏆 General', icon: '🏆' },
    { key: 'periods', label: '📅 Periods', icon: '📅' },
    { key: 'scoring', label: '🎯 Scoring', icon: '🎯' },
    { key: 'draft', label: '🎭 Draft', icon: '🎭' }
  ]

  return (
    <div className="px-4 py-6 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      </div>

      {/* Header */}
      <div className="glass-dark rounded-2xl p-6 mb-6 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gradient mb-2">⚙️ League Configuration</h1>
            <p className="text-gray-300">Customize your Fantasy Movie League experience</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 glass rounded-xl text-white font-medium hover:scale-105 transform transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 gradient-blue text-white font-bold rounded-xl hover:scale-105 transform transition-all"
            >
              Save Configuration 💾
            </button>
          </div>
        </div>
      </div>

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
              <span className="text-lg mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-dark rounded-2xl p-8 relative z-10">
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gradient mb-6">🏆 General League Settings</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">League Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => updateSettings('name', e.target.value)}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-500"
                      placeholder="Epic Movie League 2025"
                      disabled={!isCommissioner}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Maximum Players</label>
                    <select
                      value={settings.maxPlayers}
                      onChange={(e) => updateSettings('maxPlayers', parseInt(e.target.value))}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                      disabled={!isCommissioner}
                    >
                      {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} Players</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Championship Seats</label>
                    <select
                      value={settings.championshipSeats}
                      onChange={(e) => updateSettings('championshipSeats', parseInt(e.target.value))}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                      disabled={!isCommissioner}
                    >
                      {[2, 4, 6, 8].map(num => (
                        <option key={num} value={num}>{num} Championship Seats</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={settings.isPublic}
                      onChange={(e) => updateSettings('isPublic', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded"
                      disabled={!isCommissioner}
                    />
                    <label htmlFor="isPublic" className="text-white font-medium">
                      Public League (anyone can join)
                    </label>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Oscar Ceremony Date</label>
                    <input
                      type="date"
                      value={settings.oscarCeremonyDate?.split('T')[0]}
                      onChange={(e) => updateSettings('oscarCeremonyDate', e.target.value)}
                      className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                      disabled={!isCommissioner}
                    />
                  </div>

                  <div className="p-4 bg-blue-500 bg-opacity-20 rounded-xl">
                    <h3 className="text-blue-300 font-bold mb-2">💡 Pro Tips</h3>
                    <ul className="text-blue-200 text-sm space-y-1">
                      <li>• Even championship seats create balanced brackets</li>
                      <li>• Public leagues attract more diverse competition</li>
                      <li>• Oscar ceremony timing affects championship scoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'periods' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gradient mb-6">📅 Period Configuration</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 gradient-blue rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">🌟 Period 1 (Summer Season)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Start Date</label>
                        <input
                          type="date"
                          value={settings.period1StartDate?.split('T')[0]}
                          onChange={(e) => updateSettings('period1StartDate', e.target.value)}
                          className="w-full p-3 bg-black bg-opacity-30 border border-white border-opacity-30 rounded-xl text-white"
                          disabled={!isCommissioner}
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">End Date</label>
                        <input
                          type="date"
                          value={settings.period1EndDate?.split('T')[0]}
                          onChange={(e) => updateSettings('period1EndDate', e.target.value)}
                          className="w-full p-3 bg-black bg-opacity-30 border border-white border-opacity-30 rounded-xl text-white"
                          disabled={!isCommissioner}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 gradient-purple rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">🎭 Period 2 (Awards Season)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Start Date</label>
                        <input
                          type="date"
                          value={settings.period2StartDate?.split('T')[0]}
                          onChange={(e) => updateSettings('period2StartDate', e.target.value)}
                          className="w-full p-3 bg-black bg-opacity-30 border border-white border-opacity-30 rounded-xl text-white"
                          disabled={!isCommissioner}
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">End Date</label>
                        <input
                          type="date"
                          value={settings.period2EndDate?.split('T')[0]}
                          onChange={(e) => updateSettings('period2EndDate', e.target.value)}
                          className="w-full p-3 bg-black bg-opacity-30 border border-white border-opacity-30 rounded-xl text-white"
                          disabled={!isCommissioner}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-yellow-500 bg-opacity-20 rounded-xl">
                <h3 className="text-yellow-300 font-bold mb-3">⚠️ Period Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-4 text-yellow-200 text-sm">
                  <div>
                    <p className="font-medium mb-2">Period 1 - Summer Blockbusters:</p>
                    <ul className="space-y-1">
                      <li>• May through August releases</li>
                      <li>• High-budget action & franchise films</li>
                      <li>• Focus on box office potential</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Period 2 - Awards Season:</p>
                    <ul className="space-y-1">
                      <li>• September through April releases</li>
                      <li>• Oscar-worthy dramas & prestige films</li>
                      <li>• IMDB ratings & Oscar potential crucial</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scoring' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gradient mb-6">🎯 Scoring Rules Configuration</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">⭐ IMDB Rating Bonuses</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">8.5+ Rating Bonus (M)</label>
                        <input
                          type="number"
                          value={settings.scoringRules?.imdbBonus_85Plus}
                          onChange={(e) => updateScoringRule('imdbBonus_85Plus', parseFloat(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="75"
                          disabled={!isCommissioner}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">8.0-8.4 Rating Bonus (M)</label>
                        <input
                          type="number"
                          value={settings.scoringRules?.imdbBonus_80to84}
                          onChange={(e) => updateScoringRule('imdbBonus_80to84', parseFloat(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="37.5"
                          disabled={!isCommissioner}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">7.5-7.9 Rating Bonus (M)</label>
                        <input
                          type="number"
                          value={settings.scoringRules?.imdbBonus_75to79}
                          onChange={(e) => updateScoringRule('imdbBonus_75to79', parseFloat(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="17.5"
                          disabled={!isCommissioner}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">💰 Budget Multipliers</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Under $20M Multiplier</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.scoringRules?.budgetMultiplier_Under20M}
                          onChange={(e) => updateScoringRule('budgetMultiplier_Under20M', parseFloat(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="1.4"
                          disabled={!isCommissioner}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Under $50M Multiplier</label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.scoringRules?.budgetMultiplier_Under50M}
                          onChange={(e) => updateScoringRule('budgetMultiplier_Under50M', parseFloat(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="1.2"
                          disabled={!isCommissioner}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">🏆 Oscar Points</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Oscar Win Points</label>
                        <input
                          type="number"
                          value={settings.scoringRules?.oscarWinPoints}
                          onChange={(e) => updateScoringRule('oscarWinPoints', parseInt(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="5"
                          disabled={!isCommissioner}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Oscar Nomination Points</label>
                        <input
                          type="number"
                          value={settings.scoringRules?.oscarNominationPoints}
                          onChange={(e) => updateScoringRule('oscarNominationPoints', parseInt(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="2"
                          disabled={!isCommissioner}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">⏭️ Draft Options</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Skip Bonus (2nd Draft)</label>
                        <input
                          type="number"
                          value={settings.scoringRules?.skipBonusAmount}
                          onChange={(e) => updateScoringRule('skipBonusAmount', parseInt(e.target.value))}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          placeholder="25"
                          disabled={!isCommissioner}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-500 bg-opacity-20 rounded-xl">
                    <h4 className="text-green-300 font-bold mb-2">🧮 Scoring Formula</h4>
                    <p className="text-green-200 text-sm">
                      <strong>Total Score = </strong>(Box Office - Budget) + IMDB Bonus + Budget Multiplier Bonus + Oscar Points
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'draft' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gradient mb-6">🎭 Draft Configuration</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">📅 Draft Schedule</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Initial Draft Date & Time</label>
                        <input
                          type="datetime-local"
                          value={settings.initialDraftDate?.slice(0, 16)}
                          onChange={(e) => updateSettings('initialDraftDate', e.target.value)}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          disabled={!isCommissioner}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-2">Second Draft Date & Time</label>
                        <input
                          type="datetime-local"
                          value={settings.secondDraftDate?.slice(0, 16)}
                          onChange={(e) => updateSettings('secondDraftDate', e.target.value)}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          disabled={!isCommissioner}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 glass rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">🔀 Draft Order</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 mb-2">Draft Order Selection</label>
                        <select
                          value={settings.draftOrder}
                          onChange={(e) => updateSettings('draftOrder', e.target.value)}
                          className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white"
                          disabled={!isCommissioner}
                        >
                          <option value="random">🎲 Random Draft Order</option>
                          <option value="manual">✋ Commissioner Sets Order</option>
                        </select>
                      </div>
                      
                      {settings.draftOrder === 'manual' && (
                        <div className="p-4 bg-blue-500 bg-opacity-20 rounded-xl">
                          <p className="text-blue-300 text-sm">
                            You'll be able to set the draft order manually after all players join the league.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-purple-500 bg-opacity-20 rounded-xl">
                    <h3 className="text-purple-300 font-bold mb-4">🎯 Draft Strategy Guide</h3>
                    <div className="space-y-3 text-purple-200 text-sm">
                      <div>
                        <p className="font-medium">Initial Draft (Period 1):</p>
                        <ul className="ml-4 space-y-1">
                          <li>• Focus on summer blockbusters</li>
                          <li>• High box office potential crucial</li>
                          <li>• 5 starters + 5 reserves per player</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium">Second Draft (Period 2):</p>
                        <ul className="ml-4 space-y-1">
                          <li>• Awards season films</li>
                          <li>• IMDB ratings & Oscar potential</li>
                          <li>• Can skip for $25M bonus</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-green-500 bg-opacity-20 rounded-xl">
                    <h3 className="text-green-300 font-bold mb-4">📋 Draft Rules</h3>
                    <div className="space-y-2 text-green-200 text-sm">
                      <p>• Snake draft format (1-2-3-3-2-1...)</p>
                      <p>• Live synchronous drafting</p>
                      <p>• Commissioner controls draft progression</p>
                      <p>• Cross-period drafting allowed</p>
                      <p>• 5 starters + 5 reserves per period</p>
                      <p>• Only starters count for period scoring</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeagueSettings