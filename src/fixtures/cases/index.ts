import type { ScenarioId } from "@/lib/types";
import type { CaseFixture } from "@/fixtures/types";

export const caseFixtures: Record<ScenarioId, CaseFixture> = {
  "sore-throat": {
    id: "sore-throat",
    confidence: 0.97,
    caseData: {
      demographics: {
        age: 27,
        sex: "F",
      },
      vitals: {
        temp: 101.5,
        hr: 102,
        bp: "118/76",
        rr: 18,
        spo2: 98,
        weight: 64,
      },
      allergies: ["NKDA"],
      medications: [],
      medicalHistory: ["Seasonal allergies"],
      hpi: {
        chiefComplaint: "sore throat",
        onsetDays: 3,
        features: ["fever", "pain with swallowing", "fatigue"],
        severity: 6,
      },
      ros: ["no cough", "nasal congestion"],
      exam: ["tonsillar swelling", "tender cervical lymphadenopathy"],
      labs: {
        "rapid strep": "pending",
      },
    },
  },
  "thunderclap-headache": {
    id: "thunderclap-headache",
    confidence: 0.99,
    caseData: {
      demographics: {
        age: 54,
        sex: "F",
      },
      vitals: {
        temp: 99.1,
        hr: 110,
        bp: "158/92",
        rr: 22,
        spo2: 96,
        weight: 71,
      },
      allergies: ["NKDA"],
      medications: ["Hydrochlorothiazide 12.5mg daily"],
      medicalHistory: ["Hypertension"],
      hpi: {
        chiefComplaint: "sudden severe headache",
        onsetDays: 0,
        features: ["worst headache ever", "sudden onset", "vomiting", "vision changes"],
        severity: 9,
      },
      ros: ["vomiting", "blurred vision"],
      exam: ["photophobia noted", "mild neck stiffness"],
      labs: {
        "point-of-care glucose": 98,
      },
    },
  },
  "uti-dysuria": {
    id: "uti-dysuria",
    confidence: 0.95,
    caseData: {
      demographics: {
        age: 32,
        sex: "F",
        pregnant: false,
      },
      vitals: {
        temp: 98.8,
        hr: 88,
        bp: "112/70",
        rr: 16,
        spo2: 99,
        weight: 60,
      },
      allergies: ["NKDA"],
      medications: ["Combined oral contraceptive"],
      medicalHistory: ["History of prior UTI"],
      hpi: {
        chiefComplaint: "dysuria",
        onsetDays: 2,
        features: ["urinary urgency", "urinary frequency", "burning with urination"],
        severity: 5,
      },
      ros: ["no flank pain", "no fever"],
      exam: ["no costovertebral angle tenderness", "abdomen soft, non-tender"],
      labs: {
        "urinalysis": "pending",
      },
    },
  },
};
