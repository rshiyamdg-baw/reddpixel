import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useExperience, MODES } from '../../stores/useExperience'

interface Message {
  sender: 'ai' | 'user'
  text: string
}

const ContactPhaseUI: React.FC = () => {
  const { currentPhase, mode } = useExperience()
  const isExplore = mode === MODES.EXPLORE && currentPhase === 3
  
  const containerRef = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Greetings, traveler. I am the Architect's digital shadow. Speak your inquiry, and I shall fetch the answers from the databanks." }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useGSAP(() => {
    gsap.set(containerRef.current, { autoAlpha: 0 })
    tl.current = gsap.timeline({ paused: true })
      .to(containerRef.current, { autoAlpha: 1, duration: 0.1 })
      .fromTo('.chat-window', { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' })
  }, { scope: containerRef })

  useGSAP(() => {
    if (isExplore) tl.current?.timeScale(1).play()
    else tl.current?.timeScale(2).reverse()
  }, [isExplore])

  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // 1. Add User Message
    const userMsg = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    // 2. THIS IS WHERE YOU BIND YOUR N8N WEBHOOK!
    // fetch('https://your-n8n-server.com/webhook/chat', { method: 'POST', body: JSON.stringify({ message: userMsg }) })
    //   .then(res => res.json()).then(data => { setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]) })
    
    // Mock Delay for now:
    setTimeout(() => {
       setMessages(prev => [...prev, { sender: 'ai', text: "My neural link to n8n is not yet forged by the Architect. Please deploy the backend webhook to awaken me." }])
       setIsTyping(false)
    }, 1500)
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-10 pointer-events-none">
      
      <div className="chat-window relative flex flex-col w-full max-w-3xl h-[70vh] bg-[#050000]/90 backdrop-blur-md border border-red-900/50 rounded-[40px_10px_40px_10px] shadow-[0_0_50px_rgba(220,38,38,0.1)] pointer-events-auto overflow-hidden">
        
        {/* Persian Decorative Frame */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
        <div className="absolute -left-2 -top-2 w-6 h-6 border-t-2 border-l-2 border-red-500 opacity-60" />
        <div className="absolute -right-2 -bottom-2 w-6 h-6 border-b-2 border-r-2 border-red-500 opacity-60" />

        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-red-900/40 bg-black/40">
           <div className="relative w-10 h-10 border border-red-500/50 p-1 rotate-45 flex-shrink-0">
               <div className="absolute inset-0 bg-red-600/20 animate-pulse" />
               <div className="w-full h-full bg-red-950 border border-red-500/30 -rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]" />
               </div>
           </div>
           <div>
               <h2 className="text-sm font-bold tracking-[0.2em] text-red-100">THE ORACLE</h2>
               <p className="text-[9px] text-red-500/80 tracking-widest uppercase mt-0.5">Gemini Neural Link : Active</p>
           </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar flex flex-col">
           {messages.map((msg, i) => (
             <div key={i} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[80%] p-4 text-xs md:text-sm tracking-wide leading-relaxed font-light ${
                  msg.sender === 'user' 
                  ? 'bg-red-950/20 border border-red-900/30 text-red-100 rounded-[20px_0px_20px_20px]' 
                  : 'bg-black/60 border border-red-500/20 text-red-200 rounded-[0px_20px_20px_20px]'
                }`}>
                  {msg.text}
                </div>
             </div>
           ))}
           {isTyping && (
             <div className="flex w-full justify-start">
                <div className="flex gap-1 p-4 bg-black/60 border border-red-500/20 rounded-[0px_20px_20px_20px]">
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-100" />
                   <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce delay-200" />
                </div>
             </div>
           )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-red-900/40 bg-black/60 flex gap-4">
           <input 
             type="text" 
             value={input}
             onChange={e => setInput(e.target.value)}
             placeholder="Transmit inquiry..." 
             className="flex-1 bg-[#050000] border border-red-900/50 rounded-full px-6 py-3 text-xs text-red-100 focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-900"
           />
           <button type="submit" disabled={!input.trim() || isTyping} className="w-12 h-12 flex items-center justify-center bg-red-950/50 border border-red-500/50 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
             ▲
           </button>
        </form>

      </div>
    </div>
  )
}



export default ContactPhaseUI