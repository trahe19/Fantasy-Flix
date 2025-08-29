'use client'

import { useState, memo } from 'react'

const RosterManagement = memo(function RosterManagement() {
  const [currentPeriod, setCurrentPeriod] = useState(1)
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [draggedFrom, setDraggedFrom] = useState<string>('')
  const [showSwapConfirm, setShowSwapConfirm] = useState(false)
  const [swapDetails, setSwapDetails] = useState<any>(null)

  const [starters, setStarters] = useState([
    { id: 1, movie: { title: 'Oppenheimer', budget: 100, status: 'released', score: 952000000 }, locked: true },
    { id: 2, movie: { title: 'Barbie', budget: 145, status: 'released', score: 1446000000 }, locked: true },
    { id: 3, movie: { title: 'Dune: Part Two', budget: 190, status: 'upcoming', score: 0 }, locked: false },
    { id: 4, movie: null, locked: false },
    { id: 5, movie: null, locked: false },
  ])

  const [reserves, setReserves] = useState([
    { id: 6, movie: { title: 'The Marvels', budget: 250, status: 'upcoming', score: 0 }, locked: false },
    { id: 7, movie: { title: 'Wish', budget: 200, status: 'upcoming', score: 0 }, locked: false },
    { id: 8, movie: null, locked: false },
    { id: 9, movie: null, locked: false },
    { id: 10, movie: null, locked: false },
  ])

  const [waiverWire] = useState([
    { id: 11, title: 'Avatar 5', budget: 300, releaseDate: '2025-12-20', status: 'upcoming' },
    { id: 12, title: 'Marvel Phase 8', budget: 225, releaseDate: '2025-12-15', status: 'upcoming' },
    { id: 13, title: 'Pixar Magic', budget: 185, releaseDate: '2025-12-22', status: 'upcoming' },
    { id: 14, title: 'DC Legends', budget: 190, releaseDate: '2025-12-25', status: 'upcoming' },
  ])

  const handleDragStart = (e: React.DragEvent, item: any, from: string) => {
    if (item.locked) {
      e.preventDefault()
      return
    }
    setDraggedItem(item)
    setDraggedFrom(from)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, target: any, targetType: string) => {
    e.preventDefault()
    
    if (!draggedItem) return

    // Show confirmation modal
    setSwapDetails({
      from: draggedFrom,
      to: targetType,
      draggedItem,
      targetItem: target
    })
    setShowSwapConfirm(true)
  }

  const confirmSwap = () => {
    const { from, to, draggedItem, targetItem } = swapDetails

    if (from === 'starter' && to === 'reserve') {
      // Swap starter with reserve
      const starterIndex = starters.findIndex(s => s.id === draggedItem.id)
      const reserveIndex = reserves.findIndex(r => r.id === targetItem.id)
      
      const newStarters = [...starters]
      const newReserves = [...reserves]
      
      newStarters[starterIndex] = { ...targetItem, id: draggedItem.id }
      newReserves[reserveIndex] = { ...draggedItem, id: targetItem.id }
      
      setStarters(newStarters)
      setReserves(newReserves)
    } else if (from === 'waiver' && to === 'reserve') {
      // Add from waiver to reserve
      const reserveIndex = reserves.findIndex(r => r.id === targetItem.id)
      const newReserves = [...reserves]
      newReserves[reserveIndex] = { 
        ...targetItem, 
        movie: { ...draggedItem, score: 0 }
      }
      setReserves(newReserves)
    }

    setShowSwapConfirm(false)
    setDraggedItem(null)
    setDraggedFrom('')
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white">Roster Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPeriod(1)}
            className={`px-4 py-2 rounded-xl ${
              currentPeriod === 1 
                ? 'gradient-blue text-white' 
                : 'glass-dark text-gray-300 hover:text-white'
            }`}
          >
            Period 1
          </button>
          <button
            onClick={() => setCurrentPeriod(2)}
            className={`px-4 py-2 rounded-xl ${
              currentPeriod === 2 
                ? 'gradient-blue text-white' 
                : 'glass-dark text-gray-300 hover:text-white'
            }`}
          >
            Period 2
          </button>
        </div>
      </div>

      <div className="mb-4 glass-dark rounded-xl p-3">
        <p className="text-blue-400 text-sm">💡 Drag movies between slots to optimize your lineup! Locked movies (🔒) cannot be moved.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Starting Lineup */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            Starting Lineup ⭐
          </h2>
          <div className="space-y-3">
            {starters.map((slot) => (
              <div
                key={slot.id}
                draggable={!slot.locked}
                onDragStart={(e) => handleDragStart(e, slot, 'starter')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slot, 'starter')}
                className={`p-4 rounded-xl glass ${
                  slot.locked 
                    ? 'border border-red-500 opacity-75 cursor-not-allowed' 
                    : 'border border-gray-600 hover:card-glow cursor-move'
                } ${slot.movie ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20' : ''} transition-all`}
              >
                {slot.movie ? (
                  <div>
                    <div className="font-semibold text-white">{slot.movie.title}</div>
                    <div className="text-xs text-gray-400">
                      ${slot.movie.budget}M
                      {slot.locked && ' 🔒'}
                      {slot.movie.score > 0 && (
                        <span className="text-green-400 ml-2">
                          +${(slot.movie.score / 1000000).toFixed(0)}M
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Empty Slot - Drop Here</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reserve Bench */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            Reserve Bench 🎬
          </h2>
          <div className="space-y-3">
            {reserves.map((slot) => (
              <div
                key={slot.id}
                draggable={slot.movie !== null}
                onDragStart={(e) => handleDragStart(e, slot, 'reserve')}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slot, 'reserve')}
                className={`p-4 rounded-xl glass border border-gray-600 hover:card-glow transition-all cursor-move ${
                  slot.movie ? 'bg-gradient-to-r from-blue-900/20 to-cyan-900/20' : ''
                }`}
              >
                {slot.movie ? (
                  <div>
                    <div className="font-semibold text-white">{slot.movie.title}</div>
                    <div className="text-xs text-gray-400">
                      ${slot.movie.budget}M
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Empty Slot - Drop Here</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Waiver Wire */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-white">
            Waiver Wire 📋
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {waiverWire.map((movie) => (
              <div
                key={movie.id}
                draggable
                onDragStart={(e) => handleDragStart(e, movie, 'waiver')}
                className="p-3 glass border border-gray-600 rounded-xl hover:card-glow hover:scale-105 transition-all cursor-move"
              >
                <div className="font-semibold text-white">{movie.title}</div>
                <div className="text-xs text-gray-400">
                  ${movie.budget}M • {movie.releaseDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 glass-dark rounded-2xl p-4">
        <h3 className="font-bold text-blue-400 mb-2">Pro Tips:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Drag movies between slots to optimize your lineup</li>
          <li>• Starting movies lock when released (🔒 = locked)</li>
          <li>• 5 starters count toward your massive profits</li>
          <li>• Reserve movies = your secret weapons</li>
        </ul>
      </div>

      {/* Swap Confirmation Modal */}
      {showSwapConfirm && swapDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Roster Move</h3>
            <p className="text-gray-300 mb-4">
              Move <span className="text-blue-400 font-bold">
                {swapDetails.draggedItem.movie?.title || swapDetails.draggedItem.title}
              </span> to {swapDetails.to} slot?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSwapConfirm(false)}
                className="flex-1 glass border border-gray-500 text-gray-300 py-2 rounded-xl hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwap}
                className="flex-1 gradient-blue text-white py-2 rounded-xl font-bold"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default RosterManagement