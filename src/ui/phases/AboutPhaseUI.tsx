import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

const AboutPhaseUI: React.FC = () => {
  const currentPhase = useExperience((state) => state.currentPhase)
  const mode = useExperience((state) => state.mode)
  const isMobile = useExperience((state) => state.isMobile)

  // Trigger only on Phase 1
  const isExplore = mode === MODES.EXPLORE && currentPhase === 1

  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  // 1. UNBREAKABLE GSAP TIMELINE
  useGSAP(() => {
    gsap.set(containerRef.current, { autoAlpha: 0 })

    tl.current = gsap.timeline({ paused: true })
      .to(containerRef.current, { autoAlpha: 1, duration: 0.1 })
      
      // The Core Red Square Animation
      .fromTo('.anim-square',
        { scale: 0, rotate: 0 },
        { scale: 1, rotate: 45, duration: 0.6, ease: 'back.out(1.5)' }
      )
      
      // The Sharp Line Animation (Targets horizontal on desktop, vertical on mobile)
      .fromTo(isMobile ? '.anim-line-mobile' : '.anim-line-desktop',
        { scale: 0, transformOrigin: 'center' },
        { scale: 1, duration: 0.6, ease: 'expo.inOut' },
        "-=0.2"
      )
      
      // The Text Content Fade Up
      .fromTo('.anim-content',
        { opacity: 0, y: isMobile ? 15 : 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        "-=0.2"
      )
  }, { scope: containerRef, dependencies: [isMobile] }) // Rebuilds automatically if device flips!

  // 2. TIMELINE PLAYBACK CONTROL
  useGSAP(() => {
    if (isExplore) tl.current?.play()
    else tl.current?.reverse()
  }, [isExplore])

  return (
    <div ref={containerRef} className="invisible opacity-0 fixed inset-0 z-40 flex items-center justify-center p-6 pointer-events-none">
      
      {/* ========================================= */}
      {/* DESKTOP LAYOUT (Horizontal Split)           */}
      {/* ========================================= */}
      {!isMobile && (
        <div className="flex items-center justify-center w-full max-w-5xl pointer-events-auto">
          
          <div className="anim-content w-1/3 text-right pr-12">
            <h2 className="text-3xl font-light tracking-[0.2em] text-red-100">WHO AM I</h2>
            <p className="mt-4 text-xs tracking-wide text-red-100/60 leading-relaxed font-light">
              Interactive architect specializing in rendering contexts, WebGL mathematics, and unbreakable DOM architectures.
            </p>
          </div>

          <div className="relative flex items-center justify-center w-32 h-32">
            {/* The Central Gem Node */}
            <div className="anim-square absolute w-4 h-4 bg-red-600 shadow-[0_0_20px_#dc2626]" />
            <div className="anim-square absolute w-4 h-4 border border-red-400 rotate-45 scale-[1.8] opacity-50" />
            
            {/* The Horizontal Line */}
            <div className="anim-line-desktop absolute w-[600px] h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
          </div>

          <div className="anim-content w-1/3 text-left pl-12">
            <h2 className="text-3xl font-light tracking-[0.2em] text-red-100">MISSION</h2>
            <p className="mt-4 text-xs tracking-wide text-red-100/60 leading-relaxed font-light">
              Bridging the gap between raw hardware graphics and buttery-smooth user interfaces without compromise.
            </p>
          </div>
          
        </div>
      )}

      {/* ========================================= */}
      {/* MOBILE LAYOUT (Vertical Stack)            */}
      {/* ========================================= */}
      {isMobile && (
        <div className="flex flex-col items-center justify-center w-full h-full pointer-events-auto mt-8">
          
          <div className="anim-content text-center mb-10">
            <h2 className="text-2xl font-light tracking-[0.2em] text-red-100">WHO AM I</h2>
            <p className="mt-4 text-[10px] tracking-wide text-red-100/60 leading-relaxed font-light max-w-[250px] mx-auto">
              Interactive architect specializing in rendering contexts and WebGL mathematics.
            </p>
          </div>

          <div className="relative flex items-center justify-center w-full h-24">
            {/* The Central Gem Node */}
            <div className="anim-square absolute w-4 h-4 bg-red-600 shadow-[0_0_20px_#dc2626]" />
            <div className="anim-square absolute w-4 h-4 border border-red-400 rotate-45 scale-[1.8] opacity-50" />
            
            {/* The Vertical Line */}
            <div className="anim-line-mobile absolute w-[1px] h-[200px] bg-gradient-to-b from-transparent via-red-500 to-transparent" />
          </div>

          <div className="anim-content text-center mt-10">
            <h2 className="text-2xl font-light tracking-[0.2em] text-red-100">MISSION</h2>
            <p className="mt-4 text-[10px] tracking-wide text-red-100/60 leading-relaxed font-light max-w-[250px] mx-auto">
              Bridging the gap between raw hardware graphics and buttery-smooth user interfaces.
            </p>
          </div>

        </div>
      )}
      
    </div>
  )
}

export default AboutPhaseUI