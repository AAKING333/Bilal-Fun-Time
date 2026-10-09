import React from 'react';

export const Badge = ({
  children,
  variant = 'violet',
  pulsing = true,
  className = '',
}) => {
  const variants = {
    violet: {
      wrap: 'border-violet-500/30 bg-violet-500/10 text-violet-300 shadow-[0_0_15px_rgba(129,75,238,0.2)]',
      dot: 'bg-violet-400',
    },
    red: {
      wrap: 'border-rose-500/40 bg-rose-500/15 text-rose-300 shadow-[0_0_20px_rgba(229,72,77,0.3)]',
      dot: 'bg-rose-400',
    },
    green: {
      wrap: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(48,164,108,0.2)]',
      dot: 'bg-emerald-400',
    },
    neutral: {
      wrap: 'border-white/10 bg-white/5 text-white/70',
      dot: 'bg-white/40',
    },
  };

  const style = variants[variant] || variants.violet;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium tracking-wide uppercase transition-all backdrop-blur-md ${style.wrap} ${className}`}
    >
      {pulsing && (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${style.dot}`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${style.dot}`}
          />
        </span>
      )}
      {children}
    </span>
  );
};

