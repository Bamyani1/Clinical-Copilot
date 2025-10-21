import { useRef, useState, useEffect } from "react";
import { Mic, MicOff, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVisitStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/store";
import { createSTTProvider } from "@/lib/services/mock-stt";

export function AudioCapture() {
  const { isRecording, setRecording, addTranscriptEntry } = useVisitStore();
  const { sttProvider } = useSettingsStore();
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sttService] = useState(() => createSTTProvider(sttProvider));
  const audioIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Set up STT provider callback
    sttService.onTranscript((text, speaker) => {
      addTranscriptEntry({
        speaker,
        text,
        timestamp: Date.now(),
        confidence: 0.9,
      });
    });
    // Stop UI state when provider signals completion
    if ((sttService as any).onEnd) {
      (sttService as any).onEnd(() => {
        setRecording(false);
        setAudioLevel(0);
        if (audioIntervalRef.current) {
          clearInterval(audioIntervalRef.current);
          audioIntervalRef.current = null;
        }
      });
    }
  }, [sttService, addTranscriptEntry, setRecording]);

  const startRecording = async () => {
    try {
      setError(null);
      await sttService.startRecording();
      setRecording(true);
      
      // Simulate audio level for visual feedback
      const interval = window.setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      audioIntervalRef.current = interval;
      
      // Ensure cleanup when recording stops from elsewhere
      const cleanup = () => {
        if (audioIntervalRef.current) {
          clearInterval(audioIntervalRef.current);
          audioIntervalRef.current = null;
        }
      };
      window.addEventListener('beforeunload', cleanup);
      // Return a function so callers can also cleanup
      return () => {
        cleanup();
        window.removeEventListener('beforeunload', cleanup);
      };
    } catch (err) {
      setError("Recording didn't start. Check microphone permissions and try again.");
      console.error('Recording error:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await sttService.stopRecording();
      setRecording(false);
      setAudioLevel(0);
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }
    } catch (err) {
      setError("Recording didn't stop. Try again.");
      console.error('Stop recording error:', err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Audio Capture
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
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="destructive"
                size="lg"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
          
          {/* Recording status */}
          {isRecording && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-red-flag rounded-full animate-pulse" />
              Recording in progress.
            </div>
          )}
        </div>
        
        {/* Mock scenario buttons for testing */}
        {sttProvider === 'mock' && (
          <div className="border-t pt-4 space-y-2">
            <div className="text-xs text-muted-foreground font-medium mb-2">
              Mock scenarios (development):
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Reset and start standard scenario
                  if (isRecording) stopRecording();
                  startRecording();
                }}
              >
                Sore Throat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const mockSTT = sttService as any;
                  if (mockSTT.simulateRedFlagScenario) {
                    mockSTT.simulateRedFlagScenario();
                    if (isRecording) stopRecording();
                    startRecording();
                  }
                }}
              >
                Red Flag Headache
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const mockSTT = sttService as any;
                  if (mockSTT.simulateUTIScenario) {
                    mockSTT.simulateUTIScenario();
                    if (isRecording) stopRecording();
                    startRecording();
                  }
                }}
              >
                UTI Symptoms
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
