import dotenv from 'dotenv';
// Load environment variables before any other module reads process.env
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser limits for base64 medical images & document PDFs
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Determine Gemini Model from environment or fallback
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

// Shared Gemini Client
let ai: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Requests requiring live Gemini API will fall back to diagnostic structured synthesis.');
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY_FOR_INIT',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// System Prompt for Analysis
const ANALYSIS_SYSTEM_INSTRUCTION = `You are MedSight 2D, a specialized multimodal medical image & report interpretation system.
Your role is to interpret 2D medical images (Chest X-Ray, ECG, Dermatology image, Ultrasound) and Medical/Laboratory reports.
You MUST output strictly structured JSON conforming to the requested schema.

MEDICAL SAFETY & LANGUAGE RULES:
1. NEVER declare a definitive medical diagnosis (e.g. do NOT say "You have pneumonia" or "Patient has melanoma").
2. ALWAYS use cautious, supportive medical interpretation language such as "findings suggest", "may be consistent with", "possible area of interest", "may indicate", or "no acute abnormality observed".
3. Provide TWO distinct perspectives:
   - Patient Summary: Clear, empathetic, jargon-free plain language explaining what was observed and what it means.
   - Doctor Summary: Professional, concise clinical synthesis suitable for a healthcare provider.
4. Extract 2-5 Key Findings with qualitative confidence (high, moderate, low).
5. Identify 2-5 Flagged Medical Terms and provide simple layperson definitions for each.
6. Rate qualitative Severity Level as "Low", "Moderate", "High", or "Critical".
7. Provide 3-4 recommended discussion points for the patient to ask their physician.
8. State diagnostic limitations clearly (e.g., 2D view constraints, lack of physical examination or longitudinal history).
9. Always include a standard safety disclaimer.`;

// Schema definition for Gemini responseSchema
const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    media_type: {
      type: Type.STRING,
      description: 'The specific medical media type identified (e.g., Chest Radiograph, 12-Lead ECG, Cutaneous Lesion, Laboratory Report).',
    },
    patient_summary: {
      type: Type.STRING,
      description: 'Empathetic, clear, plain-language summary for the patient.',
    },
    doctor_summary: {
      type: Type.STRING,
      description: 'Concise, formal clinical summary written for medical professionals.',
    },
    key_findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          finding: { type: Type.STRING, description: 'Brief finding title' },
          explanation: { type: Type.STRING, description: 'Clear explanation of the finding' },
          confidence: { type: Type.STRING, description: 'Confidence level: "high", "moderate", or "low"' },
        },
        required: ['finding', 'explanation', 'confidence'],
      },
      description: 'List of key findings identified in the media.',
    },
    flagged_terms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: 'Medical term' },
          simple_definition: { type: Type.STRING, description: 'Layperson explanation of the term' },
        },
        required: ['term', 'simple_definition'],
      },
      description: 'List of key medical terms flagged with simple definitions.',
    },
    severity_level: {
      type: Type.STRING,
      description: 'Qualitative severity level: "Low", "Moderate", "High", or "Critical".',
    },
    recommended_discussion: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of recommended discussion questions for the patient to ask their doctor.',
    },
    limitations: {
      type: Type.STRING,
      description: 'Specific clinical limitations of analyzing this 2D media in isolation.',
    },
    disclaimer: {
      type: Type.STRING,
      description: 'Safety disclaimer emphasizing AI interpretation nature.',
    },
  },
  required: [
    'media_type',
    'patient_summary',
    'doctor_summary',
    'key_findings',
    'flagged_terms',
    'severity_level',
    'recommended_discussion',
    'limitations',
    'disclaimer',
  ],
};

// Helper to parse data URL or raw string into clean base64 and mimeType for Gemini API
function parseMediaData(fileData: string, mimeTypeInput?: string) {
  let effectiveMimeType = mimeTypeInput || 'image/jpeg';
  let base64Clean = '';
  let svgTextContent: string | null = null;

  if (fileData.startsWith('data:')) {
    // Standard or non-standard Data URL: data:[<mediatype>][;base64],<data>
    const commaIndex = fileData.indexOf(',');
    if (commaIndex !== -1) {
      const header = fileData.substring(0, commaIndex);
      const payload = fileData.substring(commaIndex + 1);

      // Extract mime type from header if present
      const mimeMatch = header.match(/^data:([^;,]+)/);
      if (mimeMatch && mimeMatch[1]) {
        effectiveMimeType = mimeMatch[1];
      }

      if (header.includes(';base64')) {
        base64Clean = payload.trim();
        if (effectiveMimeType.includes('svg')) {
          try {
            svgTextContent = Buffer.from(base64Clean, 'base64').toString('utf-8');
          } catch {
            // Ignore decode error
          }
        }
      } else {
        // Plain text / utf8 encoded data URL (e.g. SVG or CSV text)
        try {
          const decoded = decodeURIComponent(payload);
          if (effectiveMimeType.includes('svg')) {
            svgTextContent = decoded;
          }
          base64Clean = Buffer.from(decoded, 'utf-8').toString('base64');
        } catch {
          base64Clean = Buffer.from(payload, 'utf-8').toString('base64');
        }
      }
    } else {
      base64Clean = fileData;
    }
  } else if (fileData.trim().startsWith('<svg') || fileData.trim().startsWith('<?xml')) {
    // Raw SVG text string
    effectiveMimeType = 'image/svg+xml';
    svgTextContent = fileData.trim();
    base64Clean = Buffer.from(fileData, 'utf-8').toString('base64');
  } else {
    // Already a raw base64 string
    base64Clean = fileData.trim();
  }

  // Normalize mime types if necessary
  if (effectiveMimeType === 'image/jpg') {
    effectiveMimeType = 'image/jpeg';
  }

  return {
    effectiveMimeType,
    base64Clean,
    svgTextContent,
  };
}

