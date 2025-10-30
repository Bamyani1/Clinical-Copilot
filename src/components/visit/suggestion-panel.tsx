import { useState, useEffect, useCallback, useRef, type RefObject } from "react";
import { Brain, TestTube, Pill, AlertTriangle, CheckCircle2, X, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVisitStore } from "@/lib/store";
import { createReasoner } from "@/lib/services/mock-reasoner";

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
  const [reasoner] = useState(() => createReasoner());
  const [acceptedItems, setAcceptedItems] = useState<{
    differentials: string[];
    workup: string[];
    medications: string[];
  }>({
    differentials: [],
    workup: [],
    medications: [],
  });
  const lastAutoTriggerRef = useRef<string>("");

  const hasChiefComplaint = Boolean(caseData.hpi?.chiefComplaint);
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

  const generateSuggestions = useCallback(async () => {
    if (!caseData.hpi?.chiefComplaint) return;

    setIsGenerating(true);
    try {
      const response = await reasoner.generateReasoning({
        caseData,
        scenarioId,
        guidelines: [],
      });

      const nextDifferentials = response.differentials
        .map((diff, index) => ({
          id: `diff_${index}`,
          diagnosis: diff.diagnosis,
          confidence: diff.confidence,
          rationale: diff.rationale,
          guidelines: diff.guidelines,
        }))
        .sort((a, b) => b.confidence - a.confidence);

      const nextWorkup = response.workup
        .map((work, index) => ({
          id: `workup_${index}`,
          test: work.test,
          category: work.category,
          indication: work.indication,
          priority: work.priority,
          guidelines: work.guidelines,
        }))
        .sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "urgent" ? -1 : 1));

      const nextMedications = response.medications
        .map((med, index) => ({
          id: `med_${index}`,
          drugClass: med.drugClass,
          indication: med.indication,
          contraindications: med.contraindications,
          requiresConfirmation: med.requiresConfirmation,
          guidelines: med.guidelines,
        }))
        .sort((a, b) => a.drugClass.localeCompare(b.drugClass));

      const nextRedFlags = response.redFlags.map((flag, index) => ({
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
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [
    caseData,
    scenarioId,
    reasoner,
    setDifferentials,
    setMedicationSuggestions,
    setRedFlags,
    setWorkupSuggestions,
    setAcceptedItems,
  ]);

  useEffect(() => {
    if (!hasChiefComplaint) {
      lastAutoTriggerRef.current = "";
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
  }, [caseData, scenarioId, hasChiefComplaint, generateSuggestions]);

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
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5" />
          AI Suggestions
          {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <p className="text-sm text-muted-foreground">Generated automatically from the evolving clinical case data.</p>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <Accordion type="single" collapsible defaultValue="differentials" className="space-y-4">
          <AccordionItem
            value="differentials"
            className="overflow-hidden rounded-xl border border-border/60 bg-background/70 shadow-sm"
          >
            <AccordionTrigger className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Differential diagnoses
              </span>
              {differentials.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {differentials.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/60 bg-background/80 px-4 py-4 text-sm">
              {!hasChiefComplaint ? (
                <p className="text-xs text-muted-foreground">
                  Add a chief complaint to start generating AI suggestions.
                </p>
              ) : differentials.length === 0 ? (
                <p className="text-xs text-muted-foreground">No differential diagnoses yet.</p>
              ) : (
                <ScrollArea ref={differentialScrollRef} className="h-72 pr-3" aria-live="polite" aria-relevant="additions">
                  <div className="divide-y divide-border/40">
                    {differentials.map(diff => (
                      <div key={diff.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{diff.diagnosis}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{diff.rationale}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className={`text-xs ${getConfidenceColor(diff.confidence)}`}>
                              {Math.round(diff.confidence * 100)}%
                            </Badge>
                            <Button
                              size="icon"
                              variant={acceptedItems.differentials.includes(diff.id) ? "default" : "outline"}
                              onClick={() => toggleAcceptance("differentials", diff.id)}
                              className="h-7 w-7"
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
                Workup suggestions
              </span>
              {workupSuggestions.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {workupSuggestions.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/60 bg-background/80 px-4 py-4 text-sm">
              {!hasChiefComplaint ? (
                <p className="text-xs text-muted-foreground">
                  Once intake begins we will surface recommended labs and imaging.
                </p>
              ) : workupSuggestions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No workup suggestions yet.</p>
              ) : (
                <ScrollArea ref={workupScrollRef} className="h-72 pr-3" aria-live="polite" aria-relevant="additions">
                  <div className="divide-y divide-border/40">
                    {workupSuggestions.map(workup => (
                      <div key={workup.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{workup.test}</p>
                            <Badge variant="outline" className={`mt-2 text-xs ${getPriorityColor(workup.priority)}`}>
                              {workup.priority} • {workup.category}
                            </Badge>
                          </div>
                          <Button
                            size="icon"
                            variant={acceptedItems.workup.includes(workup.id) ? "default" : "outline"}
                            onClick={() => toggleAcceptance("workup", workup.id)}
                            className="h-7 w-7"
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
                Medication suggestions
              </span>
              {medicationSuggestions.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {medicationSuggestions.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/60 bg-background/80 px-4 py-4 text-sm">
              {!hasChiefComplaint ? (
                <p className="text-xs text-muted-foreground">Capture key history to populate first-line therapy ideas.</p>
              ) : medicationSuggestions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No medication suggestions yet.</p>
              ) : (
                <ScrollArea ref={medicationScrollRef} className="h-72 pr-3" aria-live="polite" aria-relevant="additions">
                  <div className="divide-y divide-border/40">
                    {medicationSuggestions.map(med => (
                      <div key={med.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{med.drugClass}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{med.indication}</p>
                            {med.contraindications && med.contraindications.length > 0 && (
                              <div className="flex items-start gap-2 rounded-md bg-background/80 px-3 py-2 text-xs text-muted-foreground shadow-inner">
                                <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                                <span className="text-foreground/80">Contraindications: <span className="text-foreground">{med.contraindications.join(", ")}</span></span>
                              </div>
                            )}
                          </div>
                          <Button
                            size="icon"
                            variant={acceptedItems.medications.includes(med.id) ? "default" : "outline"}
                            onClick={() => toggleAcceptance("medications", med.id)}
                            disabled={med.requiresConfirmation && !caseData.demographics?.age}
                            className="h-7 w-7"
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
              Red flag monitor
            </h3>
            {activeRedFlags.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {activeRedFlags.length} active
              </Badge>
            )}
          </div>
          {redFlags.length === 0 ? (
            <p className="text-xs text-muted-foreground">No red flags captured yet.</p>
          ) : (
            <div className="space-y-3">
              {redFlags.map(flag => (
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
                      <Badge
                        variant="outline"
                        className={
                          flag.severity === "critical"
                            ? "border-red-flag text-red-flag"
                            : "border-warning text-warning"
                        }
                      >
                        {flag.severity === "critical" ? "Critical" : "Urgent"}
                      </Badge>
                      <Badge
                        variant={flag.active ? "destructive" : "outline"}
                        className={flag.active ? "bg-red-flag text-red-flag-foreground" : "text-muted-foreground"}
                      >
                        {flag.active ? "Active" : "Cleared"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
