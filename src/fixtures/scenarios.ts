import { SCENARIO_IDS, type ScenarioId } from "@/lib/types";

interface ScenarioMetadata {
  id: ScenarioId;
  label: string;
  description: string;
}

export const SCENARIO_METADATA: Record<ScenarioId, ScenarioMetadata> = {
  "sore-throat": {
    id: "sore-throat",
    label: "Pharyngitis (Sore Throat)",
    description: "Classic Centor score evaluation for acute pharyngitis in urgent care.",
  },
  "thunderclap-headache": {
    id: "thunderclap-headache",
    label: "Thunderclap Headache",
    description: "Red flag neurological presentation requiring emergent escalation.",
  },
  "uti-dysuria": {
    id: "uti-dysuria",
    label: "Uncomplicated UTI",
    description: "Routine dysuria visit workflow with lab confirmation and antibiotic draft.",
  },
};

export const DEFAULT_SCENARIO_ID: ScenarioId = SCENARIO_IDS[0];
