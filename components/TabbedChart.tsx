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
  title?: string;
  league?: any;
}

const TabbedChart = ({ data, title, league }: TabbedChartProps) => {
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
      title: 'Box Office',
      dataKey: 'boxOffice' as const,
      color: '#f59e0b',
      type: 'area' as const,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      description: ''
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
      <div className="p-4">
        <div className="mb-2 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">
              {chartConfigs[activeChart].title}
            </h3>
            <p className="text-gray-400 text-xs">
              {chartConfigs[activeChart].description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-blue-400 text-sm font-bold">Period 2</span>
          </div>
        </div>

        {activeChart === 'rank' ? (
          <div className="h-64 overflow-y-auto">
            {league?.players?.length > 0 ? (
              <div className="flex items-end justify-center space-x-6 h-full px-4">
                {/* Podium arrangement - 2nd, 1st, 3rd */}
                {league.players
                  .sort((a: any, b: any) => b.totalScore - a.totalScore)
                  .slice(0, 3)
                  .map((player: any, index: number) => {
                    // Rearrange for podium: [1st=center, 2nd=left, 3rd=right]
                    const podiumOrder = index === 0 ? 1 : index === 1 ? 0 : 2;
                    const heights = ['h-20', 'h-32', 'h-16']; // 2nd, 1st, 3rd heights
                    const colors = [
                      'from-gray-400/30 to-gray-500/30 border-gray-400/50', // 2nd
                      'from-yellow-500/30 to-yellow-600/30 border-yellow-500/50', // 1st
                      'from-orange-600/30 to-orange-700/30 border-orange-600/50' // 3rd
                    ];
                    const badgeColors = [
                      'bg-gray-400 text-black', // 2nd
                      'bg-yellow-500 text-black', // 1st
                      'bg-orange-600 text-white' // 3rd
                    ];
                    const medals = ['🥈', '🥇', '🥉'];
                    
                    return (
                      <div 
                        key={player.userId}
                        className={`flex flex-col items-center space-y-2 flex-1 max-w-20 ${podiumOrder === 1 ? 'order-2' : podiumOrder === 0 ? 'order-1' : 'order-3'}`}
                      >
                        {/* Player info */}
                        <div className="text-center w-full">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${badgeColors[podiumOrder]} mb-2 mx-auto`}>
                            {medals[podiumOrder]}
                          </div>
                          <p className="text-white font-bold text-sm truncate">{player.username}</p>
                          <p className="text-gray-300 text-xs font-bold">
                            {player.totalScore?.toLocaleString() || '0'}
                          </p>
                        </div>
                        
                        {/* Podium block */}
                        <div className={`w-16 ${heights[podiumOrder]} bg-gradient-to-t ${colors[podiumOrder]} border rounded-t-lg flex items-center justify-center mx-auto`}>
                          <span className="text-white font-bold text-xl">#{index + 1}</span>
                        </div>
                      </div>
                    );
                  })}
                
                {/* Remaining players listed below if more than 3 */}
                {league.players.length > 3 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-800/80 rounded-lg p-2 max-h-16 overflow-y-auto">
                    <div className="text-xs text-gray-400 space-y-1">
                      {league.players
                        .sort((a: any, b: any) => b.totalScore - a.totalScore)
                        .slice(3)
                        .map((player: any, index: number) => (
                          <div key={player.userId} className="flex justify-between">
                            <span>#{index + 4}. {player.username}</span>
                            <span>{player.totalScore?.toLocaleString() || '0'}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No players have scored yet</p>
              </div>
            )}
          </div>
        ) : activeChart === 'boxOffice' && league ? (
          <div className="h-64">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Box Office Earnings:</span>
                <span className="font-bold text-green-400">$0M</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Bonus:</span>
                <span className="font-bold text-blue-400">$0M</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Highest Grossing Film:</span>
                <span className="font-bold text-green-400">N/A</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Highest Rated Film:</span>
                <span className="font-bold text-yellow-400">N/A</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-56 w-full overflow-hidden">
              <PerformanceChart
                title=""
                data={data}
                dataKey={chartConfigs[activeChart].dataKey}
                color={chartConfigs[activeChart].color}
                type={chartConfigs[activeChart].type}
              />
            </div>
            {activeChart === 'score' && league && (
              <div className="pt-2 border-t border-gray-600">
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Your Total Score:</span>
                  <span className="font-bold text-white">0</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TabbedChart