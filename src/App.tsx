import React, { useEffect, useState } from 'react'
import { useDetectGPU } from '@react-three/drei'
import { useExperience } from './stores/useExperience'
import Experience from './world/Experience'
import Layout from './ui/Layout'

const App: React.FC = () => {
  // @ts-ignore - Drei types can sometimes be loose for this hook
  const GPUTier = useDetectGPU() 
  const setHardwareProfile = useExperience((state) => state.setHardwareProfile)
  
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    if (GPUTier) {
      const isMobile = GPUTier.isMobile === true || window.innerWidth < 768;
      // If mobile OR tier 1/0 integrated graphics
      const isWeak = isMobile || (typeof GPUTier.tier === 'number' && GPUTier.tier <= 1);
      
      setHardwareProfile(isMobile, isWeak)
      
      const timer = setTimeout(() => setIsReady(true), 500)
      return () => clearTimeout(timer)
    }
  }, [GPUTier, setHardwareProfile])

  if (!isReady) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative flex h-16 w-16 animate-[spin_4s_linear_infinite] items-center justify-center">
            <div className="absolute inset-0 rotate-45 border border-red-500/40" />
            <div className="absolute inset-0 border border-red-500/40" />
            <div className="h-3 w-3 animate-pulse bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]" />
        </div>
        <p className="mt-8 animate-pulse font-mono text-[10px] uppercase tracking-[0.4em] text-red-500/80">
          Initializing Architecture...
        </p>
      </div>
    )
  }

  return (
    <>
      <Experience />
      <Layout />
    </>
  )
}

export default App