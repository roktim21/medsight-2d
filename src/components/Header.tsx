import React from 'react';
import { Stethoscope, ShieldCheck, RefreshCw, Cpu } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onOpenSafetyModal: () => void;
  hasMedia: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onOpenSafetyModal, hasMedia }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0C0E]/85 backdrop-blur-md border-b border-white/10 text-[#E0E0E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                MedSight <span className="text-[#00E5FF]">2D</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 rounded-full uppercase tracking-wider">
                Multimodal AI
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Universal Multimodal Medical Image & Report Synthesizer
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
            <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              GEMINI-3.6-FLASH
            </span>
          </div>

          <button
            onClick={onOpenSafetyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-medium transition-colors"
            title="Privacy & Safety Principles"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Zero Persistence</span>
          </button>

          {hasMedia && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-black text-xs font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Analysis</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
