import gsap from 'gsap'
import { useExperience, MODES } from '../../stores/useExperience'
import { worldState } from '../../world/worldState'

export const FIRST_INTERIOR_PHASE = 1;
export const MAX_PHASE = 3;

const getCameraPositions = (isMobile: boolean) => [
  { z: isMobile ? 14.0 : 14.0, y: isMobile ? 1.5 : 1.5, targetY: 0, targetZ: 0 },     
  // Camera levitates slightly and looks dead ahead.
  { z: isMobile ? 5.5 : 4.5,   y: isMobile ? 1.5 : 0.5, targetY: 0, targetZ: 0 }, 
  { z: -4.0, y: 0.0, targetY: 0, targetZ: -20.0 }, 
  { z: -8.0, y: 0.0, targetY: 0, targetZ: -20.0 }  
]

const animateCameraToPhase = (phaseIndex: number) => {
  const state = useExperience.getState()
  const positions = getCameraPositions(state.isMobile)
  const target = positions[phaseIndex] || positions[0]
  
  gsap.killTweensOf(worldState, "cameraZ,cameraY,targetY,targetZ")
  gsap.to(worldState, {
    cameraZ: target.z, cameraY: target.y, targetY: target.targetY, targetZ: target.targetZ, 
    duration: 1.2, ease: 'power3.inOut'
  })
}

// THE FIX: Auto-close Explore mode before traversing!
export const goDeeper = (): void => {
  const state = useExperience.getState()
  if (state.isTransitioning || state.currentPhase >= MAX_PHASE) return

  state.setIsTransitioning(true)
  
  // Instantly close explore mode if open. No delays!
  if (state.mode === MODES.EXPLORE) exitExploreMode();

  const nextPhase = state.currentPhase + 1
  state.setPhase(nextPhase)
  
  animateCameraToPhase(nextPhase)
  setTimeout(() => state.setIsTransitioning(false), 1200)
}

export const goBack = (): void => {
  const state = useExperience.getState()
  if (state.isTransitioning || state.currentPhase <= 0) return

  state.setIsTransitioning(true)

  // Instantly close explore mode if open. No delays!
  if (state.mode === MODES.EXPLORE) exitExploreMode();

  const prevPhase = state.currentPhase - 1
  state.setPhase(prevPhase)
  
  animateCameraToPhase(prevPhase)
  setTimeout(() => state.setIsTransitioning(false), 1200)
}

export const enterExploreMode = (): void => {
  const state = useExperience.getState()
  state.setMode(MODES.EXPLORE)
  
  if (state.currentPhase === 1) {
    const randomSpinX = (Math.random() > 0.5 ? 0.5 : -0.5) * (Math.PI * 0.25 + Math.random() * Math.PI);
    const randomSpinY = (Math.random() > 0.5 ? 0.5 : -0.5) * (Math.PI * 0.25 + Math.random() * Math.PI);

    // THE FIX: targetY = 1.2 makes the camera look UP, pushing the cube DOWN on the screen!
    const targetX = state.isMobile ? 0 : 1.2;
    const targetY = state.isMobile ? 1.2 : 0; 

    gsap.killTweensOf(worldState, "targetX,targetY,cubeRotX,cubeRotY,cubeRotZ")
    gsap.to(worldState, { 
        targetX: targetX, targetY: targetY, cubeRotX: randomSpinX, cubeRotY: randomSpinY,
        cubeRotZ: (Math.random() - 0.5) * Math.PI * 0.5,
        duration: 1.5, ease: 'power3.inOut' 
    })
  }
}

export const exitExploreMode = (): void => {
  const state = useExperience.getState()
  state.setMode(MODES.TRAVERSAL)
  
  const positions = getCameraPositions(state.isMobile)
  const baseTargetY = positions[state.currentPhase].targetY

  gsap.killTweensOf(worldState, "targetX,targetY,cubeRotX,cubeRotY,cubeRotZ")
  gsap.to(worldState, { 
      targetX: 0, targetY: baseTargetY, cubeRotX: 0, cubeRotY: 0, cubeRotZ: 0,
      duration: 1.0, ease: 'power3.inOut' 
  })
}

export const destroyCinematicController = (): void => { gsap.killTweensOf(worldState) }