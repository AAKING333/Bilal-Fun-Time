import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Badge } from '../components/ui/Badge';
import { CardTilt } from '../components/ui/CardTilt';
import { Languages, Scale, ShieldCheck, FileSpreadsheet, Send, Sparkles } from 'lucide-react';

export const KeyFeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t.features.feat1Title,
      desc: t.features.feat1Desc,
      icon: Languages,
      tag: "Whisper AI Engine",
      color: "text-violet-400",
      border: "border-violet-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(129,75,238,0.2)]",
      colSpan: "md:col-span-3",
    },
    {
      title: t.features.feat2Title,
      desc: t.features.feat2Desc,
      icon: Scale,
      tag: "Delta Calculator",
      color: "text-rose-400",
      border: "border-rose-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(229,72,77,0.2)]",
      colSpan: "md:col-span-3",
    },
    {
      title: t.features.feat3Title,
      desc: t.features.feat3Desc,
      icon: ShieldCheck,
      tag: "Zero-Log Sovereign",
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(48,164,108,0.2)]",
      colSpan: "md:col-span-2",
    },
    {
      title: t.features.feat4Title,
      desc: t.features.feat4Desc,
      icon: FileSpreadsheet,
      tag: "ICT & DC Sync",
      color: "text-amber-400",
      border: "border-amber-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(245,166,35,0.2)]",
      colSpan: "md:col-span-2",
    },
    {
      title: t.features.feat5Title,
      desc: t.features.feat5Desc,
      icon: Send,
      tag: "PERA / PFA Dispatch",
      color: "text-blue-400",
      border: "border-blue-500/20",
      glow: "group-hover:shadow-[0_0_30px_rgba(39,101,245,0.2)]",
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-[#030014]/60">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-blue-900/10 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="violet" pulsing={false} className="mb-4">
            {t.features.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {t.features.title}
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-white/60">
            {t.features.subtitle}
          </p>
        </div>

        {/* 5 Feature Tiles in Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <CardTilt
                key={idx}
                className={`group flex flex-col justify-between p-8 rounded-3xl bg-[#0c0c0c]/80 border border-white/[0.08] hover:border-white/20 backdrop-blur-xl shadow-2xl transition-all duration-300 ${feat.colSpan} ${feat.glow}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border ${feat.border} ${feat.color} shadow-inner group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] text-white/50 border border-white/[0.06]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-white/65 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.04] flex items-center gap-2 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Citizen Governance</span>
                </div>
              </CardTilt>
            );
          })}
        </div>
      </div>
    </section>
  );
};

