import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

// ... [Keep your PROJECTS array here exactly as it was] ...
const PROJECTS = [
  { id: 1, title: "AlphaTradeZone", category: "Front-End Engineering", image: "/images/project1.jpg", description: "A high-performance landing page engineered for a premier trading signal service.", link: "#", theme: { border: "border-cyan-500/40", borderBright: "border-cyan-500/80", borderSolid: "border-cyan-500", bg: "bg-cyan-900/10", bgSweep: "bg-cyan-900/60", bgDark: "bg-cyan-900/80", bgSolid: "bg-cyan-500", lineStroke: "#22d3ee", text: "text-cyan-200", accent: "text-cyan-400", hoverBox: "hover:bg-cyan-900/30", glow: "rgba(34, 211, 238, 0.9)" } },
  { id: 2, title: "Creative Developer", category: "3D Architecture", image: "/images/project2.jpg", description: "An immersive 3D web portfolio built for an architect. I handled the entire pipeline...", link: "#", theme: { border: "border-red-500/40", borderBright: "border-red-500/80", borderSolid: "border-red-500", bg: "bg-red-900/10", bgSweep: "bg-red-900/60", bgDark: "bg-red-900/80", bgSolid: "bg-red-500", lineStroke: "#ef4444", text: "text-red-100", accent: "text-red-500", hoverBox: "hover:bg-red-900/30", glow: "rgba(239, 68, 68, 0.9)" } },
  { id: 3, title: "High Voltage & Altitude", category: "Physical Engineering", image: "/images/project3.jpg", description: "Not a web application, but a testament to physical hardware and raw electricity...", link: "#", theme: { border: "border-amber-500/40", borderBright: "border-amber-500/80", borderSolid: "border-amber-500", bg: "bg-amber-900/10", bgSweep: "bg-amber-900/60", bgDark: "bg-amber-900/80", bgSolid: "bg-amber-500", lineStroke: "#fbbf24", text: "text-amber-100", accent: "text-amber-500", hoverBox: "hover:bg-amber-900/30", glow: "rgba(251, 191, 36, 0.9)" } }
]

