'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMovieBoxOfficePerformance, BoxOfficePerformance, WeeklyBoxOfficeData, formatBoxOfficeAmount, calculateWeeklyChange } from '../lib/box-office'
import { formatForContext, getTextSizeClass } from '../lib/currency-formatter'
import { BoxOfficeChart as BoxOfficeChartDisplay } from './ResponsiveBoxOfficeDisplay'

interface BoxOfficeChartProps {
  movieId: number
  title: string
  releaseDate: string
  className?: string
}

export default function BoxOfficeChart({ movieId, title, releaseDate, className = '' }: BoxOfficeChartProps) {
  const [boxOfficeData, setBoxOfficeData] = useState<BoxOfficePerformance | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)
  const [isLiveData, setIsLiveData] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    loadBoxOfficeData()
  }, [movieId, releaseDate])

  // Auto-refresh for movies currently in theaters
  useEffect(() => {
    if (autoRefresh && isLiveData) {
      const interval = setInterval(loadBoxOfficeData, 300000) // Refresh every 5 minutes
      return () => clearInterval(interval)
    }
  }, [autoRefresh, isLiveData])

  const loadBoxOfficeData = useCallback(async () => {
    setLoading(true)
    try {
      // Try API endpoint first for better caching and error handling
      const apiResponse = await fetch(
        `/api/box-office?movieId=${movieId}&title=${encodeURIComponent(title)}&releaseDate=${releaseDate}`,
        { cache: 'no-store' } // Always get fresh data
      )

      if (apiResponse.ok) {
        const result = await apiResponse.json()
        if (result.success) {
          setBoxOfficeData(result.data)
          setIsLiveData(result.meta?.hasLiveData || false)
          setLastUpdated(result.meta?.lastUpdated || new Date().toISOString())
          setAutoRefresh(result.meta?.hasLiveData || false)
          return
        }
      }

      // Fallback to direct function call
      const data = await getMovieBoxOfficePerformance(movieId, title, releaseDate)
      setBoxOfficeData(data)
      setIsLiveData(data?.isCurrentlyInTheaters || false)
      setLastUpdated(new Date().toISOString())
    } catch (error) {
      console.error('Error loading box office data:', error)
    } finally {
      setLoading(false)
    }
  }, [movieId, title, releaseDate])

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-3"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!boxOfficeData || boxOfficeData.weeklyData.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-4 ${className}`}>
        <h3 className="text-sm font-bold text-amber-300 mb-2">📊 Box Office Performance</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-700 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-400 text-xs">
            {boxOfficeData?.isCurrentlyInTheaters ? 'Box office data updating...' : 'No current box office data'}
          </p>
        </div>
      </div>
    )
  }

  const { weeklyData, totalGross, isCurrentlyInTheaters } = boxOfficeData

  // Limit to first 4 weeks only (first month)
  const firstFourWeeks = weeklyData.slice(0, 4)
  const maxWeeklyGross = Math.max(...firstFourWeeks.map(w => w.weeklyGross))

  // Calculate chart dimensions for line graph
  const chartHeight = 120
  const chartWidth = 240
  const padding = { top: 10, right: 10, bottom: 20, left: 10 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  return (
    <div className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-4 border border-amber-500/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-amber-300">📊 Box Office Performance</h3>
        <div className="flex items-center space-x-2">
          {isLiveData && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-medium">Live Data</span>
            </div>
          )}
          {isCurrentlyInTheaters && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-400 font-medium">In Theaters</span>
            </div>
          )}
          <button
            onClick={loadBoxOfficeData}
            disabled={loading}
            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50"
            title="Refresh box office data"
          >
            {loading ? '↻' : '🔄'}
          </button>
        </div>
      </div>

      {/* Total Gross */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <BoxOfficeChartDisplay amount={totalGross} className="flex-shrink-0" />
              <div className="text-xs text-gray-400 truncate">
                First {firstFourWeeks.length} week{firstFourWeeks.length !== 1 ? 's' : ''} only
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.9} />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          {/* Chart area */}
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Horizontal grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1={0}
                y1={innerHeight - ratio * innerHeight}
                x2={innerWidth}
                y2={innerHeight - ratio * innerHeight}
                stroke="rgba(156, 163, 175, 0.1)"
                strokeWidth={1}
              />
            ))}

            {/* Generate line path */}
            {(() => {
              const xScale = (weekIndex: number) => (weekIndex / 3) * innerWidth
              const yScale = (gross: number) => innerHeight - (gross / maxWeeklyGross) * innerHeight

              const linePath = firstFourWeeks
                .map((week, index) => {
                  const x = xScale(index)
                  const y = yScale(week.cumulativeGross)
                  return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
                })
                .join(' ')

              const areaPath = `${linePath} L ${xScale(3)} ${innerHeight} L ${xScale(0)} ${innerHeight} Z`

              return (
                <>
                  {/* Area under the line */}
                  <path
                    d={areaPath}
                    fill="url(#areaGradient)"
                  />

                  {/* Main line */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {firstFourWeeks.map((week, index) => {
                    const x = xScale(index)
                    const y = yScale(week.cumulativeGross)
                    const isHovered = hoveredWeek === week.week
                    const previousWeek = index > 0 ? firstFourWeeks[index - 1] : undefined
                    const weeklyChange = calculateWeeklyChange(week, previousWeek)

                    return (
                      <g key={week.week}>
                        {/* Point */}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? "#F59E0B" : "#10B981"}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredWeek(week.week)}
                          onMouseLeave={() => setHoveredWeek(null)}
                        />

                        {/* Hover tooltip */}
                        {isHovered && (
                          <g>
                            <rect
                              x={x - 40}
                              y={y - 45}
                              width={80}
                              height={35}
                              fill="rgba(0, 0, 0, 0.9)"
                              rx={4}
                              className="drop-shadow-lg"
                            />
                            <text
                              x={x}
                              y={y - 30}
                              textAnchor="middle"
                              className="fill-white text-xs font-bold"
                            >
                              Week {week.week}
                            </text>
                            <text
                              x={x}
                              y={y - 18}
                              textAnchor="middle"
                              className="fill-amber-300 text-xs font-bold"
                            >
                              {formatForContext(week.cumulativeGross, 'chart').display}
                            </text>
                            {weeklyChange !== null && (
                              <text
                                x={x}
                                y={y - 6}
                                textAnchor="middle"
                                className={`text-xs font-bold ${weeklyChange >= 0 ? 'fill-green-400' : 'fill-red-400'}`}
                              >
                                {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
                              </text>
                            )}
                          </g>
                        )}
                      </g>
                    )
                  })}

                  {/* Week labels */}
                  {firstFourWeeks.map((week, index) => (
                    <text
                      key={week.week}
                      x={xScale(index)}
                      y={innerHeight + 15}
                      textAnchor="middle"
                      className="fill-gray-400 text-xs"
                    >
                      W{week.week}
                    </text>
                  ))}
                </>
              )
            })()}
          </g>
        </svg>
      </div>

      {/* Weekly breakdown */}
      <div className="mt-4 space-y-1">
        {firstFourWeeks.map((week, index) => {
          const previousWeek = index > 0 ? firstFourWeeks[index - 1] : undefined
          const weeklyChange = calculateWeeklyChange(week, previousWeek)
          
          return (
            <div 
              key={week.week}
              className={`flex items-center justify-between text-xs p-2 rounded-lg transition-colors ${
                hoveredWeek === week.week ? 'bg-amber-500/10 border border-amber-500/20' : 'hover:bg-gray-700/30'
              }`}
              onMouseEnter={() => setHoveredWeek(week.week)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                <span className="text-gray-300 font-medium">Week {week.week}</span>
              </div>
              <div className="flex items-center justify-between space-x-3 min-w-0">
                <div className="flex-shrink-0">
                  <BoxOfficeChartDisplay amount={week.weeklyGross} />
                </div>
                {weeklyChange !== null && (
                  <span className={`text-xs font-medium flex-shrink-0 ${weeklyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex justify-between items-center text-xs text-gray-400 min-w-0">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="flex-shrink-0">Cumulative:</span>
            <BoxOfficeChartDisplay amount={totalGross} className="flex-shrink-0" />
          </div>
          <span className="flex-shrink-0">{boxOfficeData.daysInTheaters} days in theaters</span>
        </div>
        {lastUpdated && (
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <span>{isLiveData ? 'Live data' : 'Estimated data'}</span>
            <span>Updated: {new Date(lastUpdated).toLocaleTimeString()}</span>
          </div>
        )}
        {autoRefresh && (
          <div className="text-xs text-green-500 mt-1 text-center">
            🔄 Auto-refreshing every 5 minutes
          </div>
        )}
      </div>
    </div>
  )
}