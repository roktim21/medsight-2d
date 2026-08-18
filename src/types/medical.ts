export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type ConfidenceLevel = 'low' | 'moderate' | 'high';

export interface KeyFinding {
  finding: string;
  explanation: string;
  confidence: ConfidenceLevel;
}

export interface FlaggedTerm {
  term: string;
  simple_definition: string;
}

export interface MedicalAnalysis {
  media_type: string;
  patient_summary: string;
  doctor_summary: string;
  key_findings: KeyFinding[];
  flagged_terms: FlaggedTerm[];
  severity_level: SeverityLevel;
  recommended_discussion: string[];
  limitations: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

export interface SampleMediaItem {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  badge: string;
  iconName: string;
  dataUrl: string;
  mimeType: string;
  sampleAnalysis: MedicalAnalysis;
}
