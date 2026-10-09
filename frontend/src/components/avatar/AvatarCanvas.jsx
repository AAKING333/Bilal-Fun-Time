import React, { Suspense, useState, useEffect, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { ProceduralAvatar } from './ProceduralAvatar';
import { AvatarLite } from './AvatarLite';
import { AVATAR_STATES } from '../../hooks/useAvatarState';

// Error boundary to catch WebGL context creation failures
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('WebGL Error caught, switching to 2D Lite mode:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const AvatarCanvas = ({
  avatarState = AVATAR_STATES.IDLE,
  volumeLevel = 0,
  mouthAperture = 0,
  floatingChips = [],
  stepLabel = '',
  forceLite = false,
}) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mql.matches);

    // Check basic WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (forceLite || isReducedMotion || !webglSupported) {
    return (
      <AvatarLite
        avatarState={avatarState}
        volumeLevel={volumeLevel}
        mouthAperture={mouthAperture}
        floatingChips={floatingChips}
        stepLabel={stepLabel}
      />
    );
  }

  return (
    <WebGLErrorBoundary
      fallback={
        <AvatarLite
          avatarState={avatarState}
          volumeLevel={volumeLevel}
          mouthAperture={mouthAperture}
          floatingChips={floatingChips}
          stepLabel={stepLabel}
        />
      }
    >
      <div className="relative w-full h-[360px] md:h-[450px]">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.4, 2.8], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full pointer-events-auto"
        >
          <Suspense fallback={null}>
            <ProceduralAvatar
              avatarState={avatarState}
              volumeLevel={volumeLevel}
              mouthAperture={mouthAperture}
            />
          </Suspense>
        </Canvas>

        {/* Step Label overlay */}
        {stepLabel && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#131515]/90 border border-violet-500/40 text-violet-200 text-xs font-medium backdrop-blur-md shadow-[0_0_20px_rgba(129,75,238,0.3)] animate-pulse pointer-events-none">
            {stepLabel}
          </div>
        )}

        {/* Floating 3D Info Chips */}
        {floatingChips.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {floatingChips.map((chip, i) => (
              <div
                key={i}
                className={`absolute px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-xl shadow-lg transition-all animate-in fade-in zoom-in-95 duration-500 pointer-events-auto ${
                  chip.variant === 'alert'
                    ? 'bg-rose-950/85 border-rose-500/50 text-rose-300 shadow-[0_0_25px_rgba(229,72,77,0.5)]'
                    : chip.variant === 'success'
                    ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(48,164,108,0.4)]'
                    : 'bg-[#131515]/90 border-violet-500/40 text-white shadow-[0_0_20px_rgba(129,75,238,0.3)]'
                }`}
                style={{
                  top: i === 0 ? '15%' : i === 1 ? '70%' : '38%',
                  left: i === 0 ? '4%' : i === 1 ? '6%' : '76%',
                }}
              >
                {chip.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </WebGLErrorBoundary>
  );
};

