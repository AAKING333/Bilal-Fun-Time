import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { CardTilt } from '../components/ui/CardTilt';
import { Mic, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      icon: Mic,
      gradient: 'from-violet-500/20 to-transparent',
      borderColor: 'border-violet-500/30',
      iconColor: 'text-violet-400',
    },
    {
      num: '02',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      icon: Cpu,
      gradient: 'from-blue-500/20 to-transparent',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      num: '03',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-900/10 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="violet" pulsing={false} className="mb-4">
            {t.howItWorks.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-white/60">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 3 Animated Cards in VoxAI card style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <CardTilt
                key={step.num}
                className="group flex flex-col justify-between p-8 rounded-3xl bg-[#0c0c0c]/80 border border-white/[0.08] hover:border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(129,75,238,0.15)]"
              >
                <div>
                  {/* Top Row: Number & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-3xl font-extrabold text-white/20 group-hover:text-white/40 transition-colors">
                      {step.num}
                    </span>
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border ${step.borderColor} ${step.iconColor} shadow-inner group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/65 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40 group-hover:text-white/70 transition-colors">
                  <span>Step {idx + 1} of 3</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardTilt>
            );
          })}
        </div>
      </div>
    </section>
  );
};

