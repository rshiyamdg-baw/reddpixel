import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

const EXPERIENCES = [
  { title: "Freelance Architect", duration: "3 YRS", role: "Creative WebGL" },
  { title: "UI/UX Engineer", duration: "2 YRS", role: "System Design" },
  { title: "Tower Technician", duration: "1 YR", role: "Hardware/RF" }
]

const LANGUAGES = [
  { name: "PERSIAN", level: "NATIVE", pct: "w-[100%]" },
  { name: "ENGLISH", level: "FLUENT", pct: "w-[90%]" },
  { name: "GERMAN", level: "B2", pct: "w-[75%]" }
]

const SKILLS = ['REACT', 'THREE.JS', 'GSAP', 'GLSL', 'TYPESCRIPT', 'TAILWIND']

// THE FIX: Restored your favorite geometry and fixed the Tailwind dynamic class bug!
const PersianNode = ({ className = "w-4 h-4" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Solid center square */}
    <div className="absolute inset-0 bg-red-600 shadow-[0_0_20px_#dc2626]" />
    {/* Rotated outer border square */}
    {/* <div className="absolute inset-0 border border-red-400 rotate-45 scale-[1.8] opacity-50" /> */}
  </div>
)

const AboutPhaseUI: React.FC = () => {
  const { currentPhase, mode, isMobile } = useExperience()
  const isExplore = mode === MODES.EXPLORE && currentPhase === 1
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    if (tl.current) tl.current.kill()
    gsap.set(containerRef.current, { autoAlpha: 0 })

    tl.current = gsap.timeline({ paused: true })
      .to(containerRef.current, { autoAlpha: 1, duration: 0.1 })
      // THE FIX: The node spins 45 degrees into place!
      .fromTo('.anim-node', { scale: 0, rotate: 0 }, { scale: 1, rotate: 45, duration: 0.8, ease: 'back.out(1.5)' })
      .fromTo('.anim-line', { scaleX: 0, transformOrigin: isMobile ? 'right' : 'left' }, { scaleX: 1, duration: 0.6, ease: 'expo.inOut' }, "-=0.5")
      .fromTo('.anim-top-content', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, "-=0.3")
      .fromTo('.anim-bot-content', { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, "-=0.4")
  }, { scope: containerRef, dependencies: [isMobile] })

  useGSAP(() => {
    if (isExplore) tl.current?.timeScale(1).play()
    else tl.current?.timeScale(2.5).reverse()
  }, [isExplore])

  return (
    <div ref={containerRef} className="invisible opacity-0 fixed inset-0 z-40 pointer-events-none overflow-hidden">
      
      {/* DESKTOP LAYOUT - The Split-Horizon */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center max-w-[1400px] mx-auto">
          
          {/* Center Red Node - Physically dead center! */}
          <div className="w-1/2 flex justify-end items-center relative h-full">
             <div className="anim-node absolute right-0 translate-x-1/2 z-10">
                {/* THE FIX: Explicit Tailwind class sizes for desktop! */}
                <PersianNode className="w-6 h-6" />
             </div>
          </div>

          {/* Right Content Area - Cut in half by the line */}
          <div className="w-1/2 h-full relative flex flex-col justify-center pl-10 pr-[10%]">
             
             {/* The Horizon Line */}
             <div className="anim-line absolute left-0 top-1/2 -translate-y-1/2 w-[120%] h-[1px] bg-gradient-to-r from-red-500 to-transparent opacity-60 z-0" />

             {/* Top Half (Above the Line) */}
             <div className="absolute bottom-1/2 left-10 w-full flex flex-col justify-end pb-8">
                <div className="flex items-center gap-6 mb-8">
                   <div className="anim-top-content relative w-16 h-16 border border-red-500/50 p-1 rotate-45 bg-[#050000] shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                       <img src="/hero.png" alt="Profile" className="w-full h-full object-cover -rotate-45 opacity-80 mix-blend-luminosity" />
                   </div>
                   <div className="anim-top-content">
                       <h2 className="text-3xl font-light tracking-[0.2em] text-red-100">THE ARCHITECT</h2>
                       <p className="text-xs text-red-500/80 tracking-widest uppercase mt-1">Creative Developer</p>
                   </div>
                </div>

                <p className="anim-top-content text-xs tracking-wide text-red-100/70 leading-relaxed font-light max-w-[90%] mb-6 drop-shadow-md">
                  Bridging raw hardware graphics and buttery-smooth user interfaces. I forge unbreakable DOM architectures and weave WebGL mathematics into pure visual poetry.
                </p>

                <div className="anim-top-content flex flex-wrap gap-2 max-w-[90%]">
                  {SKILLS.map(skill => (
                      <span key={skill} className="border border-red-900/50 px-2 py-1 bg-[#050000]/60 backdrop-blur-sm text-[9px] text-red-400 font-bold tracking-widest shadow-lg">{skill}</span>
                  ))}
                </div>
             </div>

             {/* Bottom Half (Below the Line) */}
             <div className="absolute top-1/2 left-10 w-full flex justify-start items-start pt-8 gap-12">
                
                {/* Timeline */}
                <div className="flex-1">
                  <div className="anim-bot-content border-l border-red-900/50 pl-5 space-y-5">
                    {EXPERIENCES.map((exp, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -left-[23px] top-1 w-2 h-2 rotate-45 ${i === 0 ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'border border-red-500'}`} />
                        <h4 className="text-xs tracking-wider text-red-100 uppercase drop-shadow-md">{exp.title}</h4>
                        <div className="flex gap-2 mt-1 items-center">
                          <p className="text-[9px] text-red-500/70 tracking-widest">{exp.duration}</p>
                          <span className="text-[9px] text-red-800/50">|</span>
                          <p className="text-[9px] text-red-400/60 tracking-widest">{exp.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="flex-1 space-y-4 max-w-[200px]">
                  {LANGUAGES.map(lang => (
                    <div key={lang.name} className="anim-bot-content">
                      <div className="flex justify-between text-[9px] text-red-400 mb-1 tracking-widest drop-shadow-md"><span>{lang.name}</span><span>{lang.level}</span></div>
                      <div className="w-full h-[1px] bg-red-900/30"><div className={`${lang.pct} h-full bg-red-500 shadow-[0_0_8px_#ef4444]`} /></div>
                    </div>
                  ))}
                </div>

             </div>

          </div>
        </div>
      )}

      {/* MOBILE LAYOUT - Safely positioned Middle-Right! */}
      {isMobile && (
        <div className="absolute top-[18%] right-5 w-full max-w-[280px] flex flex-col items-end">
            
            {/* Thematic Header Anchor */}
            <div className="relative flex items-center justify-end w-full mb-6">
              <div className="anim-line w-[100vw] h-[1px] bg-gradient-to-l from-red-500 to-transparent mr-4 opacity-60" />
              <div className="anim-node z-10">
                  {/* THE FIX: Standard explicit sizing for mobile! */}
                  <PersianNode className="w-4 h-4" />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col items-end text-right w-full pr-1">
                
                {/* Profile Header */}
                <div className="flex justify-end items-center gap-3 mb-5">
                   <div className="anim-top-content">
                       <h2 className="text-[13px] font-bold tracking-[0.2em] text-red-100 drop-shadow-lg">SHIYAM</h2>
                       <p className="text-[8px] text-red-500/90 tracking-widest mt-1 uppercase">Creative Engineer</p>
                   </div>
                   <div className="anim-top-content relative w-10 h-10 border border-red-500/50 p-1 rotate-45 bg-[#050000]">
                       <img src="/hero.png" alt="Profile" className="w-full h-full object-cover -rotate-45 opacity-80 mix-blend-luminosity" />
                   </div>
                </div>

                <p className="anim-top-content text-[10px] tracking-wide text-red-100/80 leading-relaxed font-light mb-6 drop-shadow-md">
                  Bridging raw hardware and buttery UI with unbreakable WebGL DOM architecture.
                </p>

                {/* Skills Row */}
                <div className="anim-top-content flex flex-wrap gap-1.5 justify-end mb-6">
                  {SKILLS.slice(0, 5).map(skill => (
                      <span key={skill} className="border border-red-900/50 px-1.5 py-0.5 bg-[#050000]/60 text-[7px] text-red-400 font-bold tracking-widest">{skill}</span>
                  ))}
                </div>

                <div className="flex flex-col gap-6 w-full items-end mt-2">
                  
                  {/* Timeline */}
                  <div className="anim-bot-content border-r border-red-900/50 pr-3 space-y-4 text-right">
                    {EXPERIENCES.map((exp, i) => (
                      <div key={i} className="relative">
                        <div className={`absolute -right-[15px] top-1 w-1.5 h-1.5 rotate-45 ${i === 0 ? 'bg-red-600 shadow-[0_0_5px_#dc2626]' : 'border border-red-500'}`} />
                        <h4 className="text-[9px] tracking-wider text-red-100 drop-shadow-md">{exp.title}</h4>
                        <p className="text-[7px] text-red-500/80 tracking-widest mt-0.5">{exp.duration} | {exp.role}</p>
                      </div>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="anim-bot-content space-y-3 w-[70%]">
                    {LANGUAGES.map(lang => (
                      <div key={lang.name}>
                        <div className="flex justify-between text-[7px] text-red-400 mb-1 tracking-widest drop-shadow-md"><span>{lang.level}</span><span>{lang.name}</span></div>
                        <div className="w-full h-[1px] bg-red-900/30 flex justify-end"><div className={`${lang.pct} h-full bg-red-500 shadow-[0_0_5px_#ef4444]`} /></div>
                      </div>
                    ))}
                  </div>

                </div>
            </div>
        </div>
      )}
      
    </div>
  )
}

export default AboutPhaseUI