import { useRef, useState, useEffect } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVisitStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/store";
import { createSTTProvider } from "@/lib/services/mock-stt";
import type { ScenarioId } from "@/lib/types";
import { SCENARIO_METADATA } from "@/fixtures";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const SCENARIO_SHORTCUTS: ReadonlyArray<{ id: ScenarioId; label: string }> = Object.values(SCENARIO_METADATA).map(
  ({ id, label }) => ({ id, label }),
);

export function AudioCapture() {
  const { isRecording, setRecording, addTranscriptEntry, scenarioId, setScenario } = useVisitStore();
  const { sttProvider } = useSettingsStore();
  const { t } = useTranslation("visit");
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sttService] = useState(() => createSTTProvider());
  const audioIntervalRef = useRef<number | null>(null);
  const levelIndexRef = useRef(0);
  const levelPattern = [18, 46, 64, 52, 70, 58, 40];

  function beginLevelSimulation() {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
    }
    setAudioLevel(levelPattern[levelIndexRef.current]);
    audioIntervalRef.current = window.setInterval(() => {
      levelIndexRef.current = (levelIndexRef.current + 1) % levelPattern.length;
      setAudioLevel(levelPattern[levelIndexRef.current]);
    }, 160);
  }

  function clearLevelSimulation() {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    setAudioLevel(0);
    levelIndexRef.current = 0;
  }

  useEffect(() => {
    sttService.onTranscript((entry) => {
      addTranscriptEntry(entry);
    });
    sttService.onEnd?.(() => {
      setRecording(false);
      clearLevelSimulation();
    });
    return () => {
      void sttService.stopRecording();
      clearLevelSimulation();
    };
  }, [sttService, addTranscriptEntry, setRecording]);

  const startRecording = async (requestedScenario?: ScenarioId) => {
    try {
      setError(null);
      const targetScenario = requestedScenario ?? scenarioId;
      if (!targetScenario) {
        setError(t("audioCapture.errors.noScenario"));
        return;
      }

      if (requestedScenario && requestedScenario !== scenarioId) {
        setScenario(requestedScenario);
      }

      sttService.setScenario?.(targetScenario);
      await sttService.startRecording({ scenarioId: targetScenario });
      setRecording(true);
      beginLevelSimulation();
    } catch (err) {
      setError(t("audioCapture.errors.startFailed"));
      console.error("Recording error:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await sttService.stopRecording();
      setRecording(false);
      clearLevelSimulation();
    } catch (err) {
      setError(t("audioCapture.errors.stopFailed"));
      console.error("Stop recording error:", err);
    }
  };

  const handleScenarioPlayback = async (nextScenario: ScenarioId) => {
    if (isRecording) {
      await stopRecording();
    }
    setScenario(nextScenario);
    sttService.setScenario?.(nextScenario);
    await startRecording(nextScenario);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Volume2 className="h-5 w-5" />
          {t("audioCapture.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col items-center space-y-4">
          {/* Audio level indicator */}
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-100"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
          
          {/* Recording controls */}
          <div className="flex gap-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                <Mic className="h-5 w-5 mr-2" />
                {t("audioCapture.controls.start")}
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
              >
                <Square className="h-4 w-4 mr-2" />
                {t("audioCapture.controls.stop")}
              </Button>
            )}
          </div>

          {/* Recording status */}
          {isRecording && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-red-flag rounded-full animate-pulse" />
              {t("audioCapture.controls.status")}
            </div>
          )}
        </div>
        
        {/* Mock scenario buttons for testing */}
        {sttProvider === 'mock' && (
          <div className="border-t pt-4 space-y-2">
            <div className="text-xs font-semibold tracking-wide text-muted-foreground/90">
              {t("audioCapture.mock.label")}
            </div>
            <div className="grid gap-2">
              {SCENARIO_SHORTCUTS.map((scenario) => {
                const isActive = scenarioId === scenario.id;
                return (
                  <Button
                    key={scenario.id}
                    size="sm"
                    aria-pressed={isActive}
                    onClick={() => handleScenarioPlayback(scenario.id)}
                    className={cn(
                      "w-full justify-center rounded-full border border-border/60 px-6 py-2 text-sm font-semibold tracking-wide transition hover:-translate-y-0.5",
                      isActive
                        ? "border-primary/70 bg-gradient-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "bg-surface/80 text-foreground/80 hover:border-primary/50 hover:bg-primary/10 hover:text-foreground",
                    )}
                  >
                    {scenario.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
