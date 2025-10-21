// Shared types for the Clinical Copilot application

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'clinician' | 'admin' | 'nurse';
}

export interface Clinic {
  id: string;
  name: string;
  locale: string;
  settings?: Record<string, any>;
}

export interface Visit {
  id: string;
  clinicId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  locale: string;
  consented: boolean;
  status: 'active' | 'completed' | 'cancelled';
  caseData?: any;
  transcript?: any;
  suggestions?: any;
  redFlags?: any;
  soapNote?: any;
  patientSummary?: any;
}

export interface Guideline {
  id: string;
  key: string;
  title: string;
  category: string;
  content: string;
  version: string;
  active: boolean;
}

// API Request/Response types
export interface CaseExtractionRequest {
  transcript: string;
  existingCase?: any;
}

export interface CaseExtractionResponse {
  caseData: any;
  confidence: number;
}

export interface ReasoningRequest {
  caseData: any;
  guidelines?: string[];
}

export interface ReasoningResponse {
  differentials: Array<{
    diagnosis: string;
    confidence: number;
    rationale: string;
    guidelines?: string[];
  }>;
  workup: Array<{
    test: string;
    category: 'lab' | 'imaging' | 'referral';
    indication: string;
    priority: 'urgent' | 'routine';
    guidelines?: string[];
  }>;
  medications: Array<{
    drugClass: string;
    indication: string;
    contraindications?: string[];
    requiresConfirmation: boolean;
    guidelines?: string[];
  }>;
  redFlags: Array<{
    trigger: string;
    description: string;
    severity: 'critical' | 'urgent' | 'moderate';
    active: boolean;
  }>;
}

export interface SafetyCheckRequest {
  caseData: any;
  medicationClass: string;
}

export interface SafetyCheckResponse {
  safe: boolean;
  contraindications: string[];
  requiredConfirmations: string[];
  warnings: string[];
}

export interface NoteGenerationRequest {
  caseData: any;
  acceptedSuggestions: {
    differentials: string[];
    workup: string[];
    medications: string[];
  };
}

export interface NoteGenerationResponse {
  soapNote: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  patientSummary: string;
}

// STT Types
export interface STTProvider {
  name: string;
  startRecording(): Promise<void>;
  stopRecording(): Promise<void>;
  onTranscript(callback: (text: string, speaker: 'doctor' | 'patient') => void): void;
  onEnd?(callback: () => void): void;
}

// LLM Provider Types
export interface LLMProvider {
  name: string;
  extractCase(request: CaseExtractionRequest): Promise<CaseExtractionResponse>;
  generateReasoning(request: ReasoningRequest): Promise<ReasoningResponse>;
  checkSafety(request: SafetyCheckRequest): Promise<SafetyCheckResponse>;
  generateNote(request: NoteGenerationRequest): Promise<NoteGenerationResponse>;
}

// Common medical enums and constants
export const MEDICAL_SPECIALTIES = [
  'family_medicine',
  'internal_medicine',
  'pediatrics',
  'emergency_medicine',
  'urgent_care',
] as const;

export const COMPLAINT_CATEGORIES = [
  'uri_cough',
  'sore_throat',
  'ear_pain',
  'fever',
  'uti_dysuria',
  'back_pain',
  'abdominal_pain',
  'headache',
  'skin_rash',
  'ankle_sprain',
  'medication_refill',
] as const;

export const RED_FLAG_TRIGGERS = [
  'chest_pain_dyspnea',
  'fever_neck_stiffness',
  'new_neuro_deficits',
  'severe_abdominal_guarding',
  'pregnancy_abdominal_pain',
  'hematuria_clots',
  'suicidal_ideation',
  'severe_headache_thunderclap',
  'acute_vision_loss',
  'signs_of_sepsis',
] as const;

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number];
export type ComplaintCategory = typeof COMPLAINT_CATEGORIES[number];
export type RedFlagTrigger = typeof RED_FLAG_TRIGGERS[number];
