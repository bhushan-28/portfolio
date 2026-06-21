import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import './Preloader.css';

// 3D Swirling Galaxy Background
function Galaxy() {
  const pointsRef = useRef();
  const particleCount = 3000;

  // Generate spiral arms positions
  const positions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 6 + 0.1;
      const armIndex = i % 3;
      const angle = armIndex * (2 * Math.PI / 3) + radius * 0.95 + (Math.random() - 0.5) * 0.5;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 0.4 * (6 - radius) / 6;

      arr[i * 3] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  // Generate colors (glowing magenta/purple center to cyan outer arms)
  const colors = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    const colorCore = new THREE.Color('#ff007f'); // Magenta inner core
    const colorArm = new THREE.Color('#00f2fe');  // Cyan arms
    
    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 3];
      const z = positions[i * 3 + 2];
      const radius = Math.sqrt(x * x + z * z);
      
      const mixed = colorCore.clone().lerp(colorArm, Math.min(radius / 5.5, 1));
      
      arr[i * 3] = mixed.r;
      arr[i * 3 + 1] = mixed.g;
      arr[i * 3 + 2] = mixed.b;
    }
    return arr;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Slow continuous galaxy spin plus mouse acceleration
    const mouseXSpeed = state.pointer.x * 0.025;
    pointsRef.current.rotation.y += 0.0015 + mouseXSpeed;
  });

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
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Star field where stars flow past the camera along the Z axis
function StarField() {
  const pointsRef = useRef();
  const starCount = 600;

  // Pre-generate random star positions and travel speed offsets
  const [positions, speeds] = React.useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const spd = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      // Wide spread around camera Z path (X from -10 to 10, Y from -8 to 8)
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      // Z coordinates from far away (-15) to in front of camera (5)
      pos[i * 3 + 2] = Math.random() * 20 - 15;
      spd[i] = Math.random() * 0.06 + 0.03; // Travel speed
    }
    return [pos, spd];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array;

    for (let i = 0; i < starCount; i++) {
      // Move star towards the camera
      pos[i * 3 + 2] += speeds[i];

      // If star passes the camera position, wrap it around to the far back
      if (pos[i * 3 + 2] > 6) {
        pos[i * 3 + 2] = -15;
        pos[i * 3] = (Math.random() - 0.5) * 20;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={starCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

// Interactive Camera controller that slowly zooms in and rotates with the mouse
function CameraController({ progress }) {
  useFrame((state) => {
    const isMobile = state.size.width < 768;
    const baseZ = isMobile ? 8.2 : 5.8; // Zoom out camera further on mobile screens
    
    // Camera slowly flies through the galaxy
    const targetZ = baseZ - (progress / 100) * 3.0;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.03);

    // Parallax mouse rotation
    const targetX = state.pointer.x * (isMobile ? 1.0 : 1.6);
    const targetY = (isMobile ? 1.2 : 1.6) + state.pointer.y * 1.1;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.03);

    state.camera.lookAt(0, -0.2, 0);
  });

  return null;
}

// 3D Ball representing a technology orbiting the galactic center like a planet
function OrbitingBall({ label, color, radius, armIndex, speed, yOffset }) {
  const groupRef = useRef();
  const sphereRef = useRef();

  // Spiral arm distribution:
  // Two arms are 180 degrees apart (armIndex * Math.PI).
  // Adding radius-dependent twist angle creates a nice spiral form.
  const angleRef = useRef(armIndex * Math.PI + radius * 0.8 + Math.random() * 0.1);

  useFrame((state) => {
    if (!groupRef.current || !sphereRef.current) return;

    // Increment angle based on time delta
    angleRef.current += speed * 0.015;

    // Spiral coordinates in 3D
    const x = Math.cos(angleRef.current) * radius;
    const z = Math.sin(angleRef.current) * radius;
    // Tilted disk calculation
    const y = yOffset + Math.sin(angleRef.current) * radius * 0.15;

    // Mouse movement adds temporary interactive offset sway
    const mouseSwayX = state.pointer.x * 0.6;
    const mouseSwayY = state.pointer.y * 0.6;

    groupRef.current.position.x = x + mouseSwayX;
    groupRef.current.position.y = y + mouseSwayY;
    groupRef.current.position.z = z;

    // Rotate the tech sphere locally
    sphereRef.current.rotation.x += 0.01;
    sphereRef.current.rotation.y += 0.015;
  });

  return (
    <group ref={groupRef}>
      {/* 3D Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.15} 
          metalness={0.7} 
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Floating text label facing the camera */}
      <Text
        position={[0, 0.48, 0]} // Float slightly above the sphere
        fontSize={0.15}
        color="#ffffff"
        font="https://fonts.gstatic.com/s/outfit/v11/QGYyz_oq5Ou6Sv9Pq1Q.woff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineColor="#000000"
        outlineWidth={0.02}
      >
        {label}
      </Text>
    </group>
  );
}

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Auto increment progress bar over 5 seconds
  useEffect(() => {
    const duration = 4500; // 4.5s loading, 0.5s fadeout
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(Math.round(currentProgress));

      if (currentStep >= steps) {
        clearInterval(timer);
        
        // GSAP fade out overlay and trigger completion
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => {
            if (onComplete) onComplete();
          }
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Define 10 orbiting technology planets forming a spiral galaxy
  const techData = [
    { label: 'React', color: '#61dafb', radius: 1.3, armIndex: 0, speed: 0.8, yOffset: 0.1 },
    { label: 'HTML', color: '#e34f26', radius: 1.7, armIndex: 1, speed: 0.7, yOffset: -0.1 },
    { label: 'CSS', color: '#264de4', radius: 2.1, armIndex: 0, speed: 0.65, yOffset: 0.15 },
    { label: 'JS', color: '#f7df1e', radius: 2.4, armIndex: 1, speed: 0.6, yOffset: -0.2 },
    { label: 'Node.js', color: '#339933', radius: 2.7, armIndex: 0, speed: 0.55, yOffset: 0.05 },
    { label: 'MongoDB', color: '#47a248', radius: 3.0, armIndex: 1, speed: 0.5, yOffset: -0.1 },
    { label: 'GitHub', color: '#9d4edd', radius: 3.3, armIndex: 0, speed: 0.45, yOffset: 0.2 },
    { label: 'Express.js', color: '#ffffff', radius: 3.6, armIndex: 1, speed: 0.4, yOffset: -0.15 },
    { label: 'Bootstrap', color: '#7952b3', radius: 3.9, armIndex: 0, speed: 0.35, yOffset: 0.25 },
    { label: 'SQL', color: '#00758f', radius: 4.2, armIndex: 1, speed: 0.3, yOffset: -0.2 }
  ];

  return (
    <div className="preloader-overlay" ref={containerRef}>
      {/* 3D Preloading Canvas simulating a swirling galaxy in space */}
      <div className="preloader-canvas-container">
        <Canvas camera={{ position: [0, 1.8, 5.5], fov: 60 }}>
          <ambientLight intensity={0.4} />
          {/* Galactic core glow light source */}
          <pointLight position={[0, 0, 0]} intensity={3.0} color="#ff007f" />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
          <directionalLight position={[0, 5, 0]} intensity={0.8} />

          <Suspense fallback={null}>
            <Galaxy />
            <StarField />
            {techData.map((tech, idx) => (
              <OrbitingBall
                key={idx}
                label={tech.label}
                color={tech.color}
                radius={tech.radius}
                armIndex={tech.armIndex}
                speed={tech.speed}
                yOffset={tech.yOffset}
              />
            ))}
            <CameraController progress={progress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Interface overlay centered */}
      <div className="preloader-content-centered">
        <div className="preloader-logo-glow">
          Bhushan<span>.</span>
        </div>
        <p className="preloader-status-text">Entering Creative Galaxy...</p>
        
        {/* Loading Progress Bar & Percent */}
        <div className="progress-bar-container-glow">
          <div 
            className="progress-bar-fill-glow" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span className="progress-percent-glow">{progress}%</span>
      </div>
    </div>
  );
}
