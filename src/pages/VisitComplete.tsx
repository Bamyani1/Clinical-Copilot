import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, FileText, Microscope, TestTube, Pill } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVisitStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function VisitComplete() {
  const navigate = useNavigate();
  const {
    visitId,
    consented,
    caseData,
    transcript,
    differentials,
    workupSuggestions,
    medicationSuggestions,
    redFlags,
    resetVisit,
  } = useVisitStore();

  useEffect(() => {
    if (!visitId || !consented) {
      navigate("/");
    }
  }, [visitId, consented, navigate]);

  const encounterTiming = useMemo(() => {
    if (transcript.length === 0) return null;
    const ordered = [...transcript].sort((a, b) => a.timestamp - b.timestamp);
    const format = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return {
      start: format(ordered[0].timestamp),
      end: format(ordered[ordered.length - 1].timestamp),
      minutes: Math.max(1, Math.round((ordered[ordered.length - 1].timestamp - ordered[0].timestamp) / 60000)),
    };
  }, [transcript]);

  const activeRedFlags = redFlags.filter((flag) => flag.active);

  const handleStartNewVisit = () => {
    resetVisit();
    navigate("/consent");
  };

  const handleReturnHome = () => {
    resetVisit();
    navigate("/");
  };

  const confidenceTone = (confidence: number) => {
    if (confidence >= 0.75) return "border-confidence-high/50 text-confidence-high";
    if (confidence >= 0.45) return "border-confidence-medium/50 text-confidence-medium";
    return "border-confidence-low/50 text-confidence-low";
  };

  const priorityTone = (priority: "urgent" | "routine") => {
    return priority === "urgent"
      ? "border-red-flag/60 text-red-flag"
      : "border-border/50 text-muted-foreground";
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/75 via-background/60 to-background/40 px-6 py-10 shadow-lg shadow-primary/10 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">Clinical Copilot</p>
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Visit Summary</h1>
              <p className="text-sm text-muted-foreground">Concise overview of the completed encounter</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="text-xs uppercase tracking-[0.3em]">
              Visit ID: {visitId ?? "—"}
            </Badge>
            <Badge className="bg-primary-soft/40 text-primary-foreground">Transcript entries: {transcript.length}</Badge>
          </div>
        </div>
      </section>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full flex-wrap gap-2">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/60 bg-background/75 shadow-md shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                    <ClipboardList className="h-4 w-4 text-white" />
                  </div>
                  Patient Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-subtle">Demographics</p>
                  <div className="flex flex-wrap gap-2 text-foreground">
                    <Badge variant="outline" className="border-border/40">
                      Age: {caseData.demographics?.age ?? "—"}
                    </Badge>
                    <Badge variant="outline" className="border-border/40 capitalize">
                      Sex: {caseData.demographics?.sex ?? "—"}
                    </Badge>
                    {caseData.demographics?.pregnant && (
                      <Badge className="bg-warning/20 text-warning-foreground">Pregnant</Badge>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-subtle">Chief Complaint</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {caseData.hpi?.chiefComplaint || "Not captured"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Duration: {caseData.hpi?.onsetDays ? `${caseData.hpi.onsetDays} day(s)` : "—"}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-foreground">
                  <StatPill label="Temp" value={formatValue(caseData.vitals?.temp, "°F")} />
                  <StatPill label="Heart Rate" value={formatValue(caseData.vitals?.hr, "bpm")} />
                  <StatPill label="Blood Pressure" value={caseData.vitals?.bp || "—"} />
                  <StatPill label="SpO₂" value={formatValue(caseData.vitals?.spo2, "%")} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/75 shadow-md shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                    <ClipboardList className="h-4 w-4 text-white" />
                  </div>
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p className="text-sm text-foreground">
                  Review AI recommendations, confirm clinical decisions, and finalize documentation before hand-off.
                </p>
                <ul className="space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
                  <li className="list-disc">Validate differential diagnoses with clinical judgment.</li>
                  <li className="list-disc">Order highlighted investigations when clinically appropriate.</li>
                  <li className="list-disc">Communicate patient-ready guidance for therapy considerations.</li>
                  <li className="list-disc">Resolve outstanding red flags or escalate care.</li>
                </ul>
                <Separator />
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90" onClick={handleStartNewVisit}>
                    Start New Visit
                  </Button>
                  <Button variant="outline" onClick={handleReturnHome}>
                    Return Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="space-y-8">
            {/* Differential Outlook Section */}
            <section className="group/section relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/75 via-background/60 to-background/40 transition-all duration-500 hover:border-primary-muted/60">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/section:opacity-100">
                <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
              </div>

              <div className="relative p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary text-white transition-all duration-300 group-hover/section:scale-110">
                      <Microscope className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/75">
                        Differential Outlook
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">Diagnostic Possibilities</h3>
                    </div>
                  </div>
                  {differentials.length > 0 && (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {differentials.length} {differentials.length === 1 ? 'diagnosis' : 'diagnoses'}
                    </Badge>
                  )}
                </div>

                {differentials.length === 0 ? (
                  <div className="rounded-lg border border-border/40 bg-background/60 px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No differential diagnoses generated.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {differentials.slice(0, 6).map((diff, index) => (
                      <div
                        key={diff.id}
                        className="group/item relative overflow-hidden rounded-lg border border-border/40 bg-background/60 transition-all duration-300 hover:border-primary/40 hover:bg-background/80"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div
                          className={cn(
                            "absolute left-0 top-0 h-full w-1 transition-all duration-300",
                            diff.confidence >= 0.75 && "bg-confidence-high",
                            diff.confidence >= 0.45 && diff.confidence < 0.75 && "bg-confidence-medium",
                            diff.confidence < 0.45 && "bg-confidence-low",
                          )}
                        />
                        <div className="p-4 pl-5">
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <h4 className="text-sm font-semibold text-foreground transition-colors duration-300 group-hover/item:text-primary">
                              {diff.diagnosis}
                            </h4>
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0 border text-[11px] font-semibold uppercase tracking-wide transition-all duration-300",
                                confidenceTone(diff.confidence),
                              )}
                            >
                              {Math.round(diff.confidence * 100)}%
                            </Badge>
                          </div>
                          <p className="text-[13px] leading-relaxed text-muted-foreground">{diff.rationale}</p>
                          
                          {/* Confidence meter */}
                          <div className="mt-3 overflow-hidden rounded-full bg-border/30">
                            <div
                              className={cn(
                                "h-1 rounded-full transition-all duration-700",
                                diff.confidence >= 0.75 && "bg-confidence-high",
                                diff.confidence >= 0.45 && diff.confidence < 0.75 && "bg-confidence-medium",
                                diff.confidence < 0.45 && "bg-confidence-low",
                              )}
                              style={{ width: `${diff.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Recommended Workup Section */}
            <section className="group/section relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/75 via-background/60 to-background/40 transition-all duration-500 hover:border-primary-muted/60">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/section:opacity-100">
                <div className="absolute -left-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" aria-hidden />
              </div>

              <div className="relative p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary text-white transition-all duration-300 group-hover/section:scale-110">
                      <TestTube className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/75">
                        Recommended Workup
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">Diagnostic Testing</h3>
                    </div>
                  </div>
                  {workupSuggestions.length > 0 && (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {workupSuggestions.length} {workupSuggestions.length === 1 ? 'test' : 'tests'}
                    </Badge>
                  )}
                </div>

                {workupSuggestions.length === 0 ? (
                  <div className="rounded-lg border border-border/40 bg-background/60 px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No tests suggested.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {workupSuggestions.slice(0, 6).map((workup, index) => (
                      <div
                        key={workup.id}
                        className="group/item relative overflow-hidden rounded-lg border border-border/40 bg-background/60 transition-all duration-300 hover:border-primary/40 hover:bg-background/80"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div
                          className={cn(
                            "absolute left-0 top-0 h-full w-1 transition-all duration-300",
                            workup.priority === "urgent" ? "bg-red-flag" : "bg-border",
                          )}
                        />
                        <div className="p-4 pl-5">
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="mb-1 text-sm font-semibold text-foreground transition-colors duration-300 group-hover/item:text-primary">
                                {workup.test}
                              </h4>
                              <Badge
                                variant="outline"
                                className="mb-2 border-border/40 text-[11px] font-medium text-muted-foreground"
                              >
                                {workup.category}
                              </Badge>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "shrink-0 border text-[11px] font-semibold uppercase transition-all duration-300",
                                priorityTone(workup.priority),
                              )}
                            >
                              {workup.priority}
                            </Badge>
                          </div>
                          <p className="text-[13px] leading-relaxed text-muted-foreground">{workup.indication}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Medication Considerations Section */}
            <section className="group/section relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/75 via-background/60 to-background/40 transition-all duration-500 hover:border-primary-muted/60">
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/section:opacity-100">
                <div className="absolute -bottom-32 right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden />
              </div>

              <div className="relative p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary text-white transition-all duration-300 group-hover/section:scale-110">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/75">
                        Medication Considerations
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">Therapeutic Options</h3>
                    </div>
                  </div>
                  {medicationSuggestions.length > 0 && (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {medicationSuggestions.length} {medicationSuggestions.length === 1 ? 'option' : 'options'}
                    </Badge>
                  )}
                </div>

                {medicationSuggestions.length === 0 ? (
                  <div className="rounded-lg border border-border/40 bg-background/60 px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No medications suggested.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 lg:grid-cols-2">
                    {medicationSuggestions.slice(0, 6).map((med, index) => (
                      <div
                        key={med.id}
                        className="group/item relative overflow-hidden rounded-lg border border-border/40 bg-background/60 transition-all duration-300 hover:border-primary/40 hover:bg-background/80"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/60 to-primary/20 transition-all duration-300" />
                        <div className="p-4 pl-5">
                          <h4 className="mb-2 text-sm font-semibold text-foreground transition-colors duration-300 group-hover/item:text-primary">
                            {med.drugClass}
                          </h4>
                          <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">{med.indication}</p>
                          
                          {med.contraindications && med.contraindications.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {med.contraindications.map((item) => (
                                <Badge
                                  key={item}
                                  variant="outline"
                                  className="border-warning/40 bg-warning/10 text-[11px] font-medium text-warning transition-all duration-300 hover:bg-warning/20"
                                >
                                  ⚠ {item}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {med.requiresConfirmation && (
                            <div className="mt-2 flex items-center gap-2 rounded-md border border-border/30 bg-background/40 px-2 py-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              <p className="text-[11px] text-muted-foreground">
                                Requires clinician confirmation before dispensing
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: string | number;
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-xs">
      <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-subtle">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value ?? "—"}</p>
    </div>
  );
}

function formatValue(value?: number, suffix?: string) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${value}${suffix ?? ""}`;
}
