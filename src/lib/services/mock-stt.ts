// Mock Speech-to-Text provider for development and testing
import { STTProvider } from '../types';

export class MockSTTProvider implements STTProvider {
  name = 'mock';
  private isRecording = false;
  private transcriptCallback?: (text: string, speaker: 'doctor' | 'patient') => void;
  private simulationInterval?: NodeJS.Timeout;
  private entryDelayMs: number = 1000; // Faster demo cadence
  private endCallback?: () => void;

  // Mock clinical conversation scenarios
  private mockScenarios = [
    {
      speaker: 'patient' as const,
      text: "Hi doctor, I've been having a really sore throat for about 3 days now.",
    },
    {
      speaker: 'doctor' as const,
      text: "I see. Can you tell me more about the sore throat? Is it worse when you swallow?",
    },
    {
      speaker: 'patient' as const,
      text: "Yes, it hurts a lot when I swallow. I also have a fever and feel really tired.",
    },
    {
      speaker: 'doctor' as const,
      text: "Have you had any cough or runny nose with this?",
    },
    {
      speaker: 'patient' as const,
      text: "No cough, but my nose is a bit stuffy. Oh, and my neck feels swollen on both sides.",
    },
    {
      speaker: 'doctor' as const,
      text: "Any nausea or vomiting? And what's your temperature been?",
    },
    {
      speaker: 'patient' as const,
      text: "No throwing up, but I don't feel like eating. My temperature was 101.5 this morning.",
    },
    {
      speaker: 'doctor' as const,
      text: "Are you allergic to any medications, particularly penicillin or amoxicillin?",
    },
    {
      speaker: 'patient' as const,
      text: "No, no allergies that I know of. I don't take any regular medications either.",
    },
    {
      speaker: 'doctor' as const,
      text: "Let me examine your throat and feel your neck glands. Open wide for me.",
    },
    {
      speaker: 'doctor' as const,
      text: "I see some tonsillar swelling and tender lymph nodes in your neck.",
    },
    {
      speaker: 'patient' as const,
      text: "That explains why it hurts so much.",
    },
    {
      speaker: 'doctor' as const,
      text: "We'll do a rapid strep test and manage pain while we wait for results.",
    },
    {
      speaker: 'patient' as const,
      text: "Okay, sounds good.",
    },
  ];

  async startRecording(): Promise<void> {
    if (this.isRecording) return;
    
    this.isRecording = true;
    console.log('Mock STT: Starting recording simulation');
    
    // Simulate progressive transcript entries
    let currentIndex = 0;
    this.simulationInterval = setInterval(() => {
      if (currentIndex < this.mockScenarios.length && this.transcriptCallback) {
        const entry = this.mockScenarios[currentIndex];
        this.transcriptCallback(entry.text, entry.speaker);
        currentIndex++;
      } else {
        // End simulation after all entries
        this.stopRecording();
      }
    }, this.entryDelayMs);
  }

  async stopRecording(): Promise<void> {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    console.log('Mock STT: Stopping recording simulation');
    
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = undefined;
    }

    // Notify listeners that the recording session has ended
    if (this.endCallback) {
      try {
        this.endCallback();
      } catch (e) {
        console.error('Mock STT: onEnd callback error', e);
      }
    }
  }

  onTranscript(callback: (text: string, speaker: 'doctor' | 'patient') => void): void {
    this.transcriptCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.endCallback = callback;
  }

  // Additional methods for testing different scenarios
  simulateRedFlagScenario(): void {
    const redFlagScenario = [
      {
        speaker: 'patient' as const,
        text: "Doctor, I have this terrible headache that came on suddenly about an hour ago.",
      },
      {
        speaker: 'doctor' as const,
        text: "Can you describe the headache? Is it the worst headache you've ever had?",
      },
      {
        speaker: 'patient' as const,
        text: "Yes, it's like nothing I've experienced. It felt like something exploded in my head.",
      },
      {
        speaker: 'doctor' as const,
        text: "Any nausea, vomiting, or vision changes with this headache?",
      },
      {
        speaker: 'patient' as const,
        text: "Yes, I threw up twice and my vision seems a bit blurry.",
      },
      {
        speaker: 'doctor' as const,
        text: "These are concerning symptoms. I need to check your neurologic exam right away.",
      },
      {
        speaker: 'doctor' as const,
        text: "Given the sudden onset and severity, we need urgent imaging to rule out bleeding.",
      },
      {
        speaker: 'patient' as const,
        text: "Okay, I understand.",
      },
      {
        speaker: 'doctor' as const,
        text: "I'll arrange an immediate head CT and a neurology consult now.",
      },
    ];
    
    this.mockScenarios.splice(0, this.mockScenarios.length, ...redFlagScenario);
  }

  simulateUTIScenario(): void {
    const utiScenario = [
      {
        speaker: 'patient' as const,
        text: "I've been having burning when I urinate for the past two days.",
      },
      {
        speaker: 'doctor' as const,
        text: "How often are you urinating? Any urgency or frequency?",
      },
      {
        speaker: 'patient' as const,
        text: "I feel like I need to go constantly, but only small amounts come out.",
      },
      {
        speaker: 'doctor' as const,
        text: "Any fever, back pain, or blood in the urine?",
      },
      {
        speaker: 'patient' as const,
        text: "No fever or back pain, but the urine looks a bit cloudy.",
      },
      {
        speaker: 'doctor' as const,
        text: "That can happen with infection. We'll check a urinalysis today.",
      },
      {
        speaker: 'patient' as const,
        text: "Okay.",
      },
      {
        speaker: 'doctor' as const,
        text: "If it confirms UTI, we can start antibiotics and send a culture.",
      },
      {
        speaker: 'patient' as const,
        text: "Thanks, I'd like to get started.",
      },
    ];
    
    this.mockScenarios.splice(0, this.mockScenarios.length, ...utiScenario);
  }
}

// Factory function to create STT provider based on settings
export function createSTTProvider(provider: string): STTProvider {
  switch (provider) {
    case 'mock':
      return new MockSTTProvider();
    // Add other providers here when implemented
    default:
      return new MockSTTProvider();
  }
}