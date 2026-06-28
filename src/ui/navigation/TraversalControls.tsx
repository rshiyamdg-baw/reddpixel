import React, { useState } from 'react'
import { goBack, goDeeper, FIRST_INTERIOR_PHASE } from '../../core/timeline/cinematicController'
import { useExperience } from '../../stores/useExperience'

const TraversalControls: React.FC = () => {
  const show = useExperience((state) => state.showTraversalControls())
  const currentPhase = useExperience((state) => state.currentPhase)
  const isTransitioning = useExperience((state) => state.isTransitioning)

  const [isPending, setIsPending] = useState<boolean>(false)

  if (!show) return null

  const canGoBack = currentPhase >= FIRST_INTERIOR_PHASE && !isTransitioning
  
  // THE FIX: Unlocked! You can now click "Next" on Phase 3 to trigger the Blackout Loop!
  const canGoDeeper = !isTransitioning

  const handleRedClick = () => {
    setIsPending(true)
    goDeeper()
    setTimeout(() => setIsPending(false), 1200)
  }

  const handleBlueClick = () => {
    setIsPending(true)
    goBack()
    setTimeout(() => setIsPending(false), 1200)
  }

  return (
    <nav aria-label="Dimensional traversal" className="pointer-events-auto fixed bottom-6 sm:bottom-10 left-1/2 z-50 flex h-16 w-40 -translate-x-1/2 items-center justify-between">
      
      {/* PREVIOUS BUTTON (BLUE) */}
      <button
        type="button"
        disabled={!canGoBack || isPending}
        onClick={handleBlueClick}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/40 bg-black/60 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-blue-400 hover:bg-blue-500/30 disabled:opacity-30 disabled:hover:scale-100"
      >
        <span className="text-xl font-light">←</span>
      </button>

      {/* NEXT BUTTON (RED) */}
      <button
        type="button"
        disabled={!canGoDeeper || isPending}
        onClick={handleRedClick}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/40 bg-black/60 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-400 hover:bg-red-500/30 disabled:opacity-30 disabled:hover:scale-100"
      >
        <span className="text-xl font-light">→</span>
      </button>
      
    </nav>
  )
}

export default TraversalControls