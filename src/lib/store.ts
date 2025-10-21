import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for the application state
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
  hpi?: {
    chiefComplaint?: string;
    onsetDays?: number;
    features?: string[];
    severity?: number; // 1-10 scale
  };
  ros?: string[];
  exam?: string[];
}

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
  confidence: number; // 0-1
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

export interface TranscriptEntry {
  id: string;
  speaker: 'doctor' | 'patient';
  text: string;
  timestamp: number;
  confidence?: number;
}

interface VisitState {
  // Visit metadata
  visitId: string | null;
  isRecording: boolean;
  consented: boolean;
  locale: string;
  
  // Audio/transcript
  transcript: TranscriptEntry[];
  
  // Clinical data
  caseData: CaseData;
  
  // AI suggestions
  differentials: Differential[];
  workupSuggestions: WorkupSuggestion[];
  medicationSuggestions: MedicationSuggestion[];
  redFlags: RedFlag[];
  
  // Documentation
  soapNote: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
  };
  patientSummary?: string;
  
  // Actions
  setVisitId: (id: string) => void;
  setConsented: (consented: boolean) => void;
  setRecording: (recording: boolean) => void;
  addTranscriptEntry: (entry: Omit<TranscriptEntry, 'id'>) => void;
  updateCaseData: (data: Partial<CaseData>) => void;
  setDifferentials: (differentials: Differential[]) => void;
  setWorkupSuggestions: (suggestions: WorkupSuggestion[]) => void;
  setMedicationSuggestions: (suggestions: MedicationSuggestion[]) => void;
  setRedFlags: (flags: RedFlag[]) => void;
  updateSoapNote: (section: keyof VisitState['soapNote'], content: string) => void;
  setPatientSummary: (summary: string) => void;
  resetVisit: () => void;
}

const initialState = {
  visitId: null,
  isRecording: false,
  consented: false,
  locale: 'en-US',
  transcript: [],
  caseData: {},
  differentials: [],
  workupSuggestions: [],
  medicationSuggestions: [],
  redFlags: [],
  soapNote: {},
  patientSummary: undefined,
};

export const useVisitStore = create<VisitState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setVisitId: (id: string) => set({ visitId: id }),
        
        setConsented: (consented: boolean) => set({ consented }),
        
        setRecording: (recording: boolean) => set({ isRecording: recording }),
        
        addTranscriptEntry: (entry) => {
          const id = Date.now().toString();
          set((state) => ({
            transcript: [...state.transcript, { ...entry, id }],
          }));
        },
        
        updateCaseData: (data) => {
          set((state) => ({
            caseData: { ...state.caseData, ...data },
          }));
        },
        
        setDifferentials: (differentials) => set({ differentials }),
        
        setWorkupSuggestions: (suggestions) => set({ workupSuggestions: suggestions }),
        
        setMedicationSuggestions: (suggestions) => set({ medicationSuggestions: suggestions }),
        
        setRedFlags: (flags) => set({ redFlags: flags }),
        
        updateSoapNote: (section, content) => {
          set((state) => ({
            soapNote: { ...state.soapNote, [section]: content },
          }));
        },
        
        setPatientSummary: (summary) => set({ patientSummary: summary }),
        
        resetVisit: () => set(initialState),
      }),
      {
        name: 'visit-store',
        partialize: (state) => ({
          // Persist only locale to avoid carrying forward clinical data between visits
          locale: state.locale,
        }),
      }
    ),
    { name: 'visit-store' }
  )
);

// Settings store for app configuration
interface SettingsState {
  localOnlyMode: boolean;
  sttProvider: 'mock' | 'whisper' | 'gcp';
  llmProvider: 'mock' | 'openai' | 'anthropic';
  
  setLocalOnlyMode: (enabled: boolean) => void;
  setSttProvider: (provider: string) => void;
  setLlmProvider: (provider: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        localOnlyMode: true,
        sttProvider: 'mock',
        llmProvider: 'mock',
        
        setLocalOnlyMode: (enabled) => set({ localOnlyMode: enabled }),
        setSttProvider: (provider) => set({ sttProvider: provider as any }),
        setLlmProvider: (provider) => set({ llmProvider: provider as any }),
      }),
      { name: 'settings-store' }
    ),
    { name: 'settings-store' }
  )
);