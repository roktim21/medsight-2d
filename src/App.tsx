import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { SampleButtons } from './components/SampleButtons';
import { MediaPreview } from './components/MediaPreview';
import { AnalysisLoading } from './components/AnalysisLoading';
import { PatientView } from './components/PatientView';
import { DoctorView } from './components/DoctorView';
import { ChatPanel } from './components/ChatPanel';
import { SafetyNoticeModal } from './components/SafetyNoticeModal';
import { analyzeMedia } from './services/api';
import { MedicalAnalysis, SampleMediaItem } from './types/medical';
import { User, Stethoscope, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [selectedMediaType, setSelectedMediaType] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('');

  const [analysis, setAnalysis] = useState<MedicalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'chat'>('patient');
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);
  const [activeAskQuestion, setActiveAskQuestion] = useState<string>('');

  // Handle file selection from UploadZone
  const handleFileSelect = (file: File) => {
    setError(null);
    setSelectedFileName(file.name);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      setSelectedMediaUrl(result);
      runAnalysis(result, file.type, file.name);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try another media file.');
    };
    reader.readAsDataURL(file);
  };

  // Handle sample selection from SampleButtons
  const handleSelectSample = (sample: SampleMediaItem) => {
    setError(null);
    setSelectedMediaUrl(sample.dataUrl);
    setSelectedMediaType(sample.type);
    setSelectedFileName(sample.title);
    setMimeType(sample.mimeType);

    // Run synthesis with fallback sample analysis for maximum demo reliability
    setIsLoading(true);
    setTimeout(() => {
      setAnalysis(sample.sampleAnalysis);
      setIsLoading(false);
      setActiveTab('patient');
    }, 2800); // Simulated progress animation duration for smooth UI feedback
  };

  // Run Gemini Multimodal Analysis via Server API
  const runAnalysis = async (dataUrl: string, typeStr: string, fileNameStr: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeMedia(dataUrl, typeStr, fileNameStr);
      setAnalysis(result);
      setSelectedMediaType(result.media_type || '2D Medical Media');
      setActiveTab('patient');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to synthesize medical media. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMediaUrl(null);
    setSelectedMediaType('');
    setSelectedFileName('');
    setMimeType('');
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
    setActiveTab('patient');
    setActiveAskQuestion('');
  };

  const handlePatientAskQuestion = (questionText: string) => {
    setActiveAskQuestion(questionText);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#00E5FF] selection:text-black">
      <Header
        onReset={handleReset}
        onOpenSafetyModal={() => setIsSafetyModalOpen(true)}
        hasMedia={!!selectedMediaUrl}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedMediaUrl ? (
          /* Landing Screen when no media selected */
          <div className="space-y-8 my-4">
            {/* Hero Text */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Medical Media Synthesizer</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-100">
                Interpret Medical Media with <span className="bg-gradient-to-r from-[#00E5FF] to-cyan-400 bg-clip-text text-transparent">Gemini AI</span>
              </h1>
              <p className="text-sm text-gray-400 leading-relaxed">
                Upload 2D medical images or lab reports to generate clear patient explanations, structured clinician findings, and context-aware medical Q&A.
              </p>
            </div>

            {/* Dropzone Upload */}
            <UploadZone onFileSelect={handleFileSelect} isLoading={isLoading} />

            {/* Sample Buttons */}
            <SampleButtons onSelectSample={handleSelectSample} isLoading={isLoading} />
          </div>
        ) : (
          /* Active Analysis & Workspace View */
          <div className="space-y-6">
            {/* Top Media Preview Card */}
            <MediaPreview
              mediaUrl={selectedMediaUrl}
              mediaType={selectedMediaType}
              fileName={selectedFileName}
              onReset={handleReset}
              onReanalyze={() => runAnalysis(selectedMediaUrl, mimeType, selectedFileName)}
              isLoading={isLoading}
            />

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-300">Synthesis Encountered an Issue</h4>
                  <p className="mt-1">{error}</p>
                  <button
                    onClick={() => runAnalysis(selectedMediaUrl, mimeType, selectedFileName)}
                    className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-medium text-xs border border-red-500/30 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && <AnalysisLoading />}

            {/* Analysis Result View Tabs */}
            {analysis && !isLoading && (
              <div className="space-y-6">
                {/* View Switcher Tabs */}
                <div className="flex items-center justify-center sm:justify-start gap-1 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 w-fit mx-auto sm:mx-0 shadow-inner">
                  <button
                    onClick={() => setActiveTab('patient')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'patient'
                        ? 'bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Patient View</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('doctor')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'doctor'
                        ? 'bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Doctor View</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'chat'
                        ? 'bg-[#00E5FF] text-black shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Ask MedSight</span>
                  </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'patient' && (
                  <PatientView analysis={analysis} onAskQuestion={handlePatientAskQuestion} />
                )}

                {activeTab === 'doctor' && (
                  <DoctorView analysis={analysis} />
                )}

                {activeTab === 'chat' && (
                  <ChatPanel analysis={analysis} activeQuestion={activeAskQuestion} />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Safety & Privacy Modal */}
      <SafetyNoticeModal
        isOpen={isSafetyModalOpen}
        onClose={() => setIsSafetyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0B0C0E] py-6 text-center text-xs text-gray-500">
        <p>
          MedSight 2D — Universal Multimodal Medical Interpreter • Powered by Gemini AI
        </p>
        <p className="text-[11px] text-gray-600 mt-1">
          For educational & communication support. Not a medical diagnosis tool.
        </p>
      </footer>
    </div>
  );
}
