import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./alert";

interface DisclaimerProps {
  className?: string;
  variant?: "default" | "prominent";
}

export function Disclaimer({ className, variant = "default" }: DisclaimerProps) {
  if (variant === "prominent") {
    return (
      <Alert className={`border-warning bg-warning-light ${className}`}>
        <AlertTriangle className="h-5 w-5 text-warning" />
        <AlertDescription className="text-sm font-medium">
          <strong>Medical disclaimer:</strong> This tool provides decision support for licensed clinicians only. It is not
          for patient self-use and is not a substitute for professional medical judgment. Every suggestion requires
          clinician review and approval.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`text-xs text-muted-foreground p-2 bg-muted/50 rounded-sm ${className}`}>
      <strong>Clinical decision support only:</strong> For licensed healthcare providers. All recommendations require
      professional judgment and patient-specific consideration.
    </div>
  );
}
