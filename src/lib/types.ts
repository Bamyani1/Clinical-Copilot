// Shared types for the Clinical Copilot application

export const SCENARIO_IDS = ['sore-throat', 'thunderclap-headache', 'uti-dysuria'] as const;
export type ScenarioId = typeof SCENARIO_IDS[number];

export type Speaker = 'doctor' | 'patient';

export interface TranscriptEntry {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: number;
  confidence?: number;
}

export interface CaseData {
  demographics?: {
    age?: number;
    sex?: 'M' | 'F' | 'Other';
    pregnant?: boolean;
    lactating?: boolean;
  };
  vitals?: {
    temp?: number;
    hr?: number;
    bp?: string;
    rr?: number;
    spo2?: number;
    weight?: number;
  };
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string[];
  labs?: Record<string, number | string>;
  hpi?: {
    chiefComplaint?: string;
    onsetDays?: number;
    features?: string[];
    severity?: number;
  };
  ros?: string[];
  exam?: string[];
}

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export type SoapNoteDraft = Partial<SoapNote>;

export interface RedFlag {
  id: string;
  trigger: string;
  description: string;
  severity: 'critical' | 'urgent' | 'moderate';
  active: boolean;
}

export interface Differential {
  id: string;
  diagnosis: string;
  confidence: number;
  rationale: string;
  guidelines?: string[];
}

export interface WorkupSuggestion {
  id: string;
  test: string;
  category: 'lab' | 'imaging' | 'referral';
  indication: string;
  priority: 'urgent' | 'routine';
  guidelines?: string[];
}

export interface MedicationSuggestion {
  id: string;
  drugClass: string;
  indication: string;
  contraindications?: string[];
  requiresConfirmation: boolean;
  guidelines?: string[];
}

// API Request/Response types
export interface CaseExtractionRequest {
  transcript: string;
  existingCase?: CaseData;
  scenarioId?: ScenarioId;
}

export interface CaseExtractionResponse {
  caseData: CaseData;
  confidence: number;
  scenarioId: ScenarioId;
}

export interface ReasoningRequest {
  caseData: CaseData;
  scenarioId?: ScenarioId;
  guidelines?: string[];
}

export interface ReasoningResponse {
  scenarioId: ScenarioId;
  differentials: Array<Omit<Differential, 'id'>>;
  workup: Array<Omit<WorkupSuggestion, 'id'>>;
  medications: Array<Omit<MedicationSuggestion, 'id'>>;
  redFlags: Array<Omit<RedFlag, 'id'>>;
}

export interface SafetyCheckRequest {
  caseData: CaseData;
  medicationClass: string;
  scenarioId?: ScenarioId;
}

export interface SafetyCheckResponse {
  safe: boolean;
  contraindications: string[];
  requiredConfirmations: string[];
  warnings: string[];
}

export interface NoteGenerationRequest {
  caseData: CaseData;
  scenarioId?: ScenarioId;
  acceptedSuggestions: {
    differentials: string[];
    workup: string[];
    medications: string[];
  };
}

export interface NoteGenerationResponse {
  soapNote: SoapNote;
  patientSummary: string;
}

// STT Types
export interface STTProvider {
  name: string;
  startRecording(options?: { scenarioId?: ScenarioId }): Promise<void>;
  stopRecording(): Promise<void>;
  onTranscript(callback: (entry: Omit<TranscriptEntry, 'id'>) => void): void;
  onEnd?(callback: () => void): void;
  setScenario?(scenarioId: ScenarioId): void;
  getScenario?(): ScenarioId;
}

// LLM Provider Types
export interface LLMProvider {
  name: string;
  extractCase(request: CaseExtractionRequest): Promise<CaseExtractionResponse>;
  generateReasoning(request: ReasoningRequest): Promise<ReasoningResponse>;
  checkSafety(request: SafetyCheckRequest): Promise<SafetyCheckResponse>;
  generateNote(request: NoteGenerationRequest): Promise<NoteGenerationResponse>;
}
