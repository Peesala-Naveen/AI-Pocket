import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 800;

export default function ParticleField() {
  const pointsRef = useRef();

  // Pre-compute initial positions on a unit sphere, then scale to radius 20
  const { positions, initialY } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const yCache = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Generate uniformly distributed point inside a sphere of radius 20
      let x, y, z, lenSq;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        lenSq = x * x + y * y + z * z;
      } while (lenSq > 1 || lenSq === 0);

      const scale = 20;
      const i3 = i * 3;
      pos[i3] = x * scale;
      pos[i3 + 1] = y * scale;
      pos[i3 + 2] = z * scale;

      // Cache the original Y so wave motion is additive from a known baseline
      yCache[i] = pos[i3 + 1];
    }

    return { positions: pos, initialY: yCache };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();

    // Slow global rotation
    pointsRef.current.rotation.y += 0.0003;

    // Gentle per-particle wave on Y axis
    const posArray = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArray[i3 + 1] = initialY[i] + Math.sin(time + i) * 0.15;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#6C63FF"
        size={0.05}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
