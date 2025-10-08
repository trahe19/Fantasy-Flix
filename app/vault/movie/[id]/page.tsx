'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UpcomingMovie } from '../../../../lib/upcoming-movies'
import { getImageUrl, getYouTubeEmbedUrl } from '../../../../lib/tmdb'

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [movie, setMovie] = useState<UpcomingMovie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [watchlisted, setWatchlisted] = useState(false)
  const [targetedForDraft, setTargetedForDraft] = useState(false)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        // In a real app, this would fetch from your API
        // For now, we'll simulate the data structure
        const mockMovie: UpcomingMovie = {
          id: parseInt(params.id as string),
          title: "Avatar: Fire and Ash",
          overview: "The third installment in James Cameron's groundbreaking Avatar saga takes Jake Sully and Neytiri to uncharted territories of Pandora. As the Sully family faces a devastating new threat from the Ash People—a violent Na'vi tribe led by the ruthless Varang—they must unite with old allies and forge new alliances to protect their way of life.",
          release_date: "2025-12-19",
          poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
          backdrop_path: "/198vrF8k7mfQ4FjDJsBmdQcaiyq.jpg",
          genre_ids: [878, 12, 28],
          vote_average: 0,
          vote_count: 0,
          popularity: 4500.0,

          detailed_overview: "The third installment in James Cameron's groundbreaking Avatar saga takes Jake Sully and Neytiri to uncharted territories of Pandora. As the Sully family faces a devastating new threat from the Ash People—a violent Na'vi tribe led by the ruthless Varang—they must unite with old allies and forge new alliances to protect their way of life. Set against the breathtaking backdrop of Pandora's volcanic ash lands, this epic adventure explores themes of family, survival, and the eternal struggle between harmony and conquest.",
          production_budget: 460000000,
          estimated_budget: 460000000,
          studio: "20th Century Studios",
          director: "James Cameron",
          main_cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Kate Winslet", "Cliff Curtis"],
          trailer_key: "d9MyW72ELq0", // Avatar: The Way of Water trailer

          draft_potential: {
            overall_score: 95,
            opening_weekend_potential: 180000000,
            total_box_office_potential: 2000000000,
            profit_potential: 1540000000,
            genre_multiplier: 1.1,
            star_power_rating: 8,
            director_rating: 10,
            studio_confidence: 10,
            release_date_advantage: 8,
            marketing_budget_estimate: 230000000
          },

          competition_analysis: {
            release_month: "December",
            competing_movies: ["Star Wars Episode X", "Fast & Furious 11"],
            market_saturation: "High",
            genre_saturation: "Medium",
            advantage_level: "Good",
            notes: "Holiday release window provides strong box office potential despite competition"
          },

          risk_factors: [
            {
              type: "Budget",
              level: "High",
              description: "Massive $460M production budget requires unprecedented success",
              impact_on_box_office: "Needs $1.2B+ worldwide to be profitable"
            },
            {
              type: "Competition",
              level: "Medium",
              description: "Crowded December release schedule with multiple blockbusters",
              impact_on_box_office: "May limit opening weekend ceiling"
            }
          ],

          oscar_predictions: {
            overall_potential: 75,
            categories: ["Best Visual Effects", "Best Cinematography", "Best Production Design", "Best Sound"],
            release_timing_score: 9,
            genre_advantage: false,
            director_pedigree: true,
            cast_pedigree: false,
            predicted_nominations: 4,
            best_picture_odds: 25
          },

          opening_weekend_projection: 180000000,
          domestic_total_projection: 700000000,
          worldwide_projection: 2000000000,
          profit_projection: 1540000000,
          fantasy_score: 199,
          recommended_draft_round: 1,
          last_updated: new Date().toISOString()
        }

        setMovie(mockMovie)
      } catch (err) {
        setError('Failed to load movie details')
        console.error('Error fetching movie:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [params.id])

  const handleAddToWatchlist = () => {
    setWatchlisted(!watchlisted)
    // In a real app, this would make an API call
  }

  const handleTargetForDraft = () => {
    setTargetedForDraft(!targetedForDraft)
    // In a real app, this would make an API call
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
          <p className="text-gray-400 mb-8">{error || 'This movie could not be found in The Vault.'}</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:from-amber-400 hover:to-yellow-400 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop Image */}
        <div
          className="h-96 lg:h-[500px] bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 z-20 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-black/90 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Vault
          </button>

          {/* Trailer Button */}
          {movie.trailer_key && (
            <button
              onClick={() => setShowTrailer(true)}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full text-white font-bold text-xl flex items-center gap-3 transition-all hover:scale-105"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Trailer
            </button>
          )}
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-48 lg:w-64 rounded-xl shadow-2xl"
                />
              </div>

              {/* Movie Details */}
              <div className="flex-1">
                <h1 className="text-4xl lg:text-6xl font-black text-white mb-4">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap gap-4 mb-6 text-lg">
                  <span className="text-amber-400 font-bold">
                    {formatDate(movie.release_date)}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{movie.studio}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">Directed by {movie.director}</span>
                </div>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
                  {movie.detailed_overview || movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleAddToWatchlist}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                      watchlisted
                        ? 'bg-amber-500 text-black hover:bg-amber-400'
                        : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600'
                    }`}
                  >
                    {watchlisted ? '✓ On Watchlist' : '+ Add to Watchlist'}
                  </button>

                  <button
                    onClick={handleTargetForDraft}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                      targetedForDraft
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400'
                    }`}
                  >
                    {targetedForDraft ? '🎯 Targeted for Draft' : '🎯 Target for Draft'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Draft Potential Analysis */}
          <div className="lg:col-span-2 space-y-8">
            {/* Draft Potential */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/20">
              <h2 className="text-3xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                <span className="text-4xl">📊</span>
                Draft Potential Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-black/40 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Overall Score</h3>
                  <div className="flex items-center gap-4">
                    <div className={`text-6xl font-black ${getScoreColor(movie.draft_potential!.overall_score)}`}>
                      {movie.draft_potential!.overall_score}
                    </div>
                    <div className="text-gray-400">
                      <div>out of 100</div>
                      <div className="text-sm">
                        Round {movie.recommended_draft_round} pick
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Fantasy Score</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-6xl font-black text-amber-400">
                      {movie.fantasy_score}
                    </div>
                    <div className="text-gray-400">
                      <div>projected pts</div>
                      <div className="text-sm">
                        Elite tier
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Star Power</div>
                  <div className="text-2xl font-bold text-white">{movie.draft_potential!.star_power_rating}/10</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Director Rating</div>
                  <div className="text-2xl font-bold text-white">{movie.draft_potential!.director_rating}/10</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Studio Confidence</div>
                  <div className="text-2xl font-bold text-white">{movie.draft_potential!.studio_confidence}/10</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Release Advantage</div>
                  <div className="text-2xl font-bold text-white">{movie.draft_potential!.release_date_advantage}/10</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Genre Multiplier</div>
                  <div className="text-2xl font-bold text-green-400">{movie.draft_potential!.genre_multiplier}x</div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Marketing Budget</div>
                  <div className="text-lg font-bold text-white">{formatCurrency(movie.draft_potential!.marketing_budget_estimate)}</div>
                </div>
              </div>
            </div>

            {/* Box Office Projections */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20">
              <h2 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-3">
                <span className="text-4xl">💰</span>
                Box Office Projections
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-black/40 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Opening Weekend</h3>
                    <div className="text-3xl font-black text-green-400">
                      {formatCurrency(movie.opening_weekend_projection!)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Domestic projection</div>
                  </div>

                  <div className="bg-black/40 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Domestic Total</h3>
                    <div className="text-3xl font-black text-green-400">
                      {formatCurrency(movie.domestic_total_projection!)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">US & Canada total</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-black/40 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Worldwide Total</h3>
                    <div className="text-3xl font-black text-green-400">
                      {formatCurrency(movie.worldwide_projection!)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Global projection</div>
                  </div>

                  <div className="bg-black/40 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-2">Projected Profit</h3>
                    <div className="text-3xl font-black text-amber-400">
                      {formatCurrency(movie.profit_projection!)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">After production costs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competition Analysis */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
              <h2 className="text-3xl font-bold text-purple-400 mb-6 flex items-center gap-3">
                <span className="text-4xl">⚔️</span>
                Competition Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Release Window</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Month:</span>
                      <span className="text-white font-bold">{movie.competition_analysis!.release_month}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Market Saturation:</span>
                      <span className={`font-bold ${
                        movie.competition_analysis!.market_saturation === 'High' ? 'text-red-400' :
                        movie.competition_analysis!.market_saturation === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {movie.competition_analysis!.market_saturation}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Advantage Level:</span>
                      <span className={`font-bold ${
                        movie.competition_analysis!.advantage_level === 'Excellent' ? 'text-green-400' :
                        movie.competition_analysis!.advantage_level === 'Good' ? 'text-blue-400' :
                        movie.competition_analysis!.advantage_level === 'Fair' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {movie.competition_analysis!.advantage_level}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Analysis Notes</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {movie.competition_analysis!.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20">
              <h2 className="text-3xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <span className="text-4xl">⚠️</span>
                Risk Factors
              </h2>

              <div className="space-y-4">
                {movie.risk_factors!.map((risk, index) => (
                  <div key={index} className="bg-black/40 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{risk.type} Risk</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskLevelColor(risk.level)}`}>
                        {risk.level}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{risk.description}</p>
                    <div className="text-sm text-gray-400">
                      <strong>Impact:</strong> {risk.impact_on_box_office}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Oscar Potential & Cast */}
          <div className="space-y-8">
            {/* Oscar Potential */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                Oscar Potential
              </h2>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-black text-yellow-400 mb-2">
                    {movie.oscar_predictions!.overall_potential}%
                  </div>
                  <div className="text-gray-400">Overall Potential</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Predicted Nominations:</span>
                    <span className="text-white font-bold">{movie.oscar_predictions!.predicted_nominations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Best Picture Odds:</span>
                    <span className="text-yellow-400 font-bold">{movie.oscar_predictions!.best_picture_odds}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Release Timing:</span>
                    <span className="text-white font-bold">{movie.oscar_predictions!.release_timing_score}/10</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-3">Likely Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.oscar_predictions!.categories.map((category, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm rounded-full">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cast & Crew */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                <span className="text-3xl">🎭</span>
                Cast & Crew
              </h2>

              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-bold mb-3">Director</h4>
                  <div className="text-gray-300">{movie.director}</div>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-3">Main Cast</h4>
                  <div className="space-y-2">
                    {movie.main_cast!.map((actor, index) => (
                      <div key={index} className="text-gray-300">{actor}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-3">Production Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Studio:</span>
                      <span className="text-white">{movie.studio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span className="text-green-400 font-bold">
                        {formatCurrency(movie.estimated_budget || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release Date:</span>
                      <span className="text-white">{formatDate(movie.release_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-500/20">
              <h2 className="text-2xl font-bold text-gray-300 mb-6">Quick Stats</h2>

              <div className="space-y-4">
                <div className="bg-black/40 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Days Until Release</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.ceil((new Date(movie.release_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                </div>

                <div className="bg-black/40 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">TMDB Popularity</div>
                  <div className="text-2xl font-bold text-amber-400">
                    {movie.popularity.toFixed(0)}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Last updated: {new Date(movie.last_updated!).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailer_key && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-4xl relative">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-4">{movie.title} - Trailer</h3>

            <div className="aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(movie.trailer_key, true)}
                className="w-full h-full rounded-xl"
                allowFullScreen
                title={`${movie.title} Trailer`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}