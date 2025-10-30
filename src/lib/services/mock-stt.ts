import type { STTProvider, ScenarioId } from "@/lib/types";
import { conversationFixtures, DEFAULT_SCENARIO_ID } from "@/fixtures";

interface RecordingOptions {
  scenarioId?: ScenarioId;
}

const DEFAULT_CONFIDENCE = 0.92;
const PLAYBACK_SPEED = 0.1; // accelerate scripted playback further (~2x faster than real-time offsets)

type TimerHandle = ReturnType<typeof setTimeout>;

const setTimer = (callback: () => void, delay: number): TimerHandle =>
  (typeof window !== "undefined" ? window.setTimeout(callback, delay) : setTimeout(callback, delay)) as TimerHandle;

const clearTimer = (id: TimerHandle) => {
  if (typeof window !== "undefined") {
    window.clearTimeout(id);
  } else {
    clearTimeout(id);
  }
};

class MockSTTProvider implements STTProvider {
  name: string = "mock";
  private isRecording = false;
  private transcriptCallback?: (entry: { text: string; speaker: "doctor" | "patient"; timestamp: number; confidence?: number }) => void;
  private endCallback?: () => void;
  private activeTimeouts: TimerHandle[] = [];
  private scenarioId: ScenarioId = DEFAULT_SCENARIO_ID;

  startRecording = async (options: RecordingOptions = {}): Promise<void> => {
    if (this.isRecording) return;

    if (options.scenarioId) {
      this.setScenario(options.scenarioId);
    }

    const fixture = conversationFixtures[this.scenarioId];
    if (!fixture) {
      throw new Error(`Unknown conversation fixture for scenario: ${this.scenarioId}`);
    }

    this.isRecording = true;
    this.activeTimeouts = [];
    const baseTimestamp = Date.parse(fixture.startTimestamp) || Date.now();
    const now = () => (typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now());
    const startTime = now();

    const scheduleEntry = (entryIndex: number) => {
      const entry = fixture.entries[entryIndex];
      if (!entry) {
        return;
      }

      const targetTime = entry.offsetMs * PLAYBACK_SPEED;
      const elapsed = now() - startTime;
      const delay = Math.max(0, targetTime - elapsed);

      const timeout = setTimer(() => {
        if (!this.isRecording || !this.transcriptCallback) {
          return;
        }

        this.transcriptCallback({
          text: entry.text,
          speaker: entry.speaker,
          timestamp: baseTimestamp + entry.offsetMs,
          confidence: entry.confidence ?? DEFAULT_CONFIDENCE,
        });

        const nextIndex = entryIndex + 1;
        if (nextIndex < fixture.entries.length) {
          scheduleEntry(nextIndex);
        } else {
          void this.stopRecording();
        }
      }, delay);

      this.activeTimeouts.push(timeout);
    };

    scheduleEntry(0);
  };

  stopRecording = async (): Promise<void> => {
    if (!this.isRecording) return;

    this.isRecording = false;
    this.activeTimeouts.forEach((timeoutId) => clearTimer(timeoutId));
    this.activeTimeouts = [];

    if (this.endCallback) {
      try {
        this.endCallback();
      } catch (error) {
        console.error("Mock STT: end callback error", error);
      }
    }
  };

  onTranscript(callback: (entry: { text: string; speaker: "doctor" | "patient"; timestamp: number; confidence?: number }) => void): void {
    this.transcriptCallback = callback;
  }

  onEnd(callback: () => void): void {
    this.endCallback = callback;
  }

  setScenario(scenarioId: ScenarioId): void {
    if (!conversationFixtures[scenarioId]) {
      throw new Error(`Scenario ${scenarioId} is not registered in fixtures`);
    }
    this.scenarioId = scenarioId;
  }

  getScenario(): ScenarioId {
    return this.scenarioId;
  }
}

export const createSTTProvider = (): STTProvider => new MockSTTProvider();
