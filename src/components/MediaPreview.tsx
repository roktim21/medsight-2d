import React, { useState } from 'react';
import { Maximize2, RefreshCw, FileText, X, CheckCircle2 } from 'lucide-react';

interface MediaPreviewProps {
  mediaUrl: string;
  mediaType: string;
  fileName?: string;
  onReset: () => void;
  onReanalyze: () => void;
  isLoading: boolean;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaUrl,
  mediaType,
  fileName,
  onReset,
  onReanalyze,
  isLoading,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const isPdf = mediaType.includes('pdf') || fileName?.endsWith('.pdf');

  return (
    <div className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5 text-[#E0E0E0]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-100">
                {fileName || 'Uploaded Medical Media'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-white/5 text-[#00E5FF] border border-white/10 rounded-full">
                {mediaType || '2D Media'}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Active media loaded for multimodal synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onReanalyze}
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-medium border border-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-Analyze</span>
          </button>
          <button
            onClick={onReset}
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium border border-white/10 transition-colors disabled:opacity-50"
          >
            <span>Change Media</span>
          </button>
        </div>
      </div>

      {/* Media Content Box */}
      <div className="mt-4 relative bg-black/60 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[200px] max-h-[320px]">
        {isPdf ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00E5FF]">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">
                {fileName || 'Medical Laboratory PDF Document'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PDF text & tabular medical report loaded
              </p>
            </div>
          </div>
        ) : (
          <div className="relative group w-full h-full flex items-center justify-center p-2">
            <img
              src={mediaUrl}
              alt="Medical Media Preview"
              className="max-h-[280px] w-auto object-contain rounded-lg"
            />
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/80 hover:bg-black text-gray-200 border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity"
              title="Expand Image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Zoom Lightbox Modal */}
      {isZoomed && !isPdf && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full bg-[#0B0C0E] border border-white/10 rounded-2xl overflow-hidden p-4 flex flex-col items-center">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-bold text-gray-200 mb-3">
              Full Media View — {fileName || 'Medical Image'}
            </h4>
            <div className="overflow-auto max-h-[80vh] w-full flex items-center justify-center bg-black rounded-xl p-2">
              <img src={mediaUrl} alt="Expanded Medical Media" className="max-h-[75vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
