'use client'

import { useState } from 'react'
import BoxOfficeChart from './BoxOfficeChart'

export default function BoxOfficeTest() {
  const [selectedMovie, setSelectedMovie] = useState<any>(null)

  // Test movies with recent release dates to trigger box office chart
  const testMovies = [
    {
      id: 533535,
      title: "Deadpool & Wolverine",
      release_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days ago
    },
    {
      id: 912649,
      title: "Venom: The Last Dance", 
      release_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 12 days ago
    },
    {
      id: 558449,
      title: "Gladiator II",
      release_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 20 days ago
    },
    {
      id: 402431,
      title: "Wicked",
      release_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 25 days ago
    },
    {
      id: 1241982,
      title: "Moana 2",
      release_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 35 days ago (should show no data)
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Box Office Chart Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-amber-300">Test Movies (Recent Releases):</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testMovies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className={`p-4 rounded-xl transition-colors font-bold ${
                selectedMovie?.id === movie.id 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
            >
              <div className="text-left">
                <div className="font-bold">{movie.title}</div>
                <div className="text-sm opacity-75">Released: {movie.release_date}</div>
                <div className="text-xs opacity-50">
                  {Math.floor((new Date().getTime() - new Date(movie.release_date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedMovie ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-300">
            Box Office Chart for: {selectedMovie.title}
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Large Chart */}
            <div>
              <h3 className="text-lg font-bold mb-4">Full Size Chart:</h3>
              <BoxOfficeChart
                movieId={selectedMovie.id}
                title={selectedMovie.title}
                releaseDate={selectedMovie.release_date}
                className="w-full"
              />
            </div>
            
            {/* Compact Chart (as it would appear in MovieDetailModal) */}
            <div>
              <h3 className="text-lg font-bold mb-4">Compact Chart (Modal Size):</h3>
              <div className="max-w-sm">
                <BoxOfficeChart
                  movieId={selectedMovie.id}
                  title={selectedMovie.title}
                  releaseDate={selectedMovie.release_date}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-400">Select a movie above to view its box office performance chart</p>
          <p className="text-sm text-gray-500 mt-2">
            Charts will only show data for movies released within the last 30 days
          </p>
        </div>
      )}

      <div className="mt-8 bg-gray-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-amber-300 mb-4">📈 Chart Features:</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Week-by-week performance:</strong> Shows opening weekend through Week 4+
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Live updating data:</strong> For movies currently in theaters (first 30 days)
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Interactive tooltips:</strong> Hover over bars to see detailed earnings and drops
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Realistic patterns:</strong> Mock data follows actual box office drop patterns
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <strong>Theater status:</strong> Shows green "In Theaters" indicator for current releases
          </li>
          <li className="flex items-center">
            <span className="text-amber-400 mr-2">⚠️</span>
            <strong>Mock data:</strong> Using realistic simulated data until real API integration
          </li>
        </ul>
      </div>
    </div>
  )
}