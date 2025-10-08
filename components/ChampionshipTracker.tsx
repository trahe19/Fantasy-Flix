'use client'

import { useState, useEffect } from 'react'
import { 
  ChampionshipData, 
  OscarNomination, 
  OscarWin, 
  PlayerStanding, 
  Movie, 
  LeaguePlayer 
} from '../lib/fantasy-league-types'
import { formatScore, getScoreColorClass } from '../lib/scoring-engine'

interface ChampionshipTrackerProps {
  championshipData?: ChampionshipData
  leagueId: string
  players: LeaguePlayer[]
  oscarCeremonyDate: string
  scoringRules: {
    oscarNominationPoints: number
    oscarWinPoints: number
  }
  onUpdateOscarData?: (nominations: OscarNomination[], wins: OscarWin[]) => void
  isCommissioner?: boolean
}

const ChampionshipTracker = ({ 
  championshipData, 
  leagueId, 
  players, 
  oscarCeremonyDate,
  scoringRules,
  onUpdateOscarData = () => {},
  isCommissioner = false 
}: ChampionshipTrackerProps) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'nominations' | 'wins' | 'movies'>('standings')
  const [showAddNomModal, setShowAddNomModal] = useState(false)
  const [showAddWinModal, setShowAddWinModal] = useState(false)
  const [nominations, setNominations] = useState<OscarNomination[]>(championshipData?.oscarNominations || [])
  const [wins, setWins] = useState<OscarWin[]>(championshipData?.oscarWins || [])
  
  // Mock movie data for championship tracking
  const championshipMovies: Movie[] = [
    {
      id: 'oppenheimer-2024',
      tmdbId: 872585,
      title: 'Oppenheimer',
      releaseDate: '2023-07-21',
      productionBudget: 100,
      isManualBudget: false,
      imdbRating: 8.4,
      boxOfficeData: [],
      genres: ['Drama', 'Biography', 'History'],
      posterUrl: '/placeholder-movie.svg',
      runtime: 180,
      director: 'Christopher Nolan'
    },
    {
      id: 'barbie-2023',
      tmdbId: 346698,
      title: 'Barbie',
      releaseDate: '2023-07-21',
      productionBudget: 145,
      isManualBudget: false,
      imdbRating: 7.0,
      boxOfficeData: [],
      genres: ['Comedy', 'Adventure', 'Fantasy'],
      posterUrl: '/placeholder-movie.svg',
      runtime: 114,
      director: 'Greta Gerwig'
    }
  ]

  const oscarCategories = [
    'Best Picture',
    'Best Director',
    'Best Actor',
    'Best Actress',
    'Best Supporting Actor',
    'Best Supporting Actress',
    'Best Original Screenplay',
    'Best Adapted Screenplay',
    'Best Cinematography',
    'Best Film Editing',
    'Best Production Design',
    'Best Costume Design',
    'Best Makeup and Hairstyling',
    'Best Visual Effects',
    'Best Sound',
    'Best Original Score',
    'Best Original Song',
    'Best Documentary Feature',
    'Best International Feature Film',
    'Best Animated Feature',
    'Best Animated Short',
    'Best Live Action Short',
    'Best Documentary Short'
  ]

  // Calculate championship standings with Oscar points
  const calculateChampionshipStandings = (): PlayerStanding[] => {
    return players.map(player => {
      // Base score from periods (mock data)
      const baseScore = Math.floor(Math.random() * 800) + 400
      
      // Calculate Oscar points from player's movies
      let oscarPoints = 0
      
      // Mock: assign random movies to players and calculate Oscar points
      const playerMovies = championshipMovies.slice(0, Math.floor(Math.random() * 2) + 1)
      playerMovies.forEach(movie => {
        const movieNominations = nominations.filter(nom => nom.movieId === movie.id)
        const movieWins = wins.filter(win => win.movieId === movie.id)
        
        oscarPoints += movieNominations.length * scoringRules.oscarNominationPoints
        oscarPoints += movieWins.length * scoringRules.oscarWinPoints
      })
      
      const totalScore = baseScore + oscarPoints
      
      return {
        userId: player.userId,
        username: player.username,
        displayName: player.displayName,
        rank: 0,
        score: totalScore,
        oscarPoints,
        baseScore
      }
    })
    .sort((a, b) => b.score - a.score)
    .map((standing, idx) => ({ ...standing, rank: idx + 1 }))
  }

  const championshipStandings = calculateChampionshipStandings()
  const daysToOscars = Math.ceil((new Date(oscarCeremonyDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isOscarsPassed = daysToOscars < 0

  const addNomination = (movieId: string, category: string) => {
    const newNomination: OscarNomination = {
      movieId,
      category,
      year: new Date().getFullYear(),
      isWin: false
    }
    const updatedNominations = [...nominations, newNomination]
    setNominations(updatedNominations)
    onUpdateOscarData(updatedNominations, wins)
    setShowAddNomModal(false)
  }

  const addWin = (movieId: string, category: string) => {
    const newWin: OscarWin = {
      movieId,
      category,
      year: new Date().getFullYear()
    }
    const updatedWins = [...wins, newWin]
    setWins(updatedWins)
    
    // Also add as nomination if not already nominated
    const isNominated = nominations.some(nom => nom.movieId === movieId && nom.category === category)
    let updatedNominations = nominations
    if (!isNominated) {
      updatedNominations = [...nominations, {
        movieId,
        category,
        year: new Date().getFullYear(),
        isWin: true
      }]
      setNominations(updatedNominations)
    }
    
    onUpdateOscarData(updatedNominations, updatedWins)
    setShowAddWinModal(false)
  }

  const tabs = [
    { key: 'standings', label: '🏆 Championship Standings', icon: '🏆' },
    { key: 'nominations', label: '🎭 Oscar Nominations', icon: '🎭', count: nominations.length },
    { key: 'wins', label: '🥇 Oscar Wins', icon: '🥇', count: wins.length },
    { key: 'movies', label: '🎬 Eligible Movies', icon: '🎬', count: championshipMovies.length }
  ]

  return (
    <div className="px-4 py-6 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gold-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      </div>

      {/* Header */}
      <div className="glass-dark rounded-2xl p-6 mb-6 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gradient mb-2">🏆 Championship Arena</h1>
            <p className="text-gray-300">Where legends are made and Oscars decide the fate</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold mb-1 ${isOscarsPassed ? 'text-green-400' : 'text-yellow-400'}`}>
              {isOscarsPassed ? '🎉 Oscars Complete!' : `🎭 ${Math.abs(daysToOscars)} days to Oscars`}
            </div>
            <p className="text-sm text-gray-400">
              {new Date(oscarCeremonyDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Championship Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6 relative z-10">
        <div className="glass-dark rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-gradient">{championshipStandings.length}</div>
          <div className="text-sm text-gray-400">Championship Players</div>
        </div>
        <div className="glass-dark rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-blue-400">{nominations.length}</div>
          <div className="text-sm text-gray-400">Total Nominations</div>
        </div>
        <div className="glass-dark rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-yellow-400">{wins.length}</div>
          <div className="text-sm text-gray-400">Total Wins</div>
        </div>
        <div className="glass-dark rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-green-400">
            {championshipStandings.reduce((sum, standing) => sum + (standing.score || 0), 0)}
          </div>
          <div className="text-sm text-gray-400">Total Oscar Points</div>
        </div>
      </div>

      {/* Commissioner Controls */}
      {isCommissioner && (
        <div className="glass-dark rounded-2xl p-6 mb-6 relative z-10">
          <h3 className="text-xl font-bold text-gradient mb-4">🎛️ Oscar Management</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddNomModal(true)}
              className="px-4 py-2 gradient-blue text-white font-medium rounded-xl hover:scale-105 transform transition-all"
            >
              🎭 Add Nomination
            </button>
            <button
              onClick={() => setShowAddWinModal(true)}
              className="px-4 py-2 gradient-gold text-black font-bold rounded-xl hover:scale-105 transform transition-all"
            >
              🏆 Add Win
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="glass-dark rounded-2xl p-2 mb-6 relative z-10">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-shrink-0 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'gradient-gold text-black shadow-lg'
                  : 'glass hover:scale-105 transform text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="glass-dark rounded-2xl p-8 relative z-10">
        {activeTab === 'standings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">🏆 Championship Leaderboard</h2>
            
            <div className="space-y-4">
              {championshipStandings.map((standing, idx) => (
                <div key={standing.userId} className="relative">
                  {/* Winner Effects */}
                  {idx === 0 && isOscarsPassed && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-gold-400 rounded-2xl blur opacity-75 animate-pulse"></div>
                  )}
                  
                  <div className={`relative flex items-center justify-between p-6 rounded-xl transition-all ${
                    idx === 0 && isOscarsPassed
                      ? 'bg-gradient-to-r from-yellow-500 to-gold-500 text-black'
                      : idx === 0 
                      ? 'gradient-gold text-black'
                      : idx < 3 
                      ? 'gradient-blue text-white'
                      : 'glass hover:card-glow'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <span className={`text-3xl font-black ${
                          idx === 0 && isOscarsPassed ? 'text-white drop-shadow-lg' :
                          idx === 0 ? 'text-black' :
                          idx < 3 ? 'text-white' : 'text-gradient'
                        }`}>
                          #{standing.rank}
                        </span>
                        {idx === 0 && isOscarsPassed && (
                          <div className="text-2xl animate-bounce">👑</div>
                        )}
                        {idx < 3 && !isOscarsPassed && (
                          <div className="text-sm">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-black text-xl">{standing.displayName}</h3>
                        <p className={`text-sm ${
                          idx === 0 && isOscarsPassed ? 'text-black opacity-80' :
                          idx === 0 ? 'text-black opacity-80' :
                          idx < 3 ? 'text-white opacity-80' : 'text-gray-400'
                        }`}>
                          @{standing.username}
                        </p>
                        {idx === 0 && isOscarsPassed && (
                          <p className="text-black font-bold animate-pulse">🎉 CHAMPION!</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className={`font-black text-2xl ${
                        idx === 0 && isOscarsPassed ? 'text-white drop-shadow-lg' :
                        idx === 0 ? 'text-black' :
                        idx < 3 ? 'text-white' : getScoreColorClass(standing.score)
                      }`}>
                        {formatScore(standing.score)}
                      </p>
                      <div className={`flex space-x-3 text-sm ${
                        idx === 0 && isOscarsPassed ? 'text-black opacity-80' :
                        idx === 0 ? 'text-black opacity-80' :
                        idx < 3 ? 'text-white opacity-80' : 'text-gray-400'
                      }`}>
                        <span>Total Score: {formatScore(standing.score || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!isOscarsPassed && (
              <div className="mt-8 p-6 bg-yellow-500 bg-opacity-20 rounded-xl text-center">
                <h3 className="text-yellow-300 font-bold mb-2">⏰ Championship in Progress</h3>
                <p className="text-yellow-200">
                  Final standings will be determined after the Oscar ceremony on{' '}
                  {new Date(oscarCeremonyDate).toLocaleDateString()}. 
                  Oscar nominations and wins will add crucial points!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nominations' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">🎭 Oscar Nominations</h2>
            
            {nominations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">No Nominations Yet</h3>
                <p className="text-gray-500">
                  {isCommissioner ? 'Add nominations as they are announced!' : 'Nominations will appear here once announced.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {oscarCategories.filter(category => 
                  nominations.some(nom => nom.category === category)
                ).map(category => {
                  const categoryNominations = nominations.filter(nom => nom.category === category)
                  return (
                    <div key={category} className="p-6 glass rounded-xl">
                      <h3 className="text-xl font-bold text-white mb-4">{category}</h3>
                      <div className="space-y-2">
                        {categoryNominations.map((nomination, idx) => {
                          const movie = championshipMovies.find(m => m.id === nomination.movieId)
                          const isWinner = wins.some(win => 
                            win.movieId === nomination.movieId && win.category === nomination.category
                          )
                          
                          return (
                            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${
                              isWinner ? 'bg-yellow-500 bg-opacity-20 border border-yellow-400' : 'bg-gray-700 bg-opacity-50'
                            }`}>
                              <div className="flex items-center space-x-3">
                                {isWinner && <span className="text-yellow-400 text-xl">🏆</span>}
                                <span className="text-white font-medium">
                                  {movie?.title || nomination.movieId}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  isWinner ? 'bg-yellow-400 text-black' : 'bg-blue-500 text-white'
                                }`}>
                                  {isWinner ? 'WINNER' : 'NOMINATED'}
                                </span>
                                <p className="text-xs text-gray-400 mt-1">
                                  +{isWinner ? scoringRules.oscarWinPoints : scoringRules.oscarNominationPoints} pts
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wins' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">🥇 Oscar Winners</h2>
            
            {wins.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">No Winners Yet</h3>
                <p className="text-gray-500">
                  {isCommissioner ? 'Add wins as they are announced during the ceremony!' : 'Winners will appear here during the Oscar ceremony.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {wins.map((win, idx) => {
                  const movie = championshipMovies.find(m => m.id === win.movieId)
                  return (
                    <div key={idx} className="p-6 gradient-gold rounded-xl text-black">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">🏆</span>
                          <div>
                            <h3 className="text-xl font-black">{movie?.title || win.movieId}</h3>
                            <p className="font-bold">{win.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black">+{scoringRules.oscarWinPoints}</div>
                          <div className="text-sm font-medium">Oscar Points</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'movies' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gradient mb-6">🎬 Championship Movies</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {championshipMovies.map(movie => {
                const movieNominations = nominations.filter(nom => nom.movieId === movie.id)
                const movieWins = wins.filter(win => win.movieId === movie.id)
                const totalOscarPoints = (movieNominations.length * scoringRules.oscarNominationPoints) + 
                                       (movieWins.length * scoringRules.oscarWinPoints)
                
                return (
                  <div key={movie.id} className="glass rounded-xl p-5 hover:card-glow transition-all">
                    <div className="aspect-[2/3] relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={movie.posterUrl || '/placeholder-movie.svg'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      {movieWins.length > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                            {movieWins.length} WINS 🏆
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-white text-lg mb-2">{movie.title}</h3>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">IMDB:</span>
                        <span className="text-yellow-400">⭐ {movie.imdbRating?.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nominations:</span>
                        <span className="text-blue-400">{movieNominations.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wins:</span>
                        <span className="text-yellow-400">{movieWins.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Oscar Points:</span>
                        <span className="text-green-400 font-bold">+{totalOscarPoints}</span>
                      </div>
                    </div>
                    
                    {movieNominations.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-gray-400 text-xs font-medium">Categories:</p>
                        {movieNominations.slice(0, 3).map((nomination, idx) => (
                          <div key={idx} className="text-xs text-blue-300">
                            • {nomination.category}
                          </div>
                        ))}
                        {movieNominations.length > 3 && (
                          <div className="text-xs text-gray-500">
                            ...and {movieNominations.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Nomination Modal */}
      {showAddNomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gradient mb-4">🎭 Add Oscar Nomination</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Movie</label>
                <select className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white">
                  {championshipMovies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Category</label>
                <select className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white">
                  {oscarCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddNomModal(false)}
                className="flex-1 py-3 glass rounded-xl text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => addNomination(championshipMovies[0].id, oscarCategories[0])}
                className="flex-1 py-3 gradient-blue text-white font-bold rounded-xl"
              >
                Add Nomination
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Win Modal */}
      {showAddWinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-dark rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gradient mb-4">🏆 Add Oscar Win</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Movie</label>
                <select className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white">
                  {championshipMovies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Category</label>
                <select className="w-full p-3 bg-black bg-opacity-50 border border-gray-600 rounded-xl text-white">
                  {oscarCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAddWinModal(false)}
                className="flex-1 py-3 glass rounded-xl text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => addWin(championshipMovies[0].id, oscarCategories[0])}
                className="flex-1 py-3 gradient-gold text-black font-bold rounded-xl"
              >
                Add Win 🏆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChampionshipTracker