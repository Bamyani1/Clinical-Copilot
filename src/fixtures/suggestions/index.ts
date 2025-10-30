import type { ScenarioId } from "@/lib/types";
import type { SuggestionFixture } from "@/fixtures/types";

export const suggestionFixtures: Record<ScenarioId, SuggestionFixture> = {
  "sore-throat": {
    id: "sore-throat",
    differentials: [
      {
        diagnosis: "Viral pharyngitis",
        confidence: 0.68,
        rationale: "Centor score of 2 with rhinorrhea favors viral etiology despite fever.",
        guidelines: ["sore_throat"],
      },
      {
        diagnosis: "Group A streptococcal pharyngitis",
        confidence: 0.62,
        rationale: "Tender nodes, fever, and lack of cough raise probability of strep infection.",
        guidelines: ["sore_throat"],
      },
      {
        diagnosis: "Infectious mononucleosis",
        confidence: 0.24,
        rationale: "Consider in young adult with fatigue and lymphadenopathy if strep testing negative.",
        guidelines: ["sore_throat"],
      },
    ],
    workup: [
      {
        test: "Rapid antigen detection (RADT) for Group A strep",
        category: "lab",
        indication: "Centor score ≥ 2 warrants confirmatory testing before antibiotics.",
        priority: "routine",
        guidelines: ["sore_throat"],
      },
      {
        test: "Throat culture if RADT negative",
        category: "lab",
        indication: "Rule out false-negative RADT in high-pretest probability case.",
        priority: "routine",
        guidelines: ["sore_throat"],
      },
    ],
    medications: [
      {
        drugClass: "Penicillin VK 500 mg PO BID x10d",
        indication: "First-line treatment for confirmed Group A strep pharyngitis.",
        contraindications: ["Penicillin allergy"],
        requiresConfirmation: true,
        guidelines: ["sore_throat"],
      },
      {
        drugClass: "Acetaminophen or ibuprofen",
        indication: "Symptomatic relief of throat pain and fever.",
        contraindications: ["NSAID use limited if kidney disease"],
        requiresConfirmation: false,
        guidelines: ["sore_throat"],
      },
    ],
    redFlags: [],
    safetyChecks: {
      "Penicillin VK 500 mg PO BID x10d": {
        contraindications: ["Documented severe penicillin allergy"],
        requiredConfirmations: ["No history of anaphylaxis to beta-lactams"],
        warnings: ["Educate about completing full antibiotic course"],
      },
      "Acetaminophen or ibuprofen": {
        contraindications: ["Chronic liver disease (acetaminophen)", "Renal insufficiency (NSAIDs)"],
        requiredConfirmations: ["Recent kidney function if chronic NSAID use"],
        warnings: ["Avoid exceeding max acetaminophen daily dose"],
      },
    },
  },
  "thunderclap-headache": {
    id: "thunderclap-headache",
    differentials: [
      {
        diagnosis: "Subarachnoid hemorrhage",
        confidence: 0.82,
        rationale: "Sudden onset 'worst headache of life' with vomiting requires emergent exclusion.",
        guidelines: ["headache_thunderclap"],
      },
      {
        diagnosis: "Reversible cerebral vasoconstriction syndrome",
        confidence: 0.38,
        rationale: "Consider in thunderclap presentation especially in middle-aged female.",
        guidelines: ["headache_thunderclap"],
      },
      {
        diagnosis: "Migraine with aura",
        confidence: 0.18,
        rationale: "Prior history and normal exam would support migraine; current red flags lower confidence.",
        guidelines: ["headache_thunderclap"],
      },
    ],
    workup: [
      {
        test: "Non-contrast head CT",
        category: "imaging",
        indication: "First-line to evaluate for intracranial hemorrhage in thunderclap headache.",
        priority: "urgent",
        guidelines: ["headache_thunderclap"],
      },
      {
        test: "CTA head and neck",
        category: "imaging",
        indication: "Assess for aneurysm or vascular malformation if CT equivocal.",
        priority: "urgent",
        guidelines: ["headache_thunderclap"],
      },
      {
        test: "Emergency neurology consult",
        category: "referral",
        indication: "Coordinate acute management for possible subarachnoid hemorrhage.",
        priority: "urgent",
        guidelines: ["headache_thunderclap"],
      },
    ],
    medications: [
      {
        drugClass: "IV labetalol PRN",
        indication: "Titrate systolic BP <140 mmHg prior to definitive diagnosis.",
        contraindications: ["Asthma", "Bradycardia"],
        requiresConfirmation: true,
        guidelines: ["headache_thunderclap"],
      },
    ],
    redFlags: [
      {
        trigger: "severe_headache_thunderclap",
        description: "Sudden-onset maximal headache with vomiting and visual changes.",
        severity: "critical",
        active: true,
      },
      {
        trigger: "new_neuro_deficits",
        description: "Blurred vision and neck stiffness require emergent neuro evaluation.",
        severity: "critical",
        active: true,
      },
    ],
    safetyChecks: {
      "IV labetalol PRN": {
        contraindications: ["Second-degree or third-degree heart block", "Asthma exacerbation"],
        requiredConfirmations: ["Baseline ECG reviewed"],
        warnings: ["Monitor blood pressure and heart rate continuously"],
      },
    },
  },
  "uti-dysuria": {
    id: "uti-dysuria",
    differentials: [
      {
        diagnosis: "Acute uncomplicated cystitis",
        confidence: 0.78,
        rationale: "Classic dysuria with urgency and absence of systemic symptoms.",
        guidelines: ["uti_dysuria"],
      },
      {
        diagnosis: "Urethritis",
        confidence: 0.34,
        rationale: "Consider STI-related urethritis if sexual history supports.",
        guidelines: ["uti_dysuria"],
      },
      {
        diagnosis: "Vaginitis",
        confidence: 0.18,
        rationale: "Rule out if discharge or irritation emerges; current symptoms less supportive.",
        guidelines: ["uti_dysuria"],
      },
    ],
    workup: [
      {
        test: "Urinalysis with microscopy",
        category: "lab",
        indication: "Confirm leukocyte esterase and nitrite positivity.",
        priority: "routine",
        guidelines: ["uti_dysuria"],
      },
      {
        test: "Urine culture",
        category: "lab",
        indication: "Identify organism and sensitivities before prescribing antibiotics.",
        priority: "routine",
        guidelines: ["uti_dysuria"],
      },
    ],
    medications: [
      {
        drugClass: "Nitrofurantoin monohydrate/macrocrystals 100 mg PO BID x5d",
        indication: "First-line agent for uncomplicated cystitis if creatinine clearance ≥30 mL/min.",
        contraindications: ["CrCl <30 mL/min", "Late third-trimester pregnancy"],
        requiresConfirmation: true,
        guidelines: ["uti_dysuria"],
      },
      {
        drugClass: "Phenazopyridine 200 mg PO TID with meals",
        indication: "Short-term bladder analgesia for severe dysuria.",
        contraindications: ["Renal impairment"],
        requiresConfirmation: false,
        guidelines: ["uti_dysuria"],
      },
    ],
    redFlags: [],
    safetyChecks: {
      "Nitrofurantoin monohydrate/macrocrystals 100 mg PO BID x5d": {
        contraindications: ["Creatinine clearance <30", "G6PD deficiency", "Late-term pregnancy"],
        requiredConfirmations: ["Pregnancy status", "Recent renal function"],
        warnings: ["Take with food and counsel on darkened urine"],
      },
      "Phenazopyridine 200 mg PO TID with meals": {
        contraindications: ["Severe hepatic impairment", "Renal insufficiency"],
        requiredConfirmations: ["Renal function adequate"],
        warnings: ["Limit therapy to 48 hours once antibiotics started"],
      },
    },
  },
};
