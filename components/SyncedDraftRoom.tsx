'use client'

import { useState, useEffect } from 'react'
import { getDraftEligibleMovies, DraftMovie } from '../lib/draft-movies'
import { draftMovie, getDraftSummary } from '../lib/drafted-movies'
import FantasyDraftRoom from './FantasyDraftRoom'

interface SyncedDraftRoomProps {
  leagueId?: string
  currentUser: { id: string; username: string }
}

// Convert DraftMovie to the Movie interface expected by FantasyDraftRoom
function convertDraftMovie(draftMovie: DraftMovie): any {
  return {
    id: draftMovie.id,
    title: draftMovie.title,
    overview: draftMovie.overview,
    releaseDate: draftMovie.release_date,
    posterPath: draftMovie.poster_path,
    backdropPath: draftMovie.backdrop_path,
    genres: draftMovie.genre_ids,
    voteAverage: draftMovie.vote_average,
    popularity: draftMovie.popularity,
    budget: draftMovie.estimated_budget,
    domesticProjection: draftMovie.domestic_projection,
    worldwideProjection: draftMovie.worldwide_projection,
    profitProjection: draftMovie.profit_projection,
    openingWeekendProjection: draftMovie.opening_weekend_projection,
    mainCast: draftMovie.main_cast,
    director: draftMovie.director,
    draftRank: draftMovie.draftRank,
    projectionConfidence: draftMovie.projection_confidence,
    riskAssessment: draftMovie.risk_assessment,
    oscarPotential: draftMovie.oscar_potential,
    franchiseStrength: draftMovie.franchise_strength,
    scoutingReport: draftMovie.scouting_report
  }
}

const SyncedDraftRoom = ({ leagueId = 'sample-league', currentUser }: SyncedDraftRoomProps) => {
  const [availableMovies, setAvailableMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Mock league members
  const leagueMembers = [
    { 
      userId: 'user-1', 
      username: 'You', 
      displayName: 'You',
      joinDate: new Date().toISOString(),
      role: 'commissioner' as const,
      period1Score: 0,
      period2Score: 0,
      totalScore: 0,
      rankCurrentPeriod: 1,
      rankOverall: 1,
      isChampionshipEligible: true
    },
    { 
      userId: 'user-2', 
      username: 'MovieMaster', 
      displayName: 'MovieMaster',
      joinDate: new Date().toISOString(),
      role: 'player' as const,
      period1Score: 0,
      period2Score: 0,
      totalScore: 0,
      rankCurrentPeriod: 2,
      rankOverall: 2,
      isChampionshipEligible: true
    },
    { 
      userId: 'user-3', 
      username: 'BlockbusterBuff', 
      displayName: 'BlockbusterBuff',
      joinDate: new Date().toISOString(),
      role: 'player' as const,
      period1Score: 0,
      period2Score: 0,
      totalScore: 0,
      rankCurrentPeriod: 3,
      rankOverall: 3,
      isChampionshipEligible: true
    },
    { 
      userId: 'user-4', 
      username: 'FilmFanatic', 
      displayName: 'FilmFanatic',
      joinDate: new Date().toISOString(),
      role: 'player' as const,
      period1Score: 0,
      period2Score: 0,
      totalScore: 0,
      rankCurrentPeriod: 4,
      rankOverall: 4,
      isChampionshipEligible: true
    }
  ]

  // Mock draft order
  const draftOrder = ['user-1', 'user-2', 'user-3', 'user-4']

  useEffect(() => {
    const loadDraftMovies = async () => {
      try {
        setLoading(true)
        console.log('Loading draft eligible movies...')
        const draftMovies = await getDraftEligibleMovies(leagueId)
        console.log(`Loaded ${draftMovies.length} draft eligible movies`)
        
        // Convert to expected format
        const convertedMovies = draftMovies.map(convertDraftMovie)
        setAvailableMovies(convertedMovies)
      } catch (error) {
        console.error('Error loading draft movies:', error)
        setAvailableMovies([])
      } finally {
        setLoading(false)
      }
    }

    loadDraftMovies()
  }, [leagueId])

  const handleDraftPick = async (movieId: string) => {
    const movieIdNum = parseInt(movieId)
    const movie = availableMovies.find(m => m.id === movieIdNum)
    
    if (movie) {
      // Draft the movie
      const success = draftMovie(movieIdNum, movie.title, currentUser.id, leagueId)
      
      if (success) {
        // Remove from available movies
        setAvailableMovies(prev => prev.filter(m => m.id !== movieIdNum))
        console.log(`${movie.title} drafted by ${currentUser.username}`)
        
        // In a real app, you'd update the draft state and notify other players
        alert(`You've drafted ${movie.title}!`)
      } else {
        alert('Failed to draft movie - it may already be taken.')
      }
    }
  }

  const handleSkipPick = () => {
    // In a real app, this would advance to the next player
    alert('Pick skipped!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Draft Room</h2>
          <p className="text-gray-400">Preparing available movies...</p>
        </div>
      </div>
    )
  }

  // Get current draft state
  const draftSummary = getDraftSummary(leagueId)
  const currentPlayerIndex = draftSummary.totalDrafted % draftOrder.length
  const currentPlayer = draftOrder[currentPlayerIndex]
  
  // Create mock draft room object
  const draftRoom = {
    leagueId,
    draftType: 'initial' as const,
    status: 'active' as const,
    currentPlayer,
    currentPick: draftSummary.totalDrafted + 1,
    timePerPick: 120, // 2 minutes
    currentPickStartTime: new Date().toISOString(),
    draftOrder,
    availableMovies,
    picks: [], // Could populate with actual picks if needed
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString()
  }

  return (
    <FantasyDraftRoom
      draftRoom={draftRoom}
      currentUser={currentUser}
      leagueMembers={leagueMembers}
      onDraftPick={handleDraftPick}
      onSkipPick={handleSkipPick}
    />
  )
}

export default SyncedDraftRoom