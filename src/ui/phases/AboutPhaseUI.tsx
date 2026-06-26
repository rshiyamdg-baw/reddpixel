import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

const AboutPhaseUI: React.FC = () => {
  const { currentPhase, mode, isMobile } = useExperience()
  const isExplore = mode === MODES.EXPLORE && currentPhase === 1
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    gsap.set(containerRef.current, { autoAlpha: 0 })

    tl.current = gsap.timeline({ paused: true })
      .to(containerRef.current, { autoAlpha: 1, duration: 0.1 })
      .fromTo('.anim-square',
        { scale: 0, rotate: 0 },
        { scale: 1, rotate: 45, duration: 0.6, ease: 'back.out(1.5)' }
      )
      .fromTo(isMobile ? '.anim-line-mobile' : '.anim-line-desktop',
        { scaleX: 0, scaleY: 0, transformOrigin: 'center' },
        { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'expo.inOut' },
        "-=0.4"
      )
      .fromTo('.anim-content',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' },
        "-=0.2"
      )
  }, { scope: containerRef, dependencies: [isMobile] })

  useGSAP(() => {
    if (isExplore) tl.current?.timeScale(1).play()
    else tl.current?.timeScale(2).reverse()
  }, [isExplore])

  return (
    <div ref={containerRef} className="invisible opacity-0 fixed inset-0 z-40 flex items-center justify-center pointer-events-none p-4">
      
      {/* DESKTOP LAYOUT (Unchanged - Keeps the pristine layout) */}
      {!isMobile && (
        <div className="flex w-full max-w-6xl items-center justify-between pointer-events-auto pb-24">
          <div className="flex flex-col w-[35%] text-right items-end pr-8">
            <h2 className="anim-content text-3xl font-light tracking-[0.2em] text-red-100 mb-2">THE ARCHITECT</h2>
            <p className="anim-content text-[10px] tracking-widest text-red-500 mb-4 uppercase">Interactive Developer</p>
            <p className="anim-content text-xs tracking-wide text-red-100/60 leading-relaxed font-light mb-6">
              Bridging the gap between raw hardware graphics and buttery-smooth user interfaces. I forge unbreakable DOM architectures and weave WebGL mathematics.
            </p>
            <div className="anim-content flex flex-wrap gap-2 justify-end mb-4 max-w-[250px]">
              {['REACT', 'THREE.JS', 'GSAP', 'GLSL'].map(skill => (
                  <span key={skill} className="border border-red-900/50 px-2 py-1 bg-black/40 text-[9px] text-red-400 font-bold tracking-widest">{skill}</span>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="anim-square absolute w-4 h-4 bg-red-600 shadow-[0_0_20px_#dc2626] z-10" />
            <div className="anim-square absolute w-4 h-4 border border-red-400 rotate-45 scale-[1.8] opacity-50 z-10" />
            <div className="anim-line-desktop absolute w-[700px] h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60" />
          </div>

          <div className="flex flex-col w-[35%] text-left pl-8">
              <div className="anim-content flex items-center gap-4 mb-8">
                 <div className="relative w-12 h-12 border border-red-500/50 p-1 rotate-45 bg-[#050000]">
                     <img src="/hero.png" alt="Profile" className="w-full h-full object-cover -rotate-45 opacity-80 mix-blend-luminosity" />
                 </div>
                 <div>
                     <h3 className="text-sm font-bold tracking-[0.2em] text-red-200">SHIYAM</h3>
                     <p className="text-[9px] text-red-500/80 tracking-widest">SYSTEM ARCHITECT</p>
                 </div>
              </div>

              <div className="anim-content border-l border-red-900/50 pl-4 space-y-5 mb-8">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2 h-2 bg-red-600 shadow-[0_0_10px_#dc2626] rotate-45" />
                  <h4 className="text-xs tracking-wider text-red-100">Freelance Architect</h4>
                  <p className="text-[9px] text-red-500/70 tracking-widest mt-1">3 YEARS EXP</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2 h-2 border border-red-500 rotate-45" />
                  <h4 className="text-xs tracking-wider text-red-100">Radio Tower Technician</h4>
                  <p className="text-[9px] text-red-500/70 tracking-widest mt-1">1 YEAR EXP</p>
                </div>
              </div>

              <div className="anim-content space-y-3 w-full max-w-[200px]">
                <div>
                  <div className="flex justify-between text-[9px] text-red-400 mb-1 tracking-widest"><span>ENGLISH</span><span>FLUENT</span></div>
                  <div className="w-full h-[1px] bg-red-900/30"><div className="w-[90%] h-full bg-red-500 shadow-[0_0_10px_#ef4444]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-[9px] text-red-400 mb-1 tracking-widest"><span>GERMAN</span><span>B2</span></div>
                  <div className="w-full h-[1px] bg-red-900/30"><div className="w-[75%] h-full bg-red-500" /></div>
                </div>
              </div>
          </div>
        </div>
      )}

      {/* THE FIX: MOBILE LAYOUT - Beautifully centered in the top 60% of the screen! */}
      {isMobile && (
        <div className="absolute top-0 left-0 w-full h-[65%] flex flex-col justify-center items-center pointer-events-auto px-6 mt-8">
            
            {/* Top Text */}
            <div className="text-center w-full mb-6">
                <h2 className="anim-content text-2xl font-light tracking-[0.2em] text-red-100 mb-1">THE ARCHITECT</h2>
                <p className="anim-content text-[10px] tracking-widest text-red-500 mb-3 uppercase">Creative Developer</p>
                <p className="anim-content text-[11px] tracking-wide text-red-100/60 leading-relaxed font-light max-w-[280px] mx-auto">
                    Bridging raw hardware graphics and buttery-smooth user interfaces with unbreakable DOM architecture.
                </p>
            </div>

            {/* The Glorious Center Node */}
            <div className="relative flex items-center justify-center w-full h-16 my-2">
                <div className="anim-square absolute w-4 h-4 bg-red-600 shadow-[0_0_20px_#dc2626] z-10" />
                <div className="anim-square absolute w-4 h-4 border border-red-400 rotate-45 scale-[1.8] opacity-50 z-10" />
                <div className="anim-line-mobile absolute w-[1px] h-[120px] bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-60" />
                <div className="anim-line-mobile absolute w-[80vw] h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-40" />
            </div>

            {/* Bottom Row: Timeline & Profile Split */}
            <div className="w-full max-w-[300px] flex justify-between items-start mt-8 px-2">
                
                {/* Left: Timeline */}
                <div className="anim-content border-l border-red-900/50 pl-3 space-y-4">
                    <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-1.5 h-1.5 bg-red-600 shadow-[0_0_10px_#dc2626] rotate-45" />
                        <h4 className="text-[10px] tracking-wider text-red-100">Freelance Architect</h4>
                        <p className="text-[8px] text-red-500/70 tracking-widest mt-1">3 YRS EXP</p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[17px] top-1 w-1.5 h-1.5 border border-red-500 rotate-45" />
                        <h4 className="text-[10px] tracking-wider text-red-100">Tower Tech</h4>
                        <p className="text-[8px] text-red-500/70 tracking-widest mt-1">1 YR EXP</p>
                    </div>
                </div>

                {/* Right: Portrait & Languages */}
                <div className="flex flex-col items-end gap-4">
                     <div className="relative w-10 h-10 border border-red-500/50 p-1 rotate-45 bg-[#050000]">
                         <img src="/hero.png" alt="Profile" className="w-full h-full object-cover -rotate-45 opacity-80 mix-blend-luminosity" />
                     </div>
                     <div className="anim-content space-y-2 w-[100px]">
                        <div>
                            <div className="flex justify-between text-[8px] text-red-400 mb-1 tracking-widest"><span>ENG</span><span>FLUENT</span></div>
                            <div className="w-full h-[1px] bg-red-900/30 flex justify-end"><div className="w-[90%] h-full bg-red-500" /></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[8px] text-red-400 mb-1 tracking-widest"><span>GER</span><span>B2</span></div>
                            <div className="w-full h-[1px] bg-red-900/30 flex justify-end"><div className="w-[75%] h-full bg-red-500" /></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      )}
      
    </div>
  )
}

export default AboutPhaseUI