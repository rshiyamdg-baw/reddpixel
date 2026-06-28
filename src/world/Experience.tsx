import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useExperience } from '../stores/useExperience'
import TimelineBridge from '../core/timeline/TimelineBridge'
import GlassShell from './GlassShell'
import InnerWorldEnvironment from './InnerWorldEnvironment'
import GemAura from './GemAura' // YOUR ORIGINAL GEM AURA RESTORED
import { Perf } from 'r3f-perf'

const Scene: React.FC = () => {
  return (
    <>
      <TimelineBridge />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 8]} intensity={1.2} />
      
      {/* Background Phase 0 Atmosphere */}
      <GemAura /> 
      
      {/* The Core Artifacts */}
      <GlassShell />
      <InnerWorldEnvironment />
    </>
  )
}

const Experience: React.FC = () => {
  const isLowEnd = useExperience((state) => state.isLowEnd)

  return (
    <div id="webgl-root" className="webgl-layer fixed inset-0 z-0">
      <Canvas
        dpr={isLowEnd ? 1 : [1, 2]}
        gl={{
          antialias: !isLowEnd, // Saves massive bandwidth on mobile
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ fov: 45, near: 0.01, far: 500, position: [0, 0, 12] }}
        shadows={!isLowEnd} // Off entirely on mobile!
      >
        {/* <Perf /> */}
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Experience