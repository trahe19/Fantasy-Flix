'use client'

import { useState } from 'react'
import PerformanceChart from './PerformanceChart'

interface ChartData {
  week: string;
  score: number;
  rank: number;
  boxOffice: number;
}

interface TabbedChartProps {
  data: ChartData[];
}

const TabbedChart = ({ data }: TabbedChartProps) => {
  const [activeChart, setActiveChart] = useState<'score' | 'rank' | 'boxOffice'>('score')

  const chartConfigs = {
    score: {
      title: 'Weekly Score',
      dataKey: 'score' as const,
      color: '#0ea5e9',
      type: 'area' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      description: 'Your fantasy points over time'
    },
    rank: {
      title: 'League Rank', 
      dataKey: 'rank' as const,
      color: '#10b981',
      type: 'line' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      description: 'Your position in the league'
    },
    boxOffice: {
      title: 'Box Office Total',
      dataKey: 'boxOffice' as const,
      color: '#f59e0b',
      type: 'area' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      description: 'Total box office earnings'
    }
  }

  return (
    <div className="glass-elegant rounded-2xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-600 bg-gray-800 bg-opacity-50">
        {Object.entries(chartConfigs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveChart(key as any)}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-300 ${
              activeChart === key
                ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700 hover:bg-opacity-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg">{config.icon}</span>
              <span className="hidden sm:inline">{config.title}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Chart Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">
            {chartConfigs[activeChart].title}
          </h3>
          <p className="text-gray-400 text-sm">
            {chartConfigs[activeChart].description}
          </p>
        </div>

        <PerformanceChart
          title=""
          data={data}
          dataKey={chartConfigs[activeChart].dataKey}
          color={chartConfigs[activeChart].color}
          type={chartConfigs[activeChart].type}
        />

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-600">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Current</p>
            <p className="text-white font-bold">
              {activeChart === 'boxOffice' 
                ? `$${(data[data.length - 1]?.boxOffice / 1000000 || 0).toFixed(1)}M`
                : activeChart === 'rank'
                ? `#${data[data.length - 1]?.rank || 0}`
                : (data[data.length - 1]?.score || 0).toLocaleString()
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Best</p>
            <p className="text-green-400 font-bold">
              {activeChart === 'boxOffice' 
                ? `$${(Math.max(...data.map(d => d.boxOffice)) / 1000000).toFixed(1)}M`
                : activeChart === 'rank'
                ? `#${Math.min(...data.map(d => d.rank))}`
                : Math.max(...data.map(d => d.score)).toLocaleString()
              }
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Trend</p>
            <p className="text-blue-400 font-bold">
              {data.length > 1 ? (
                activeChart === 'rank'
                  ? data[data.length - 1].rank < data[data.length - 2].rank ? '📈 Up' : '📉 Down'
                  : data[data.length - 1][activeChart] > data[data.length - 2][activeChart] ? '📈 Up' : '📉 Down'
              ) : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabbedChart