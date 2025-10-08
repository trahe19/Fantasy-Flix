'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ActorProfile from '../../../components/ActorProfile'

export default function ActorPage() {
  const params = useParams()
  const [actorId, setActorId] = useState<number | null>(null)

  useEffect(() => {
    if (params.id) {
      const id = parseInt(params.id as string)
      if (!isNaN(id)) {
        setActorId(id)
      }
    }
  }, [params.id])

  if (!actorId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <ActorProfile 
        actorId={actorId} 
        isOpen={true} 
        onClose={() => window.history.back()} 
      />
    </div>
  )
}