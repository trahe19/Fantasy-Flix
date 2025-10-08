'use client'

import { useState, useEffect } from 'react'
import { getMovieTrailers, TMDBVideo, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../lib/tmdb'

export default function TrailerTest() {
  const [trailer, setTrailer] = useState<TMDBVideo | null>(null)
  const [loading, setLoading] = useState(false)
  const [movieId, setMovieId] = useState<string>('')

  const testMovieIds = [
    { id: '533535', title: 'Deadpool & Wolverine' },
    { id: '912649', title: 'Venom: The Last Dance' },
    { id: '558449', title: 'Gladiator II' },
    { id: '402431', title: 'Wicked' },
    { id: '1241982', title: 'Moana 2' }
  ]

  const loadTrailer = async (id: string) => {
    if (!id) return
    
    setLoading(true)
    try {
      console.log(`Loading official trailer for movie ID: ${id}`)
      const movieTrailers = await getMovieTrailers(parseInt(id))
      const officialTrailer = movieTrailers.length > 0 ? movieTrailers[0] : null
      console.log('Official trailer found:', officialTrailer)
      setTrailer(officialTrailer)
    } catch (error) {
      console.error('Error loading trailer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🎬 Trailer Test Component</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Test with Popular Movies:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testMovieIds.map((movie) => (
            <button
              key={movie.id}
              onClick={() => {
                setMovieId(movie.id)
                loadTrailer(movie.id)
              }}
              className="p-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors"
            >
              {movie.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Or enter Movie ID:</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
            placeholder="Enter TMDB Movie ID (e.g., 533535)"
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
          <button
            onClick={() => loadTrailer(movieId)}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg"
          >
            Load Official Trailer
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading trailers...</p>
        </div>
      )}

      {!loading && trailer && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Official Trailer Found:</h2>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-amber-300">{trailer.name}</h3>
              <p className="text-gray-400">
                {trailer.type} • {trailer.official ? 'Official' : 'Fan-made'} • Size: {trailer.size}p
              </p>
              <p className="text-sm text-gray-500">
                Published: {new Date(trailer.published_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 font-mono">
                Key: {trailer.key}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Thumbnail Preview */}
              <div>
                <h4 className="font-bold mb-2">Thumbnail Preview:</h4>
                <img
                  src={getYouTubeThumbnailUrl(trailer.key, 'high')}
                  alt={trailer.name}
                  className="w-full rounded-lg"
                />
              </div>
              
              {/* Embed Player */}
              <div>
                <h4 className="font-bold mb-2">Embed Player:</h4>
                <div className="aspect-video">
                  <iframe
                    src={getYouTubeEmbedUrl(trailer.key)}
                    title={trailer.name}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && movieId && !trailer && (
        <div className="text-center py-8 text-gray-400">
          <p>No official trailer found for movie ID: {movieId}</p>
          <p className="text-sm">This movie may not have an official trailer available yet.</p>
        </div>
      )}
    </div>
  )
}