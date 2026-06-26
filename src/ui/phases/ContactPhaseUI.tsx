import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

const ContactPhaseUI: React.FC = () => {
  const currentPhase = useExperience((state) => state.currentPhase)
  const mode = useExperience((state) => state.mode)
  
  const isExplore = mode === MODES.EXPLORE && currentPhase === 3
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    // THE FIX: Remove the manual querySelectors!
    gsap.set(containerRef.current, { autoAlpha: 0 })

    tl.current = gsap.timeline({ paused: true })
      // Use "!" to promise TypeScript that containerRef.current is not null here
      .to(containerRef.current!, { autoAlpha: 1, duration: 0.1 }) 
      
      // Pass the string selector directly! GSAP's scope handles the rest securely.
      .fromTo('.form-panel', 
        { y: 50, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'expo.out' }
      )
      .fromTo('.anim-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
        "-=0.5"
      )
  }, { scope: containerRef })

  useGSAP(() => {
    if (isExplore) tl.current?.play()
    else tl.current?.reverse()
  }, [isExplore])

  return (
    <div ref={containerRef} className=" pointer-events-none fixed inset-0 z-40 flex items-center justify-center p-6 pb-[180px]">
      <div className="form-panel pointer-events-auto relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-t-[180px] rounded-b-2xl border border-red-500/30 bg-[#050000]/90 px-8 pb-14 pt-24 shadow-[0_0_60px_rgba(220,38,38,0.15)] sm:px-14">
        
        <div className="absolute left-1/2 top-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-red-500/20 bg-black/40">
            <div className="h-2 w-2 rotate-45 border border-red-500 bg-red-600/20 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
        </div>
        
        <h2 className="anim-item mt-4 mb-2 text-3xl font-light tracking-[0.25em] text-white">INITIATE</h2>
        <p className="anim-item mb-12 text-center text-[9px] font-light tracking-[0.3em] text-red-400/80 uppercase">Establish a secure connection</p>

        <form className="flex w-full flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
          <div className="anim-item relative group">
            <input type="text" placeholder="YOUR DESIGNATION" className="peer w-full border-b border-red-900/50 bg-transparent pb-3 text-xs tracking-[0.3em] text-white placeholder-red-900/80 outline-none transition-colors focus:border-transparent" />
            <div className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-red-500 transition-all duration-500 peer-focus:w-full" />
          </div>
          <div className="anim-item relative group">
            <input type="email" placeholder="SECURE FREQUENCY" className="peer w-full border-b border-red-900/50 bg-transparent pb-3 text-xs tracking-[0.3em] text-white placeholder-red-900/80 outline-none transition-colors focus:border-transparent" />
            <div className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-red-500 transition-all duration-500 peer-focus:w-full" />
          </div>
          <div className="anim-item relative group">
            <textarea rows={3} placeholder="TRANSMIT DIRECTIVE..." className="peer w-full resize-none border-b border-red-900/50 bg-transparent pb-3 text-xs tracking-[0.3em] text-white placeholder-red-900/80 outline-none transition-colors focus:border-transparent" />
            <div className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-red-500 transition-all duration-500 peer-focus:w-full" />
          </div>
          <button className="anim-item group relative mt-6 flex w-full items-center justify-center overflow-hidden bg-black/40 py-5 text-[10px] tracking-[0.4em] text-red-200 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]" style={{ clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)' }}>
            <div className="absolute inset-0 border border-red-500/30 transition-colors duration-500 group-hover:border-transparent" style={{ clipPath: 'polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)' }} />
            <div className="absolute inset-0 -translate-x-full bg-red-900/60 transition-transform duration-700 ease-out group-hover:translate-x-0" />
            <span className="relative z-10 flex items-center gap-6 font-bold transition-colors duration-300 group-hover:text-white">TRANSMIT</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactPhaseUI