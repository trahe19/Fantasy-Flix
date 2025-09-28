'use client'

import { useState } from 'react'
import { get2025BoxOfficeData, isTop2025Movie } from '../lib/top-2025-box-office'
import { formatBoxOfficeAmount } from '../lib/box-office'

interface Top2025BoxOfficeLineChartProps {
  movieId: number
  title: string
  className?: string
}

export default function Top2025BoxOfficeLineChart({ movieId, title, className = '' }: Top2025BoxOfficeLineChartProps) {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null)

  // Check if this movie is in the top 50 2025 list
  if (!isTop2025Movie(movieId)) {
    return null // Don't show chart for non-top-50 movies
  }

  const movieData = get2025BoxOfficeData(movieId)
  if (!movieData) return null

  const { weeklyProgression, domesticTotal, rank } = movieData

  // Chart dimensions optimized for large prominent display
  const chartWidth = 320
  const chartHeight = 160
  const padding = { top: 20, right: 20, bottom: 30, left: 20 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Calculate scales
  const maxGross = Math.max(...weeklyProgression.map(w => w.cumulativeGross))
  const xScale = (week: number) => ((week - 1) / 3) * innerWidth
  const yScale = (gross: number) => innerHeight - (gross / maxGross) * innerHeight

  // Generate line path
  const linePath = weeklyProgression
    .map((week, index) => {
      const x = xScale(week.week)
      const y = yScale(week.cumulativeGross)
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  return (
    <div className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-xl p-4 border border-amber-500/30 backdrop-blur-md shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-bold text-amber-300">📊 2025 US Box Office</div>
          <div className="text-sm text-gray-400">#{rank} Domestic</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">{formatBoxOfficeAmount(domesticTotal)}</div>
          <div className="text-sm text-green-400">Domestic Total</div>
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

            {/* Area under the line */}
            <path
              d={`${linePath} L ${xScale(4)} ${innerHeight} L ${xScale(1)} ${innerHeight} Z`}
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
            {weeklyProgression.map((week) => {
              const x = xScale(week.week)
              const y = yScale(week.cumulativeGross)
              const isHovered = hoveredWeek === week.week

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
                        y={y - 35}
                        width={80}
                        height={25}
                        fill="rgba(0, 0, 0, 0.9)"
                        rx={4}
                        className="drop-shadow-lg"
                      />
                      <text
                        x={x}
                        y={y - 20}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold"
                      >
                        Week {week.week}
                      </text>
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        className="fill-amber-300 text-xs font-bold"
                      >
                        {formatBoxOfficeAmount(week.cumulativeGross)}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* Week labels */}
            {weeklyProgression.map((week) => (
              <text
                key={week.week}
                x={xScale(week.week)}
                y={innerHeight + 15}
                textAnchor="middle"
                className="fill-gray-400 text-xs"
              >
                W{week.week}
              </text>
            ))}
          </g>
        </svg>
      </div>

      {/* Weekly breakdown */}
      <div className="mt-3 space-y-1">
        {weeklyProgression.map((week) => {
          const isHovered = hoveredWeek === week.week
          const weeklyChange = week.week > 1
            ? ((week.weeklyGross - weeklyProgression[week.week - 2].weeklyGross) / weeklyProgression[week.week - 2].weeklyGross) * 100
            : null

          return (
            <div
              key={week.week}
              className={`flex items-center justify-between text-xs p-1 rounded transition-colors cursor-pointer ${
                isHovered ? 'bg-amber-500/10 border border-amber-500/20' : 'hover:bg-gray-700/20'
              }`}
              onMouseEnter={() => setHoveredWeek(week.week)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">W{week.week}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">
                  {formatBoxOfficeAmount(week.cumulativeGross)}
                </span>
                {weeklyChange !== null && (
                  <span className={`text-xs ${weeklyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {weeklyChange >= 0 ? '+' : ''}{weeklyChange.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Final total highlight */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Final Domestic Total:</span>
          <span className="text-sm font-bold text-amber-300">
            {formatBoxOfficeAmount(domesticTotal)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400">2025 US Rank:</span>
          <span className="text-xs font-bold text-green-400">#{rank} Domestic</span>
        </div>
      </div>
    </div>
  )
}