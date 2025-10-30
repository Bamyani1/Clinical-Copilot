import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVisitStore } from "@/lib/store";

export default function Consent() {
  const navigate = useNavigate();
  const { setConsented, setVisitId, resetVisit } = useVisitStore();
  
  const [patientFirstName, setPatientFirstName] = useState("Jordan");
  const [patientLastName, setPatientLastName] = useState("Smith");
  const [patientConsent, setPatientConsent] = useState(true);
  const [clinicianConsent, setClinicianConsent] = useState(true);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const namesProvided = patientFirstName.trim().length > 0 && patientLastName.trim().length > 0;
  const canProceed = patientConsent && clinicianConsent && privacyAcknowledged && namesProvided;

  const toSlug = (value: string, fallback: string) => {
    const slug = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || fallback;
  };

  const handleSubmit = async () => {
    if (!canProceed) return;
    setIsSubmitting(true);

    // Generate new visit ID in lastname_firstname_id format
    const uniqueSegment = Math.random().toString(36).slice(2, 11);
    const visitId = `${toSlug(patientLastName, "patient")}_${toSlug(patientFirstName, "visit")}_${uniqueSegment}`;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fully reset prior visit data before configuring the new encounter
    resetVisit();
    setVisitId(visitId);
    setConsented(true);

    navigate(`/visit/${visitId}`);
  };

  return (
    <div className="flex w-full flex-col gap-16">
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/80 via-background/60 to-background/40 px-6 py-10 shadow-lg shadow-primary/10 backdrop-blur">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
            <Shield className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">Visit readiness</p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Visit Consent & Authorization</h1>
            <p className="text-sm text-muted-foreground">Required before AI assistance begins</p>
          </div>
        </div>
        <div className="mt-8 space-y-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FileText className="h-5 w-5" />
            Consent for AI-Assisted Clinical Documentation
          </div>
          <p className="text-foreground">In this demo you can expect:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Ambient capture to assist documentation; recording can be paused at any time.</li>
            <li>Clinicians review every AI suggestion before it is saved.</li>
            <li>All visit data remains local unless you choose to export it.</li>
          </ul>
        </div>
        <div className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="patient-last-name" className="text-xs uppercase tracking-[0.3em] text-subtle">
              Patient last name
            </Label>
            <Input
              id="patient-last-name"
              placeholder="e.g., Smith"
              value={patientLastName}
              onChange={(e) => setPatientLastName(e.target.value)}
              className="h-9 border-primary-muted/40 bg-background/40 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="patient-first-name" className="text-xs uppercase tracking-[0.3em] text-subtle">
              Patient first name
            </Label>
            <Input
              id="patient-first-name"
              placeholder="e.g., Jordan"
              value={patientFirstName}
              onChange={(e) => setPatientFirstName(e.target.value)}
              className="h-9 border-primary-muted/40 bg-background/40 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-background/60 shadow-md shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Shared Visit Consent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-muted-foreground">
              <p>Together, confirm the basics for this ambient documentation trial:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>The conversation may be recorded and transcribed; it can be paused at any point.</li>
                <li>AI drafts notes and flags issues, but the clinician keeps final say on every decision.</li>
                <li>Both parties can request edits or stop the assistance at any time.</li>
              </ul>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="patient-consent"
                    checked={patientConsent}
                    onCheckedChange={(checked) => setPatientConsent(checked === true)}
                  />
                  <label htmlFor="patient-consent" className="text-sm leading-relaxed text-foreground">
                    Patient confirms these expectations and agrees to use the AI documentation helper for this visit.
                  </label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="clinician-consent"
                    checked={clinicianConsent}
                    onCheckedChange={(checked) => setClinicianConsent(checked === true)}
                  />
                  <label htmlFor="clinician-consent" className="text-sm leading-relaxed text-foreground">
                    Clinician confirms licensure, retains responsibility for outcomes, and will review the AI outputs before sign-off.
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-background/60 shadow-md shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Privacy & Data Essentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="list-disc space-y-2 pl-5">
                <li>Captured audio and notes stay on this device unless you choose to export or delete them.</li>
                <li>No training or billing systems are connected in this sandbox demo.</li>
                <li>You can clear the visit history immediately after the session.</li>
              </ul>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy-acknowledged"
                  checked={privacyAcknowledged}
                  onCheckedChange={(checked) => setPrivacyAcknowledged(checked === true)}
                />
                <label htmlFor="privacy-acknowledged" className="text-sm leading-relaxed text-foreground">
                  We understand how visit data is stored in this demo environment.
                </label>
              </div>
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
            Cancel
          </Button>

          <div className="flex flex-col gap-2 sm:items-end">
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              size="lg"
              className="rounded-full bg-gradient-primary px-8 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground hover:opacity-90"
            >
              {isSubmitting ? "Setting up visit..." : "Begin AI-Assisted Visit"}
            </Button>
            <p
              className={`min-h-[1.25rem] text-xs text-muted-foreground transition-opacity ${canProceed ? "opacity-0" : "opacity-100"}`}
              aria-live="polite"
              aria-hidden={canProceed}
            >
              All consent items and patient names must be completed to proceed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
