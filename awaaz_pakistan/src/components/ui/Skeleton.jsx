import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-xl' }) => {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.04] border border-white/[0.06] ${rounded} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
    </div>
  );
};

