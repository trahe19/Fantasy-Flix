export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-6">The page you're looking for doesn't exist.</p>
        <a 
          href="/"
          className="gradient-blue text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transform hover:scale-105 transition-all inline-block"
        >
          Back to Fantasy Flix
        </a>
      </div>
    </div>
  )
}