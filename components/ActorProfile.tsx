'use client'

import { useState, useEffect } from 'react'
import { getPersonDetails, getPersonMovieCredits, TMDBPersonDetails, PersonMovieCredits, getImageUrl, formatCurrency, formatDate } from '../lib/tmdb'
import { navigateBack, getBackButtonLabel, hasBackNavigation } from '../lib/navigation'
import MovieDetailModal from './MovieDetailModal'

interface ActorProfileProps {
  actorId: number
  isOpen: boolean
  onClose: () => void
}

export default function ActorProfile({ actorId, isOpen, onClose }: ActorProfileProps) {
  const [actor, setActor] = useState<TMDBPersonDetails | null>(null)
  const [credits, setCredits] = useState<PersonMovieCredits | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [showMovieModal, setShowMovieModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'filmography' | 'stats'>('overview')

  useEffect(() => {
    if (isOpen && actorId) {
      loadActorData()
    }
  }, [isOpen, actorId])

  const loadActorData = async () => {
    setLoading(true)
    try {
      const [actorData, creditsData] = await Promise.all([
        getPersonDetails(actorId),
        getPersonMovieCredits(actorId)
      ])
      setActor(actorData)
      setCredits(creditsData)
    } catch (error) {
      console.error('Error loading actor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie)
    setShowMovieModal(true)
  }

  const getAge = (birthday: string | null) => {
    if (!birthday) return null
    const today = new Date()
    const birthDate = new Date(birthday)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const getRecentMovies = () => {
    if (!credits) return []
    return credits.cast
      .filter(movie => {
        const year = new Date(movie.release_date).getFullYear()
        return year >= 2020
      })
      .slice(0, 8)
  }

  const getMajorMovies = () => {
    if (!credits) return []
    return credits.cast
      .filter(movie => movie.popularity > 30 && movie.vote_count > 500)
      .slice(0, 12)
  }

  if (!isOpen) return null

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20">
          <div className="animate-spin w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-center">Loading actor profile...</p>
        </div>
      </div>
    )
  }

  if (!actor) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20">
          <p className="text-white text-center">Actor not found</p>
          <button 
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors mx-auto block"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl w-full max-w-7xl my-8 border border-amber-500/20 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-amber-500/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Back Button (when available) */}
              {hasBackNavigation() && (
                <button 
                  onClick={navigateBack}
                  className="flex items-center text-amber-400 hover:text-amber-300 transition-colors group"
                >
                  <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {getBackButtonLabel()}
                </button>
              )}
              <h1 className="text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 bg-clip-text text-transparent">
                {actor.name}
              </h1>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Actor Hero Section */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Profile Image & Basic Info */}
            <div className="space-y-6">
              <div className="aspect-[3/4] relative overflow-hidden rounded-2xl">
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/placeholder-movie.svg'}
                  alt={actor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-movie.svg'
                  }}
                />
              </div>
              
              {/* Basic Info */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 space-y-3">
                <h3 className="text-xl font-bold text-amber-300 mb-4">Basic Info</h3>
                {actor.birthday && (
                  <div>
                    <span className="text-gray-400">Age: </span>
                    <span className="text-white">{getAge(actor.birthday)} years old</span>
                  </div>
                )}
                {actor.place_of_birth && (
                  <div>
                    <span className="text-gray-400">Birthplace: </span>
                    <span className="text-white">{actor.place_of_birth}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Department: </span>
                  <span className="text-white">{actor.known_for_department}</span>
                </div>
                <div>
                  <span className="text-gray-400">TMDB Popularity: </span>
                  <span className="text-amber-300 font-bold">{actor.popularity.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Fantasy Flix Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-4 border border-amber-500/30">
                  <div className="text-2xl font-black text-amber-300">{actor.starPowerScore}/10</div>
                  <div className="text-sm text-gray-300">Star Power</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                  <div className="text-2xl font-black text-green-300">{formatCurrency(actor.boxOfficeTotal || 0)}</div>
                  <div className="text-sm text-gray-300">Est. Box Office</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/30">
                  <div className="text-2xl font-black text-blue-300">{actor.averageMovieRating?.toFixed(1)}/10</div>
                  <div className="text-sm text-gray-300">Avg Movie Rating</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-2xl font-black text-purple-300">{actor.fantasyValue}/10</div>
                  <div className="text-sm text-gray-300">Fantasy Value</div>
                </div>
              </div>

              {/* Awards Section */}
              {(actor.oscarWins || actor.oscarNominations) && (
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-6 border border-yellow-500/20">
                  <h3 className="text-xl font-bold text-yellow-300 mb-4">🏆 Awards Recognition</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-black text-yellow-300">{actor.oscarWins}</div>
                      <div className="text-sm text-gray-300">Oscar Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-black text-yellow-400">{actor.oscarNominations}</div>
                      <div className="text-sm text-gray-300">Oscar Nominations</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex space-x-4 mb-6">
                {['overview', 'filmography', 'stats'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all capitalize ${
                      activeTab === tab 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {actor.biography && (
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-amber-300 mb-4">Biography</h3>
                      <p className="text-gray-300 leading-relaxed">{actor.biography}</p>
                    </div>
                  )}
                  
                  {/* Recent Movies */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Recent Movies (2020+)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {getRecentMovies().map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => handleMovieClick(movie)}
                          className="cursor-pointer transform hover:scale-105 transition-all duration-300"
                        >
                          <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
                            <img
                              src={getImageUrl(movie.poster_path)}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-movie.svg'
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                            <div className="absolute bottom-1 left-1 right-1">
                              <p className="text-white font-bold text-xs leading-tight mb-1 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{movie.title}</p>
                              <p className="text-amber-300 text-xs font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{movie.character}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'filmography' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Major Movies</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getMajorMovies().map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleMovieClick(movie)}
                        className="cursor-pointer transform hover:scale-105 transition-all duration-300"
                      >
                        <div className="aspect-[2/3] relative overflow-hidden rounded-xl">
                          <img
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-movie.svg'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                          <div className="absolute bottom-1 left-1 right-1">
                            <p className="text-white font-bold text-xs leading-tight mb-1 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9)', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{movie.title}</p>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-amber-300 text-xs font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{movie.vote_average.toFixed(1)}</span>
                              <span className="text-blue-300 text-xs font-semibold drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{new Date(movie.release_date).getFullYear()}</span>
                            </div>
                            <p className="text-gray-300 text-xs font-medium drop-shadow-md truncate" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>{movie.character}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-amber-300 mb-4">Career Statistics</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <span className="text-gray-400">Total Movies: </span>
                          <span className="text-white font-bold">{credits?.cast.length || 0}</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-gray-400">Movies Since 2020: </span>
                          <span className="text-white font-bold">{getRecentMovies().length}</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-gray-400">Major Movies (Pop &gt; 30): </span>
                          <span className="text-white font-bold">{getMajorMovies().length}</span>
                        </div>
                      </div>
                      <div>
                        <div className="mb-4">
                          <span className="text-gray-400">Highest Rated Movie: </span>
                          <span className="text-white font-bold">
                            {credits?.cast.reduce((highest, movie) => 
                              movie.vote_average > (highest?.vote_average || 0) ? movie : highest
                            , credits.cast[0])?.vote_average.toFixed(1) || 'N/A'}/10
                          </span>
                        </div>
                        <div className="mb-4">
                          <span className="text-gray-400">Most Popular Movie: </span>
                          <span className="text-white font-bold">
                            {credits?.cast.reduce((popular, movie) => 
                              movie.popularity > (popular?.popularity || 0) ? movie : popular
                            , credits.cast[0])?.title || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={showMovieModal}
          onClose={() => {
            setShowMovieModal(false)
            setSelectedMovie(null)
          }}
        />
      )}
    </div>
  )
}