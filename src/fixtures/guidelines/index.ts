import type { GuidelineFixture } from "@/fixtures/types";

export const guidelineFixtures: Record<string, GuidelineFixture> = {
  sore_throat: {
    id: "guideline-sore-throat",
    key: "sore_throat",
    title: "Acute Pharyngitis Pathway",
    category: "Infectious Disease",
    summary: "Risk-stratify sore throat presentations using Centor/McIsaac criteria.",
    content:
      "1. Apply Centor score to determine pre-test probability.\n" +
      "2. Perform RADT when score ≥2; follow with culture if negative but suspicion remains.\n" +
      "3. Treat confirmed strep with first-line penicillin-class antibiotic unless contraindicated.\n" +
      "4. Provide supportive care: hydration, analgesics, voice rest.\n" +
      "5. Educate on red flags requiring re-evaluation (respiratory distress, progressive swelling).",
    version: "2024.1",
    active: true,
  },
  headache_thunderclap: {
    id: "guideline-thunderclap",
    key: "headache_thunderclap",
    title: "Thunderclap Headache Escalation Guide",
    category: "Neurology",
    summary: "Immediate imaging-first algorithm for sudden-onset severe headache.",
    content:
      "1. Activate emergency protocol and obtain vitals while preparing CT.\n" +
      "2. Non-contrast head CT within minutes of arrival; if negative and suspicion persists, pursue CTA or LP.\n" +
      "3. Tight blood pressure control (target SBP <140) to prevent re-bleed.\n" +
      "4. Consult neurology/neurosurgery early for definitive management.\n" +
      "5. Document neurologic exam serially and monitor for deterioration.",
    version: "2024.1",
    active: true,
  },
  uti_dysuria: {
    id: "guideline-uti-dysuria",
    key: "uti_dysuria",
    title: "Uncomplicated Cystitis Checklist",
    category: "Primary Care",
    summary: "Evidence-based approach to outpatient dysuria without systemic signs.",
    content:
      "1. Confirm absence of flank pain, fever, or pregnancy complications.\n" +
      "2. Obtain urinalysis; culture recommended prior to antibiotics.\n" +
      "3. Nitrofurantoin or TMP-SMX as first-line therapy, aligned with local resistance data.\n" +
      "4. Provide bladder analgesia for symptomatic relief as needed.\n" +
      "5. Counsel on hydration, warning signs (fever, flank pain), and 48-hour follow-up if no improvement.",
    version: "2024.1",
    active: true,
  },
};
