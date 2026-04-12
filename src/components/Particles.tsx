'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  className?: string;
}

function ParticleSystem({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.5,
  particleColors = ['#ffffff'],
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  disableRotation = false,
}: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorObjects = particleColors.map((c) => new THREE.Color(c));

    for (let i = 0; i < particleCount; i++) {
      // Sphere distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * particleSpread;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const color = colorObjects[Math.floor(Math.random() * colorObjects.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = particleBaseSize * (1 + (Math.random() - 0.5) * sizeRandomness);
    }

    return { positions, colors, sizes };
  }, [particleCount, particleSpread, particleColors, particleBaseSize, sizeRandomness]);

  useFrame((_, delta) => {
    if (meshRef.current && !disableRotation) {
      meshRef.current.rotation.y += delta * speed * 0.05;
      meshRef.current.rotation.x += delta * speed * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={alphaParticles ? 0.6 : 1}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function Particles({
  cameraDistance = 20,
  className = '',
  ...rest
}: ParticlesProps) {
  return (
    <div className={`w-full h-full ${className}`} style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, cameraDistance], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleSystem {...rest} />
      </Canvas>
    </div>
  );
}
