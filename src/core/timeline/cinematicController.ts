import gsap from 'gsap'
import { useExperience, MODES } from '../../stores/useExperience'
import { worldState } from '../../world/worldState'

export const FIRST_INTERIOR_PHASE = 1;
export const MAX_PHASE = 3;

// THE FIX: Added targetZ to keep the camera looking FORWARD forever!
const CAMERA_POSITIONS = [
  { z: 14.0, y: 1.5, targetY: 0, targetZ: 0 },     // Phase 0: Far
  { z: 4.5,  y: 0.5, targetY: 0, targetZ: 0 },     // Phase 1: Close
  { z: -4.0, y: 0.0, targetY: 0, targetZ: -20.0 }, // Phase 2: Passing through the cube!
  { z: -8.0, y: 0.0, targetY: 0, targetZ: -20.0 }  // Phase 3: Deep inside
]

const animateCameraToPhase = (phaseIndex: number) => {
  const target = CAMERA_POSITIONS[phaseIndex] || CAMERA_POSITIONS[0]
  gsap.to(worldState, {
    cameraZ: target.z,
    cameraY: target.y,
    targetY: target.targetY,
    targetZ: target.targetZ, // Pushes the lookAt target ahead of the camera
    duration: 1.0,
    ease: 'power3.inOut'
  })
}

export const goDeeper = (): void => {
  const state = useExperience.getState()
  if (state.isTransitioning || state.currentPhase >= MAX_PHASE) return

  state.setIsTransitioning(true)
  const nextPhase = state.currentPhase + 1
  state.setPhase(nextPhase)
  
  animateCameraToPhase(nextPhase)
  setTimeout(() => state.setIsTransitioning(false), 1000)
}

export const goBack = (): void => {
  const state = useExperience.getState()
  if (state.isTransitioning || state.currentPhase <= 0) return

  state.setIsTransitioning(true)
  const prevPhase = state.currentPhase - 1
  state.setPhase(prevPhase)
  
  animateCameraToPhase(prevPhase)
  setTimeout(() => state.setIsTransitioning(false), 1000)
}

export const enterExploreMode = (): void => {
  const state = useExperience.getState()
  state.setMode(MODES.EXPLORE)
  
  if (state.currentPhase === 1) {
    // THE FIX: Massive, elegant 90-to-270 degree random rotations to reveal back faces!
    const randomSpinX = (Math.random() > 0.5 ? 0.5 : -0.5) * (Math.PI * 0.25 + Math.random() * Math.PI);
    const randomSpinY = (Math.random() > 0.5 ? 0.5 : -0.5) * (Math.PI * 0.25 + Math.random() * Math.PI);

    gsap.to(worldState, { 
        targetX: 1.2, 
        cubeRotX: randomSpinX, 
        cubeRotY: randomSpinY,
        cubeRotZ: (Math.random() - 0.5) * Math.PI * 0.5, // Slight Z tilt
        duration: 1.5, 
        ease: 'power3.inOut' 
    })
  }
}

export const exitExploreMode = (): void => {
  const state = useExperience.getState()
  state.setMode(MODES.TRAVERSAL)
  
  gsap.to(worldState, { 
      targetX: 0, cubeRotX: 0, cubeRotY: 0, cubeRotZ: 0,
      duration: 1.5, ease: 'power3.inOut' 
  })
}

export const destroyCinematicController = (): void => {
  gsap.killTweensOf(worldState)
}