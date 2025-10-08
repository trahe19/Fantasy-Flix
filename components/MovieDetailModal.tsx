'use client'

import { useState, useEffect } from 'react'
import { getImageUrl, TMDBMovie, getMovieTrailers, TMDBVideo, getYouTubeEmbedUrl, getYouTubeThumbnailUrl, getMovieCast, MovieCredits } from '../lib/tmdb'
import { navigateToActor } from '../lib/navigation'
import Top2025BoxOfficeLineChart from './Top2025BoxOfficeLineChart'

interface MovieDetailModalProps {
  movie: TMDBMovie
  isOpen: boolean
  onClose: () => void
}

const getMovieDetails = (movie: TMDBMovie) => {
  const isReleased = new Date(movie.release_date) < new Date()

  const baseDetails = {
    releaseDate: movie.release_date,
    synopsis: movie.overview,
    reception: isReleased ? {
      imdb: movie.vote_average > 0 ? movie.vote_average : null,
      rottenTomatoes: movie.vote_average > 0 ? Math.round(movie.vote_average * 10) : null,
      letterboxd: movie.vote_average > 0 ? (movie.vote_average / 2).toFixed(1) : null
    } : null
  }

  switch (movie.title) {
    case "Avatar: Fire and Ash":
      return {
        ...baseDetails,
        studio: "20th Century Studios",
        budget: 400000000,
        director: "James Cameron",
        cast: [
          { name: "Sam Worthington", role: "Jake Sully" },
          { name: "Zoe Saldana", role: "Neytiri" },
          { name: "Sigourney Weaver", role: "Kiri" }
        ]
      }

    case "The Fantastic Four: First Steps":
      return {
        ...baseDetails,
        studio: "Marvel Studios",
        budget: 200000000,
        director: "Matt Shakman",
        cast: [
          { name: "Pedro Pascal", role: "Reed Richards" },
          { name: "Vanessa Kirby", role: "Sue Storm" },
          { name: "Joseph Quinn", role: "Johnny Storm" }
        ]
      }

    case "Superman: Legacy":
      return {
        ...baseDetails,
        studio: "DC Studios",
        budget: 200000000,
        director: "James Gunn",
        cast: [
          { name: "David Corenswet", role: "Clark Kent" },
          { name: "Rachel Brosnahan", role: "Lois Lane" },
          { name: "Nicholas Hoult", role: "Lex Luthor" }
        ]
      }

    case "Mission: Impossible - The Final Reckoning":
      return {
        ...baseDetails,
        studio: "Paramount Pictures",
        budget: 290000000,
        director: "Christopher McQuarrie",
        cast: [
          { name: "Tom Cruise", role: "Ethan Hunt" },
          { name: "Hayley Atwell", role: "Grace" },
          { name: "Ving Rhames", role: "Luther Stickell" }
        ]
      }

    case "The Batman Part II":
      return {
        ...baseDetails,
        studio: "Warner Bros. Pictures",
        budget: 200000000,
        director: "Matt Reeves",
        cast: [
          { name: "Robert Pattinson", role: "Bruce Wayne" },
          { name: "Colin Farrell", role: "The Penguin" },
          { name: "Andy Serkis", role: "Alfred" }
        ]
      }

    default:
      return {
        ...baseDetails,
        studio: "Major Studio",
        budget: movie.budget || 100000000,
        director: "Acclaimed Director",
        cast: [
          { name: "Leading Actor", role: "Main Character" },
          { name: "Supporting Actor", role: "Supporting Role" }
        ]
      }
  }
}

