'use client'

import { formatForContext, getTextSizeClass, FormattedAmount } from '../lib/currency-formatter'

interface ResponsiveBoxOfficeDisplayProps {
  amount: number
  label: string
  context?: 'card' | 'modal' | 'chart' | 'table'
  color?: string
  showTooltip?: boolean
  className?: string
}

export default function ResponsiveBoxOfficeDisplay({
  amount,
  label,
  context = 'card',
  color = 'text-white',
  showTooltip = true,
  className = ''
}: ResponsiveBoxOfficeDisplayProps) {
  const formatted = formatForContext(amount, context)
  const textSizeClass = getTextSizeClass(formatted.size)

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <p className="text-gray-400 text-sm mb-1 truncate">{label}</p>
      )}
      <div
        className={`${formatted.containerClass} flex items-center justify-start`}
        title={showTooltip ? `${label}: ${formatted.fullAmount}` : undefined}
      >
        <span className={`${textSizeClass} font-bold ${color} truncate leading-tight`}>
          {formatted.display}
        </span>
      </div>
    </div>
  )
}

// Specialized components for different use cases
export function BoxOfficeCard({ amount, label, className = '' }: { amount: number, label: string, className?: string }) {
  return (
    <div className={`glass rounded-xl p-4 ${className}`}>
      <ResponsiveBoxOfficeDisplay
        amount={amount}
        label={label}
        context="card"
        color="text-white"
        className="h-full flex flex-col justify-between"
      />
    </div>
  )
}

export function BoxOfficeModal({ amount, label, color = "text-white", className = '' }: { amount: number, label: string, color?: string, className?: string }) {
  return (
    <ResponsiveBoxOfficeDisplay
      amount={amount}
      label={label}
      context="modal"
      color={color}
      className={className}
    />
  )
}

export function BoxOfficeChart({ amount, className = '' }: { amount: number, className?: string }) {
  return (
    <ResponsiveBoxOfficeDisplay
      amount={amount}
      label=""
      context="chart"
      color="text-white"
      showTooltip={true}
      className={className}
    />
  )
}

export function BoxOfficeTable({ amount, label, className = '' }: { amount: number, label: string, className?: string }) {
  return (
    <ResponsiveBoxOfficeDisplay
      amount={amount}
      label={label}
      context="table"
      color="text-white"
      className={className}
    />
  )
}

// Grid layout for multiple box office figures
export function BoxOfficeGrid({
  budget,
  projectedOpening,
  projectedTotal,
  actualTotal,
  className = ''
}: {
  budget?: number
  projectedOpening?: number
  projectedTotal?: number
  actualTotal?: number
  className?: string
}) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {budget !== undefined && (
        <BoxOfficeCard amount={budget} label="Production Budget" />
      )}
      {projectedOpening !== undefined && (
        <BoxOfficeCard amount={projectedOpening} label="Projected Opening" className="border-l-4 border-green-400" />
      )}
      {projectedTotal !== undefined && (
        <BoxOfficeCard amount={projectedTotal} label="Projected Total" className="border-l-4 border-yellow-400" />
      )}
      {actualTotal !== undefined && (
        <BoxOfficeCard amount={actualTotal} label="Actual Total" className="border-l-4 border-blue-400" />
      )}
    </div>
  )
}

// Projection bar with proper overflow handling
export function BoxOfficeProjectionBar({
  label,
  amount,
  percentage,
  color = "from-green-500 to-green-400",
  className = ''
}: {
  label: string
  amount: number
  percentage: number
  color?: string
  className?: string
}) {
  const formatted = formatForContext(amount, 'chart')
  const textSizeClass = getTextSizeClass(formatted.size)

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-white text-sm min-w-[80px] truncate">{label}</span>
      <div className="flex-1 mx-4 h-4 bg-gray-800 rounded-full overflow-hidden min-w-[100px]">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
        ></div>
      </div>
      <div className={`${formatted.containerClass} flex justify-end`}>
        <span
          className={`${textSizeClass} font-bold text-white truncate`}
          title={`${label}: ${formatted.fullAmount}`}
        >
          {formatted.display}
        </span>
      </div>
    </div>
  )
}