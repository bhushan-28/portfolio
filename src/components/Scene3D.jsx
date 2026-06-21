import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Procedural floating 3D Shape that reacts to mouse movement
function FloatingShape({ isMobile }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slow continuous rotation
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.007;

    // Follow mouse pointer slightly for interactivity (disabled on mobile touch profiles)
    const mobileLayout = state.size.width < 768;
    const targetX = mobileLayout ? 0 : state.pointer.x * 0.5;
    const targetY = mobileLayout ? 0 : state.pointer.y * 0.5;

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
  });

  return (
    <mesh ref={meshRef} scale={isMobile ? 0.95 : 1.4}>
      <torusKnotGeometry args={[0.8, 0.25, 120, 16]} />
      <MeshDistortMaterial
        color="#00f2fe"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive="#004466"
      />
    </mesh>
  );
}

// Particle field around the shape
function Particles() {
  const pointsRef = useRef();

  useFrame((state) => {
    if (!pointsRef.current) return;

    // Slowly rotate the particle field
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
  });

  // Generate particle positions
  const particleCount = 200;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 8; // Spread particles
    }
    return arr;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#9d4edd"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Scene3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#ff007f" />
        <directionalLight position={[0, 5, 0]} intensity={0.8} />

        <Suspense fallback={null}>
          <FloatingShape isMobile={isMobile} />
          <Particles />
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1} />
        </Suspense>

        {!isMobile && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.5}
          />
        )}
      </Canvas>
    </div>
  );
}