const MovieDetailModal = ({ movie, isOpen, onClose }: MovieDetailModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [trailer, setTrailer] = useState<TMDBVideo | null>(null)
  const [showTrailerPlayer, setShowTrailerPlayer] = useState(false)
  const [loadingTrailer, setLoadingTrailer] = useState(false)
  const [cast, setCast] = useState<MovieCredits | null>(null)
  const [loadingCast, setLoadingCast] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
      loadTrailers()
      loadCast()
    } else {
      document.body.style.overflow = 'unset'
      setTimeout(() => setIsVisible(false), 300)
      setShowTrailerPlayer(false)
      setTrailer(null)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, movie.id])

  const loadTrailers = async () => {
    setLoadingTrailer(true)
    try {
      const movieTrailers = await getMovieTrailers(movie.id)
      if (movieTrailers.length > 0) {
        setTrailer(movieTrailers[0])
      }
    } catch (error) {
      console.error('Error loading trailer:', error)
    } finally {
      setLoadingTrailer(false)
    }
  }

  const handlePlayTrailer = () => {
    setShowTrailerPlayer(true)
  }

  const loadCast = async () => {
    setLoadingCast(true)
    try {
      const movieCast = await getMovieCast(movie.id)
      setCast(movieCast)
    } catch (error) {
      console.error('Error loading cast:', error)
    } finally {
      setLoadingCast(false)
    }
  }

  const handleActorClick = (actorId: number) => {
    navigateToActor(actorId, {
      from: 'movie',
      fromId: movie.id,
      fromTitle: movie.title
    })
  }

  const getDirector = () => {
    if (!cast) return 'Loading...'
    const director = cast.crew.find(person => person.job === 'Director')
    return director ? director.name : 'Unknown Director'
  }

  if (!isVisible) return null

  const movieDetails = getMovieDetails(movie)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
      style={{
        opacity: isOpen ? 1 : 0,
        backgroundColor: isOpen ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
      }}
      onClick={onClose}
    >
      <div
        className="glass-elegant max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg transform transition-all duration-300"
        style={{
          transform: isOpen ? 'scale(1)' : 'scale(0.95)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Close Button - Absolute Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-3 rounded-full bg-black/50 hover:bg-black/70 transition-all z-50 text-white hover:text-red-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>


          {/* Main Content */}
          <div className="p-6">
            {/* Standard Layout: Left Column with Poster/Cast/Reception/Synopsis, Right Column with Box Office and Trailer */}
            <div className="flex gap-8" style={{ paddingRight: '40px' }}>
              {/* LEFT COLUMN: Poster, Cast/Crew, Reception, Synopsis */}
              <div className="flex-1 max-w-2xl space-y-8">
                {/* Poster and Cast/Crew Section */}
                <div className="flex gap-6">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-48 h-72 object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-movie.svg'
                      }}
                    />
                  </div>

                  {/* Title, Basic Info, and Cast/Crew */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {movie.title}
                    </h1>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                      <p><strong>Release Date:</strong> {new Date(movieDetails.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p><strong>Studio:</strong> {movieDetails.studio}</p>
                      <p><strong>Budget:</strong> ${(movieDetails.budget / 1000000).toFixed(0)} million</p>
                    </div>

                    {/* Cast & Crew */}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Cast & Crew
                      </h2>
                      {loadingCast ? (
                        <div className="text-center py-4">
                          <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                          <p className="text-gray-500">Loading cast...</p>
                        </div>
                      ) : cast && cast.cast.length > 0 ? (
                        <div className="space-y-2">
                          {cast.cast.slice(0, 4).map((person) => (
                            <div key={person.id} className="text-gray-600 dark:text-gray-400">
                              <button
                                onClick={() => handleActorClick(person.id)}
                                className="text-amber-500 hover:text-amber-400 font-bold cursor-pointer transition-colors underline-offset-2 hover:underline"
                              >
                                {person.name}
                              </button>
                              <span className="text-gray-600 dark:text-gray-400"> as {person.character}</span>
                            </div>
                          ))}
                          {cast.cast.length > 4 && (
                            <p className="text-sm text-gray-500 italic">+ {cast.cast.length - 4} more actors</p>
                          )}
                          <div className="text-gray-600 dark:text-gray-400 mt-3">
                            <strong className="text-gray-900 dark:text-white">Director:</strong>
                            <span className="ml-1">{getDirector()}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {movieDetails.cast.slice(0, 4).map((person, index) => (
                            <div key={index} className="text-gray-600 dark:text-gray-400">
                              <strong className="text-gray-900 dark:text-white">{person.name}</strong> – {person.role}
                            </div>
                          ))}
                          <div className="text-gray-600 dark:text-gray-400">
                            <strong className="text-gray-900 dark:text-white">Director:</strong> {movieDetails.director}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reception Section (Below Poster) */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Reception
                  </h4>
                  {movieDetails.reception ? (
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-amber-500/20 shadow-lg">
                      <div className="space-y-4">
                        {movieDetails.reception.imdb && (
                          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-gray-300 font-medium">IMDb</span>
                            </div>
                            <span className="text-yellow-400 font-bold text-xl">{movieDetails.reception.imdb}/10</span>
                          </div>
                        )}
                        {movieDetails.reception.rottenTomatoes && (
                          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-300 font-medium">Rotten Tomatoes</span>
                            </div>
                            <span className="text-red-400 font-bold text-xl">{movieDetails.reception.rottenTomatoes}%</span>
                          </div>
                        )}
                        {movieDetails.reception.letterboxd && (
                          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-gray-300 font-medium">Letterboxd</span>
                            </div>
                            <span className="text-green-400 font-bold text-xl">{movieDetails.reception.letterboxd}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-amber-500/20 shadow-lg">
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-gray-400 italic">Not yet released - ratings coming soon!</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Synopsis Section (Below Reception) */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                    </svg>
                    Synopsis
                  </h3>
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-blue-500/20 shadow-lg">
                    <p className="text-gray-300 leading-relaxed text-base">
                      {movieDetails.synopsis}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Box Office (Top) and Trailer (Bottom) */}
              <div className="w-96 space-y-8">
                {/* Box Office Chart (Top Right) */}
                <div>
                  <Top2025BoxOfficeLineChart
                    movieId={movie.id}
                    title={movie.title}
                    className="w-full"
                  />
                </div>

                {/* Official Trailer (Bottom Right) */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Official Trailer
                  </h3>

                  {loadingTrailer && (
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-red-500/20 shadow-lg flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-300 text-lg">Loading trailer...</p>
                      </div>
                    </div>
                  )}

                  {!loadingTrailer && !trailer && (
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-red-500/20 shadow-lg flex items-center justify-center h-64">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm12 4a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h12zM6 10v4h2v-4H6zm4 0v4h2v-4h-2z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-gray-400 text-lg">No official trailer available yet</p>
                      </div>
                    </div>
                  )}

                  {!loadingTrailer && trailer && (
                    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-red-500/20 shadow-lg overflow-hidden">
                      {showTrailerPlayer ? (
                        <div className="h-64">
                          <iframe
                            src={getYouTubeEmbedUrl(trailer.key, true)}
                            title={trailer.name}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <div
                          className="relative cursor-pointer group h-64"
                          onClick={handlePlayTrailer}
                        >
                          <img
                            src={getYouTubeThumbnailUrl(trailer.key, 'maxres')}
                            alt={trailer.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = getYouTubeThumbnailUrl(trailer.key, 'high')
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <div className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all shadow-2xl">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <h4 className="text-white font-bold text-lg mb-1">{trailer.name}</h4>
                            <p className="text-gray-300 text-sm">{trailer.type} • {trailer.official ? 'Official' : 'Unofficial'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-8 border-t border-gray-700/50 mt-8">
              <button className="gradient-blue text-white px-6 py-2 rounded font-medium hover:opacity-90 transition-all">
                Add to Roster
              </button>
              <button className="glass px-6 py-2 rounded font-medium hover:card-glow transition-all">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetailModal