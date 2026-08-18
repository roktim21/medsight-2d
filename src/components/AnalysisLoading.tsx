import React, { useEffect, useState } from 'react';
import { Check, Loader2, Sparkles } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

const STEPS: Step[] = [
  { id: 1, label: 'File validated & format verified' },
  { id: 2, label: 'Media type & modality detected' },
  { id: 3, label: 'Interpreting medical content with Gemini' },
  { id: 4, label: 'Structuring findings & qualitative severity' },
  { id: 5, label: 'Synthesizing patient & doctor perspectives' },
];

export const AnalysisLoading: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 600);
    const timer2 = setTimeout(() => setCurrentStep(3), 1300);
    const timer3 = setTimeout(() => setCurrentStep(4), 2200);
    const timer4 = setTimeout(() => setCurrentStep(5), 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-6 sm:p-8 rounded-xl bg-white/[0.03] border border-white/10 text-[#E0E0E0] shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-100">
            Analyzing Medical Media
          </h3>
          <p className="text-xs text-gray-400">
            Gemini Multimodal AI Processing Pipeline
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {STEPS.map((step) => {
          const isDone = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 text-xs sm:text-sm transition-all duration-300 ${
                isDone
                  ? 'text-emerald-400 font-medium'
                  : isCurrent
                  ? 'text-[#00E5FF] font-semibold scale-[1.01]'
                  : 'text-gray-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : isCurrent
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]'
                    : 'bg-white/5 border-white/10 text-gray-600'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00E5FF]" />
                ) : (
                  <span className="text-[10px]">{step.id}</span>
                )}
              </div>

              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
        <span>Processing in-memory (No database persistence)</span>
        <span className="text-[#00E5FF] font-medium">Please wait...</span>
      </div>
    </div>
  );
};
