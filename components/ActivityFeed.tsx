'use client'

import { useState } from 'react'

export interface ActivityItem {
  id: string;
  type: 'trade' | 'pickup' | 'drop' | 'draft' | 'score_update' | 'league_join';
  user: string;
  userAvatar?: string;
  action: string;
  details: string;
  timestamp: string;
  movieTitle?: string;
  moviePoster?: string;
  value?: number;
  tradePartner?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  showFilters?: boolean;
  maxItems?: number;
}

const ActivityFeed = ({ activities, showFilters = true, maxItems = 10 }: ActivityFeedProps) => {
  const [filter, setFilter] = useState<'all' | 'trades' | 'pickups' | 'scores'>('all')
  
  const filteredActivities = activities
    .filter(activity => {
      if (filter === 'all') return true
      if (filter === 'trades') return activity.type === 'trade'
      if (filter === 'pickups') return activity.type === 'pickup' || activity.type === 'drop'
      if (filter === 'scores') return activity.type === 'score_update'
      return true
    })
    .slice(0, maxItems)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'trade': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
      case 'pickup': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      case 'drop': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
      case 'draft': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
      case 'score_update': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      case 'league_join': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
      default: return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'trade': return 'text-blue-400'
      case 'pickup': return 'text-green-400'
      case 'drop': return 'text-red-400'
      case 'draft': return 'text-purple-400'
      case 'score_update': return 'text-yellow-400'
      case 'league_join': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="glass-elegant rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          Live Activity
        </h3>
        {showFilters && (
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'trades', label: 'Trades' },
              { key: 'pickups', label: 'Moves' },
              { key: 'scores', label: 'Scores' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === key
                    ? 'gradient-blue text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-700 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-medium mb-2">No Activity Yet</p>
            <p className="text-gray-500 text-sm">
              Player activity will appear here when members make trades, pickups, or score updates
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-700 hover:bg-opacity-30 transition-all group"
            >
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full gradient-blue flex items-center justify-center text-white font-bold text-sm">
                  {activity.user[0].toUpperCase()}
                </div>
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={getActivityColor(activity.type)}>{getActivityIcon(activity.type)}</span>
                  <span className="text-white font-medium">{activity.user}</span>
                  <span className={`text-sm ${getActivityColor(activity.type)}`}>
                    {activity.action}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-1">
                  {activity.details}
                </p>
                
                {activity.movieTitle && (
                  <div className="flex items-center space-x-2 mt-2">
                    {activity.moviePoster && (
                      <img
                        src={activity.moviePoster}
                        alt={activity.movieTitle}
                        className="w-8 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="text-blue-400 text-sm font-medium">{activity.movieTitle}</p>
                      {activity.value && (
                        <p className="text-green-400 text-xs">
                          ${activity.value.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-500 text-xs mt-2">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-white p-1 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredActivities.length >= maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-600 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All Activity →
          </button>
        </div>
      )}
    </div>
  )
}

// Generate real activity from league data
export const generateRealActivity = (): ActivityItem[] => {
  const now = Date.now()
  return [
    {
      id: '1',
      type: 'trade',
      user: 'Will',
      action: 'added',
      details: 'Adds Dog Man, Swaps Michael for Mission Impossible: Final Reckoning',
      timestamp: '2025-01-16',
      movieTitle: 'Dog Man',
      value: 0
    },
    {
      id: '2',
      type: 'trade',
      user: 'Tyler',
      action: 'added',
      details: 'Adds Conjuring: Last Rites, drops Mission Impossible: Final Reckoning - Penalty: 20 points',
      timestamp: '2025-08-18',
      movieTitle: 'The Conjuring: Last Rites',
      value: -20
    },
    {
      id: '3',
      type: 'trade',
      user: 'Tyler',
      action: 'swapped',
      details: 'Swaps Conjuring: Last Rites for Spiderman: Beyond the Spiderverse',
      timestamp: '2025-08-18',
      movieTitle: 'Beyond the Spider-verse',
      value: 0
    },
    {
      id: '4',
      type: 'drop',
      user: 'Tyler',
      action: 'penalty for unreleased movies',
      details: 'Michael does not release, Spiderman: Beyond the Spiderverse does not release - Penalty: 40 points',
      timestamp: '2025-08-18',
      movieTitle: 'Michael',
      value: -40
    },
    {
      id: '5',
      type: 'drop',
      user: 'Tyler',
      action: 'penalty for unreleased movies', 
      details: 'Moana does not release, Dog Man is auto-swapped - Penalty: 40 points',
      timestamp: '2025-12-31',
      movieTitle: 'Moana 2',
      value: -40
    },
    {
      id: '6',
      type: 'trade',
      user: 'Will',
      action: 'auto-swap penalty',
      details: 'Moana does not release, Dog Man is auto-swapped - Penalty: 20 points',
      timestamp: '2025-12-31',
      movieTitle: 'Moana 2',
      value: -20
    }
  ]
}

// Fallback mock data
export const generateMockActivity = (): ActivityItem[] => generateRealActivity()

export default ActivityFeed