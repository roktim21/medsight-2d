import React from 'react';
import { X, ShieldCheck, Lock, Cpu, Stethoscope, CheckCircle2 } from 'lucide-react';

interface SafetyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyNoticeModal: React.FC<SafetyNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-xl w-full bg-[#0B0C0E] border border-white/10 rounded-xl p-6 shadow-2xl text-[#E0E0E0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-100">
              Privacy & Responsible Medical AI
            </h3>
            <p className="text-xs text-gray-400">
              Zero-Persistence Architecture & Clinical Guidelines
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-gray-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>Zero Permanent Data Persistence</span>
            </div>
            <p>
              MedSight 2D is intentionally engineered without databases or persistent image disk stores.
              All uploaded medical media files (X-Rays, ECGs, Dermatology images, Lab Reports) are processed strictly in-memory and immediately discarded after request completion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#00E5FF] font-bold">
              <Cpu className="w-4 h-4" />
              <span>Server-Side Multimodal Architecture</span>
            </div>
            <p>
              Gemini Multimodal API operations are proxied exclusively through server-side endpoints.
              API keys are never exposed to the client browser bundle.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Stethoscope className="w-4 h-4" />
              <span>Clinical Assistant Scope</span>
            </div>
            <p>
              MedSight 2D is a communication and interpretation aid designed to bridge the gap between complex medical imaging and patient understanding.
              It does not replace professional medical diagnosis, clinical judgment, or physical medical examination.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-200">Our Core Principles:</h4>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Never present AI output as a definitive diagnosis.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Provide distinct Patient and Doctor perspectives for effective healthcare communication.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Context-lock AI chat strictly to the analyzed media to prevent hallucinated medical advice.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-black font-bold text-xs shadow-[0_0_12px_rgba(0,229,255,0.3)] transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
