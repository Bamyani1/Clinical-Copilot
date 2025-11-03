import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle2, Shuffle, Eraser, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVisitStore } from "@/lib/store";
import { useTranslation } from "react-i18next";

export default function Consent() {
  const navigate = useNavigate();
  const { setConsented, setVisitId, resetVisit, setScenario } = useVisitStore();
  const { t } = useTranslation(["consent", "common"]);

  const persona = useMemo(
    () => ({
      firstName: t("persona.firstName"),
      lastName: t("persona.lastName"),
      summary: t("persona.summary"),
      scenarioId: "uti-dysuria" as const,
    }),
    [t],
  );

  const includedItems = useMemo(
    () => t("cards.included.items", { returnObjects: true }) as string[],
    [t],
  );

  const fullTermsItems = useMemo(
    () => t("cards.included.fullTerms.items", { returnObjects: true }) as string[],
    [t],
  );

  const sharedConsentItems = useMemo(
    () => t("cards.sharedConsent.items", { returnObjects: true }) as string[],
    [t],
  );

  const [patientFirstName, setPatientFirstName] = useState(persona.firstName);
  const [patientLastName, setPatientLastName] = useState(persona.lastName);
  const [patientConsent, setPatientConsent] = useState(true);
  const [clinicianConsent, setClinicianConsent] = useState(true);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const namesProvided = patientFirstName.trim().length > 0 && patientLastName.trim().length > 0;
  const canProceed = patientConsent && clinicianConsent && privacyAcknowledged && namesProvided;

  const toSlug = (value: string, fallback: string) => {
    const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || fallback;
  };

  const handleSubmit = useCallback(async () => {
    if (!canProceed) return;
    setIsSubmitting(true);
    const uniqueSegment = Math.random().toString(36).slice(2, 11);
    const visitId = `${toSlug(patientLastName, "patient")}_${toSlug(patientFirstName, "visit")}_${uniqueSegment}`;

    await new Promise((resolve) => setTimeout(resolve, 400));

    resetVisit();
    setVisitId(visitId);
    setConsented(true);
    setScenario(persona.scenarioId);

    navigate(`/visit/${visitId}`);
  }, [
    canProceed,
    navigate,
    patientFirstName,
    patientLastName,
    persona.scenarioId,
    resetVisit,
    setConsented,
    setScenario,
    setVisitId,
  ]);

  return (
    <div className="flex w-full flex-col gap-12 sm:gap-16">
      <section className="px-2 sm:px-0">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40">
            <Shield className="h-6 w-6" />
          </span>
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary/70">{t("header.badge")}</p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{t("header.title")}</h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{t("header.subtitle")}</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/75 via-background/55 to-background/40 px-6 py-10 shadow-lg shadow-primary/10 backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-primary-muted/30 bg-background/45 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">{t("cards.demoPatient.title")}</h2>
                {persona.summary && <p className="mt-2 text-sm text-muted-foreground">{persona.summary}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="patient-last-name" className="text-xs uppercase tracking-[0.3em] text-subtle">
                    {t("cards.demoPatient.labels.lastName")}
                  </Label>
                  <Input
                    id="patient-last-name"
                    placeholder={t("cards.demoPatient.placeholders.lastName")}
                    value={patientLastName}
                    onChange={(e) => setPatientLastName(e.target.value)}
                    className="h-11 border-primary-muted/40 bg-background/50 text-sm shadow-sm focus-visible:ring-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="patient-first-name" className="text-xs uppercase tracking-[0.3em] text-subtle">
                    {t("cards.demoPatient.labels.firstName")}
                  </Label>
                  <Input
                    id="patient-first-name"
                    placeholder={t("cards.demoPatient.placeholders.firstName")}
                    value={patientFirstName}
                    onChange={(e) => setPatientFirstName(e.target.value)}
                    className="h-11 border-primary-muted/40 bg-background/50 text-sm shadow-sm focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button type="button" size="sm" variant="ghost" className="gap-2" onClick={randomizeNames}>
                  <Shuffle className="h-4 w-4" />
                  Randomize
                </Button>
                <Button type="button" size="sm" variant="ghost" className="gap-2" onClick={clearNames}>
                  <Eraser className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-[var(--radius-lg)] border border-primary-muted/30 bg-background/40 p-6 shadow-lg shadow-primary/5 backdrop-blur-sm">
            <div>
              <h2 className="text-base font-semibold text-foreground">{t("cards.included.title")}</h2>
              <div className="mt-3 grid gap-3">
                {includedItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {showFullTerms && (
              <div className="rounded-md border border-border/50 bg-background/60 p-4 text-sm leading-relaxed text-foreground">
                <p className="mb-2 font-semibold">{t("cards.included.fullTerms.title")}</p>
                <ul className="space-y-2 pl-4 text-foreground/90">
                  {fullTermsItems.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              type="button"
              variant="link"
              className="self-start px-0 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
              onClick={() => setShowFullTerms((prev) => !prev)}
            >
              {showFullTerms ? (
                <span className="inline-flex items-center gap-1">
                  {t("cards.included.toggle.hide")}
                  <ChevronUp className="h-3 w-3" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  {t("cards.included.toggle.show")}
                  <ChevronDown className="h-3 w-3" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/60 bg-background/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("cards.sharedConsent.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground/90">{t("cards.sharedConsent.description")}</p>
              <div className="space-y-3">
                <label htmlFor="patient-consent" className="flex items-start gap-3 text-sm text-foreground">
                  <Checkbox
                    id="patient-consent"
                    checked={patientConsent}
                    onCheckedChange={(checked) => setPatientConsent(checked === true)}
                  />
                  {sharedConsentItems[0]}
                </label>
                <label htmlFor="clinician-consent" className="flex items-start gap-3 text-sm text-foreground">
                  <Checkbox
                    id="clinician-consent"
                    checked={clinicianConsent}
                    onCheckedChange={(checked) => setClinicianConsent(checked === true)}
                  />
                  {sharedConsentItems[1]}
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">{t("cards.privacy.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground/90">{t("cards.privacy.description")}</p>
              <label htmlFor="privacy-acknowledged" className="flex items-start gap-3 text-sm text-foreground">
                <Checkbox
                  id="privacy-acknowledged"
                  checked={privacyAcknowledged}
                  onCheckedChange={(checked) => setPrivacyAcknowledged(checked === true)}
                />
                {t("cards.privacy.acknowledgement")}
              </label>
            </CardContent>
          </Card>
        </div>

        <Separator className="border-border/60" />

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
            className="rounded-full px-6"
          >
            {t("common:actions.cancel")}
          </Button>

          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => void handleSubmit()}
                disabled={!canProceed || isSubmitting}
                size="lg"
                className="rounded-full bg-gradient-primary px-8 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground hover:opacity-90"
              >
                {isSubmitting ? t("actions.primary.loading") : t("actions.primary.default")}
              </Button>
            </div>
            <p
              className={`min-h-[1.25rem] text-xs text-muted-foreground transition-opacity ${canProceed ? "opacity-0" : "opacity-100"}`}
              aria-live="polite"
              aria-hidden={canProceed}
            >
              {t("actions.validationWarning")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
