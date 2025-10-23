import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "./alert";
import { cn } from "@/lib/utils";

interface DisclaimerProps {
  className?: string;
  variant?: "default" | "prominent";
}

export function Disclaimer({ className, variant = "default" }: DisclaimerProps) {
  if (variant === "prominent") {
    return (
      <Alert className={cn("border-warning/40 bg-warning-light text-warning-foreground shadow-lg shadow-warning/20", className)}>
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
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border/60 bg-surface/70 p-3 text-xs text-muted-foreground shadow-inner shadow-primary/5",
        className,
      )}
    >
      <strong>Clinical decision support only:</strong> For licensed healthcare providers. All recommendations require
      professional judgment and patient-specific consideration.
    </div>
  );
}