const WorksPhaseUI: React.FC = () => {
  const currentPhase = useExperience((state) => state.currentPhase)
  const mode = useExperience((state) => state.mode)
  const isExplore = mode === MODES.EXPLORE && currentPhase === 2
  
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // SVG Refs for the restored lines!
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const pathLengths = useRef<number[]>([])

  // Measure paths on mount
  useEffect(() => {
    pathRefs.current.forEach((path, i) => {
      if (path) {
        const length = path.getTotalLength()
        pathLengths.current[i] = length
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }) // Hide initially
      }
    })
  }, [])

  // 1. UNBREAKABLE TIMELINE (No tailwind invisible/opacity-0 classes to fight with!)
  useGSAP(() => {
    const cards = gsap.utils.toArray('.project-window')
    const centerPixels = containerRef.current?.querySelector('#center-pixels')
    
    // Set initial GSAP state (hidden)
    gsap.set(containerRef.current, { autoAlpha: 0 })

    tl.current = gsap.timeline({ paused: true })
      // Smooth fade in of the entire layer
      .to(containerRef.current, { autoAlpha: 1, duration: 0.1 })
      
      // Animate the center origin dots
      .fromTo(centerPixels, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(2)' })

      // Animate the SVG lines tracing outward!
      .to(pathRefs.current, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        stagger: 0.1
      }, "-=0.2")

      // Slide and fade the cards in exactly as the lines hit them
      .fromTo(cards, 
        { y: 100, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        "-=0.6"
      )
  }, { scope: containerRef })

  // 2. TIMELINE PLAYBACK
  useGSAP(() => {
    if (isExplore) tl.current?.play()
    else {
      // Reverse smoothly. When reverse finishes, autoAlpha automatically returns to 0. No flashing.
      tl.current?.reverse()
      setTimeout(() => setExpandedId(null), 500)
    }
  }, [isExplore])

  return (
    // THE FIX: Removed `invisible opacity-0` from here. GSAP `autoAlpha` handles it flawlessly.
    <div ref={containerRef} className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-10 lg:p-16 pointer-events-none">
      
      {/* RESTORED CENTER PIXELS */}
      <div id="center-pixels" className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-30 flex gap-24 pointer-events-none">
        <div className="w-2 h-2 bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
        <div className="w-2 h-2 bg-red-500 shadow-[0_0_15px_#ef4444]" />
        <div className="w-2 h-2 bg-amber-400 shadow-[0_0_15px_#fbbf24]" />
      </div>

      {/* RESTORED SVG CIRCUIT LINES */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {PROJECTS.map((p, i) => (
          <path 
            key={`path-${p.id}`} 
            ref={(el) => (pathRefs.current[i] = el)} 
            // Draws lines from bottom center up to the cards
            d={`M ${typeof window !== 'undefined' ? window.innerWidth / 2 + (i - 1) * 100 : 0} ${typeof window !== 'undefined' ? window.innerHeight * 0.9 : 0} L ${typeof window !== 'undefined' ? window.innerWidth / 2 + (i - 1) * 300 : 0} ${typeof window !== 'undefined' ? window.innerHeight * 0.5 : 0}`}
            fill="none" 
            stroke={p.theme.lineStroke} 
            strokeWidth="1.5" 
            style={{ filter: `drop-shadow(0px 0px 8px ${p.theme.lineStroke})` }} 
          />
        ))}
      </svg>

      <div className={`flex w-full max-w-6xl flex-col md:flex-row items-center justify-center h-[85vh] md:h-[65vh] pb-8 gap-6 pointer-events-auto transition-all duration-700`}>
        {PROJECTS.map((project) => {
          const isExpanded = expandedId === project.id
          const isHidden = expandedId !== null && expandedId !== project.id

          return (
            <div 
              key={project.id}
              className={`project-window relative flex flex-col overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-black/80 backdrop-blur-md ${project.theme.border}
                ${isHidden ? 'w-0 opacity-0 mx-0 border-transparent pointer-events-none' : 'opacity-100'}
                ${isExpanded ? 'w-full h-full md:w-full md:h-full rounded-[40px] md:rounded-[60px]' : 'w-full md:w-[33%] h-[25vh] md:h-full rounded-[40px] md:rounded-[150px_150px_12px_12px]'}
              `}
              onClick={() => !isExpanded && setExpandedId(project.id)}
            >
              {/* COMPACT VIEW */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-white/5 cursor-pointer'}`}>
                  <div className="flex flex-col items-center text-center mt-auto mb-8">
                    <span className={`mb-2 text-[10px] uppercase tracking-[0.4em] opacity-80 ${project.theme.accent}`}>{project.category}</span>
                    <h3 className={`text-lg md:text-xl font-light tracking-[0.2em] ${project.theme.text}`}>{project.title}</h3>
                  </div>
              </div>

              {/* EXPANDED VIEW */}
              <div className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-700 delay-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button onClick={(e) => { e.stopPropagation(); setExpandedId(null); }} className={`absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border bg-black/50 backdrop-blur-md transition-all hover:scale-110 hover:bg-black/80 ${project.theme.accent} ${project.theme.border}`}>✕</button>
                <div className={`relative flex h-48 md:h-full w-full md:w-[45%] items-center justify-center border-b md:border-b-0 md:border-r p-6 bg-[#050505] ${project.theme.border}`}>
                    <div className={`relative h-full w-full border p-1.5 ${project.theme.borderBright}`}>
                        <div className={`absolute -left-1.5 -top-1.5 h-3 w-3 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`absolute -right-1.5 -top-1.5 h-3 w-3 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`absolute -left-1.5 -bottom-1.5 h-3 w-3 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`absolute -right-1.5 -bottom-1.5 h-3 w-3 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`relative h-full w-full overflow-hidden border ${project.theme.border}`}>
                            <img src={project.image} alt={project.title} className="h-full w-full object-cover mix-blend-normal opacity-70" />
                        </div>
                    </div>
                </div>
                <div className="relative flex w-full md:w-[55%] flex-col justify-center p-6 md:p-16 bg-gradient-to-br from-black/80 to-transparent">
                  <span className={`mb-4 text-[10px] uppercase tracking-[0.4em] opacity-80 ${project.theme.accent}`}>{project.category}</span>
                  <h2 className={`mb-6 text-3xl md:text-5xl font-light tracking-[0.15em] ${project.theme.text}`}>{project.title}</h2>
                  <p className={`mb-10 leading-relaxed font-light text-xs md:text-sm opacity-80 ${project.theme.text}`}>{project.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorksPhaseUI