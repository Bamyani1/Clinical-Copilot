import { useState, useEffect, useCallback, useRef, type RefObject } from "react";
import { Brain, TestTube, Pill, AlertTriangle, CheckCircle2, X, Loader2, HelpCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useVisitStore } from "@/lib/store";
import { createInsightEngine, FixtureLoadError, type ScenarioFixtureFallback } from "@/lib/services/mock-insight-engine";
import type { SuggestionFixture } from "@/fixtures/types";
import { useTranslation } from "react-i18next";

export function SuggestionPanel() {
  const {
    caseData,
    differentials,
    workupSuggestions,
    medicationSuggestions,
    redFlags,
    setDifferentials,
    setWorkupSuggestions,
    setMedicationSuggestions,
    setRedFlags,
    scenarioId,
  } = useVisitStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [insightEngine] = useState(() => createInsightEngine());
  const [acceptedItems, setAcceptedItems] = useState<{
    differentials: string[];
    workup: string[];
    medications: string[];
  }>({
    differentials: [],
    workup: [],
    medications: [],
  });
  const [fixtureStatus, setFixtureStatus] = useState<{ tone: "warning" | "error"; message: string } | null>(null);
  const [coachmarkVisible, setCoachmarkVisible] = useState(false);
  const [coachmarkDismissed, setCoachmarkDismissed] = useState(false);
  const lastAutoTriggerRef = useRef<string>("");
  const { t } = useTranslation("visit");

  const hasChiefComplaint = Boolean(caseData.hpi?.chiefComplaint);
  const displayDifferentials = differentials;
  const displayWorkup = workupSuggestions;
  const displayMedications = medicationSuggestions;
  const displayRedFlags = redFlags;
  const activeRedFlags = redFlags.filter(flag => flag.active);

  const differentialScrollRef = useRef<HTMLDivElement | null>(null);
  const workupScrollRef = useRef<HTMLDivElement | null>(null);
  const medicationScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollViewport = (ref: RefObject<HTMLDivElement>, position: "top" | "bottom") => {
    const viewport = ref.current?.querySelector<HTMLElement>("[data-radix-scroll-area-viewport]");
    if (viewport) {
      const top = position === "top" ? 0 : viewport.scrollHeight;
      viewport.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  const applySuggestionPayload = useCallback(
    (payload: {
      differentials: Array<{ diagnosis: string; confidence: number; rationale: string; guidelines?: string[] }>;
      workup: Array<{ test: string; category: string; indication: string; priority: "urgent" | "routine"; guidelines?: string[] }>;
      medications: Array<{
        drugClass: string;
        indication: string;
        contraindications?: string[];
        requiresConfirmation?: boolean;
        guidelines?: string[];
      }>;
      redFlags: Array<{ trigger: string; description: string; severity: "critical" | "urgent" | "moderate"; active: boolean }>;
    }) => {
      const nextDifferentials = payload.differentials
        .map((diff, index) => ({
          id: `diff_${index}`,
          diagnosis: diff.diagnosis,
          confidence: diff.confidence,
          rationale: diff.rationale,
          guidelines: diff.guidelines,
        }))
        .sort((a, b) => b.confidence - a.confidence);

      const nextWorkup = payload.workup
        .map((work, index) => ({
          id: `workup_${index}`,
          test: work.test,
          category: work.category,
          indication: work.indication,
          priority: work.priority,
          guidelines: work.guidelines,
        }))
        .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "urgent" ? -1 : 1));

      const nextMedications = payload.medications
        .map((med, index) => ({
          id: `med_${index}`,
          drugClass: med.drugClass,
          indication: med.indication,
          contraindications: med.contraindications,
          requiresConfirmation: med.requiresConfirmation,
          guidelines: med.guidelines,
        }))
        .sort((a, b) => a.drugClass.localeCompare(b.drugClass));

      const nextRedFlags = payload.redFlags.map((flag, index) => ({
        id: `flag_${index}`,
        trigger: flag.trigger,
        description: flag.description,
        severity: flag.severity,
        active: flag.active,
      }));

      setDifferentials(nextDifferentials);
      setWorkupSuggestions(nextWorkup);
      setMedicationSuggestions(nextMedications);
      setRedFlags(nextRedFlags);

      setAcceptedItems((prev) => ({
        differentials: prev.differentials.filter((id) => nextDifferentials.some((item) => item.id === id)),
        workup: prev.workup.filter((id) => nextWorkup.some((item) => item.id === id)),
        medications: prev.medications.filter((id) => nextMedications.some((item) => item.id === id)),
      }));
    },
    [setDifferentials, setMedicationSuggestions, setRedFlags, setWorkupSuggestions],
  );

  const generateSuggestions = useCallback(async () => {
    if (!caseData.hpi?.chiefComplaint) return;

    setIsGenerating(true);
    setFixtureStatus(null);
    try {
      const response = await insightEngine.generateReasoning({
        caseData,
        scenarioId,
        guidelines: [],
      });
      applySuggestionPayload(response);
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      if (error instanceof FixtureLoadError) {
        if (error.fallback) {
          const fallback = error.fallback as ScenarioFixtureFallback<SuggestionFixture>;
          applySuggestionPayload({
            differentials: fallback.fixture.differentials,
            workup: fallback.fixture.workup,
            medications: fallback.fixture.medications,
            redFlags: fallback.fixture.redFlags,
          });
          setFixtureStatus({
            tone: "warning",
            message: t("suggestionPanel.status.fallback", { id: error.identifier, fallbackId: fallback.scenarioId }),
          });
        } else {
          setFixtureStatus({
            tone: "error",
            message: t("suggestionPanel.status.missing"),
          });
        }
        return;
      }
      setFixtureStatus({
        tone: "error",
        message: t("suggestionPanel.status.unexpected"),
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    caseData,
    scenarioId,
    insightEngine,
    applySuggestionPayload,
    t,
  ]);

  useEffect(() => {
    if (!hasChiefComplaint) {
      lastAutoTriggerRef.current = "";
      setDifferentials([]);
      setWorkupSuggestions([]);
      setMedicationSuggestions([]);
      setRedFlags([]);
      setAcceptedItems({ differentials: [], workup: [], medications: [] });
      setFixtureStatus(null);
      setCoachmarkVisible(false);
      return;
    }

    const signature = JSON.stringify({
      scenarioId,
      hpi: caseData.hpi,
      vitals: caseData.vitals,
      allergies: caseData.allergies,
      medications: caseData.medications,
      exam: caseData.exam,
      labs: caseData.labs,
      ros: caseData.ros,
    });

    if (signature === lastAutoTriggerRef.current) {
      return;
    }

    lastAutoTriggerRef.current = signature;
    void generateSuggestions();
  }, [
    caseData,
    scenarioId,
    hasChiefComplaint,
    generateSuggestions,
    setDifferentials,
    setWorkupSuggestions,
    setMedicationSuggestions,
    setRedFlags,
  ]);

  useEffect(() => {
    if (differentials.length > 0) {
      scrollViewport(differentialScrollRef, "top");
    }
  }, [differentials.length]);

  useEffect(() => {
    if (workupSuggestions.length > 0) {
      scrollViewport(workupScrollRef, "bottom");
    }
  }, [workupSuggestions.length]);

  useEffect(() => {
    if (medicationSuggestions.length > 0) {
      scrollViewport(medicationScrollRef, "bottom");
    }
  }, [medicationSuggestions.length]);

  useEffect(() => {
    if (differentials.length > 0 && !coachmarkDismissed) {
      setCoachmarkVisible(true);
    }
  }, [coachmarkDismissed, differentials.length]);

  const toggleAcceptance = (category: keyof typeof acceptedItems, id: string) => {
    setAcceptedItems(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(item => item !== id)
        : [...prev[category], id],
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "text-confidence-high border-confidence-high";
    if (confidence >= 0.4) return "text-confidence-medium border-confidence-medium";
    return "text-confidence-low border-confidence-low";
  };

  const getPriorityColor = (priority: "urgent" | "routine") => {
    return priority === "urgent" ? "text-red-flag" : "text-muted-foreground";
  };

  return (
    <Card className="relative flex h-full min-h-0 flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5" />
          <span className="flex items-center gap-2">
            {t("suggestionPanel.title")}
            {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/50 text-muted-foreground transition hover:border-primary-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={t("suggestionPanel.tooltip.trigger")}
              >
                <HelpCircle className="h-4 w-4" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent align="end" className="max-w-sm text-left leading-relaxed">
              {t("suggestionPanel.tooltip.content")}
            </TooltipContent>
          </Tooltip>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{t("suggestionPanel.subtitle")}</p>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 space-y-6 overflow-y-auto">
        {fixtureStatus && (
          <Alert
            variant={fixtureStatus.tone === "error" ? "destructive" : "default"}
            className="border-dashed border-border/60 bg-background/80"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden />
            <AlertDescription>{fixtureStatus.message}</AlertDescription>
          </Alert>
        )}
        <Accordion type="single" collapsible defaultValue="differentials" className="space-y-4">
          <AccordionItem
            value="differentials"
            className="overflow-hidden rounded-xl border border-border/60 bg-background/70 shadow-sm"
          >
            <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                {t("suggestionPanel.accordion.differentials")}
              </span>
              {displayDifferentials.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {displayDifferentials.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/60 bg-background/80 px-4 py-4 text-sm">
              {!hasChiefComplaint ? (
                <p className="text-xs text-muted-foreground">{t("suggestionPanel.accordion.empty.chiefComplaint")}</p>
              ) : displayDifferentials.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t("suggestionPanel.accordion.empty.differentials")}</p>
              ) : (
                <ScrollArea ref={differentialScrollRef} className="h-72 pr-3" aria-live="polite" aria-relevant="additions">
                  <div className="divide-y divide-border/40">
                    {displayDifferentials.map(diff => (
                      <div key={diff.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{diff.diagnosis}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{diff.rationale}</p>
                          </div>
                        <div className="flex flex-col items-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className={`text-xs ${getConfidenceColor(diff.confidence)}`}>
                                {Math.round(diff.confidence * 100)}%
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>{t("suggestionPanel.accordion.tooltips.confidence")}</TooltipContent>
                          </Tooltip>
                          <Button
                            size="icon"
                            variant={acceptedItems.differentials.includes(diff.id) ? "default" : "outline"}
                            onClick={() => toggleAcceptance("differentials", diff.id)}
                            className="h-7 w-7"
                            aria-label={
                              acceptedItems.differentials.includes(diff.id)
                                ? t("suggestionPanel.accordion.actions.reject")
                                : t("suggestionPanel.accordion.actions.accept")
                            }
                          >
                              {acceptedItems.differentials.includes(diff.id) ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <X className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Progress value={diff.confidence * 100} className="mt-1 h-1" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="workup"
            className="overflow-hidden rounded-xl border border-border/60 bg-background/70 shadow-sm"
          >
            <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                {t("suggestionPanel.accordion.workup")}
              </span>
              {displayWorkup.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {displayWorkup.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/60 bg-background/80 px-4 py-4 text-sm">
              {!hasChiefComplaint ? (
                <p className="text-xs text-muted-foreground">{t("suggestionPanel.accordion.empty.chiefComplaint")}</p>
              ) : displayWorkup.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t("suggestionPanel.accordion.empty.workup")}</p>
              ) : (
                <ScrollArea ref={workupScrollRef} className="h-72 pr-3" aria-live="polite" aria-relevant="additions">
                  <div className="divide-y divide-border/40">
                    {displayWorkup.map(workup => (
                      <div key={workup.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{workup.test}</p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className={`mt-2 text-xs ${getPriorityColor(workup.priority)}`}>
                                  {t(`suggestionPanel.accordion.priority.${workup.priority}`)} • {workup.category}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                {workup.priority === "urgent"
                                  ? t("suggestionPanel.accordion.tooltips.priorityUrgent")
                                  : t("suggestionPanel.accordion.tooltips.priorityRoutine")}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Button
                            size="icon"
                            variant={acceptedItems.workup.includes(workup.id) ? "default" : "outline"}
                            onClick={() => toggleAcceptance("workup", workup.id)}
                            className="h-7 w-7"
                            aria-label={
                              acceptedItems.workup.includes(workup.id)
                                ? t("suggestionPanel.accordion.actions.reject")
                                : t("suggestionPanel.accordion.actions.accept")
                            }
                          >
                            {acceptedItems.workup.includes(workup.id) ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{workup.indication}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="medications"
            className="overflow-hidden rounded-xl border border-border/60 bg-background/70 shadow-sm"
          >
            <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                {t("suggestionPanel.accordion.medications")}
              </span>
              {displayMedications.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {displayMedications.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/60 bg-background/80 px-4 py-4 text-sm">
              {!hasChiefComplaint ? (
                <p className="text-xs text-muted-foreground">{t("suggestionPanel.accordion.empty.chiefComplaint")}</p>
              ) : displayMedications.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t("suggestionPanel.accordion.empty.medications")}</p>
              ) : (
                <ScrollArea ref={medicationScrollRef} className="h-72 pr-3" aria-live="polite" aria-relevant="additions">
                  <div className="divide-y divide-border/40">
                    {displayMedications.map(med => (
                      <div key={med.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{med.drugClass}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{med.indication}</p>
                            {med.contraindications && med.contraindications.length > 0 && (
                              <div className="flex items-start gap-2 rounded-md bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-inner">
                                <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                                <span className="text-foreground/80">
                                  {t("suggestionPanel.accordion.contraindications", {
                                    items: med.contraindications.join(", "),
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant={acceptedItems.medications.includes(med.id) ? "default" : "outline"}
                            onClick={() => toggleAcceptance("medications", med.id)}
                            disabled={med.requiresConfirmation && !caseData.demographics?.age}
                            className="h-7 w-7"
                            aria-label={
                              acceptedItems.medications.includes(med.id)
                                ? t("suggestionPanel.accordion.actions.reject")
                                : t("suggestionPanel.accordion.actions.accept")
                            }
                          >
                            {acceptedItems.medications.includes(med.id) ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4" />
              {t("suggestionPanel.accordion.redFlags.title")}
            </h3>
            {activeRedFlags.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {t("suggestionPanel.accordion.redFlags.activeCount", { count: activeRedFlags.length })}
              </Badge>
            )}
          </div>
          {displayRedFlags.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("suggestionPanel.accordion.redFlags.none")}</p>
          ) : (
            <div className="space-y-3">
              {displayRedFlags.map(flag => (
                <div
                  key={flag.id}
                  className={`rounded-lg border p-4 shadow-sm ${
                    flag.active ? "border-red-flag/60 bg-red-flag/10" : "border-border/60 bg-background/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{flag.trigger}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{flag.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-xs">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="outline"
                            className={
                              flag.severity === "critical"
                                ? "border-red-flag text-red-flag"
                                : "border-warning text-warning"
                            }
                          >
                            {flag.severity === "critical"
                              ? t("suggestionPanel.accordion.redFlags.severity.critical")
                              : t("suggestionPanel.accordion.redFlags.severity.urgent")}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {flag.severity === "critical"
                            ? t("suggestionPanel.accordion.redFlags.severity.criticalHelp")
                            : t("suggestionPanel.accordion.redFlags.severity.urgentHelp")}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={flag.active ? "destructive" : "outline"}
                            className={flag.active ? "bg-red-flag text-red-flag-foreground" : "text-muted-foreground"}
                          >
                            {flag.active
                              ? t("suggestionPanel.accordion.redFlags.status.active")
                              : t("suggestionPanel.accordion.redFlags.status.cleared")}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          {flag.active
                            ? t("suggestionPanel.accordion.redFlags.status.activeHelp")
                            : t("suggestionPanel.accordion.redFlags.status.clearedHelp")}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      {coachmarkVisible && (
        <div
          className="pointer-events-auto absolute inset-x-4 top-[6.75rem] z-20 rounded-[var(--radius-md)] border border-primary/40 bg-background/95 p-5 shadow-xl shadow-primary/20 backdrop-blur"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">{t("suggestionPanel.coachmark.title")}</p>
              <p>{t("suggestionPanel.coachmark.body")}</p>
              <Button
                size="sm"
                className="mt-2 rounded-full bg-primary text-primary-foreground"
                onClick={() => {
                  setCoachmarkVisible(false);
                  setCoachmarkDismissed(true);
                }}
              >
                {t("suggestionPanel.coachmark.dismiss")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
