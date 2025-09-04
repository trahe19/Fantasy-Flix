'use client'

import { memo } from 'react'

interface UserProfileProps {
  username: string
  onClose: () => void
}

const UserProfile = memo(function UserProfile({ username, onClose }: UserProfileProps) {
  const userStats = {
    'BoxOfficeLegend': {
      avatar: '👑',
      rank: 1,
      totalWins: 847,
      championships: 8,
      winRate: '94.2%',
      totalProfit: '$12.3B',
      favoriteGenre: 'Action Blockbusters',
      biggestWin: 'Avatar 2 - $2.1B profit',
      joinDate: 'Founder',
      leagues: 47,
      trophies: ['🏆', '💎', '⚡', '🔥', '👑'],
      bio: 'The undisputed champion of box office predictions. Legendary strategist.',
    },
    'MovieMogul88': {
      avatar: '🎬',
      rank: 2,
      totalWins: 523,
      championships: 5,
      winRate: '76.8%',
      totalProfit: '$8.7B',
      favoriteGenre: 'Sci-Fi Epics',
      biggestWin: 'Dune 2 - $987M profit',
      joinDate: 'Jan 2024',
      leagues: 23,
      trophies: ['🏆', '💎', '⚡'],
      bio: 'Professional box office analyst. Always betting on sequels.',
    },
    'BoxOfficeBoss': {
      avatar: '💰',
      rank: 3,
      totalWins: 412,
      championships: 4,
      winRate: '71.2%',
      totalProfit: '$6.2B',
      favoriteGenre: 'Marvel Movies',
      biggestWin: 'Spider-Man 4 - $1.5B profit',
      joinDate: 'Mar 2024',
      leagues: 18,
      trophies: ['🏆', '💎'],
      bio: 'MCU specialist. If it has superheroes, I draft it.',
    },
  }

  const defaultUser = {
    avatar: '🎭',
    rank: Math.floor(Math.random() * 1000) + 100,
    totalWins: Math.floor(Math.random() * 100),
    championships: Math.floor(Math.random() * 3),
    winRate: `${(Math.random() * 50 + 30).toFixed(1)}%`,
    totalProfit: `$${(Math.random() * 500).toFixed(1)}M`,
    favoriteGenre: 'Mixed',
    biggestWin: 'TBD',
    joinDate: 'Recently',
    leagues: Math.floor(Math.random() * 10) + 1,
    trophies: ['🎬'],
    bio: 'Rising star in the movie prediction game.',
  }

  const user = userStats[username as keyof typeof userStats] || { ...defaultUser, avatar: username[0].toUpperCase() }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="glass-dark rounded-3xl p-8 w-full max-w-2xl transform scale-100" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full gradient-blue flex items-center justify-center text-4xl">
              {user.avatar}
            </div>
            <div>
              <h2 className="text-3xl font-black text-gradient">{username}</h2>
              <p className="text-gray-400">Global Rank #{user.rank}</p>
              <div className="flex space-x-2 mt-2">
                {user.trophies.map((trophy, idx) => (
                  <span key={idx} className="text-2xl">{trophy}</span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Wins</p>
            <p className="text-2xl font-bold text-white">{user.totalWins}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm">Championships</p>
            <p className="text-2xl font-bold text-gradient">{user.championships}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm">Win Rate</p>
            <p className="text-2xl font-bold text-green-400">{user.winRate}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Profit</p>
            <p className="text-2xl font-bold text-yellow-400">{user.totalProfit}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Bio</p>
            <p className="text-white">{user.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm">Favorite Genre</p>
              <p className="text-white font-bold">{user.favoriteGenre}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm">Biggest Win</p>
              <p className="text-white font-bold">{user.biggestWin}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm">Member Since</p>
              <p className="text-white">{user.joinDate}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm">Active Leagues</p>
              <p className="text-white">{user.leagues}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-green-400">🟢 Online</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button className="flex-1 gradient-blue text-white py-3 rounded-xl font-bold hover:opacity-90">
            Challenge to Duel
          </button>
          <button className="flex-1 glass border border-gray-600 text-white py-3 rounded-xl font-bold hover:card-glow">
            View Leagues
          </button>
        </div>
      </div>
    </div>
  )
})

export default UserProfile