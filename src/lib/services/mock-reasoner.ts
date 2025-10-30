import {
  type CaseExtractionRequest,
  type CaseExtractionResponse,
  type LLMProvider,
  type NoteGenerationRequest,
  type NoteGenerationResponse,
  type ReasoningRequest,
  type ReasoningResponse,
  type SafetyCheckRequest,
  type SafetyCheckResponse,
  type ScenarioId,
  type CaseData,
} from "@/lib/types";
import { DEFAULT_SCENARIO_ID, caseFixtures, guidelineFixtures, scenarioFromTranscript, suggestionFixtures } from "@/fixtures";

const clone = <T>(value: T): T =>
  typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const resolveScenario = (transcript: string | undefined, scenarioId?: ScenarioId): ScenarioId => {
  if (scenarioId && suggestionFixtures[scenarioId]) {
    return scenarioId;
  }
  if (transcript && transcript.trim().length > 0) {
    return scenarioFromTranscript(transcript);
  }
  return DEFAULT_SCENARIO_ID;
};

const sanitizeMedKey = (key: string) => key.trim().toLowerCase();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const mergeCaseData = (base: CaseData, incoming: CaseData): CaseData => {
  const result: CaseData = clone(base);
  const mutable = result as Record<keyof CaseData, unknown>;

  (Object.keys(incoming) as Array<keyof CaseData>).forEach((section) => {
    const incomingValue = incoming[section];
    if (incomingValue == null) {
      return;
    }

    const currentValue = mutable[section];

    if (Array.isArray(incomingValue)) {
      const baseArray = Array.isArray(currentValue) ? (currentValue as string[]) : [];
      const merged = Array.from(new Set([...baseArray, ...incomingValue]));
      mutable[section] = merged;
      return;
    }

    if (isRecord(incomingValue)) {
      const baseRecord = isRecord(currentValue) ? (currentValue as Record<string, unknown>) : {};
      mutable[section] = { ...baseRecord, ...incomingValue };
      return;
    }

    mutable[section] = incomingValue;
  });

  return result;
};

class MockReasoner implements LLMProvider {
  name = "mock";

  async extractCase(request: CaseExtractionRequest): Promise<CaseExtractionResponse> {
    const scenarioId = resolveScenario(request.transcript, request.scenarioId);
    const fixture = caseFixtures[scenarioId];
    const merged = request.existingCase ? mergeCaseData(fixture.caseData, request.existingCase) : fixture.caseData;

    return {
      scenarioId,
      caseData: clone(merged),
      confidence: fixture.confidence,
    };
  }

  async generateReasoning(request: ReasoningRequest): Promise<ReasoningResponse> {
    const scenarioId = resolveScenario(undefined, request.scenarioId);
    const fixture = suggestionFixtures[scenarioId];

    return {
      scenarioId,
      differentials: clone(fixture.differentials),
      workup: clone(fixture.workup),
      medications: clone(fixture.medications),
      redFlags: clone(fixture.redFlags),
    };
  }

  async checkSafety(request: SafetyCheckRequest): Promise<SafetyCheckResponse> {
    const scenarioId = resolveScenario(undefined, request.scenarioId);
    const fixture = suggestionFixtures[scenarioId];
    const key = sanitizeMedKey(request.medicationClass);
    const safetyEntry =
      Object.entries(fixture.safetyChecks).find(([name]) => sanitizeMedKey(name) === key)?.[1] ?? {};

    const contraindications = clone(safetyEntry.contraindications ?? []);
    const requiredConfirmations = clone(safetyEntry.requiredConfirmations ?? []);
    const warnings = clone(safetyEntry.warnings ?? []);

    const allergies = request.caseData.allergies ?? [];
    if (allergies.length > 0) {
      warnings.push(`Documented allergies: ${allergies.join(", ")}`);
    }

    return {
      safe: contraindications.length === 0,
      contraindications,
      requiredConfirmations,
      warnings,
    };
  }