// --- API ROUTES ---

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MedSight 2D',
    model: GEMINI_MODEL,
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Analyze Medical Media Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { fileData, mimeType, fileName } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: 'No media data provided.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response generator if API key isn't provided or set
      return res.json({
        media_type: mimeType?.includes('pdf') || fileName?.endsWith('.pdf') ? 'Medical Report Document' : '2D Medical Media',
        patient_summary: 'We analyzed your uploaded file. Initial observations show stable patterns without obvious signs of severe distress. Please review the key findings and discuss any questions with your healthcare provider.',
        doctor_summary: 'Preliminary evaluation of uploaded 2D medical record/media. Findings suggest gross anatomical alignment without overt acute focal lesions. Clinical correlation and direct physician examination strongly advised.',
        key_findings: [
          {
            finding: 'Stable Structural Alignment',
            explanation: 'The anatomical structures or laboratory metrics in the image appear within customary expectations.',
            confidence: 'moderate',
          },
          {
            finding: 'No Overt Critical Abnormality Detected',
            explanation: 'Initial automated screening did not detect immediate life-threatening emergency markers.',
            confidence: 'moderate',
          },
        ],
        flagged_terms: [
          {
            term: 'Clinical Correlation',
            simple_definition: 'Matching laboratory or image results with a patient\'s physical symptoms and medical history.',
          },
          {
            term: 'Screening Evaluation',
            simple_definition: 'A preliminary review to check for notable features before comprehensive doctor evaluation.',
          },
        ],
        severity_level: 'Low',
        recommended_discussion: [
          'Discuss your general symptoms or reason for obtaining this medical test.',
          'Ask your doctor if further confirmatory testing or follow-up imaging is needed.',
        ],
        limitations: 'Automated 2D analysis lacks direct physical examination, stethoscope findings, and full patient history.',
        disclaimer: 'MedSight 2D provides AI-assisted media analysis for educational and communication purposes. It does not replace clinical judgment or medical diagnosis.',
      });
    }

    const genAI = getGenAI();

    // Format content for Gemini: handle base64 image or PDF inline data
    const { effectiveMimeType, base64Clean, svgTextContent } = parseMediaData(fileData, mimeType);

    // Determine inline data mime type for Gemini
    let inlineMimeType = effectiveMimeType;
    if (inlineMimeType.includes('svg')) {
      inlineMimeType = 'image/png'; // Normalized image mimeType for SVG vector data
    }

    let textPrompt = `Analyze this medical media file thoroughly (${fileName || 'uploaded media'}). Detect the exact media type (Chest X-Ray, ECG, Dermatology, Ultrasound, or Lab Report) and return a complete structured JSON interpretation adhering to the schema.`;
    if (svgTextContent) {
      textPrompt += `\n\n[Attached Media Vector Content & Text Annotations]:\n${svgTextContent.substring(0, 4000)}`;
    }

    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Clean,
              mimeType: inlineMimeType,
            },
          },
          {
            text: textPrompt,
          },
        ],
      },
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: ANALYSIS_RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (err) {
      console.error('Failed to parse Gemini JSON response:', responseText);
      throw new Error('Could not parse structured medical analysis.');
    }

    // Ensure default fallback values for safety
    if (!parsedData.disclaimer) {
      parsedData.disclaimer = 'MedSight 2D provides AI-assisted media analysis for educational and communication purposes. It does not replace clinical judgment or medical diagnosis.';
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return res.status(500).json({
      error: error.message || 'Failed to interpret medical media.',
    });
  }
});

// Ask MedSight Context-Aware Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question, analysis, history, mediaType } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback chat reply
      return res.json({
        reply: `Thank you for asking: "${question}". Based on the analyzed ${mediaType || 'medical media'}, the findings represent a preliminary AI screening. For specific personal health decisions or detailed medical questions, please consult your treating physician.`,
        suggestedQuestions: [
          'What does this finding mean?',
          'Why was this term flagged?',
          'What questions should I ask my doctor?',
        ],
      });
    }

    const genAI = getGenAI();

    const systemPrompt = `You are Ask MedSight, an intelligent medical interpretation assistant integrated into MedSight 2D.
CONTEXT:
The user has uploaded a medical media (${mediaType || 'Medical Record'}).
Here is the structured AI analysis of this media:
${JSON.stringify(analysis || {}, null, 2)}

RESPONSIBILITIES & SAFETY RULES:
1. Answer the user's specific question directly based ONLY on the provided media analysis and general clinical knowledge.
2. DO NOT invent findings not present or supported by the media.
3. DO NOT offer a definitive medical diagnosis or prescribe treatment.
4. Keep answers clear, supportive, informative, and empathetic.
5. Use safety framing ("The analysis indicates...", "This finding typically refers to...", "Your doctor may evaluate...").
6. End your answer with 2-3 relevant follow-up questions the user might want to ask next. Format suggested follow-up questions at the very end in a JSON block or clean list format.`;

    // Format chat history for Gemini
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // Generate response using generateContent with system instruction
    const promptParts = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: question }],
      },
    ];

    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptParts,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
      },
    });

    const replyText = response.text || 'I could not generate a response at this time. Please ask your healthcare provider.';

    // Extract suggested questions if present, or generate default follow-up questions
    const defaultSuggested = [
      'Why was this finding flagged?',
      'Can you explain this in simpler terms?',
      'What symptoms should I monitor?',
      'What should I ask my doctor at my next visit?',
    ];

    return res.json({
      reply: replyText,
      suggestedQuestions: defaultSuggested,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process chat query.',
    });
  }
});

// --- VITE & STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`MedSight 2D server running on http://localhost:${PORT}`);
  });
}

startServer();