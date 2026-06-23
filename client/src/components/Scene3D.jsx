import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import ParticleField from './ParticleField';

// ── shape descriptors (static, never re-created) ──────────────────────────────
const SHAPES = [
  { type: 'icosahedron', args: [1.5, 0],          position: [-8, 4, -10],  color: '#6C63FF', speed: [0.001, 0.002, 0]     },
  { type: 'torus',       args: [1, 0.3, 16, 32],  position: [7, -3, -8],   color: '#00D4FF', speed: [0.002, 0.001, 0]     },
  { type: 'octahedron',  args: [1.2, 0],           position: [-5, -5, -12], color: '#FF6B9D', speed: [0, 0.001, 0.002]     },
  { type: 'torusKnot',   args: [0.8, 0.25, 64, 8],position: [9, 5, -15],   color: '#FFD93D', speed: [0.001, 0, 0.001]     },
  { type: 'dodecahedron', args: [1.0, 0],          position: [3, -6, -10],  color: '#6C63FF', speed: [0.002, 0.002, 0]     },
  { type: 'icosahedron', args: [0.8, 0],           position: [-3, 7, -14],  color: '#00D4FF', speed: [0, 0.001, 0.001]     },
];

// Geometry tag lookup — maps descriptor string → JSX geometry element
const GEOM_MAP = {
  icosahedron:  (a) => <icosahedronGeometry  args={a} />,
  torus:        (a) => <torusGeometry        args={a} />,
  octahedron:   (a) => <octahedronGeometry   args={a} />,
  torusKnot:    (a) => <torusKnotGeometry    args={a} />,
  dodecahedron: (a) => <dodecahedronGeometry args={a} />,
};

// ── single shape (internal) ────────────────────────────────────────────────────
function FloatingShape({ type, args, position, color, speed }) {
  const meshRef = useRef();
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Continuous rotation
    meshRef.current.rotation.x += speed[0];
    meshRef.current.rotation.y += speed[1];
    meshRef.current.rotation.z += speed[2];

    // Gentle floating bob
    meshRef.current.position.y = baseY + Math.sin(t * 0.5 + baseY) * 0.4;
  });

  return (
    <mesh ref={meshRef} position={position}>
      {GEOM_MAP[type](args)}
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

// ── all shapes group ───────────────────────────────────────────────────────────
function FloatingShapes() {
  return (
    <group>
      {SHAPES.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </group>
  );
}

// ── main background scene ──────────────────────────────────────────────────────
export default function Scene3D() {
  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 15], fov: 60 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      {/* dark space background */}
      <color attach="background" args={['#0a0a1a']} />

      {/* subtle lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]}   color="#6C63FF" intensity={0.5} />
      <pointLight position={[-10, -10, -5]} color="#00D4FF" intensity={0.3} />

      {/* starfield */}
      <Stars
        radius={100}
        depth={50}
        count={2500}
        factor={4}
        saturation={0.5}
        fade
        speed={0.5}
      />

      {/* custom particles */}
      <ParticleField />

      {/* wireframe floating shapes */}
      <FloatingShapes />
    </Canvas>
  );
}
