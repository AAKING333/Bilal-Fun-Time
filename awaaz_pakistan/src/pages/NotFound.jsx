import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center p-4 text-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute w-[400px] h-[300px] bg-violet-900/15 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-md p-8 rounded-3xl bg-[#0c0c0c]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400 mx-auto mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 font-mono">
          404
        </h1>
        <h2 className="text-lg font-bold text-white/90 mb-3">
          Page Not Found
        </h2>
        <p className="text-xs text-white/50 mb-8 leading-relaxed">
          The requested route does not exist on the Awaaz Pakistan platform.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#814bee] to-[#4f1ad6] hover:from-[#925eff] hover:to-[#5e24f0] text-white font-semibold text-xs shadow-[0_0_25px_rgba(129,75,238,0.4)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

