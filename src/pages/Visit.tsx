import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Stethoscope, AlertTriangle } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Red Flag Banner */}
      {activeRedFlags.length > 0 && (
        <RedFlagBanner redFlags={activeRedFlags} />
      )}

      {/* Header */}
      <header className={`border-b bg-card/80 backdrop-blur-sm ${
        activeRedFlags.length > 0 ? 'mt-24' : ''
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Stethoscope className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Active Clinical Visit</h1>
                <p className="text-sm text-muted-foreground">Visit ID: {visitId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/visit/complete')}
              >
                Complete Visit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex flex-col gap-6 px-4 py-6 pb-24 lg:gap-8">
        <div className="grid flex-1 min-h-0 gap-6 lg:grid-cols-12">
          {/* Left Column - Audio & Transcript */}
          <div className="flex min-h-0 flex-col space-y-6 lg:col-span-4">
            <AudioCapture />
            <div className="flex-1 min-h-0">
              <TranscriptViewer />
            </div>
          </div>

          {/* Middle Column - Case Data */}
          <div className="flex min-h-0 lg:col-span-4">
            <CaseEditor />
          </div>

          {/* Right Column - AI Suggestions */}
          <div className="flex min-h-0 lg:col-span-4">
            <SuggestionPanel />
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex">
            <Button
              variant={activeTab === 'transcript' ? 'default' : 'ghost'}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab('transcript')}
            >
              Transcript
            </Button>
            <Button
              variant={activeTab === 'case' ? 'default' : 'ghost'}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab('case')}
            >
              Case data
            </Button>
            <Button
              variant={activeTab === 'suggestions' ? 'default' : 'ghost'}
              className="flex-1 rounded-none"
              onClick={() => setActiveTab('suggestions')}
            >
              Suggestions
            </Button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden mt-6 pb-16">
          {activeTab === 'transcript' && (
            <Card className="p-4 h-96">
              <TranscriptViewer />
            </Card>
          )}
          {activeTab === 'case' && (
            <Card className="p-4">
              <CaseEditor />
            </Card>
          )}
          {activeTab === 'suggestions' && (
            <Card className="p-4">
              <SuggestionPanel />
            </Card>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-surface/90 px-4 py-3 shadow-md">
          <Disclaimer className="!bg-transparent !p-0 text-sm leading-relaxed" />
        </div>
      </main>
    </div>
  );
}
