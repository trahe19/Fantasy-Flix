'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface ChartData {
  week: string;
  score: number;
  rank: number;
  boxOffice: number;
}

interface PerformanceChartProps {
  title: string;
  data: ChartData[];
  type?: 'line' | 'area';
  dataKey: 'score' | 'rank' | 'boxOffice';
  color?: string;
}

const PerformanceChart = ({ 
  title, 
  data, 
  type = 'area', 
  dataKey, 
  color = '#3b82f6' 
}: PerformanceChartProps) => {
  const formatValue = (value: number) => {
    if (dataKey === 'boxOffice') {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (dataKey === 'rank') {
      return `#${value}`
    }
    return value.toLocaleString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark rounded-xl p-3 border border-gray-600">
          <p className="text-white font-medium">{`Week ${label}`}</p>
          <p className="text-blue-400">
            {`${title}: ${formatValue(payload[0].value)}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-elegant rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: color }}
          ></div>
          <span className="text-gray-400 text-sm capitalize">{dataKey}</span>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="week" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `W${value}`}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fillOpacity={1}
                fill={`url(#gradient-${dataKey})`}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="week" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `W${value}`}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#1f2937' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-600">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Current: </span>
            <span className="text-white font-bold">
              {formatValue(data[data.length - 1][dataKey])}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Mock data generator for demonstration
export const generateMockChartData = (): ChartData[] => {
  return [
    { week: '1', score: 125000, rank: 8, boxOffice: 15000000 },
    { week: '2', score: 178000, rank: 5, boxOffice: 23000000 },
    { week: '3', score: 156000, rank: 6, boxOffice: 19000000 },
    { week: '4', score: 203000, rank: 3, boxOffice: 31000000 },
    { week: '5', score: 189000, rank: 4, boxOffice: 28000000 },
    { week: '6', score: 245000, rank: 2, boxOffice: 42000000 },
    { week: '7', score: 267000, rank: 1, boxOffice: 38000000 },
    { week: '8', score: 298000, rank: 1, boxOffice: 45000000 },
  ]
}

export default PerformanceChart