  async generateNote(request: NoteGenerationRequest): Promise<NoteGenerationResponse> {
    const scenarioId = resolveScenario(undefined, request.scenarioId);
    const caseData = request.caseData;
    const accepted = request.acceptedSuggestions;
    const chiefComplaint = caseData.hpi?.chiefComplaint ?? "today's visit";
    const differentialSummary = accepted.differentials.length > 0 ? accepted.differentials.join(", ") : "see assessment";

    const subjectiveParts: string[] = [];
    if (caseData.demographics?.age && caseData.demographics?.sex) {
      const sex = caseData.demographics.sex === "M" ? "male" : caseData.demographics.sex === "F" ? "female" : "patient";
      subjectiveParts.push(`${caseData.demographics.age}-year-old ${sex}`);
    } else {
      subjectiveParts.push("Patient");
    }
    subjectiveParts.push(`presents with ${chiefComplaint}`);
    if (caseData.hpi?.onsetDays != null) {
      subjectiveParts.push(`for ${caseData.hpi.onsetDays} day${caseData.hpi.onsetDays === 1 ? "" : "s"}`);
    }
    if (caseData.hpi?.features?.length) {
      subjectiveParts.push(`Associated symptoms: ${caseData.hpi.features.join(", ")}`);
    }
    if (caseData.ros?.length) {
      subjectiveParts.push(`ROS notable for ${caseData.ros.join(", ")}`);
    }
    if (caseData.allergies?.length) {
      subjectiveParts.push(`Allergies: ${caseData.allergies.join(", ")}`);
    }

    const objectiveParts: string[] = [];
    if (caseData.vitals && Object.keys(caseData.vitals).length > 0) {
      const segments: string[] = [];
      if (caseData.vitals.temp) segments.push(`T ${caseData.vitals.temp}°F`);
      if (caseData.vitals.hr) segments.push(`HR ${caseData.vitals.hr} bpm`);
      if (caseData.vitals.bp) segments.push(`BP ${caseData.vitals.bp}`);
      if (caseData.vitals.rr) segments.push(`RR ${caseData.vitals.rr}`);
      if (caseData.vitals.spo2) segments.push(`SpO₂ ${caseData.vitals.spo2}%`);
      objectiveParts.push(`Vital signs: ${segments.join(", ")}`);
    }
    if (caseData.exam?.length) {
      objectiveParts.push(`Exam: ${caseData.exam.join(", ")}`);
    }
    if (caseData.labs && Object.keys(caseData.labs).length > 0) {
      const labs = Object.entries(caseData.labs)
        .map(([name, value]) => `${name}: ${value}`)
        .join("; ");
      objectiveParts.push(`Point-of-care data: ${labs}`);
    }

    const assessmentParts: string[] = [];
    if (accepted.differentials.length > 0) {
      assessmentParts.push(`Leading considerations: ${differentialSummary}.`);
    } else {
      assessmentParts.push("Assessment aligns with presenting symptoms in context of available data.");
    }
    const guidelineNotes = suggestionFixtures[scenarioId].differentials
      .flatMap((item) => item.guidelines ?? [])
      .map((key) => guidelineFixtures[key]?.title)
      .filter(Boolean);
    if (guidelineNotes.length > 0) {
      assessmentParts.push(`Reviewed pathways: ${guidelineNotes.join(", ")}.`);
    }

    const planParts: string[] = [];
    if (accepted.workup.length > 0) {
      planParts.push("Diagnostics:");
      accepted.workup.forEach((item, index) => {
        planParts.push(`${index + 1}. ${item}`);
      });
    }
    if (accepted.medications.length > 0) {
      planParts.push(planParts.length > 0 ? "\nMedications:" : "Medications:");
      accepted.medications.forEach((med, index) => {
        planParts.push(`${index + 1}. ${med}`);
      });
    }
    planParts.push("Follow-up: Return if symptoms worsen, new red flags emerge, or no improvement within 48 hours.");

    const summaryLines: string[] = [];
    summaryLines.push(`Today we addressed ${chiefComplaint}.`);
    if (accepted.differentials.length > 0) {
      summaryLines.push(`Your care team is prioritizing: ${accepted.differentials[0]}.`);
    }
    if (accepted.medications.length > 0) {
      summaryLines.push("Medication instructions were discussed—please follow the dosing guidance provided.");
    }
    if (accepted.workup.length > 0) {
      summaryLines.push("We ordered tests to confirm the plan; the clinic will contact you with results.");
    }
    summaryLines.push("Call immediately if symptoms escalate or new concerns appear.");

    const soapNote = {
      subjective: subjectiveParts.join(". "),
      objective: objectiveParts.join("\n"),
      assessment: assessmentParts.join(" "),
      plan: planParts.join("\n"),
    };

    return {
      soapNote,
      patientSummary: summaryLines.join(" "),
    };
  }
}

export const createReasoner = (): LLMProvider => new MockReasoner();
