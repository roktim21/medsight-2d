import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, AlertCircle, Shield, FileUp } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndPass = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    const maxSizeMB = 15;

    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf')) {
      setError('Unsupported file type. Please upload a JPEG, PNG, WEBP image, or PDF report.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds limit (${maxSizeMB}MB). Please choose a smaller file.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative group rounded-xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-[#00E5FF] bg-[#00E5FF]/10 scale-[1.01]'
            : 'border-white/10 hover:border-[#00E5FF]/50 bg-white/[0.03] hover:bg-white/[0.05]'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-1">
              Drop medical image or report here
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Drag & drop your file or <span className="text-[#00E5FF] font-medium underline underline-offset-2">browse computer</span>
            </p>
          </div>

          {/* Supported Format Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/10">
              <ImageIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
              Chest X-Ray / CT
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/10">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              ECG / Skin Scan
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/10">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Lab Report PDF
            </span>
          </div>

          <p className="text-[11px] text-gray-500">
            Supports JPEG, PNG, WEBP, PDF (Max 15MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Privacy Notice Micro-copy */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 bg-white/[0.02] py-2.5 px-4 rounded-xl border border-white/5">
        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong className="text-gray-300">Zero Permanent Storage:</strong> MedSight 2D processes medical media transiently in memory and immediately discards data after analysis.
        </span>
      </div>
    </div>
  );
};
