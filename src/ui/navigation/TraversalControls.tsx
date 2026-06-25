import React, { useState } from 'react'
import { goBack, goDeeper, enterExploreMode, exitExploreMode, FIRST_INTERIOR_PHASE } from '../../core/timeline/cinematicController'
import { useExperience, MODES } from '../../stores/useExperience'

const TraversalControls: React.FC = () => {
  const show = useExperience((state) => state.showTraversalControls())
  const currentPhase = useExperience((state) => state.currentPhase)
  const isTransitioning = useExperience((state) => state.isTransitioning)
  const mode = useExperience((state) => state.mode)

  const [isPending, setIsPending] = useState<boolean>(false)

  if (!show) return null

  const canGoBack = currentPhase >= FIRST_INTERIOR_PHASE && !isTransitioning
  const canGoDeeper = !isTransitioning
  const isExplore = mode === MODES.EXPLORE

  const handleYellowClick = () => {
    if (isExplore) exitExploreMode()
    else enterExploreMode()
  }

  const handleRedClick = () => {
    if (isExplore) {
      setIsPending(true)
      exitExploreMode()
      setTimeout(() => { goDeeper(); setIsPending(false) }, 1000)
    } else {
      goDeeper()
    }
  }

  const handleBlueClick = () => {
    if (isExplore) {
      setIsPending(true)
      exitExploreMode()
      setTimeout(() => { goBack(); setIsPending(false) }, 1000)
    } else {
      goBack()
    }
  }

  return (
    <nav aria-label="Dimensional traversal" className="pointer-events-auto fixed bottom-8 left-1/2 z-50 flex h-28 w-36 -translate-x-1/2 items-center justify-center sm:bottom-12">
      <button
        type="button"
        disabled={isTransitioning || isPending}
        onClick={handleYellowClick}
        className="absolute top-0 flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500/40 bg-black/40 shadow-[0_0_20px_rgba(250,204,21,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-yellow-400 hover:bg-yellow-500/20 disabled:opacity-50"
      >
        <div className={`h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,1)] transition-transform duration-300 ${isExplore ? 'scale-50' : 'scale-100'}`} />
      </button>

      <button
        type="button"
        disabled={!canGoBack || isPending}
        onClick={handleBlueClick}
        className="absolute bottom-0 left-0 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/40 bg-black/40 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-blue-400 hover:bg-blue-500/20 disabled:opacity-30 disabled:hover:scale-100"
      >
        <span className="text-xl font-light">←</span>
      </button>

      <button
        type="button"
        disabled={!canGoDeeper || isPending}
        onClick={handleRedClick}
        className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/40 bg-black/40 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-red-400 hover:bg-red-500/20 disabled:opacity-30 disabled:hover:scale-100"
      >
        <span className="text-xl font-light">→</span>
      </button>
    </nav>
  )
}

export default TraversalControls