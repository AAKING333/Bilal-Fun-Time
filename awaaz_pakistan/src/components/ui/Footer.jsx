import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { PrivacyModal } from './PrivacyModal';
import { Mic } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#030014] pt-16 pb-12 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-t from-violet-900/10 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#814bee] to-[#4f1ad6] shadow-[0_0_15px_rgba(129,75,238,0.4)]">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                {t.nav.brand}
              </span>
            </div>
            <p className="text-xs text-white/50 max-w-sm">
              {t.footer.builtFor}
            </p>
          </div>

          {/* Anchor Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
            <button
              onClick={() => scrollTo('report')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.report}
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.howItWorks}
            </button>
            <button
              onClick={() => scrollTo('dashboard')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.liveDashboard}
            </button>
            <button
              onClick={() => scrollTo('official-rates')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.officialRates}
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.faq}
            </button>
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="text-violet-400 hover:text-violet-300 transition-colors underline cursor-pointer"
            >
              {t.footer.privacyLink}
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} Awaaz Pakistan. {t.footer.rights}</p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Local Voice AI</span>
            <span className="inline-block w-1 h-1 rounded-full bg-white/30" />
            <span className="text-white/60">Islamabad & Rawalpindi</span>
          </p>
        </div>
      </div>

      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </footer>
  );
};
