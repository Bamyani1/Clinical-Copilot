import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Mic, CheckCircle } from "lucide-react";
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
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Visit Consent & Authorization</h1>
              <p className="text-sm text-muted-foreground">Required before AI assistance begins</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Consent Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consent for AI-Assisted Clinical Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  This AI system provides decision support only. Licensed healthcare providers make all final
                  decisions, and patient privacy is protected with encrypted handling.
                </AlertDescription>
              </Alert>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Mic className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Audio Recording</h3>
                  <p className="text-sm text-muted-foreground">
                    Conversation audio is recorded and transcribed for clinical documentation.
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-success" />
                  <h3 className="font-semibold mb-1">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground">
                    All data is encrypted, stored securely, and handled per HIPAA requirements.
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <h3 className="font-semibold mb-1">Clinical Oversight</h3>
                  <p className="text-sm text-muted-foreground">
                    A healthcare provider reviews and approves every AI suggestion.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Forms */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patient Consent */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Consent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><strong>I understand that:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>This visit will be recorded and transcribed.</li>
                    <li>AI technology will assist in clinical documentation.</li>
                    <li>My healthcare provider makes all final medical decisions.</li>
                    <li>My privacy will be protected per HIPAA standards.</li>
                    <li>I can request to stop recording at any time.</li>
                  </ul>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="patient-consent"
                    checked={patientConsent}
                    onCheckedChange={(checked) => setPatientConsent(checked === true)}
                  />
                  <label
                    htmlFor="patient-consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I consent to AI-assisted clinical documentation for this visit.
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Clinician Consent */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clinician Authorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><strong>I acknowledge that:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>I am a licensed healthcare provider.</li>
                    <li>AI suggestions are decision support only.</li>
                    <li>I retain full clinical responsibility for all decisions.</li>
                    <li>I will review all AI-generated content before finalizing.</li>
                    <li>Patient safety is my primary concern.</li>
                  </ul>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clinician-consent"
                    checked={clinicianConsent}
                    onCheckedChange={(checked) => setClinicianConsent(checked === true)}
                  />
                  <label
                    htmlFor="clinician-consent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I authorize the use of AI clinical decision support for this patient visit.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Acknowledgment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Privacy & Data Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p><strong>Data Handling:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Visit recordings are encrypted and stored securely.</li>
                  <li>Data is used only for this clinical encounter.</li>
                  <li>No patient data is used for AI training without explicit consent.</li>
                  <li>All data can be deleted upon request.</li>
                  <li>The system follows all applicable privacy regulations.</li>
                </ul>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy-acknowledged"
                  checked={privacyAcknowledged}
                  onCheckedChange={(checked) => setPrivacyAcknowledged(checked === true)}
                />
                <label
                  htmlFor="privacy-acknowledged"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and understand the privacy and data handling policies.
                </label>
              </div>
            </CardContent>
          </Card>

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
