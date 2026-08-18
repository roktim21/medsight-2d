import { SampleMediaItem } from '../types/medical';

// Synthetic inline SVG graphics encoded as Data URLs for high fidelity samples
const xraySvgData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600" style="background:%230b0f19"><text x="300" y="40" fill="%2364748b" font-family="sans-serif" font-size="14" text-anchor="middle" font-weight="bold">CHEST X-RAY (AP VIEW) - DEMO MEDIA</text><ellipse cx="300" cy="300" rx="220" ry="240" fill="none" stroke="%231e293b" stroke-width="4"/><path d="M 180 180 Q 220 160 260 180 Q 240 320 180 380 Q 150 280 180 180 Z" fill="%231e293b" opacity="0.8" stroke="%2338bdf8" stroke-width="1.5"/><path d="M 420 180 Q 380 160 340 180 Q 360 320 420 380 Q 450 280 420 180 Z" fill="%231e293b" opacity="0.8" stroke="%2338bdf8" stroke-width="1.5"/><path d="M 280 260 Q 310 240 320 290 Q 330 350 270 380 Z" fill="%23475569" opacity="0.9"/><path d="M 180 120 Q 300 130 420 120" fill="none" stroke="%2394a3b8" stroke-width="6"/><path d="M 160 180 C 240 200 360 200 440 180" fill="none" stroke="%23475569" stroke-width="3"/><path d="M 150 220 C 240 240 360 240 450 220" fill="none" stroke="%23475569" stroke-width="3"/><path d="M 150 260 C 240 280 360 280 450 260" fill="none" stroke="%23475569" stroke-width="3"/><path d="M 160 300 C 240 320 360 320 440 300" fill="none" stroke="%23475569" stroke-width="3"/><circle cx="210" cy="340" r="28" fill="%2338bdf8" opacity="0.25" stroke="%2338bdf8" stroke-width="2" stroke-dasharray="4,4"/><text x="210" y="380" fill="%2338bdf8" font-family="sans-serif" font-size="11" text-anchor="middle">Perihilar Opacity</text><text x="50" y="560" fill="%2394a3b8" font-family="monospace" font-size="12">PATIENT: DEMO_XRAY_01  |  DATE: 2026-08-11</text><text x="50" y="580" fill="%2364748b" font-family="sans-serif" font-size="11">SIMULATED NON-DIAGNOSTIC CHEST RADIOGRAPH FOR DEMO</text></svg>`;

const ecgSvgData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" style="background:%23051411"><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23064e3b" stroke-width="0.8" opacity="0.6"/><path d="M 100 0 L 0 0 0 100" fill="none" stroke="%23047857" stroke-width="1.2" opacity="0.8"/></pattern><rect width="600" height="400" fill="url(%23grid)"/><text x="30" y="35" fill="%2310b981" font-family="sans-serif" font-size="14" font-weight="bold">12-LEAD ELECTROCARDIOGRAM (LEAD II RHYTHM STRIP)</text><path d="M 30 200 L 70 200 L 80 180 L 90 220 L 100 200 L 120 200 Q 130 190 140 200 L 150 200 L 155 210 L 160 120 L 168 260 L 175 195 L 180 200 L 195 200 Q 210 170 230 200 L 260 200 L 270 185 L 280 215 L 290 200 L 310 200 Q 320 190 330 200 L 340 200 L 345 208 L 350 115 L 358 265 L 365 195 L 370 200 L 385 200 Q 400 170 420 200 L 450 200 L 460 185 L 470 215 L 480 200 L 500 200 L 505 210 L 510 125 L 518 255 L 525 195 L 530 200 L 570 200" fill="none" stroke="%2334d399" stroke-width="2.5" stroke-linecap="round"/><text x="160" y="95" fill="%2334d399" font-family="sans-serif" font-size="11">R Peak (Normal Amplitude)</text><text x="30" y="360" fill="%236ee7b7" font-family="monospace" font-size="12">HR: 74 BPM  |  PR: 152 ms  |  QRS: 88 ms  |  QTc: 412 ms</text><text x="30" y="380" fill="%23059669" font-family="sans-serif" font-size="11">NORMAL SINUS RHYTHM WITH UNREMARKABLE ST-T SEGMENTS</text></svg>`;

const dermSvgData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500" style="background:%2318181b"><rect width="500" height="500" fill="%2327272a"/><circle cx="250" cy="250" r="180" fill="%23fecdd3" stroke="%23f43f5e" stroke-width="3"/><path d="M 210 210 C 230 180 290 190 300 230 C 310 270 270 310 230 290 C 190 270 190 230 210 210 Z" fill="%23881337" opacity="0.85"/><path d="M 230 220 Q 260 210 270 240 Q 250 270 220 250 Z" fill="%23450a0a"/><circle cx="250" cy="250" r="95" fill="none" stroke="%23fbbf24" stroke-width="2" stroke-dasharray="6,4"/><text x="250" y="40" fill="%23e4e4e7" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">DERMATOLOGY LESION MACROGRAPH</text><text x="250" y="375" fill="%23fbbf24" font-family="sans-serif" font-size="12" text-anchor="middle">Asymmetric Pigmented Cutaneous Lesion</text><text x="250" y="450" fill="%23a1a1aa" font-family="sans-serif" font-size="11" text-anchor="middle">ABCDE Criteria Assessment: Irregular Borders, Dual Pigment</text></svg>`;

