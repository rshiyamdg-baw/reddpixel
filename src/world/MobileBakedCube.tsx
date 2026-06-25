import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, useEnvironment, useGLTF } from '@react-three/drei' 
import { useExperience } from '../stores/useExperience'
import { goDeeper } from '../core/timeline/cinematicController'
import { worldState } from './worldState'
import { Mesh, DoubleSide } from 'three'

const MobileBakedCube: React.FC = () => {
  const currentPhase = useExperience((state) => state.currentPhase)
  const shellRef = useRef<Mesh>(null)

  // 1. Summon the Custom Geometry (Using its true Houdini name: geo1)
  const { nodes } = useGLTF('/models/mobile_glass_box.glb') as any

  // 2. Load the Master Atlases
  const [colorMap, normalMap, roughnessMap, metalnessMap] = useTexture([
    '/textures/atlas_color.jpg',
    '/textures/atlas_normal.png', 
    '/textures/atlas_roughness.jpg',
    '/textures/atlas_melatic.jpg'
  ])

  // Prevent Three.js from flipping the images upside down (Houdini UVs start at the bottom)
  colorMap.flipY = false;
  normalMap.flipY = false;
  roughnessMap.flipY = false;
  metalnessMap.flipY = false;

  // 3. The Grand Illusion: A cheap environment map to fake glass reflections!
  const envMap = useEnvironment({ preset: 'studio' }) 

  useFrame(() => {
    if (shellRef.current) {
      shellRef.current.rotation.x = worldState.cubeRotX
      shellRef.current.rotation.y = worldState.cubeRotY
      shellRef.current.rotation.z = worldState.cubeRotZ
    }
  })

  return (
    <mesh
      ref={shellRef}
      visible={currentPhase < 3}
      // BEHOLD: The True Name of the Geometry!
      geometry={nodes.geo1.geometry} 
      onClick={(e) => { e.stopPropagation(); if (currentPhase === 0) { document.body.style.cursor = 'auto'; goDeeper(); } }}
      onPointerOver={() => { if (currentPhase === 0) document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = 'auto' }}
    >
      {/* THE OPTIMIZED SHADER: 
        No expensive refraction! The 'envMap' combined with 'metalnessMap' makes 
        the shards look like shiny glass. The 'normalMap' catches the light on the edges,
        and 'opacity' lets the background bleed through for absolute pennies! 
      */}
      <meshStandardMaterial 
  map={colorMap}
  normalMap={normalMap}
  roughnessMap={roughnessMap}
  metalnessMap={metalnessMap}
  
  // 1. Tame the Reflections: 
  // Lower the normal scale and envMap intensity so the white city lights don't wash out your reds!
  normalScale={[0.5, 0.1]} 
  envMap={envMap}
  envMapIntensity={0.1} 
  
  // 2. Thicken the Glass:
  // Real stained glass is barely transparent unless directly backlit. 
  transparent={true}
  opacity={0.75} 
  
  // 3. Deepen the Pigment:
  // By tinting the base color to a light grey, we automatically darken the baked Houdini map, 
  // pulling those pinks back down into deep, rich blood reds.
  color="#737373" 
  
  side={DoubleSide}
/>
    </mesh>
  )
}

// Preload the model so it doesn't pop in late and ruin the magic
useGLTF.preload('/models/mobile_glass_box.glb')

export default MobileBakedCube