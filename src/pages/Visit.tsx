import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AudioCapture } from "@/components/visit/audio-capture";
import { TranscriptViewer } from "@/components/visit/transcript-viewer";
import { CaseEditor } from "@/components/visit/case-editor";
import { SuggestionPanel } from "@/components/visit/suggestion-panel";
import { useVisitStore } from "@/lib/store";
import type { CaseData } from "@/lib/types";
import "@/styles/visit-layout.css";
import { useTranslation } from "react-i18next";

const isMeaningfulValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(isMeaningfulValue);
  }
  if (typeof value === "number") return !Number.isNaN(value);
  return true;
};

const hasMeaningfulCaseData = (data?: CaseData): boolean => {
  if (!data) return false;
  return Object.values(data).some(isMeaningfulValue);
};

export default function Visit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { visitId, consented, caseData } = useVisitStore();
  const { t } = useTranslation("visit");
  const [activeTab, setActiveTab] = useState<"transcript" | "case" | "suggestions">("transcript");
  const hasCaseData = useMemo(() => hasMeaningfulCaseData(caseData), [caseData]);

  useEffect(() => {
    // Verify visit authorization
    if (!consented || !visitId || visitId !== id) {
      navigate("/consent");
      return;
    }
  }, [consented, visitId, id, navigate]);

  if (!consented || !visitId) {
    return null; // Will redirect
  }

  const handleCompleteVisit = () => {
    if (!hasCaseData) return;
    navigate("/visit/complete");
  };

  return (
    <main className="visit-page">
      {/* Mobile layout */}
      <div className="visit-mobile flex flex-col gap-6 lg:hidden">
        <AudioCapture />

        {/* Tab navigation - moved to top */}
        <div className="flex overflow-hidden rounded-[var(--radius)] border border-border/60 bg-card/95 shadow-lg shadow-primary/20 backdrop-blur">
          <Button
            variant={activeTab === "transcript" ? "default" : "ghost"}
            className="flex-1 rounded-none first:rounded-l-[var(--radius)] last:rounded-r-[var(--radius)]"
            onClick={() => setActiveTab("transcript")}
          >
            {t("page.tabs.transcript")}
          </Button>
          <Button
            variant={activeTab === "case" ? "default" : "ghost"}
            className="flex-1 rounded-none first:rounded-l-[var(--radius)] last:rounded-r-[var(--radius)]"
            onClick={() => setActiveTab("case")}
          >
            {t("page.tabs.case")}
          </Button>
          <Button
            variant={activeTab === "suggestions" ? "default" : "ghost"}
            className="flex-1 rounded-none first:rounded-l-[var(--radius)] last:rounded-r-[var(--radius)]"
            onClick={() => setActiveTab("suggestions")}
          >
            {t("page.tabs.suggestions")}
          </Button>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "transcript" && <TranscriptViewer />}
          {activeTab === "case" && <CaseEditor />}
          {activeTab === "suggestions" && <SuggestionPanel />}
        </div>
      </div>

      {/* Desktop layout */}
      <section className="visit-app-layout hidden lg:grid">
        <div className="visit-column visit-column--left">
          <div className="visit-card visit-card--audio">
            <AudioCapture />
          </div>
          <div className="visit-card visit-card--transcript">
            <TranscriptViewer />
          </div>
        </div>

        <div className="visit-column">
          <div className="visit-card visit-card--case">
            <CaseEditor />
          </div>
        </div>

        <div className="visit-column">
          <div className="visit-card visit-card--support">
            <SuggestionPanel />
          </div>
        </div>
      </section>

      <section className="relative flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/75 via-background/65 to-background/50 px-4 py-5 shadow-lg shadow-primary/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <div className="flex items-center gap-4">
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">{t("page.header.brand")}</p>
            <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{t("page.header.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("page.header.visitId", { id: visitId })}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-full border-primary-muted/60 bg-background/60 text-sm font-semibold tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          onClick={handleCompleteVisit}
          disabled={!hasCaseData}
        >
          {t("page.header.complete")}
        </Button>
      </section>
      {!hasCaseData && (
        <p className="text-xs text-muted-foreground text-right">
          {t("page.header.incompleteNotice")}
        </p>
      )}
    </main>
  );
}
