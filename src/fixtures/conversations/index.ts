import type { ScenarioId } from "@/lib/types";
import type { ConversationFixture } from "@/fixtures/types";

export const conversationFixtures: Record<ScenarioId, ConversationFixture> = {
  "sore-throat": {
    id: "sore-throat",
    label: "Acute Pharyngitis Intake",
    summary: "Patient with 3-day history of sore throat and Centor-positive features.",
    startTimestamp: "2024-02-20T09:05:00.000Z",
    keywords: ["sore throat", "rapid strep test", "temperature was 101.5"],
    entries: [
      {
        speaker: "patient",
        text: "Hi doctor, I've been having a really sore throat for about 3 days now.",
        offsetMs: 0,
      },
      {
        speaker: "doctor",
        text: "I see. Can you tell me more about the sore throat? Is it worse when you swallow?",
        offsetMs: 9000,
      },
      {
        speaker: "patient",
        text: "Yes, it hurts a lot when I swallow. I also have a fever and feel really tired.",
        offsetMs: 18000,
      },
      {
        speaker: "doctor",
        text: "Have you had any cough or runny nose with this?",
        offsetMs: 27000,
      },
      {
        speaker: "patient",
        text: "No cough, but my nose is a bit stuffy. Oh, and my neck feels swollen on both sides.",
        offsetMs: 36000,
      },
      {
        speaker: "doctor",
        text: "Any nausea or vomiting? And what's your temperature been?",
        offsetMs: 45000,
      },
      {
        speaker: "patient",
        text: "No throwing up, but I don't feel like eating. My temperature was 101.5 this morning.",
        offsetMs: 54000,
      },
      {
        speaker: "doctor",
        text: "Are you allergic to any medications, particularly penicillin or amoxicillin?",
        offsetMs: 63000,
      },
      {
        speaker: "patient",
        text: "No, no allergies that I know of. I don't take any regular medications either.",
        offsetMs: 72000,
      },
      {
        speaker: "doctor",
        text: "Let me examine your throat and feel your neck glands. Open wide for me.",
        offsetMs: 81000,
      },
      {
        speaker: "doctor",
        text: "I see some tonsillar swelling and tender lymph nodes in your neck.",
        offsetMs: 90000,
      },
      {
        speaker: "patient",
        text: "That explains why it hurts so much.",
        offsetMs: 99000,
      },
      {
        speaker: "doctor",
        text: "We'll do a rapid strep test and manage pain while we wait for results.",
        offsetMs: 108000,
      },
      {
        speaker: "patient",
        text: "Okay, sounds good.",
        offsetMs: 117000,
      },
    ],
  },
  "thunderclap-headache": {
    id: "thunderclap-headache",
    label: "Thunderclap Headache Emergency",
    summary: "Sudden-onset severe headache with neurologic red flags requiring escalation.",
    startTimestamp: "2024-04-02T14:20:00.000Z",
    keywords: ["worst headache", "exploded in my head", "immediate head CT"],
    entries: [
      {
        speaker: "patient",
        text: "Doctor, I have this terrible headache that came on suddenly about an hour ago.",
        offsetMs: 0,
      },
      {
        speaker: "doctor",
        text: "Can you describe the headache? Is it the worst headache you've ever had?",
        offsetMs: 8000,
      },
      {
        speaker: "patient",
        text: "Yes, it's like nothing I've experienced. It felt like something exploded in my head.",
        offsetMs: 16000,
      },
      {
        speaker: "doctor",
        text: "Any nausea, vomiting, or vision changes with this headache?",
        offsetMs: 24000,
      },
      {
        speaker: "patient",
        text: "Yes, I threw up twice and my vision seems a bit blurry.",
        offsetMs: 32000,
      },
      {
        speaker: "doctor",
        text: "These are concerning symptoms. I need to check your neurologic exam right away.",
        offsetMs: 40000,
      },
      {
        speaker: "doctor",
        text: "Given the sudden onset and severity, we need urgent imaging to rule out bleeding.",
        offsetMs: 48000,
      },
      {
        speaker: "patient",
        text: "Okay, I understand.",
        offsetMs: 56000,
      },
      {
        speaker: "doctor",
        text: "I'll arrange an immediate head CT and a neurology consult now.",
        offsetMs: 64000,
      },
    ],
  },
  "uti-dysuria": {
    id: "uti-dysuria",
    label: "Uncomplicated UTI Visit",
    summary: "Classic dysuria presentation without systemic involvement, planning outpatient care.",
    startTimestamp: "2024-06-18T10:15:00.000Z",
    keywords: ["burning when I urinate", "urinalysis", "urine looks a bit cloudy"],
    entries: [
      {
        speaker: "patient",
        text: "I've been having burning when I urinate for the past two days.",
        offsetMs: 0,
      },
      {
        speaker: "doctor",
        text: "How often are you urinating? Any urgency or frequency?",
        offsetMs: 9000,
      },
      {
        speaker: "patient",
        text: "I feel like I need to go constantly, but only small amounts come out.",
        offsetMs: 18000,
      },
      {
        speaker: "doctor",
        text: "Any fever, back pain, or blood in the urine?",
        offsetMs: 27000,
      },
      {
        speaker: "patient",
        text: "No fever or back pain, but the urine looks a bit cloudy.",
        offsetMs: 36000,
      },
      {
        speaker: "doctor",
        text: "That can happen with infection. We'll check a urinalysis today.",
        offsetMs: 45000,
      },
      {
        speaker: "patient",
        text: "Okay.",
        offsetMs: 54000,
      },
      {
        speaker: "doctor",
        text: "If it confirms UTI, we can start antibiotics and send a culture.",
        offsetMs: 63000,
      },
      {
        speaker: "patient",
        text: "Thanks, I'd like to get started.",
        offsetMs: 72000,
      },
    ],
  },
};

export const scenarioFromTranscript = (transcript: string): ScenarioId => {
  const normalized = transcript.toLowerCase();
  for (const fixture of Object.values(conversationFixtures)) {
    const matches = fixture.keywords.every((keyword) => normalized.includes(keyword.toLowerCase()));
    if (matches) {
      return fixture.id;
    }
  }
  return "sore-throat";
};
