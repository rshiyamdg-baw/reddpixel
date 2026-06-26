import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

// THE FIX: 'hidden md:block' prevents this GPU-killer from rendering on mobile!
const CSSRotatingCube = ({ colorClass }: { colorClass: string }) => (
  <div className="hidden md:block w-16 h-16 md:w-24 md:h-24 perspective-[1000px] absolute right-4 bottom-4 md:right-10 md:bottom-10 opacity-40 pointer-events-none z-0 transition-opacity duration-700">
    <div className="w-full h-full relative transform-style-3d animate-[spin_8s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateY(180deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateY(90deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateY(-90deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateX(90deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateX(-90deg) translateZ(30px)' }} />
    </div>
  </div>
)

const PROJECTS = [
  { id: 1, title: "ALPHA TRADE", category: "Front-End", image: "/images/project1.jpg", description: "A high-performance landing page engineered for a premier trading signal service.", theme: { border: "border-cyan-500/30", borderBright: "border-cyan-400", text: "text-cyan-200", accent: "text-cyan-400", bg: "bg-cyan-950/20" } },
  { id: 2, title: "ARCHITECT 3D", category: "WebGL", image: "/images/project2.jpg", description: "An immersive 3D web portfolio built for an architect. Engineered the entire pipeline...", theme: { border: "border-red-500/30", borderBright: "border-red-500", text: "text-red-100", accent: "text-red-500", bg: "bg-red-950/20" } },
  { id: 3, title: "HIGH VOLTAGE", category: "Hardware", image: "/images/project3.jpg", description: "A testament to physical hardware and raw electricity bridging with digital interfaces.", theme: { border: "border-amber-500/30", borderBright: "border-amber-400", text: "text-amber-100", accent: "text-amber-500", bg: "bg-amber-950/20" } }
]

const WorksPhaseUI: React.FC = () => {
  const { currentPhase, mode } = useExperience()
  const isExplore = mode === MODES.EXPLORE && currentPhase === 2
  
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  
  // THE FIX: The Lock State to prevent desktop hover wrestling!
  const [isClosing, setIsClosing] = useState<boolean>(false)

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true); // Lock the UI
    setExpandedId(null);
    setTimeout(() => setIsClosing(false), 700); // Unlock exactly when transition ends
  }

  useGSAP(() => {
    const cards = gsap.utils.toArray('.project-window')
    gsap.set(containerRef.current, { autoAlpha: 0 })

    tl.current = gsap.timeline({ paused: true })
      .to(containerRef.current, { autoAlpha: 1, duration: 0.1 })
      .fromTo(cards, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
      )
  }, { scope: containerRef })

  useGSAP(() => {
    if (isExplore) tl.current?.timeScale(1).play()
    else tl.current?.timeScale(2.5).reverse().then(() => setExpandedId(null))
  }, [isExplore])

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-10 pointer-events-none">
      
      <div className={`flex w-full max-w-6xl h-[60vh] max-h-[600px] mt-[-10vh] gap-2 md:gap-4 pointer-events-auto`}>
        
        {PROJECTS.map((project) => {
          const isExpanded = expandedId === project.id
          const isSiblingExpanded = expandedId !== null && expandedId !== project.id

          return (
            <div 
              key={project.id}
              onClick={() => { if (!isExpanded && !isClosing) setExpandedId(project.id) }}
              // THE FIX: Solid colors on mobile (bg-[#050000]) and pointer-events-none during closing lock!
              className={`project-window group relative flex overflow-hidden border transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-[#050000] md:bg-[#050000]/90 ${project.theme.border} hover:border-opacity-100
                ${isClosing ? 'pointer-events-none' : ''}
                ${isExpanded ? 'flex-[10] md:flex-[8] rounded-[20px] md:rounded-[30px] cursor-default' : ''}
                ${isSiblingExpanded ? 'flex-[1] md:flex-[1.5] rounded-[15px] cursor-pointer hover:flex-[1.5] md:hover:flex-[2] opacity-60 hover:opacity-100' : ''}
                ${expandedId === null ? 'flex-1 rounded-[20px] md:rounded-[40px] cursor-pointer hover:flex-[1.2]' : ''}
              `}
            >
              
              {/* SIBLING COLLAPSED VIEW */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isSiblingExpanded ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
                 <span className={`rotate-[-90deg] whitespace-nowrap text-xs md:text-sm tracking-[0.3em] font-light ${project.theme.text}`}>{project.title}</span>
              </div>

              {/* MAIN COMPACT VIEW */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${expandedId === null ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <div className="absolute inset-0 overflow-hidden opacity-30 md:group-hover:opacity-60 transition-opacity duration-700">
                    <img src={project.image} alt="bg" className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-1000 mix-blend-luminosity" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050000] via-transparent to-transparent" />
                 
                 <div className="relative z-10 flex flex-col items-center text-center mt-auto mb-8 md:mb-12 px-4">
                    <div className={`w-1.5 h-1.5 rounded-full mb-4 md:animate-pulse ${project.theme.bg}`} />
                    <span className={`mb-2 text-[10px] uppercase tracking-[0.4em] opacity-80 ${project.theme.accent}`}>{project.category}</span>
                    <h3 className={`text-lg md:text-2xl font-light tracking-[0.2em] ${project.theme.text}`}>{project.title}</h3>
                 </div>
              </div>

              {/* EXPANDED VIEW */}
              <div className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-700 delay-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                
                <CSSRotatingCube colorClass={project.theme.accent} />

                <button onClick={handleClose} className={`absolute right-4 top-4 md:right-6 md:top-6 z-50 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border bg-[#050000] transition-all md:hover:scale-110 md:hover:bg-white/10 ${project.theme.accent} ${project.theme.borderBright}`}>✕</button>
                
                {/* Image Panel - Solid BG on Mobile */}
                <div className={`relative flex h-[35%] md:h-full w-full md:w-[45%] items-center justify-center border-b md:border-b-0 md:border-r p-3 md:p-6 bg-[#000000] md:bg-[#020000] z-10 ${project.theme.border}`}>
                    <div className={`relative h-full w-full border p-1 ${project.theme.borderBright}`}>
                        <div className={`absolute -left-1 -top-1 h-2 w-2 rotate-45 border bg-[#050000] ${project.theme.borderBright}`} />
                        <div className={`absolute -right-1 -top-1 h-2 w-2 rotate-45 border bg-[#050000] ${project.theme.borderBright}`} />
                        <div className={`absolute -left-1 -bottom-1 h-2 w-2 rotate-45 border bg-[#050000] ${project.theme.borderBright}`} />
                        <div className={`absolute -right-1 -bottom-1 h-2 w-2 rotate-45 border bg-[#050000] ${project.theme.borderBright}`} />
                        
                        <div className={`relative h-full w-full overflow-hidden border ${project.theme.border}`}>
                            <img src={project.image} alt={project.title} className="h-full w-full object-cover mix-blend-luminosity opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Content Panel - Solid BG on Mobile */}
                <div className="relative flex w-full md:w-[55%] h-[65%] md:h-full flex-col justify-center p-6 md:p-16 bg-[#050000] md:bg-transparent z-10">
                  <span className={`mb-2 md:mb-4 text-[10px] uppercase tracking-[0.4em] opacity-80 ${project.theme.accent}`}>{project.category}</span>
                  <h2 className={`mb-4 md:mb-6 text-2xl md:text-5xl font-light tracking-[0.15em] ${project.theme.text}`}>{project.title}</h2>
                  <p className={`leading-relaxed font-light text-[11px] md:text-sm opacity-80 max-w-[90%] ${project.theme.text}`}>{project.description}</p>
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