const reportSvgData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="550" height="700" viewBox="0 0 550 700" style="background:%23ffffff"><rect width="550" height="700" fill="%23f8fafc"/><rect x="20" y="20" width="510" height="660" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2" rx="8"/><text x="40" y="60" fill="%230f172a" font-family="sans-serif" font-size="18" font-weight="bold">METROPOLITAN CLINICAL LABORATORY</text><text x="40" y="80" fill="%2364748b" font-family="sans-serif" font-size="11">PATIENT: JANE DOE | AGE: 48 | LAB ID: %23884920</text><line x1="40" y1="95" x2="510" y2="95" stroke="%23cbd5e1" stroke-width="1"/><text x="40" y="125" fill="%231e293b" font-family="sans-serif" font-size="14" font-weight="bold">COMPREHENSIVE METABOLIC PANEL (CMP)</text><rect x="40" y="140" width="470" height="28" fill="%23f1f5f9"/><text x="50" y="158" fill="%23475569" font-family="sans-serif" font-size="11" font-weight="bold">TEST</text><text x="220" y="158" fill="%23475569" font-family="sans-serif" font-size="11" font-weight="bold">RESULT</text><text x="320" y="158" fill="%23475569" font-family="sans-serif" font-size="11" font-weight="bold">REFERENCE</text><text x="440" y="158" fill="%23475569" font-family="sans-serif" font-size="11" font-weight="bold">STATUS</text><text x="50" y="190" fill="%23334155" font-family="sans-serif" font-size="12">Fasting Glucose</text><text x="220" y="190" fill="%23dc2626" font-family="sans-serif" font-size="12" font-weight="bold">138 mg/dL</text><text x="320" y="190" fill="%2364748b" font-family="sans-serif" font-size="12">70 - 99 mg/dL</text><text x="440" y="190" fill="%23dc2626" font-family="sans-serif" font-size="12" font-weight="bold">HIGH ⬆</text><text x="50" y="220" fill="%23334155" font-family="sans-serif" font-size="12">HbA1c (Glycated Hb)</text><text x="220" y="220" fill="%23dc2626" font-family="sans-serif" font-size="12" font-weight="bold">6.8 %</text><text x="320" y="220" fill="%2364748b" font-family="sans-serif" font-size="12">&lt; 5.7 %</text><text x="440" y="220" fill="%23dc2626" font-family="sans-serif" font-size="12" font-weight="bold">HIGH ⬆</text><text x="50" y="250" fill="%23334155" font-family="sans-serif" font-size="12">Serum Creatinine</text><text x="220" y="250" fill="%231e293b" font-family="sans-serif" font-size="12">0.9 mg/dL</text><text x="320" y="250" fill="%2364748b" font-family="sans-serif" font-size="12">0.6 - 1.1 mg/dL</text><text x="440" y="250" fill="%2316a34a" font-family="sans-serif" font-size="12">Normal</text><text x="50" y="280" fill="%23334155" font-family="sans-serif" font-size="12">eGFR</text><text x="220" y="280" fill="%231e293b" font-family="sans-serif" font-size="12">94 mL/min/1.73m²</text><text x="320" y="280" fill="%2364748b" font-family="sans-serif" font-size="12">&gt; 60</text><text x="440" y="280" fill="%2316a34a" font-family="sans-serif" font-size="12">Normal</text><text x="50" y="310" fill="%23334155" font-family="sans-serif" font-size="12">Serum Sodium</text><text x="220" y="310" fill="%231e293b" font-family="sans-serif" font-size="12">140 mmol/L</text><text x="320" y="310" fill="%2364748b" font-family="sans-serif" font-size="12">135 - 145 mmol/L</text><text x="440" y="310" fill="%2316a34a" font-family="sans-serif" font-size="12">Normal</text><text x="50" y="340" fill="%23334155" font-family="sans-serif" font-size="12">Serum Potassium</text><text x="220" y="340" fill="%231e293b" font-family="sans-serif" font-size="12">4.2 mmol/L</text><text x="320" y="340" fill="%2364748b" font-family="sans-serif" font-size="12">3.5 - 5.0 mmol/L</text><text x="440" y="340" fill="%2316a34a" font-family="sans-serif" font-size="12">Normal</text><text x="50" y="370" fill="%23334155" font-family="sans-serif" font-size="12">ALT (Alanine Transaminase)</text><text x="220" y="370" fill="%23d97706" font-family="sans-serif" font-size="12" font-weight="bold">42 U/L</text><text x="320" y="370" fill="%2364748b" font-family="sans-serif" font-size="12">7 - 35 U/L</text><text x="440" y="370" fill="%23d97706" font-family="sans-serif" font-size="12" font-weight="bold">SLIGHT HIGH ⬆</text><text x="40" y="440" fill="%230f172a" font-family="sans-serif" font-size="13" font-weight="bold">LABORATORY IMPRESSION</text><text x="40" y="465" fill="%23475569" font-family="sans-serif" font-size="11">Fasting glycemia and glycated hemoglobin are above target thresholds.</text><text x="40" y="485" fill="%23475569" font-family="sans-serif" font-size="11">Renal function parameters (Creatinine, eGFR) remain within normal limits.</text></svg>`;

