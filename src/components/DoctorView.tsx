import React, { useState } from 'react';
import { MedicalAnalysis, SeverityLevel } from '../types/medical';
import { Stethoscope, Copy, Check, AlertCircle, Tag, ShieldAlert, FileText, ExternalLink } from 'lucide-react';

interface DoctorViewProps {
  analysis: MedicalAnalysis;
}

export const DoctorView: React.FC<DoctorViewProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const fullSummary = `
MEDSIGHT 2D CLINICAL SYNTHESIS
========================================
MEDIA TYPE: ${analysis.media_type}
QUALITATIVE SEVERITY: ${analysis.severity_level}

CLINICAL SUMMARY:
${analysis.doctor_summary}

KEY FINDINGS:
${analysis.key_findings.map((f, i) => `${i + 1}. ${f.finding} (${f.confidence} confidence): ${f.explanation}`).join('\n')}

FLAGGED TERMS:
${analysis.flagged_terms.map((t) => `• ${t.term}: ${t.simple_definition}`).join('\n')}

RECOMMENDED DISCUSSION:
${analysis.recommended_discussion.map((d, i) => `${i + 1}. ${d}`).join('\n')}

DIAGNOSTIC LIMITATIONS:
${analysis.limitations}

DISCLAIMER:
${analysis.disclaimer}
`.trim();

    navigator.clipboard.writeText(fullSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Moderate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Low':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6 text-[#E0E0E0] font-mono text-xs sm:text-sm">
      {/* Clinician Top Header Panel */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="w-5 h-5 text-[#00E5FF]" />
              <h3 className="text-base font-bold text-gray-100 tracking-tight">
                Clinician Dashboard Synthesis
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-sans">
              Structured multimodal findings for clinical evaluation & documentation
            </p>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-black font-sans text-xs font-bold shadow-[0_0_12px_rgba(0,229,255,0.3)] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>Copied Clinical Note</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>Copy Clinical Note</span>
              </>
            )}
          </button>
        </div>

        {/* Media Type & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 font-sans">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Media Type / Modality
            </span>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#00E5FF]" />
              <span className="font-bold text-gray-200 text-xs sm:text-sm">
                {analysis.media_type}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Qualitative Severity
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${getSeverityBadge(
                analysis.severity_level
              )}`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{analysis.severity_level} Severity</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              AI Assessment Model
            </span>
            <div className="flex items-center gap-2 text-gray-300 text-xs">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Gemini 3.6 Flash System</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Key Findings Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm font-sans">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <span>KEY FINDINGS & CONFIDENCE ASSESSMENTS</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-bold text-gray-400 uppercase">
                <th className="py-2.5 px-3">Finding</th>
                <th className="py-2.5 px-3">Clinical Explanation</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {analysis.key_findings.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#00E5FF] shrink-0">
                    {item.finding}
                  </td>
                  <td className="py-3 px-3 text-gray-300 leading-normal">
                    {item.explanation}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                        item.confidence === 'high'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.confidence === 'moderate'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-white/5 text-gray-400 border-white/10'
                      }`}
                    >
                      {item.confidence}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Summary & Flagged Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        {/* Doctor Summary */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              CLINICAL SUMMARY
            </h4>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed font-mono whitespace-pre-line">
              {analysis.doctor_summary}
            </div>
          </div>
        </div>

        {/* Flagged Medical Terms */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            FLAGGED CLINICAL TERMS
          </h4>
          <div className="space-y-2.5">
            {analysis.flagged_terms.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-xs font-bold text-[#00E5FF] block mb-0.5">
                  {item.term}
                </span>
                <span className="text-xs text-gray-400 block">
                  {item.simple_definition}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diagnostic Limitations & Recommended Discussion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>DIAGNOSTIC LIMITATIONS</span>
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/10">
            {analysis.limitations}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            RECOMMENDED CLINICAL DISCUSSION
          </h4>
          <ul className="space-y-2 text-xs text-gray-300">
            {analysis.recommended_discussion.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#00E5FF] font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
