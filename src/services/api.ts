import { MedicalAnalysis, ChatMessage } from '../types/medical';

export async function analyzeMedia(fileData: string, mimeType: string, fileName?: string): Promise<MedicalAnalysis> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileData,
      mimeType,
      fileName,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Server responded with status ${response.status}`);
  }

  return await response.json();
}

export async function sendChatMessage(
  question: string,
  analysis: MedicalAnalysis | null,
  history: ChatMessage[],
  mediaType?: string
): Promise<{ reply: string; suggestedQuestions: string[] }> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      analysis,
      history,
      mediaType,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Chat service error (${response.status})`);
  }

  return await response.json();
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    return res.ok;
  } catch {
    return false;
  }
}
