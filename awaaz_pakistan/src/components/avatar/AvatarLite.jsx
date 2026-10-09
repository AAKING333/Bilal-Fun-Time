import React from 'react';
import { AVATAR_STATES } from '../../hooks/useAvatarState';
import { Mic, AlertTriangle, CheckCircle, Brain } from 'lucide-react';

export const AvatarLite = ({
  avatarState = AVATAR_STATES.IDLE,
  volumeLevel = 0,
  mouthAperture = 0,
  floatingChips = [],
  stepLabel = '',
}) => {
  const isAlert = avatarState === AVATAR_STATES.ALERT;
  const isHappy = avatarState === AVATAR_STATES.HAPPY;
  const isThinking = avatarState === AVATAR_STATES.THINKING;
  const isListening = avatarState === AVATAR_STATES.LISTENING;

  const glowColor = isAlert
    ? 'rgba(229, 72, 77, 0.45)'
    : isHappy
    ? 'rgba(48, 164, 108, 0.45)'
    : isThinking
    ? 'rgba(129, 75, 238, 0.5)'
    : isListening
    ? 'rgba(39, 101, 245, 0.5)'
    : 'rgba(129, 75, 238, 0.3)';

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[360px] md:h-[440px] select-none">
      {/* Ambient Pulsing Aura */}
      <div
        className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full blur-3xl transition-all duration-700"
        style={{
          backgroundColor: glowColor,
          transform: `scale(${1 + volumeLevel * 0.4 + mouthAperture * 0.2})`,
        }}
      />

      {/* Hologram Orb / Bust */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Orbital Ring */}
        <div
          className={`absolute -inset-6 rounded-full border border-dashed transition-all duration-700 ${
            isThinking
              ? 'border-violet-400/60 animate-spin [animation-duration:6s]'
              : isAlert
              ? 'border-rose-400/60 animate-pulse'
              : 'border-white/15'
          }`}
        />

        {/* Outer Glowing Ring */}
        <div
          className="relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-[#131515] to-[#080808] border border-white/20 shadow-2xl transition-all duration-300"
          style={{
            boxShadow: `0 0 35px ${glowColor}`,
          }}
        >
          {/* Inner Face / Visor */}
          <div className="relative flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 rounded-full bg-black/60 border border-white/10 overflow-hidden">
            {/* Eyes */}
            <div className="flex items-center gap-6 mb-3">
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isAlert
                    ? 'bg-rose-400 shadow-[0_0_12px_#e5484d] scale-y-75'
                    : isHappy
                    ? 'bg-emerald-400 shadow-[0_0_12px_#30a46c]'
                    : isThinking
                    ? 'bg-violet-400 shadow-[0_0_12px_#814bee] -translate-y-1'
                    : 'bg-white shadow-[0_0_10px_#ffffff]'
                }`}
              />
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isAlert
                    ? 'bg-rose-400 shadow-[0_0_12px_#e5484d] scale-y-75'
                    : isHappy
                    ? 'bg-emerald-400 shadow-[0_0_12px_#30a46c]'
                    : isThinking
                    ? 'bg-violet-400 shadow-[0_0_12px_#814bee] -translate-y-1'
                    : 'bg-white shadow-[0_0_10px_#ffffff]'
                }`}
              />
            </div>

            {/* Mouth (Animates with volume / mouthAperture) */}
            <div
              className={`rounded-full transition-all duration-100 ${
                isAlert ? 'bg-rose-400' : isHappy ? 'bg-emerald-400' : 'bg-violet-400'
              }`}
              style={{
                width: `${18 + mouthAperture * 14}px`,
                height: `${3 + mouthAperture * 14}px`,
                boxShadow: `0 0 10px ${glowColor}`,
              }}
            />

            {/* Dynamic Soundwave Overlay when Listening */}
            {isListening && (
              <div className="absolute bottom-3 flex items-center gap-1">
                {[0.4, 0.8, 1.0, 0.6, 0.3].map((mult, idx) => (
                  <span
                    key={idx}
                    className="w-1 bg-cyan-400 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(4, volumeLevel * 24 * mult)}px`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step Label or State Badge */}
        {stepLabel ? (
          <div className="mt-4 px-4 py-1.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-200 text-xs font-medium backdrop-blur-md animate-pulse">
            {stepLabel}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60">
            {isAlert && <AlertTriangle className="w-3 h-3 text-rose-400" />}
            {isHappy && <CheckCircle className="w-3 h-3 text-emerald-400" />}
            {isThinking && <Brain className="w-3 h-3 text-violet-400 animate-pulse" />}
            {isListening && <Mic className="w-3 h-3 text-cyan-400 animate-pulse" />}
            <span className="capitalize">{avatarState} Mode</span>
          </div>
        )}
      </div>

      {/* Floating 3D Info Chips */}
      {floatingChips.length > 0 && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {floatingChips.map((chip, i) => (
            <div
              key={i}
              className={`absolute px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-xl shadow-lg transition-all animate-in fade-in zoom-in-95 duration-500 ${
                chip.variant === 'alert'
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 shadow-[0_0_20px_rgba(229,72,77,0.4)]'
                  : chip.variant === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_20px_rgba(48,164,108,0.4)]'
                  : 'bg-[#131515]/90 border-violet-500/40 text-white'
              }`}
              style={{
                top: i === 0 ? '18%' : i === 1 ? '70%' : '40%',
                left: i === 0 ? '5%' : i === 1 ? '8%' : '76%',
              }}
            >
              {chip.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
