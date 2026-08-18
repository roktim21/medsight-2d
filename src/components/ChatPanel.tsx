import React, { useState, useRef, useEffect } from 'react';
import { MedicalAnalysis, ChatMessage } from '../types/medical';
import { sendChatMessage } from '../services/api';
import { MessageSquare, Send, Sparkles, Volume2, VolumeX, Bot, User, Loader2 } from 'lucide-react';

interface ChatPanelProps {
  analysis: MedicalAnalysis | null;
  activeQuestion?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ analysis, activeQuestion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-01',
      sender: 'assistant',
      text: analysis
        ? `Hello! I am Ask MedSight. I have reviewed your ${analysis.media_type}. You can ask me any question about the findings, medical terminology, or what to discuss with your doctor.`
        : 'Hello! I am Ask MedSight. Once you upload or select a medical image or report, I can help answer your questions about the results.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        'Why was this finding flagged?',
        'Explain this finding more simply',
        'What questions should I ask my doctor?',
        'What does the severity level mean?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Respond when activeQuestion is triggered externally (e.g. from PatientView click)
  useEffect(() => {
    if (activeQuestion) {
      handleSend(activeQuestion);
    }
  }, [activeQuestion]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await sendChatMessage(
        textToSend,
        analysis,
        messages,
        analysis?.media_type
      );

      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: res.suggestedQuestions,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I apologize, I encountered a temporary connection issue. Please try asking your question again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl flex flex-col h-[650px] shadow-sm text-[#E0E0E0]">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-black/40 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-100">
                Ask MedSight Assistant
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 rounded-full">
                Context-Aware
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {analysis ? `Locked to active ${analysis.media_type} context` : 'Upload medical media to lock context'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-black/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 text-[11px] text-gray-400">
              {msg.sender === 'user' ? (
                <>
                  <span>You</span>
                  <User className="w-3 h-3 text-[#00E5FF]" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-[#00E5FF]" />
                  <span>Ask MedSight</span>
                </>
              )}
              <span>• {msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#00E5FF] text-black font-semibold rounded-br-none shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.sender === 'assistant' && 'speechSynthesis' in window && (
                <button
                  onClick={() => handleSpeak(msg.text)}
                  className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#00E5FF] transition-colors"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>Stop Reading</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>Read Explanation Aloud</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Suggested Question Chips for assistant messages */}
            {msg.sender === 'assistant' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[88%] sm:max-w-[80%]">
                {msg.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isSending}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[#00E5FF] border border-[#00E5FF]/30 text-[11px] transition-colors flex items-center gap-1 text-left"
                  >
                    <Sparkles className="w-3 h-3 text-[#00E5FF] shrink-0" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/10 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-[#00E5FF]" />
            <span>MedSight is analyzing media context & preparing answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-black/40 rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              analysis
                ? `Ask about your ${analysis.media_type} findings...`
                : 'Upload medical media to start context-aware chat...'
            }
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/60 transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="p-2.5 rounded-lg bg-[#00E5FF] hover:bg-cyan-300 text-black font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0 shadow-[0_0_10px_rgba(0,229,255,0.3)]"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
