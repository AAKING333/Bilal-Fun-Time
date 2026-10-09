import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Mic, ArrowUpRight } from 'lucide-react';

export const FinalCtaSection = () => {
  const { t } = useLanguage();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-[#030014]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#131515] to-[#080808] border border-white/[0.1] p-10 sm:p-16 text-center overflow-hidden shadow-2xl">
          {/* Internal atmospheric violet aura */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-[100px]" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
              {t.footer.ctaTitle}
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-10 leading-relaxed">
              {t.footer.ctaSub}
            </p>

            <button
              onClick={() => scrollTo('report')}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#814bee] to-[#4f1ad6] hover:from-[#925eff] hover:to-[#5e24f0] text-white font-bold text-sm shadow-[0_0_35px_rgba(129,75,238,0.5)] hover:shadow-[0_0_50px_rgba(129,75,238,0.8)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{t.footer.ctaButton}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

