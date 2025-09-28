'use client'

import BoxOfficeChart from '../../components/BoxOfficeChart'

export default function TestBoxOfficePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-300 mb-4">📊 Box Office Data Test</h1>
          <p className="text-gray-400">Testing real box office data integration</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Real Data Tests */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Real Data (Manual Database)</h2>

            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Wicked</h3>
              <BoxOfficeChart
                movieId={402431}
                title="Wicked"
                releaseDate="2024-11-22"
              />
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Moana 2</h3>
              <BoxOfficeChart
                movieId={1241982}
                title="Moana 2"
                releaseDate="2024-11-27"
              />
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Sonic 3</h3>
              <BoxOfficeChart
                movieId={1100782}
                title="Sonic the Hedgehog 3"
                releaseDate="2024-12-20"
              />
            </div>
          </div>

          {/* Fallback Data Tests */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Fallback Data (Generated)</h2>

            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Test Movie (2025)</h3>
              <BoxOfficeChart
                movieId={999999}
                title="Test Summer Blockbuster"
                releaseDate="2025-07-15"
              />
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Recent Release</h3>
              <BoxOfficeChart
                movieId={888888}
                title="New Action Movie"
                releaseDate="2025-08-01"
              />
            </div>

            <div className="bg-gray-800/30 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-amber-300 mb-2">Old Movie (No Data)</h3>
              <BoxOfficeChart
                movieId={777777}
                title="Old Classic"
                releaseDate="2023-01-01"
              />
            </div>
          </div>

        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-2xl p-6 border border-blue-500/20 text-center">
          <h3 className="text-lg font-bold text-blue-300 mb-3">✅ Expected Results</h3>
          <div className="text-left text-gray-300 space-y-2">
            <p><strong>Real Data:</strong> Wicked, Moana 2, Sonic 3 should show actual box office performance with real weekly data</p>
            <p><strong>Fallback Data:</strong> Test movies should show generated realistic box office patterns</p>
            <p><strong>No Data:</strong> Old movie should show "No current box office data" message</p>
          </div>
        </div>

      </div>
    </div>
  )
}