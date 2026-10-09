import React, { useState } from 'react';
import { AvatarCanvas } from './AvatarCanvas';
import { AVATAR_STATES } from '../../hooks/useAvatarState';
import { Sparkles } from 'lucide-react';

export const AvatarController = ({
  avatarState = AVATAR_STATES.IDLE,
  volumeLevel = 0,
  mouthAperture = 0,
  floatingChips = [],
  stepLabel = '',
  className = '',
}) => {
  const [forceLite, setForceLite] = useState(false);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 3D / Lite Toggle for low-spec control */}
      <button
        type="button"
        onClick={() => setForceLite(!forceLite)}
        className="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[10px] text-white/60 hover:text-white transition-all cursor-pointer backdrop-blur-md"
        title="Toggle between 3D Canvas and 2D Lite Mode"
      >
        <Sparkles className="w-3 h-3 text-violet-400" />
        <span>{forceLite ? '2D Lite' : '3D Real-time'}</span>
      </button>

      {/* Main Avatar Render */}
      <AvatarCanvas
        avatarState={avatarState}
        volumeLevel={volumeLevel}
        mouthAperture={mouthAperture}
        floatingChips={floatingChips}
        stepLabel={stepLabel}
        forceLite={forceLite}
      />
    </div>
  );
};
