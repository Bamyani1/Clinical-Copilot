import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, User, UserCheck } from "lucide-react";
import { useVisitStore } from "@/lib/store";
import type { Speaker } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const transcriptBubbleBase =
  "group rounded-[var(--radius-md)] border border-border/60 bg-background/80 p-4 text-foreground shadow-sm shadow-primary/10 backdrop-blur transition-colors";
const speakerChipBase =
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] bg-background/85 text-foreground/80";
const confidenceBadgeBase =
  "rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]";
const timestampClass = "text-[10px] font-medium text-muted-foreground/80";

const speakerStyles: Record<Speaker, { bubble: string; chip: string; iconClass: string }> = {
  doctor: {
    bubble: "border-primary/45 ring-1 ring-primary/5",
    chip: "border-primary/45 bg-primary-soft/25 text-primary",
    iconClass: "text-primary",
  },
  patient: {
    bubble: "border-secondary/45 ring-1 ring-secondary/5",
    chip: "border-secondary/45 bg-secondary/25 text-secondary-foreground",
    iconClass: "text-secondary-foreground",
  },
};

const getConfidenceTone = (confidence: number) => {
  if (confidence >= 0.8) return "border-success/60 bg-success/10 text-success";
  if (confidence >= 0.6) return "border-warning/60 bg-warning/10 text-warning-foreground";
  return "border-destructive/60 bg-destructive/10 text-destructive";
};

export function TranscriptViewer() {
  const { transcript } = useVisitStore();

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLElement>("[data-radix-scroll-area-viewport]");
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [transcript.length]);

  return (
    <Card className="flex h-[28rem] flex-col overflow-hidden lg:h-[36rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5" />
          Live Transcript
          {transcript.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {transcript.length} entries
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden px-6 pb-6 pt-0">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 pr-4"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {transcript.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No transcript yet.</p>
                <p className="text-sm">Start recording to capture the conversation.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {transcript.map((entry) => {
                const styles = speakerStyles[entry.speaker];
                const Icon = entry.speaker === "doctor" ? UserCheck : User;
                return (
                  <div key={entry.id} className={cn(transcriptBubbleBase, styles.bubble)}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={cn(speakerChipBase, styles.chip)}>
                        <Icon className={cn("h-3.5 w-3.5", styles.iconClass)} />
                        <span>{entry.speaker === "doctor" ? "Doctor" : "Patient"}</span>
                      </span>
                      <span className={timestampClass}>{formatTimestamp(entry.timestamp)}</span>
                      {entry.confidence !== undefined && (
                        <Badge
                          variant="outline"
                          className={cn(confidenceBadgeBase, getConfidenceTone(entry.confidence))}
                          aria-label={`Transcript confidence ${Math.round(entry.confidence * 100)} percent`}
                        >
                          {Math.round(entry.confidence * 100)}%
                        </Badge>
                      )}
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-foreground/90">{entry.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
