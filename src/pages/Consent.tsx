import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Disclaimer } from "@/components/ui/disclaimer";
import { useVisitStore } from "@/lib/store";

export default function Consent() {
  const navigate = useNavigate();
  const { setConsented, setVisitId, setDifferentials, setWorkupSuggestions, setMedicationSuggestions, setRedFlags, updateCaseData } = useVisitStore();
  
  const [patientConsent, setPatientConsent] = useState(false);
  const [clinicianConsent, setClinicianConsent] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = patientConsent && clinicianConsent && privacyAcknowledged;

  const handleSubmit = async () => {
    if (!canProceed) return;
    
    setIsSubmitting(true);
    
    // Generate new visit ID
    const visitId = `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear any prior clinical data and suggestions before starting a new visit
    updateCaseData({});
    setDifferentials([]);
    setWorkupSuggestions([]);
    setMedicationSuggestions([]);
    setRedFlags([]);
    setVisitId(visitId);
    setConsented(true);
    
    navigate(`/visit/${visitId}`);
  };

  return (
    <div className="flex w-full flex-col gap-16 pb-24">
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface/80 via-background/60 to-background/40 px-6 py-10 shadow-lg shadow-primary/10 backdrop-blur">
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-md shadow-primary/40">
            <Shield className="h-6 w-6" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-[0.3em] text-subtle">Visit readiness</p>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Visit Consent & Authorization</h1>
            <p className="text-sm text-muted-foreground">Required before AI assistance begins</p>
          </div>
        </div>
      </section>

      <section className="space-y-10">
        <Card className="border-border/70 bg-background/60 shadow-md shadow-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5" />
              Consent for AI-Assisted Clinical Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-muted-foreground">
            <Alert className="border-primary/40 bg-primary-soft/10 text-primary">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm leading-relaxed text-primary">
                This AI system provides decision support only. Licensed healthcare providers make all final decisions, and patient
                privacy is protected with encrypted handling.
              </AlertDescription>
            </Alert>

            <p className="text-foreground">In this demo you can expect:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Ambient capture to assist documentation; recording can be paused at any time.</li>
              <li>Clinicians review every AI suggestion before it is saved.</li>
              <li>All visit data remains local unless you choose to export it.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-background/60 shadow-md shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Shared Visit Consent</CardTitle>
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
              <CardTitle className="text-lg">Privacy & Data Essentials</CardTitle>
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

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={() => navigate("/")} disabled={isSubmitting} className="rounded-full px-6">
            Cancel
          </Button>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              size="lg"
              className="rounded-full bg-gradient-primary px-8 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground hover:opacity-90"
            >
              {isSubmitting ? "Setting up visit..." : "Begin AI-Assisted Visit"}
            </Button>
            {!canProceed && (
              <p className="text-xs text-muted-foreground">All consent items must be checked to proceed.</p>
            )}
          </div>
        </div>

        <Disclaimer variant="prominent" />
      </section>
    </div>
  );
}
