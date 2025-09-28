'use client'

import { BoxOfficeGrid, BoxOfficeProjectionBar, BoxOfficeCard, BoxOfficeModal } from './ResponsiveBoxOfficeDisplay'

export default function BoxOfficeTestPage() {
  // Test cases with various large numbers
  const testCases = [
    {
      title: "Avatar: The Way of Water",
      budget: 350000000, // $350M
      projectedOpening: 180000000, // $180M
      projectedTotal: 2300000000, // $2.3B
      actualTotal: 2320000000 // $2.32B
    },
    {
      title: "Mission: Impossible 8",
      budget: 290000000, // $290M
      projectedOpening: 85000000, // $85M
      projectedTotal: 750000000, // $750M
      actualTotal: 680000000 // $680M
    },
    {
      title: "The Batman 2",
      budget: 200000000, // $200M
      projectedOpening: 120000000, // $120M
      projectedTotal: 950000000, // $950M
      actualTotal: 0 // Not released yet
    },
    {
      title: "Indie Film",
      budget: 15000000, // $15M
      projectedOpening: 8000000, // $8M
      projectedTotal: 45000000, // $45M
      actualTotal: 52000000 // $52M
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-300 mb-4">📊 Box Office Display Test</h1>
          <p className="text-gray-400">Testing responsive box office displays with various number sizes</p>
        </div>

        {/* Test Grid Layouts */}
        {testCases.map((movie, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-amber-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">{movie.title}</h2>

            {/* Main Grid */}
            <BoxOfficeGrid
              budget={movie.budget}
              projectedOpening={movie.projectedOpening}
              projectedTotal={movie.projectedTotal}
              actualTotal={movie.actualTotal > 0 ? movie.actualTotal : undefined}
              className="mb-6"
            />

            {/* Projection Bars */}
            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-amber-300 mb-4">Performance Projections</h3>
              <div className="space-y-3">
                <BoxOfficeProjectionBar
                  label="Opening Weekend"
                  amount={movie.projectedOpening}
                  percentage={60}
                  color="from-green-500 to-green-400"
                />
                <BoxOfficeProjectionBar
                  label="First Month"
                  amount={movie.projectedTotal * 0.4}
                  percentage={80}
                  color="from-yellow-500 to-yellow-400"
                />
                <BoxOfficeProjectionBar
                  label="Total Lifetime"
                  amount={movie.projectedTotal}
                  percentage={100}
                  color="from-blue-500 to-cyan-500"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Individual Card Tests */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-amber-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Individual Card Tests</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <BoxOfficeCard amount={2100000000} label="Avatar 3 Projection" />
            <BoxOfficeCard amount={950000000} label="Superhero Blockbuster" />
            <BoxOfficeCard amount={350000000} label="Production Budget" />
            <BoxOfficeCard amount={85000000} label="Opening Weekend" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BoxOfficeCard amount={25000000} label="Mid-Budget Film" />
            <BoxOfficeCard amount={5000000} label="Indie Production" />
            <BoxOfficeCard amount={150000} label="Limited Release" />
          </div>
        </div>

        {/* Modal-style displays */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-amber-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Modal Display Tests</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <BoxOfficeModal amount={2300000000} label="Worldwide Box Office" color="text-green-400" />
              <BoxOfficeModal amount={890000000} label="Domestic Total" color="text-blue-400" />
              <BoxOfficeModal amount={1410000000} label="International Total" color="text-yellow-400" />
            </div>
            <div className="space-y-4">
              <BoxOfficeModal amount={400000000} label="Production Budget" color="text-red-400" />
              <BoxOfficeModal amount={200000000} label="Marketing Budget" color="text-orange-400" />
              <BoxOfficeModal amount={1700000000} label="Net Profit" color="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Edge Cases */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-amber-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Edge Case Tests</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BoxOfficeCard amount={0} label="Pre-Release" />
            <BoxOfficeCard amount={1500} label="Very Small" />
            <BoxOfficeCard amount={999999} label="Under 1M" />
            <BoxOfficeCard amount={1000000} label="Exactly 1M" />
            <BoxOfficeCard amount={1000000000} label="Exactly 1B" />
            <BoxOfficeCard amount={10000000000} label="10 Billion+" />
            <BoxOfficeCard amount={50000000000} label="Mega Franchise" />
            <BoxOfficeCard amount={999999999999} label="Extreme Test" />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20 text-center">
          <h3 className="text-lg font-bold text-blue-300 mb-3">✅ Test Results</h3>
          <p className="text-gray-300 mb-2">
            All box office amounts should display properly without overflow or cutoff.
          </p>
          <p className="text-gray-400 text-sm">
            Large numbers like $2.1B should be abbreviated and fit within their containers.
            Hover over amounts to see the full value in tooltips.
          </p>
        </div>

      </div>
    </div>
  )
}