export const SAMPLE_MEDIA: SampleMediaItem[] = [
  {
    id: 'chest-xray-01',
    title: 'Chest X-Ray (AP View)',
    subtitle: 'Simulated radiograph with mild perihilar opacity',
    type: 'Chest X-Ray',
    badge: 'Imaging',
    iconName: 'Activity',
    dataUrl: xraySvgData,
    mimeType: 'image/svg+xml',
    sampleAnalysis: {
      media_type: 'Chest Radiograph (X-Ray)',
      patient_summary: 'The chest X-ray image shows a subtle area of increased cloudiness (opacity) near the central region of the right lung field. The heart size appears within typical boundaries, and no large fluid collections are seen around the lungs.',
      doctor_summary: 'Anteroposterior chest radiograph demonstrates a focal area of increased attenuation in the right perihilar pulmonary parenchyma, suggestive of early infiltrate or localized bronchial inflammation. Cardiac silhouette size is within upper normal limits. Costophrenic angles are clear without overt pleural effusion.',
      key_findings: [
        {
          finding: 'Right perihilar parenchymal opacity',
          explanation: 'Mild focal cloudiness near the root of the right lung, which may indicate localized inflammation or early infection.',
          confidence: 'moderate'
        },
        {
          finding: 'Normal cardiothoracic ratio',
          explanation: 'The width of the heart relative to the chest cage is within typical size limits.',
          confidence: 'high'
        },
        {
          finding: 'Clear costophrenic angles',
          explanation: 'The lower corners where the lungs meet the diaphragm appear sharp, indicating no significant fluid accumulation.',
          confidence: 'high'
        }
      ],
      flagged_terms: [
        {
          term: 'Perihilar Opacity',
          simple_definition: 'An area of increased density or cloudiness on an X-ray located near the center of the chest where main blood vessels and airways enter the lungs.'
        },
        {
          term: 'Cardiothoracic Ratio',
          simple_definition: 'The visual proportion comparing the width of the heart to the total width of the inner rib cage on an X-ray.'
        },
        {
          term: 'Costophrenic Angles',
          simple_definition: 'The sharp triangular corners seen at the bottom outer edges of the lungs where the diaphragm meets the chest wall.'
        }
      ],
      severity_level: 'Moderate',
      recommended_discussion: [
        'Ask your doctor if this perihilar finding correlates with any recent cough, fever, or shortness of breath.',
        'Discuss whether follow-up lung listening (auscultation) or blood tests are recommended.',
        'Clarify if a repeat X-ray in a few weeks is needed to check if the opacity resolves.'
      ],
      limitations: 'Single static 2D view; lacks physical examination context, respiratory auscultation findings, or historical comparison images.',
      disclaimer: 'This AI-generated synthesis is provided strictly for educational and communication support. It does not constitute a formal medical diagnosis or radiologic report.'
    }
  },
  {
    id: 'ecg-strip-02',
    title: '12-Lead ECG Strip',
    subtitle: 'Rhythm tracing showing normal sinus rhythm',
    type: 'ECG / EKG Scan',
    badge: 'Cardiology',
    iconName: 'Heart',
    dataUrl: ecgSvgData,
    mimeType: 'image/svg+xml',
    sampleAnalysis: {
      media_type: 'Electrocardiogram (ECG / EKG)',
      patient_summary: 'The electrical trace of your heart shows a steady, regular beat with a heart rate of approximately 74 beats per minute. The electrical intervals between cardiac beats appear standard, with no obvious signs of restricted blood flow or irregular rhythm.',
      doctor_summary: 'Continuous Lead II electrocardiographic rhythm strip demonstrates normal sinus rhythm at 74 bpm. P-waves are upright and uniform with a normal PR interval (~152 ms). QRS complex duration is narrow (~88 ms) without bundle branch delay. ST-segments are isoelectric without significant elevation or depression.',
      key_findings: [
        {
          finding: 'Normal Sinus Rhythm (74 BPM)',
          explanation: 'The heart electrical impulses originate normally from the natural pacemaker (SA node) at a healthy resting rate.',
          confidence: 'high'
        },
        {
          finding: 'Isoelectric ST-Segments',
          explanation: 'The baseline sections between ventricular contraction and recovery are flat, suggesting no acute ischemia or cardiac muscle strain.',
          confidence: 'high'
        },
        {
          finding: 'Preserved QRS Duration (88 ms)',
          explanation: 'Ventricular depolarization occurs rapidly and efficiently through standard conduction pathways.',
          confidence: 'high'
        }
      ],
      flagged_terms: [
        {
          term: 'Sinus Rhythm',
          simple_definition: 'The normal, healthy rhythm of the heart initiated by its natural pacemaker node.'
        },
        {
          term: 'ST-Segment',
          simple_definition: 'The specific portion on an ECG tracing that represents the period when cardiac ventricles prepare to repolarize; used to check for heart muscle strain or ischemia.'
        },
        {
          term: 'QRS Complex',
          simple_definition: 'The main tall spike on an ECG tracing corresponding to the contraction of the main heart pumping chambers (ventricles).'
        }
      ],
      severity_level: 'Low',
      recommended_discussion: [
        'Confirm with your physician that your current physical activity goals align with your normal ECG reading.',
        'Mention if you experience any episodic heart palpitations, lightheadedness, or chest discomfort during exertion.',
        'Ask if routine cardiovascular check-ups should include cholesterol or blood pressure tracking.'
      ],
      limitations: 'Limited single-lead trace snapshot; does not replace full 12-lead multi-vector continuous cardiac monitoring or echocardiogram evaluation.',
      disclaimer: 'This AI-generated synthesis is provided strictly for educational and communication support. It does not constitute a formal medical diagnosis or radiologic report.'
    }
  },
  {
    id: 'dermatology-03',
    title: 'Dermatology Cutaneous Lesion',
    subtitle: 'Pigmented skin spot evaluation via ABCDE framework',
    type: 'Dermatology Image',
    badge: 'Dermatology',
    iconName: 'ShieldAlert',
    dataUrl: dermSvgData,
    mimeType: 'image/svg+xml',
    sampleAnalysis: {
      media_type: 'Dermatology Macro-photograph',
      patient_summary: 'The photograph shows a single raised pigmented spot on the skin. It exhibits somewhat uneven outer edges and two different shades of brown pigment. Because pigmented lesions with irregular shapes merit careful monitoring, professional evaluation with a specialized skin magnifier is advised.',
      doctor_summary: 'Cutaneous macro-photograph reveals an asymmetrical, hyperpigmented macule/papule with irregular scalloped borders and dual-tone brownish-black pigmentation. Estimated lesion diameter exceeds 6mm. Clinical features warrant dermoscopic evaluation and potential biopsy to rule out atypical melanocytic proliferation.',
      key_findings: [
        {
          finding: 'Asymmetric border & scalloped margins',
          explanation: 'The left half of the lesion does not match the right half, and the outer edges are slightly wavy rather than smooth.',
          confidence: 'moderate'
        },
        {
          finding: 'Color variation (Dual-tone pigment)',
          explanation: 'Multiple shades of dark brown and lighter tan are visible within the same border.',
          confidence: 'high'
        },
        {
          finding: 'Lesion size > 6mm',
          explanation: 'The overall width appears slightly larger than a standard pencil eraser.',
          confidence: 'moderate'
        }
      ],
      flagged_terms: [
        {
          term: 'ABCDE Criteria',
          simple_definition: 'A clinical checklist used in dermatology: Asymmetry, Border irregularity, Color variation, Diameter >6mm, and Evolving features.'
        },
        {
          term: 'Dermoscopy',
          simple_definition: 'An examination of skin spots using a specialized high-magnification lighted instrument called a dermatoscope.'
        },
        {
          term: 'Melanocytic',
          simple_definition: 'Relating to melanocytes, the pigment-producing cells in the skin.'
        }
      ],
      severity_level: 'Moderate',
      recommended_discussion: [
        'Ask your dermatologist to perform a dermoscopic examination of this specific spot.',
        'Inform your physician if this lesion has recently changed in size, shape, color, or if it itching/bleeding.',
        'Inquire whether a routine full-body skin examination is recommended.'
      ],
      limitations: 'Surface 2D photography cannot capture subsurface cellular structures or micro-vascular patterns available under calibrated dermoscopy or histopathology.',
      disclaimer: 'This AI-generated synthesis is provided strictly for educational and communication support. It does not constitute a formal medical diagnosis or radiologic report.'
    }
  },
  {
    id: 'lab-report-04',
    title: 'Lab Report: Metabolic Panel',
    subtitle: 'Blood test report indicating elevated fasting glucose & HbA1c',
    type: 'Medical Report / Laboratory Test',
    badge: 'Lab Panel',
    iconName: 'FileText',
    dataUrl: reportSvgData,
    mimeType: 'image/svg+xml',
    sampleAnalysis: {
      media_type: 'Comprehensive Metabolic & Glycemic Panel Report',
      patient_summary: 'The lab report highlights two blood sugar measurements above normal reference ranges: Fasting Glucose (138 mg/dL) and HbA1c (6.8%). Kidney function markers like Creatinine and eGFR are completely normal, indicating your kidneys are filtering healthy blood.',
      doctor_summary: 'Laboratory chemistry panel demonstrates elevated fasting plasma glucose (138 mg/dL, ref 70-99) and elevated HbA1c (6.8%, ref <5.7%), meeting diagnostic parameters for Type 2 Diabetes Mellitus. Renal functional markers (Serum Creatinine 0.9 mg/dL, eGFR 94 mL/min) and electrolyte panel are unremarkable. Mild elevation in ALT (42 U/L) warrants lipid and metabolic liver check.',
      key_findings: [
        {
          finding: 'Elevated HbA1c (6.8%) & Fasting Glucose (138 mg/dL)',
          explanation: 'Average blood sugar levels over the past 2-3 months are above standard non-diabetic thresholds.',
          confidence: 'high'
        },
        {
          finding: 'Normal Kidney Function (eGFR 94, Creatinine 0.9)',
          explanation: 'Kidney filtration capacity remains strong and within healthy physiological ranges.',
          confidence: 'high'
        },
        {
          finding: 'Mildly Elevated ALT (42 U/L)',
          explanation: 'A liver enzyme is slightly above baseline reference limits, often seen with metabolic changes.',
          confidence: 'moderate'
        }
      ],
      flagged_terms: [
        {
          term: 'HbA1c (Glycated Hemoglobin)',
          simple_definition: 'A blood test measuring the percentage of red blood cells coated with sugar, reflecting average glucose control over the past 2-3 months.'
        },
        {
          term: 'eGFR (Estimated Glomerular Filtration Rate)',
          simple_definition: 'A calculation estimating how efficiently your kidneys filter waste products from your bloodstream.'
        },
        {
          term: 'ALT (Alanine Transaminase)',
          simple_definition: 'An enzyme found mainly in liver cells; slight increases can reflect metabolic activity or fatty liver changes.'
        }
      ],
      severity_level: 'Moderate',
      recommended_discussion: [
        'Discuss a comprehensive metabolic management plan including dietary adjustments, exercise, and glucose monitoring.',
        'Ask whether fasting lab confirmation or additional lipid (cholesterol) panels are indicated.',
        'Review whether lifestyle modifications or preventive medication should be started.'
      ],
      limitations: 'Document interpretation based on extracted text; requires clinician context regarding medication history, fasting status, and symptom presentation.',
      disclaimer: 'This AI-generated synthesis is provided strictly for educational and communication support. It does not constitute a formal medical diagnosis or radiologic report.'
    }
  }
];
