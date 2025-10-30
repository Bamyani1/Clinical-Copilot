import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  CaseData,
  Differential,
  MedicationSuggestion,
  SoapNote,
  SoapNoteDraft,
  RedFlag,
  ScenarioId,
  TranscriptEntry,
  WorkupSuggestion,
} from './types';

interface VisitState {
  // Visit metadata
  visitId: string | null;
  isRecording: boolean;
  consented: boolean;
  locale: string;
  scenarioId: ScenarioId;
  
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
  soapNote: SoapNoteDraft;
  patientSummary?: string;
  
  // Actions
  setVisitId: (id: string) => void;
  setConsented: (consented: boolean) => void;
  setRecording: (recording: boolean) => void;
  addTranscriptEntry: (entry: Omit<TranscriptEntry, 'id'>) => void;
  setScenario: (scenarioId: ScenarioId) => void;
  updateCaseData: (data: Partial<CaseData>) => void;
  setDifferentials: (differentials: Differential[]) => void;
  setWorkupSuggestions: (suggestions: WorkupSuggestion[]) => void;
  setMedicationSuggestions: (suggestions: MedicationSuggestion[]) => void;
  setRedFlags: (flags: RedFlag[]) => void;
  updateSoapNote: (section: keyof SoapNote, content: string) => void;
  setPatientSummary: (summary: string) => void;
  resetVisit: () => void;
}

type VisitStateData = Omit<
  VisitState,
  | 'setVisitId'
  | 'setConsented'
  | 'setRecording'
  | 'addTranscriptEntry'
  | 'setScenario'
  | 'updateCaseData'
  | 'setDifferentials'
  | 'setWorkupSuggestions'
  | 'setMedicationSuggestions'
  | 'setRedFlags'
  | 'updateSoapNote'
  | 'setPatientSummary'
  | 'resetVisit'
>;

const initialState: VisitStateData = {
  visitId: null,
  isRecording: false,
  consented: false,
  locale: 'en-US',
  scenarioId: 'sore-throat' as ScenarioId,
  transcript: [] as TranscriptEntry[],
  caseData: {} as CaseData,
  differentials: [] as Differential[],
  workupSuggestions: [] as WorkupSuggestion[],
  medicationSuggestions: [] as MedicationSuggestion[],
  redFlags: [] as RedFlag[],
  soapNote: {} as SoapNoteDraft,
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
          set((state) => {
            const id = `${entry.timestamp}-${state.transcript.length}`;
            return {
              transcript: [...state.transcript, { ...entry, id }],
            };
          });
        },
        
        setScenario: (scenarioId) => {
          set((state) => ({
            scenarioId,
            transcript: [] as TranscriptEntry[],
            caseData: {} as CaseData,
            differentials: [] as Differential[],
            workupSuggestions: [] as WorkupSuggestion[],
            medicationSuggestions: [] as MedicationSuggestion[],
            redFlags: [] as RedFlag[],
            soapNote: {} as SoapNoteDraft,
            patientSummary: undefined,
            visitId: state.visitId,
            consented: state.consented,
            isRecording: false,
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
        
        resetVisit: () => set((state) => ({
          ...initialState,
          locale: state.locale,
        })),
      }),
      {
        name: 'visit-store',
        partialize: (state) => ({
          // Persist only the deterministic visit payload required for reload safety.
          locale: state.locale,
          caseData: state.caseData,
          soapNote: state.soapNote,
        }),
        version: 3,
        migrate: (persistedState, version) => {
          if (version < 2) {
            const legacyState = persistedState as { locale?: string };
            return {
              locale: legacyState.locale ?? 'en-US',
              caseData: {} as CaseData,
              soapNote: {} as SoapNoteDraft,
            };
          }

          if (version === 2) {
            const legacyState = persistedState as { locale?: string; caseData?: CaseData };
            return {
              locale: legacyState.locale ?? 'en-US',
              caseData: legacyState.caseData ?? ({} as CaseData),
              soapNote: {} as SoapNoteDraft,
            };
          }

          const currentState = persistedState as {
            locale?: string;
            caseData?: CaseData;
            soapNote?: SoapNoteDraft;
          };

          return {
            locale: currentState.locale ?? 'en-US',
            caseData: currentState.caseData ?? ({} as CaseData),
            soapNote: currentState.soapNote ?? ({} as SoapNoteDraft),
          };
        },
      }
    ),
    { name: 'visit-store' }
  )
);

// Settings store for app configuration
interface SettingsState {
  localOnlyMode: boolean;
  sttProvider: 'mock';
  llmProvider: 'mock';
  
  setLocalOnlyMode: (enabled: boolean) => void;
  setSttProvider: () => void;
  setLlmProvider: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        localOnlyMode: true,
        sttProvider: 'mock',
        llmProvider: 'mock',
        
        setLocalOnlyMode: (enabled) => set({ localOnlyMode: enabled }),
        setSttProvider: () => set({ sttProvider: 'mock' }),
        setLlmProvider: () => set({ llmProvider: 'mock' }),
      }),
      { name: 'settings-store' }
    ),
    { name: 'settings-store' }
  )
);
