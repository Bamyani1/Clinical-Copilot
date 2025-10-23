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
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-[var(--radius-md)] bg-gradient-primary p-2">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Visit Consent & Authorization</h1>
              <p className="text-sm text-muted-foreground">Required before AI assistance begins</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-8">
          {/* Consent Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consent for AI-Assisted Clinical Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This AI system provides decision support only. Licensed healthcare providers make all final
                  decisions, and patient privacy is protected with encrypted handling.
                </AlertDescription>
              </Alert>

              <p className="text-foreground">In this demo you can expect:</p>
              <ul className="list-disc list-inside space-y-2">
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
                <ul className="list-disc list-inside space-y-2">
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
                    <label htmlFor="patient-consent" className="text-sm text-foreground leading-relaxed">
                      Patient confirms these expectations and agrees to use the AI documentation helper for this visit.
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="clinician-consent"
                      checked={clinicianConsent}
                      onCheckedChange={(checked) => setClinicianConsent(checked === true)}
                    />
                    <label htmlFor="clinician-consent" className="text-sm text-foreground leading-relaxed">
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
                <ul className="list-disc list-inside space-y-2">
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
                  <label htmlFor="privacy-acknowledged" className="text-sm text-foreground leading-relaxed">
                    We understand how visit data is stored in this demo environment.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                {isSubmitting ? 'Setting up visit...' : 'Begin AI-Assisted Visit'}
              </Button>
              {!canProceed && (
                <p className="text-xs text-muted-foreground">
                  All consent items must be checked to proceed.
                </p>
              )}
            </div>
          </div>

          <Disclaimer variant="prominent" />
        </div>
      </main>
    </div>
  );
}
