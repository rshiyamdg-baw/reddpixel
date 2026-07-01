import React, { useRef, useState,useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

const CSSRotatingCube = ({ colorClass }: { colorClass: string }) => (
  <div className="hidden md:block w-16 h-16 md:w-24 md:h-24 perspective-[1000px] absolute right-4 bottom-4 md:right-10 md:bottom-10 opacity-40 pointer-events-none z-0">
    <div className="w-full h-full relative transform-style-3d animate-[spin_10s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateY(180deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateY(90deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateY(-90deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateX(90deg) translateZ(30px)' }} />
      <div className={`absolute inset-0 border border-current ${colorClass}`} style={{ transform: 'rotateX(-90deg) translateZ(30px)' }} />
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 transform-style-3d animate-[spin_5s_linear_infinite_reverse]">
          <div className={`absolute inset-0 border border-current opacity-50 ${colorClass}`} style={{ transform: 'translateZ(15px)' }} />
          <div className={`absolute inset-0 border border-current opacity-50 ${colorClass}`} style={{ transform: 'rotateY(90deg) translateZ(15px)' }} />
          <div className={`absolute inset-0 border border-current opacity-50 ${colorClass}`} style={{ transform: 'rotateX(90deg) translateZ(15px)' }} />
      </div>
    </div>
  </div>
)

const UnifiedPersianNode = ({ solidBg, shadow }: { solidBg: string, shadow: string }) => (
  <div className={`w-3 h-3 md:w-4 md:h-4 ${solidBg} ${shadow}`} />
)

const PROJECTS = [
  { id: 1, title: "ALPHA TRADE", category: "Front-End", image: "/images/project1.jpg", description: "A high-performance landing page engineered for a premier trading signal service. Built purely with React, Tailwind, and strict GSAP sequencing to deliver a buttery-smooth, premium DOM experience without relying on WebGL.", link: "#", theme: { solidBg: "bg-cyan-500", shadow: "shadow-[0_0_15px_#06b6d4]", line: "from-cyan-500", border: "border-cyan-500/30", borderBright: "border-cyan-400", text: "text-cyan-200", accent: "text-cyan-400" } },
  { id: 2, title: "ARCHITECT 3D", category: "WebGL", image: "/images/project2.jpg", description: "An immersive 3D web portfolio built for an architect. Engineered the entire pipeline from 3D modeling to React rendering.", link: "#", theme: { solidBg: "bg-red-500", shadow: "shadow-[0_0_15px_#ef4444]", line: "from-red-500", border: "border-red-500/30", borderBright: "border-red-500", text: "text-red-100", accent: "text-red-500" } },
  { id: 3, title: "HIGH VOLTAGE", category: "Hardware", image: "/images/project3.jpg", description: "Not a web application, but a testament to physical hardware and raw electricity. From scaling massive radio towers in biting winds to engineering complex electrical systems in luxury smart homes, my foundation is built on real-world problem-solving and an absolute lack of vertigo.", link: null, theme: { solidBg: "bg-amber-500", shadow: "shadow-[0_0_15px_#f59e0b]", line: "from-amber-500", border: "border-amber-500/30", borderBright: "border-amber-400", text: "text-amber-100", accent: "text-amber-500" } }
]

const WorksPhaseUI: React.FC = () => {
  const { currentPhase, mode } = useExperience()
  const isExplore = mode === MODES.EXPLORE && currentPhase === 2
  
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isClosing, setIsClosing] = useState<boolean>(false)

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosing(true); setExpandedId(null);
    setTimeout(() => setIsClosing(false), 500); 
  }

  // 1. ENTRANCE TIMELINE - Purified with Immutable Anchors!
  useGSAP(() => {
    const cards = gsap.utils.toArray('.project-window')
    
    // HARDCODE INITIAL STATES - Bypasses StrictMode Corruption!
    gsap.set(containerRef.current, { autoAlpha: 0 })
    gsap.set('.anim-node', { scale: 0, rotate: 0 })
    gsap.set('.anim-line', { scaleY: 0 })
    gsap.set(cards, { y: 20, opacity: 0 })
    gsap.set('.anim-compact-content', { opacity: 0, y: 10 })

    tl.current = gsap.timeline({ paused: true })
      .to(containerRef.current, { autoAlpha: 1, duration: 0.1 })
      // Notice we use purely .to() calls now!
      .to('.anim-node', { scale: 1, rotate: 45, duration: 0.5, stagger: 0.05, ease: 'back.out(2)' })
      .to('.anim-line', { scaleY: 1, duration: 0.3, stagger: 0.05, ease: 'power2.inOut' }, "-=0.1")
      .to(cards, { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, "-=0.2")
      .to('.anim-compact-content', { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }, "-=0.2")
  }, { scope: containerRef })

  // REACTION TIMELINE - Kept exactly as is!
  useGSAP(() => {
    if (expandedId !== null && !isClosing) {
      gsap.to(`#node-${expandedId}`, { scale: 1.3, rotate: 90, duration: 0.3, ease: 'power2.out' });
      gsap.to(`#line-${expandedId}`, { scaleX: 1.5, duration: 0.3, ease: 'power2.out' });

      PROJECTS.forEach(p => {
         if(p.id !== expandedId) {
            gsap.to(`#node-${p.id}`, { opacity: 0.2, rotate: 45, scale: 0.9, duration: 0.3 });
            gsap.to(`#line-${p.id}`, { opacity: 0.2, scaleX: 1, duration: 0.3 });
         } else {
            gsap.to(`#node-${p.id}`, { opacity: 1, duration: 0.3 });
            gsap.to(`#line-${p.id}`, { opacity: 0.7, duration: 0.3 });
         }
      });
    } else if (expandedId === null) {
      gsap.to('.anim-node', { scale: 1, rotate: 45, opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to('.anim-line', { opacity: 0.7, scaleX: 1, duration: 0.3 });
    }
  }, [expandedId, isClosing])

  // THE CONDUCTOR - Orchestrates safely
  useEffect(() => {
    if (!tl.current) return;
    if (isExplore) tl.current.timeScale(1).play()
    else tl.current.timeScale(2.5).reverse().then(() => setExpandedId(null))
  }, [isExplore])

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 sm:p-10 pointer-events-none pb-24 sm:pb-32">
      
      {/* THE FIX: Vastly Expanded Vertical Canvas (h-[80vh] max-h-[800px]) banishes scrollbars! */}
      <div className="flex w-full max-w-6xl h-[75vh] md:h-[80vh] max-h-[800px] gap-2 md:gap-4 pointer-events-auto z-10">
        {PROJECTS.map((project) => {
          const isExpanded = expandedId === project.id
          const isSiblingExpanded = expandedId !== null && expandedId !== project.id

          return (
            <div 
              key={project.id}
              onClick={() => { if (!isExpanded && !isClosing) setExpandedId(project.id) }}
              // THE FIX: duration-500 makes the accordion open rapidly and responsively!
              className={`project-window group relative flex overflow-hidden border transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] bg-[#050505] md:bg-[#050505]/95 ${project.theme.border} hover:border-opacity-100
                ${isClosing ? 'pointer-events-none' : ''}
                ${isExpanded ? 'flex-[10] md:flex-[8] rounded-[20px] md:rounded-[40px_12px_40px_12px] cursor-default' : ''}
                ${isSiblingExpanded ? 'flex-[1] md:flex-[1.5] rounded-[15px] cursor-pointer hover:flex-[1.5] md:hover:flex-[2] opacity-60 hover:opacity-100' : ''}
                ${expandedId === null ? 'flex-1 rounded-[40px_12px_12px_12px] md:rounded-[80px_16px_16px_16px] cursor-pointer hover:flex-[1.2]' : ''}
              `}
            >
              
              {/* SIBLING COLLAPSED VIEW */}
              <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isSiblingExpanded ? 'opacity-100 duration-300 delay-200' : 'opacity-0 duration-200 pointer-events-none'}`}>
                 <span className={`rotate-[-90deg] whitespace-nowrap text-xs md:text-sm tracking-[0.3em] font-light ${project.theme.text}`}>{project.title}</span>
              </div>

              {/* MAIN COMPACT VIEW */}
              <div className={`absolute inset-0 flex flex-col items-center transition-opacity ${expandedId === null ? 'opacity-100 duration-500 delay-200' : 'opacity-0 duration-200 pointer-events-none'}`}>
                 <div className="absolute inset-0 overflow-hidden opacity-30 md:group-hover:opacity-60 transition-opacity duration-700">
                    <img src={project.image} alt="bg" className="w-full h-full object-cover mix-blend-luminosity md:group-hover:scale-110 transition-transform duration-1000" />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
                 
                 <div className="relative z-10 flex flex-col items-center text-center mt-auto mb-10 px-4">
                    <span className={`anim-compact-content mb-2 text-[10px] uppercase tracking-[0.4em] opacity-80 ${project.theme.accent}`}>{project.category}</span>
                    <h3 className={`anim-compact-content text-lg md:text-2xl font-light tracking-[0.2em] ${project.theme.text}`}>{project.title}</h3>
                 </div>
              </div>

              {/* EXPANDED VIEW */}
              {/* THE FIX: Fast text reveal (duration-300 delay-200) so the user doesn't wait! */}
              <div className={`absolute inset-0 flex flex-col md:flex-row transition-opacity ${isExpanded ? 'opacity-100 duration-300 delay-200' : 'opacity-0 duration-200 pointer-events-none'}`}>
                
                <CSSRotatingCube colorClass={project.theme.accent} />
                <button onClick={handleClose} className={`absolute right-4 top-4 md:right-8 md:top-8 z-50 flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full border bg-[#050505] transition-all hover:scale-110 hover:bg-white/10 ${project.theme.accent} ${project.theme.borderBright}`}>✕</button>
                
                <div className={`relative w-full h-[45%] md:h-full md:w-[55%] flex items-center justify-center p-3 md:p-8 bg-[#000000] border-b md:border-b-0 md:border-r ${project.theme.border}`}>
                    <div className={`relative h-full w-full border p-1 ${project.theme.borderBright}`}>
                        <div className={`absolute -left-1 -top-1 h-2 w-2 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`absolute -right-1 -top-1 h-2 w-2 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`absolute -left-1 -bottom-1 h-2 w-2 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`absolute -right-1 -bottom-1 h-2 w-2 rotate-45 border bg-[#050505] ${project.theme.borderBright}`} />
                        <div className={`relative h-full w-full overflow-hidden border ${project.theme.border}`}>
                            <img src={project.image} alt={project.title} className="h-full w-full object-cover opacity-90 transition-all duration-1000" />
                        </div>
                    </div>
                </div>

                <div className="relative w-full h-[55%] md:h-full md:w-[45%] flex flex-col justify-center p-6 md:p-10 bg-[#050505] md:bg-transparent z-10">
                  
                  <div className="absolute top-4 md:top-10 left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 opacity-40">
                     <div className={`w-1.5 h-1.5 rotate-45 ${project.theme.solidBg}`} />
                     <div className={`w-2.5 h-2.5 rotate-45 border ${project.theme.borderBright}`} />
                     <div className={`w-1.5 h-1.5 rotate-45 ${project.theme.solidBg}`} />
                  </div>

                  <span className={`mb-3 md:mb-5 text-[10px] uppercase tracking-[0.4em] opacity-80 ${project.theme.accent}`}>{project.category}</span>
                  <h2 className={`mb-4 md:mb-6 text-2xl md:text-4xl font-light tracking-[0.15em] ${project.theme.text}`}>{project.title}</h2>
                  <p className={`leading-relaxed font-light text-[11px] md:text-sm opacity-80 ${project.theme.text}`}>{project.description}</p>
                  
                  {project.link ? (
                     /* THE FIX: Intricate Persian Geometric Button! */
                     <a href={project.link} target="_blank" rel="noreferrer" className={`group/btn relative w-fit mt-6 md:mt-10 px-8 py-3 md:py-4 flex items-center justify-center bg-[#050505] transition-all hover:bg-white/5`}>
                        {/* Core Borders */}
                        <div className={`absolute inset-0 border ${project.theme.borderBright} opacity-40 group-hover/btn:opacity-100 transition-opacity`} />
                        
                        {/* Geometric Corner Cutouts */}
                        <div className={`absolute -left-1.5 -top-1.5 w-3 h-3 rotate-45 bg-[#050505] border ${project.theme.borderBright} transition-transform group-hover/btn:scale-125`} />
                        <div className={`absolute -right-1.5 -top-1.5 w-3 h-3 rotate-45 bg-[#050505] border ${project.theme.borderBright} transition-transform group-hover/btn:scale-125`} />
                        <div className={`absolute -left-1.5 -bottom-1.5 w-3 h-3 rotate-45 bg-[#050505] border ${project.theme.borderBright} transition-transform group-hover/btn:scale-125`} />
                        <div className={`absolute -right-1.5 -bottom-1.5 w-3 h-3 rotate-45 bg-[#050505] border ${project.theme.borderBright} transition-transform group-hover/btn:scale-125`} />
                        
                        {/* Hover Fill */}
                        <div className={`absolute inset-0 w-0 transition-all duration-500 ease-out group-hover/btn:w-full ${project.theme.solidBg} opacity-10 md:opacity-20`} />
                        
                        <span className={`relative text-[10px] md:text-xs tracking-[0.2em] font-bold transition-colors group-hover/btn:text-white ${project.theme.accent}`}>INITIATE SEQUENCE</span>
                     </a>
                  ) : (
                     /* THE FIX: The Hardware Vault Seal! */
                     <div className="w-fit mt-8 flex flex-col items-center gap-3">
                         <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16">
                             <div className={`absolute inset-0 border-2 rotate-45 opacity-40 ${project.theme.borderBright} animate-[spin_10s_linear_infinite]`} />
                             <div className={`absolute inset-2 border rotate-45 bg-[#050505] ${project.theme.borderBright} flex items-center justify-center animate-[spin_6s_linear_infinite_reverse]`}>
                                <div className={`w-2 h-2 md:w-3 md:h-3 rotate-45 animate-pulse ${project.theme.solidBg} ${project.theme.shadow}`} />
                             </div>
                         </div>
                         <div className="text-center">
                             <span className={`block text-[9px] md:text-[10px] tracking-widest opacity-80 ${project.theme.text}`}>PHYSICAL HARDWARE</span>
                             <span className={`block text-[7px] md:text-[8px] tracking-[0.3em] uppercase mt-1 ${project.theme.accent}`}>[ Classified Seal ]</span>
                         </div>
                     </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="w-full max-w-6xl flex gap-2 md:gap-4 mt-2 px-4 md:px-0 z-0">
        {PROJECTS.map((project) => {
          const isExpanded = expandedId === project.id
          const isSiblingExpanded = expandedId !== null && expandedId !== project.id

          return (
             <div 
               key={`rig-${project.id}`} 
               className={`flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]
                 ${isExpanded ? 'flex-[10] md:flex-[8]' : ''}
                 ${isSiblingExpanded ? 'flex-[1] md:flex-[1.5]' : ''}
                 ${expandedId === null ? 'flex-1' : ''}
               `}
             >
                <div id={`line-${project.id}`} className={`anim-line w-[1px] md:w-[2px] h-10 md:h-16 bg-gradient-to-t ${project.theme.line} to-transparent origin-bottom opacity-70 scale-y-0 transition-opacity duration-300`} />
                <div id={`node-${project.id}`} className="anim-node mt-1 md:mt-2 scale-0 origin-center transition-opacity duration-300">
                   <UnifiedPersianNode solidBg={project.theme.solidBg} shadow={project.theme.shadow} />
                </div>
             </div>
          )
        })}
      </div>

    </div>
  )
}

export default WorksPhaseUI