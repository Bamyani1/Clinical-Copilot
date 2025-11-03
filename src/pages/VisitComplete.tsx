import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ClipboardList, Microscope, TestTube, Pill, FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVisitStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { buildVisitSummaryDocument, buildVisitSummaryFilename } from "@/lib/exporters/visitSummary";

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
    soapNote,
    resetVisit,
  } = useVisitStore();
  const { t, i18n } = useTranslation(["visitComplete", "common"]);

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

  const placeholder = t("stats.placeholder");
  const nextStepItems = useMemo(() => t("overview.nextSteps.items", { returnObjects: true }) as string[], [t]);
  const formatStatValue = (value?: number, unit?: string) => {
    if (value === undefined || value === null || Number.isNaN(value)) {
      return placeholder;
    }
    return `${value}${unit ?? ""}`;
  };

  const formatDuration = (days?: number | null) => {
    if (days == null) return placeholder;
    return t("overview.durationValue", { count: days });
  };

  const handleStartNewVisit = () => {
    resetVisit();
    navigate("/consent");
  };

  const handleReturnHome = () => {
    resetVisit();
    navigate("/");
  };

  const handleExportSummary = () => {
    const fixedT = i18n.getFixedT(i18n.language, "visitComplete");
    const content = buildVisitSummaryDocument({
      t: fixedT,
      visitId,
      caseData,
      differentials,
      workupSuggestions,
      medicationSuggestions,
      redFlags,
      soapNote,
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = buildVisitSummaryFilename(fixedT, visitId);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const confidenceTone = (confidence: number) => {
    if (confidence >= 0.75) return "border-confidence-high/50 text-confidence-high";
    if (confidence >= 0.45) return "border-confidence-medium/50 text-confidence-medium";
    return "border-confidence-low/50 text-confidence-low";
  };

  const priorityTone = (priority: "urgent" | "routine") => {
    return priority === "urgent" ? "border-red-flag/60 text-red-flag" : "border-border/50 text-muted-foreground";
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
              <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">{t("header.brand")}</p>
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{t("header.title")}</h1>
              <p className="text-sm text-muted-foreground">{t("header.subtitle")}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs uppercase tracking-[0.3em]">
            {t("common:labels.visitId")}: {visitId ?? placeholder}
          </Badge>
        </div>
      </section>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full flex-wrap gap-2">
          <TabsTrigger value="overview" className="flex-1">
            {t("tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1">
            {t("tabs.insights")}
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
                  {t("overview.patientSnapshot")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-subtle">{t("overview.demographics")}</p>
                  <div className="flex flex-wrap gap-2 text-foreground">
                    <Badge variant="outline" className="border-border/40">
                      {t("overview.age")}: {caseData.demographics?.age ?? placeholder}
                    </Badge>
                    <Badge variant="outline" className="border-border/40 capitalize">
                      {t("overview.sex")}: {caseData.demographics?.sex ?? placeholder}
                    </Badge>
                    {caseData.demographics?.pregnant && (
                      <Badge className="bg-warning/20 text-warning-foreground">{t("overview.pregnant")}</Badge>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-subtle">{t("overview.chiefComplaint")}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {caseData.hpi?.chiefComplaint || t("overview.notCaptured")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("overview.duration")}: {formatDuration(caseData.hpi?.onsetDays ?? null)}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-foreground">
                  <StatPill label={t("overview.stats.temp")} value={formatStatValue(caseData.vitals?.temp, t("stats.unit.temp"))} />
                  <StatPill label={t("overview.stats.heartRate")} value={formatStatValue(caseData.vitals?.hr, t("stats.unit.heartRate"))} />
                  <StatPill label={t("overview.stats.bloodPressure")} value={caseData.vitals?.bp ?? placeholder} />
                  <StatPill label={t("overview.stats.spo2")} value={formatStatValue(caseData.vitals?.spo2, t("stats.unit.spo2"))} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-background/75 shadow-md shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                    <ClipboardList className="h-4 w-4 text-white" />
                  </div>
                  {t("overview.nextSteps.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p className="text-sm text-foreground">{t("overview.nextSteps.body")}</p>
                <ul className="space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground">
                  {nextStepItems.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-2">
            <Button
              className="inline-flex items-center rounded-full border border-primary-muted/40 bg-gradient-primary/75 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-gradient-primary"
              onClick={handleStartNewVisit}
            >
              {t("common:actions.startNewVisit")}
            </Button>
            <Button
              className="inline-flex items-center rounded-full border border-primary-muted/40 bg-gradient-primary/75 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-gradient-primary"
              onClick={handleReturnHome}
            >
              {t("common:actions.returnHome")}
            </Button>
            <Button
              className="inline-flex items-center gap-2 rounded-full border border-primary-muted/40 bg-gradient-primary/75 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-gradient-primary"
              onClick={handleExportSummary}
            >
              <FileDown className="h-3 w-3" />
              {t("common:actions.exportSummary")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="space-y-8">
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
                        {t("insights.differential.label")}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">{t("insights.differential.title")}</h3>
                    </div>
                  </div>
                </div>

                {differentials.length === 0 ? (
                  <div className="rounded-lg border border-border/40 bg-background/60 px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">{t("insights.differential.empty")}</p>
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
                        {t("insights.workup.label")}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">{t("insights.workup.title")}</h3>
                    </div>
                  </div>
                  {workupSuggestions.length > 0 && (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {t("insights.workup.count", { count: workupSuggestions.length })}
                    </Badge>
                  )}
                </div>

                {workupSuggestions.length === 0 ? (
                  <div className="rounded-lg border border-border/40 bg-background/60 px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">{t("insights.workup.empty")}</p>
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
                              {t(`insights.workup.priorities.${workup.priority}`)}
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
                        {t("insights.medications.label")}
                      </p>
                      <h3 className="text-lg font-semibold text-foreground">{t("insights.medications.title")}</h3>
                    </div>
                  </div>
                  {medicationSuggestions.length > 0 && (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {t("insights.medications.count", { count: medicationSuggestions.length })}
                    </Badge>
                  )}
                </div>

                {medicationSuggestions.length === 0 ? (
                  <div className="rounded-lg border border-border/40 bg-background/60 px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">{t("insights.medications.empty")}</p>
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
                                {t("insights.medications.requiresConfirmation")}
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
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
