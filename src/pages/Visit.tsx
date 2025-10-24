import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AudioCapture } from "@/components/visit/audio-capture";
import { TranscriptViewer } from "@/components/visit/transcript-viewer";
import { CaseEditor } from "@/components/visit/case-editor";
import { SuggestionPanel } from "@/components/visit/suggestion-panel";
import { RedFlagBanner } from "@/components/ui/red-flag-banner";
import { Disclaimer } from "@/components/ui/disclaimer";
import { useVisitStore } from "@/lib/store";

export default function Visit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { visitId, consented, redFlags } = useVisitStore();
  const [activeTab, setActiveTab] = useState<'transcript' | 'case' | 'suggestions'>('transcript');

  useEffect(() => {
    // Verify visit authorization
    if (!consented || !visitId || visitId !== id) {
      navigate('/consent');
      return;
    }
  }, [consented, visitId, id, navigate]);

  if (!consented || !visitId) {
    return null; // Will redirect
  }

  const activeRedFlags = redFlags.filter(flag => flag.active);

  return (
    <div className="flex w-full flex-col gap-8">
      {activeRedFlags.length > 0 && (
        <RedFlagBanner redFlags={activeRedFlags} />
      )}

      <section className="grid min-h-0 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex min-h-0 w-full flex-col space-y-6 lg:col-span-4">
          <AudioCapture />
          <div className="flex min-h-0 flex-1 flex-col">
            <TranscriptViewer />
          </div>
        </div>

        <div className="flex min-h-0 w-full lg:col-span-4">
          <CaseEditor />
        </div>

        <div className="flex min-h-0 w-full lg:col-span-4">
          <SuggestionPanel />
        </div>
      </section>

      <div className="fixed bottom-6 left-1/2 z-40 w-[calc(100%-3rem)] -translate-x-1/2 lg:hidden">
        <div className="flex overflow-hidden rounded-[var(--radius)] border border-border/60 bg-card/95 shadow-lg shadow-primary/20 backdrop-blur">
          <Button
            variant={activeTab === "transcript" ? "default" : "ghost"}
            className="flex-1 rounded-none first:rounded-l-[var(--radius)] last:rounded-r-[var(--radius)]"
            onClick={() => setActiveTab("transcript")}
          >
            Transcript
          </Button>
          <Button
            variant={activeTab === "case" ? "default" : "ghost"}
            className="flex-1 rounded-none first:rounded-l-[var(--radius)] last:rounded-r-[var(--radius)]"
            onClick={() => setActiveTab("case")}
          >
            Case data
          </Button>
          <Button
            variant={activeTab === "suggestions" ? "default" : "ghost"}
            className="flex-1 rounded-none first:rounded-l-[var(--radius)] last:rounded-r-[var(--radius)]"
            onClick={() => setActiveTab("suggestions")}
          >
            Suggestions
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-4 pb-16 lg:hidden">
        {activeTab === "transcript" && (
          <Card className="h-96 p-4">
            <TranscriptViewer />
          </Card>
        )}
        {activeTab === "case" && (
          <Card className="p-4">
            <CaseEditor />
          </Card>
        )}
        {activeTab === "suggestions" && (
          <Card className="p-4">
            <SuggestionPanel />
          </Card>
        )}
      </div>

      <div className="rounded-[var(--radius)] border border-border/70 bg-surface/80 px-4 py-3 shadow-md shadow-primary/10 backdrop-blur">
        <Disclaimer className="!bg-transparent !p-0 text-sm leading-relaxed" />
      </div>

      <section className="relative flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/75 via-background/65 to-background/50 px-6 py-5 shadow-lg shadow-primary/10 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-md shadow-primary/40">
            <Stethoscope className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">Clinical Copilot</p>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Active Clinical Visit</h1>
            <p className="text-sm text-muted-foreground">Visit ID: {visitId}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-primary-muted/60 bg-background/60 text-sm font-semibold tracking-[0.12em]"
          onClick={() => navigate("/visit/complete")}
        >
          Complete Visit
        </Button>
      </section>
    </div>
  );
}
