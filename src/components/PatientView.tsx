import React, { useState } from 'react';
import { MedicalAnalysis } from '../types/medical';
import { Heart, HelpCircle, BookOpen, MessageSquare, AlertTriangle, Check, Copy, Sparkles } from 'lucide-react';

interface PatientViewProps {
  analysis: MedicalAnalysis;
  onAskQuestion: (question: string) => void;
}

export const PatientView: React.FC<PatientViewProps> = ({ analysis, onAskQuestion }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyDiscussion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 text-[#E0E0E0]">
      {/* 1. What We Found */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-100">
              What We Found
            </h3>
            <p className="text-xs text-gray-400">
              Plain-language overview of your {analysis.media_type}
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-gray-200 bg-black/40 p-4 rounded-xl border border-white/5">
          {analysis.patient_summary}
        </p>
      </div>

      {/* 2. Key Findings & What Does This Mean? */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-100">
              What Does This Mean?
            </h3>
            <p className="text-xs text-gray-400">
              Detailed breakdown of key visual/report observations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysis.key_findings.map((finding, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-black/30 border border-white/10 hover:border-[#00E5FF]/40 transition-colors flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#00E5FF]">
                    {finding.finding}
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/5 text-gray-400 border border-white/10 shrink-0">
                    {finding.confidence} confidence
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-normal">
                  {finding.explanation}
                </p>
              </div>

              <button
                onClick={() => onAskQuestion(`Can you explain "${finding.finding}" in more detail?`)}
                className="self-start mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#00E5FF] hover:text-cyan-300 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask MedSight about this</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Important Medical Terms */}
      {analysis.flagged_terms && analysis.flagged_terms.length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-100">
                Important Medical Terms
              </h3>
              <p className="text-xs text-gray-400">
                Simple definitions for medical terms mentioned in your results
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {analysis.flagged_terms.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-xs font-bold text-purple-300 block mb-1">
                  {item.term}
                </span>
                <p className="text-xs text-gray-300">
                  {item.simple_definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. What to Discuss with Your Doctor */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-100">
                What to Discuss with Your Doctor
              </h3>
              <p className="text-xs text-gray-400">
                Recommended discussion points for your upcoming appointment
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5">
          {analysis.recommended_discussion.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-black/30 border border-white/10 flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {item}
                </p>
              </div>

              <button
                onClick={() => handleCopyDiscussion(item, idx)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors shrink-0"
                title="Copy question"
              >
                {copiedIndex === idx ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Patient Safety Notice */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-300">
            AI Communication & Interpretation Notice
          </h4>
          <p className="text-amber-200/90 leading-relaxed">
            {analysis.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
