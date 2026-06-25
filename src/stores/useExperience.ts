import { create } from 'zustand'

export enum MODES {
  LANDING = 'LANDING',
  TRAVERSAL = 'TRAVERSAL',
  EXPLORE = 'EXPLORE'
}

interface ExperienceState {
  currentPhase: number;
  mode: MODES;
  isTransitioning: boolean;
  isMobile: boolean;
  isLowEnd: boolean;
  
  setPhase: (phase: number) => void;
  setMode: (mode: MODES) => void;
  setIsTransitioning: (status: boolean) => void;
  setHardwareProfile: (isMobile: boolean, isLowEnd: boolean) => void;
  showTraversalControls: () => boolean;
}

export const useExperience = create<ExperienceState>((set, get) => ({
  currentPhase: 0, 
  mode: MODES.LANDING,
  isTransitioning: false,
  isMobile: false,
  isLowEnd: false,
  
  setPhase: (phase) => set({ currentPhase: phase }),
  setMode: (mode) => set({ mode }),
  setIsTransitioning: (status) => set({ isTransitioning: status }),
  setHardwareProfile: (isMobile, isLowEnd) => set({ isMobile, isLowEnd }),
  
  showTraversalControls: () => {
    // THE FIX: The UI stays visible on ALL phases greater than 0, even during Explore Mode!
    return get().currentPhase > 0;
  }
}))