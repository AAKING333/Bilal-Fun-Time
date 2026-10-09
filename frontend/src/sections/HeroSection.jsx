import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { AvatarController } from '../components/avatar/AvatarController';
import { Mic, ArrowDown } from 'lucide-react';

export const HeroSection = ({
  avatarState,
  volumeLevel,
  mouthAperture,
  floatingChips,
  stepLabel,
}) => {
  const { t } = useLanguage();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Gradient & Glow Aura Layers matching VoxAI */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top Center Electric Violet Ambient Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#814bee]/25 to-transparent rounded-full blur-[120px]" />
        {/* Secondary Blue & Indigo Depth Glows */}
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-[#2765f5]/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-[#4f1ad6]/20 rounded-full blur-[100px]" />
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Pill Badge */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Badge variant="violet" pulsing={true}>
            {t.hero.badge}
          </Badge>
        </div>

        {/* Huge Display Wordmark "Awaaz Pakistan" matching VoxAI's oversized hero typography */}
        <div className="mb-4">
          <h1 className="font-extrabold tracking-tighter leading-[0.92] text-white">
            <span className="block text-[4.5rem] sm:text-[6.5rem] md:text-[8rem] lg:text-[9.5rem] uppercase tracking-[-0.05em] bg-clip-text text-transparent bg-gradient-to-b from-white via-white/95 to-white/40 drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              {t.hero.titleAwaaz}
            </span>
            <span className="block text-2xl sm:text-4xl md:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-white -mt-2 sm:-mt-4 font-bold">
              {t.hero.titleSub}
            </span>
          </h1>
        </div>

        {/* Short Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-white/70 font-normal leading-relaxed mb-8 px-4">
          {t.hero.subtitle}
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto px-4">
          <button
            onClick={() => scrollTo('report')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#814bee] to-[#4f1ad6] hover:from-[#925eff] hover:to-[#5e24f0] text-white font-semibold text-sm shadow-[0_0_35px_rgba(129,75,238,0.5)] hover:shadow-[0_0_50px_rgba(129,75,238,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{t.hero.ctaVoice}</span>
          </button>

          <button
            onClick={() => scrollTo('dashboard')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-white/90 hover:text-white font-medium text-sm backdrop-blur-md transition-all cursor-pointer"
          >
            <span>{t.hero.ctaDashboard}</span>
            <ArrowDown className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Centerpiece: Real-time 3D AI AVATAR */}
        <div className="relative w-full max-w-2xl mx-auto -mt-4 mb-8">
          <AvatarController
            avatarState={avatarState}
            volumeLevel={volumeLevel}
            mouthAperture={mouthAperture}
            floatingChips={floatingChips}
            stepLabel={stepLabel}
          />
        </div>

        {/* Trust & Architecture Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 max-w-3xl w-full pt-4 border-t border-white/[0.08]">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="font-mono text-base sm:text-lg font-bold text-violet-300">
              Urdu • Punjabi • Pashto
            </span>
            <span className="text-[11px] text-white/50">{t.hero.statsTrained}</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="font-mono text-base sm:text-lg font-bold text-white">
              ICT & Rawalpindi
            </span>
            <span className="text-[11px] text-white/50">{t.hero.marketsMonitored}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <span className="font-mono text-base sm:text-lg font-bold text-emerald-400">
              100% Private Local AI
            </span>
            <span className="text-[11px] text-white/50">Zero Voice Retention</span>
          </div>
        </div>
      </div>
    </section>
  );
};
