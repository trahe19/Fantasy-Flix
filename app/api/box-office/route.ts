import { NextRequest, NextResponse } from 'next/server'
import { getLiveBoxOfficePerformance, getMoviesWithLiveData } from '../../../lib/live-box-office'
import { getMovieBoxOfficePerformance } from '../../../lib/box-office'
import { getCurrentTheatricalReleases as getRealTheatricalReleases, getBoxOfficeSummary } from '../../../lib/real-box-office-data'

// GET /api/box-office?movieId=123&title=MovieName&releaseDate=2025-01-01
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const movieId = searchParams.get('movieId')
    const title = searchParams.get('title')
    const releaseDate = searchParams.get('releaseDate')
    const action = searchParams.get('action')

    // List all movies with box office data (real + live)
    if (action === 'live-movies') {
      const realMovies = getRealTheatricalReleases()
      const liveMovies = await getMoviesWithLiveData()

      // Convert real movies to API format
      const realMoviesFormatted = realMovies.map(movie => ({
        tmdbId: movie.tmdbId,
        title: movie.title,
        releaseDate: movie.releaseDate,
        isInTheaters: movie.status === 'current' || (movie.daysInTheaters && movie.daysInTheaters <= 45),
        daysInTheaters: movie.daysInTheaters || 0,
        estimatedTheaterCount: movie.widestRelease,
        hasRealData: true,
        totalGross: movie.domesticTotal,
        dataSource: movie.dataSource
      }))

      // Combine real and live data, prioritizing real data
      const allMovies = [
        ...realMoviesFormatted,
        ...liveMovies.filter(live =>
          !realMoviesFormatted.some(real => real.tmdbId === live.tmdbId)
        )
      ]

      return NextResponse.json({
        success: true,
        data: allMovies,
        count: allMovies.length,
        meta: {
          realDataCount: realMoviesFormatted.length,
          liveDataCount: liveMovies.length,
          summary: getBoxOfficeSummary()
        }
      })
    }

    // Get box office data for a specific movie
    if (!movieId || !title || !releaseDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: movieId, title, releaseDate'
        },
        { status: 400 }
      )
    }

    const movieIdNum = parseInt(movieId)
    if (isNaN(movieIdNum)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid movieId: must be a number'
        },
        { status: 400 }
      )
    }

    console.log(`API: Fetching box office data for ${title} (${movieIdNum})`)

    // Get comprehensive box office data (tries live APIs first, falls back to mock)
    const boxOfficeData = await getMovieBoxOfficePerformance(movieIdNum, title, releaseDate)

    if (!boxOfficeData) {
      return NextResponse.json({
        success: false,
        error: 'No box office data available for this movie',
        movieId: movieIdNum,
        title,
        releaseDate
      })
    }

    return NextResponse.json({
      success: true,
      data: boxOfficeData,
      meta: {
        hasLiveData: boxOfficeData.isCurrentlyInTheaters,
        dataSource: boxOfficeData.isCurrentlyInTheaters ? 'live' : 'estimated',
        lastUpdated: new Date().toISOString(),
        weekCount: boxOfficeData.weeklyData.length
      }
    })

  } catch (error) {
    console.error('Box office API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch box office data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/box-office - Refresh box office data for a movie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { movieId, title, releaseDate } = body

    if (!movieId || !title || !releaseDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: movieId, title, releaseDate'
        },
        { status: 400 }
      )
    }

    console.log(`API: Refreshing box office data for ${title} (${movieId})`)

    // Force refresh of box office data
    const refreshedData = await getLiveBoxOfficePerformance(movieId, title, releaseDate)

    if (!refreshedData) {
      return NextResponse.json({
        success: false,
        error: 'Unable to refresh box office data for this movie',
        movieId,
        title,
        releaseDate
      })
    }

    return NextResponse.json({
      success: true,
      data: refreshedData,
      meta: {
        refreshed: true,
        timestamp: new Date().toISOString(),
        hasLiveData: refreshedData.isCurrentlyInTheaters
      }
    })

  } catch (error) {
    console.error('Box office refresh API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh box office data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}