import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ShieldCheck, MapPin, Trash2, Lock, X } from 'lucide-react';

export const PrivacyModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#0c0c0c] border border-white/10 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 id="privacy-modal-title" className="text-xl font-bold text-white">
              {t.privacy.title}
            </h3>
            <p className="text-xs text-white/50">Awaaz Pakistan Data Governance Charter</p>
          </div>
        </div>

        {/* Modal Points */}
        <div className="space-y-4 text-sm text-white/75 leading-relaxed">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <Trash2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">Transient Audio Processing</h4>
              <p className="text-xs text-white/60">{t.privacy.p1}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">Incident Location (Shop Pin)</h4>
              <p className="text-xs text-white/60">{t.privacy.p2}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">Restricted Administrative Access</h4>
              <p className="text-xs text-white/60">{t.privacy.p3}</p>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="mt-8 pt-5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#814bee] to-[#4f1ad6] text-white font-medium text-xs shadow-[0_0_20px_rgba(129,75,238,0.4)] hover:shadow-[0_0_30px_rgba(129,75,238,0.6)] cursor-pointer"
          >
            {t.privacy.close}
          </button>
        </div>
      </div>
    </div>
  );
};

