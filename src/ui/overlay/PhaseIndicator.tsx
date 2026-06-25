import React from 'react'
import { useExperience } from '../../stores/useExperience'

const PhaseIndicator: React.FC = () => {
  const currentPhase = useExperience((state) => state.currentPhase)
  const isLanding = currentPhase === 0

  return (
    <div 
      className={`fixed top-8 left-8 z-50 transition-opacity duration-1000 pointer-events-none
      ${isLanding ? 'opacity-0' : 'opacity-100'}`}
    >
      <p className="font-mono text-xs tracking-[0.4em] text-white/50 uppercase">
        PHASE // <span className="text-red-500 font-bold">0{currentPhase}</span>
      </p>
    </div>
  )
}

export default PhaseIndicator