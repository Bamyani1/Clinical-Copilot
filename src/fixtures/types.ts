import type {
  CaseData,
  MedicationSuggestion,
  ScenarioId,
  Speaker,
  WorkupSuggestion,
} from "@/lib/types";

interface ConversationEntry {
  speaker: Speaker;
  text: string;
  offsetMs: number;
  confidence?: number;
}

export interface ConversationFixture {
  id: ScenarioId;
  label: string;
  summary: string;
  startTimestamp: string;
  keywords: string[];
  entries: ConversationEntry[];
}

export interface CaseFixture {
  id: ScenarioId;
  confidence: number;
  caseData: CaseData;
}

export interface SuggestionFixture {
  id: ScenarioId;
  differentials: Array<{
    diagnosis: string;
    confidence: number;
    rationale: string;
    guidelines?: string[];
  }>;
  workup: Array<Omit<WorkupSuggestion, "id">>;
  medications: Array<Omit<MedicationSuggestion, "id">>;
  redFlags: Array<{
    trigger: string;
    description: string;
    severity: "critical" | "urgent" | "moderate";
    active: boolean;
  }>;
  safetyChecks: Record<
    string,
    {
      contraindications?: string[];
      requiredConfirmations?: string[];
      warnings?: string[];
    }
  >;
}

export interface GuidelineFixture {
  id: string;
  key: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  version: string;
  active: boolean;
}
