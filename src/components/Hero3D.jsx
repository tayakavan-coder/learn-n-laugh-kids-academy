import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, RoundedBox, Cloud, Clouds } from '@react-three/drei'
import * as THREE from 'three'

const BLOCK_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const BLOCK_COLORS = ['#FF4FA3', '#3B82F6', '#22C55E', '#F59E0B', '#F97316', '#A855F7', '#EC4899']

function SchoolBuilding() {
  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15
    }
  })

  return (
    <group ref={ref} position={[0, -0.5, 0]}>
      {/* Main building body */}
      <RoundedBox args={[2.5, 2, 1.5]} radius={0.08} position={[0, 0, 0]}>
        <meshStandardMaterial color="#FFE4F0" />
      </RoundedBox>

      {/* Roof */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color="#FF4FA3" />
      </mesh>

      {/* Flag pole */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      {/* Flag */}
      <mesh position={[0.25, 2.35, 0]}>
        <boxGeometry args={[0.4, 0.25, 0.01]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>

      {/* Door */}
      <mesh position={[0, -0.6, 0.76]}>
        <boxGeometry args={[0.5, 0.8, 0.02]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>

      {/* Windows */}
      <mesh position={[-0.7, 0.2, 0.76]}>
        <boxGeometry args={[0.4, 0.4, 0.02]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>
      <mesh position={[0.7, 0.2, 0.76]}>
        <boxGeometry args={[0.4, 0.4, 0.02]} />
        <meshStandardMaterial color="#22C55E" />
      </mesh>

      {/* School sign */}
      <mesh position={[0, 0.55, 0.76]}>
        <boxGeometry args={[1.2, 0.3, 0.02]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>
    </group>
  )
}

function AlphabetBlock({ letter, color, position, speed }) {
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <group position={position}>
        <RoundedBox args={[0.5, 0.5, 0.5]} radius={0.06}>
          <meshStandardMaterial color={color} />
        </RoundedBox>
        <Text
          position={[0, 0, 0.26]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {letter}
        </Text>
      </group>
    </Float>
  )
}

function MovingClouds() {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud
        seed={1}
        segments={20}
        bounds={[6, 1, 2]}
        volume={0.3}
        color="white"
        position={[-3, 2, -2]}
        opacity={0.6}
      />
      <Cloud
        seed={2}
        segments={20}
        bounds={[6, 1, 2]}
        volume={0.3}
        color="white"
        position={[3, 2.5, -2]}
        opacity={0.5}
      />
    </Clouds>
  )
}

export default function Hero3D() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const blockPositions = isMobile
    ? [[-1.8, 0.8, -1], [1.8, 0.3, -1], [-1.5, -0.4, 0.5], [1.5, -0.8, 0.5], [0, 1.8, -1.5]]
    : [
        [-2.5, 1, -1], [2.5, 0.5, -1], [-2, -0.5, 0.5], [2, -1, 0.5],
        [-3, 0, 0], [3, 1.5, 0], [0, 2, -1.5],
      ]
  const letters = isMobile ? BLOCK_LETTERS.slice(0, 5) : BLOCK_LETTERS

  return (
    <div className="absolute inset-0" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, isMobile ? 7 : 6], fov: 50 }}
        dpr={[1, isMobile ? 1 : 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#FF4FA3" />
        <pointLight position={[5, -3, 5]} intensity={0.5} color="#3B82F6" />

        <SchoolBuilding />
        <MovingClouds />
        {letters.map((l, i) => (
          <AlphabetBlock
            key={i}
            letter={l}
            color={BLOCK_COLORS[i]}
            position={blockPositions[i]}
            speed={1 + i * 0.3}
          />
        ))}
      </Canvas>
    </div>
  )
}
