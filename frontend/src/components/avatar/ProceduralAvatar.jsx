import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AVATAR_STATES } from '../../hooks/useAvatarState';

export const ProceduralAvatar = ({
  avatarState = AVATAR_STATES.IDLE,
  volumeLevel = 0,
  mouthAperture = 0,
}) => {
  const headRef = useRef();
  const eyesRef = useRef();
  const mouthRef = useRef();
  const ringsRef = useRef();
  const particlesRef = useRef();
  const pointLightRef = useRef();

  // State-based colors
  const auraColor = useMemo(() => {
    switch (avatarState) {
      case AVATAR_STATES.ALERT:
        return new THREE.Color('#E5484D');
      case AVATAR_STATES.HAPPY:
        return new THREE.Color('#30A46C');
      case AVATAR_STATES.THINKING:
        return new THREE.Color('#814bee');
      case AVATAR_STATES.LISTENING:
        return new THREE.Color('#2765f5');
      case AVATAR_STATES.ERROR:
        return new THREE.Color('#994b20');
      default:
        return new THREE.Color('#814bee');
    }
  }, [avatarState]);

  // Orbiting particles for thinking
  const particleCount = 45;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const radius = 1.35 + Math.random() * 0.3;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const { x, y } = state.pointer;

    // Head smooth tracking of cursor
    if (headRef.current) {
      // Natural idle breathing & sway
      const idleSwayX = Math.sin(t * 0.8) * 0.05;
      const idleSwayY = Math.cos(t * 0.5) * 0.04;

      const targetRotY = x * 0.45 + idleSwayX;
      const targetRotX = -y * 0.35 + idleSwayY;

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, delta * 3.5);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, delta * 3.5);

      // Listening state leans forward
      const targetPosZ = avatarState === AVATAR_STATES.LISTENING ? 0.35 : 0;
      headRef.current.position.z = THREE.MathUtils.lerp(headRef.current.position.z, targetPosZ, delta * 2.5);
    }

    // Eyes blinking simulation
    if (eyesRef.current) {
      const blink = Math.sin(t * 2.5);
      const isBlinking = blink > 0.96;
      eyesRef.current.scale.y = isBlinking ? 0.1 : 1.0;
    }

    // Mouth aperture animation from speech / analyser
    if (mouthRef.current) {
      const targetScaleY = 0.2 + mouthAperture * 2.2;
      mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, targetScaleY, delta * 15);
      mouthRef.current.scale.x = THREE.MathUtils.lerp(mouthRef.current.scale.x, 1 + mouthAperture * 0.4, delta * 15);
    }

    // Pulse torus rings with volume level during listening
    if (ringsRef.current) {
      ringsRef.current.rotation.z = t * 0.3;
      ringsRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.7) * 0.1;
      const pulse = 1 + volumeLevel * 0.6;
      ringsRef.current.scale.set(pulse, pulse, pulse);
    }

    // Orbiting particles rotation in thinking state
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 1.2;
    }

    // Point light intensity animation
    if (pointLightRef.current) {
      pointLightRef.current.color.lerp(auraColor, delta * 3);
      const intensityBase = avatarState === AVATAR_STATES.ALERT ? 3.5 : 2.0;
      pointLightRef.current.intensity = intensityBase + Math.sin(t * 3) * 0.5 + volumeLevel * 2.0;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Dynamic Key & Rim Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} color="#ffffff" />
      <pointLight ref={pointLightRef} position={[0, 0, 1.8]} intensity={2.5} distance={6} />
      <pointLight position={[0, -2, -1]} intensity={1.0} color="#4f1ad6" />

      {/* Head & Bust Group */}
      <group ref={headRef}>
        {/* Holographic Cranium / Head Sphere */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.75, 48, 48]} />
          <meshPhysicalMaterial
            color="#080811"
            roughness={0.15}
            metalness={0.85}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transmission={0.2}
            reflectivity={0.9}
          />
        </mesh>

        {/* Visor Screen Glass */}
        <mesh position={[0, 0.38, 0.48]}>
          <boxGeometry args={[0.9, 0.45, 0.35]} />
          <meshPhysicalMaterial
            color="#030014"
            roughness={0.1}
            metalness={0.9}
            transmission={0.4}
            thickness={0.5}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Cybernetic Glowing Eyes */}
        <group ref={eyesRef} position={[0, 0.45, 0.68]}>
          <mesh position={[-0.22, 0, 0]}>
            <capsuleGeometry args={[0.045, 0.08, 12, 16]} />
            <meshStandardMaterial
              color={auraColor}
              emissive={auraColor}
              emissiveIntensity={3.5}
              roughness={0.2}
            />
          </mesh>
          <mesh position={[0.22, 0, 0]}>
            <capsuleGeometry args={[0.045, 0.08, 12, 16]} />
            <meshStandardMaterial
              color={auraColor}
              emissive={auraColor}
              emissiveIntensity={3.5}
              roughness={0.2}
            />
          </mesh>
        </group>

        {/* Dynamic Mouth Mesh */}
        <mesh ref={mouthRef} position={[0, 0.22, 0.68]}>
          <capsuleGeometry args={[0.03, 0.16, 8, 16]} />
          <meshStandardMaterial
            color={auraColor}
            emissive={auraColor}
            emissiveIntensity={2.8}
            roughness={0.3}
          />
        </mesh>

        {/* Neck & Cyber Collar */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.28, 0.38, 0.45, 32]} />
          <meshStandardMaterial color="#0c0d14" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Shoulders / Torso base */}
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[1.6, 0.45, 0.8]} />
          <meshPhysicalMaterial color="#08090e" metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* Reactive Glowing Energy Torus Rings */}
      <group ref={ringsRef} position={[0, 0.35, 0]}>
        <mesh>
          <torusGeometry args={[1.05, 0.022, 16, 64]} />
          <meshStandardMaterial
            color={auraColor}
            emissive={auraColor}
            emissiveIntensity={2.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.15, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#814bee"
            emissive="#814bee"
            emissiveIntensity={1.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>

      {/* Orbiting particles for Thinking state */}
      {avatarState === AVATAR_STATES.THINKING && (
        <points ref={particlesRef} position={[0, 0.4, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particlePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color="#814bee"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Reflective Ground Halo */}
      <mesh position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.8, 48]} />
        <meshBasicMaterial
          color={auraColor}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

