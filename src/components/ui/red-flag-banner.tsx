import { AlertTriangle, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import { RedFlag } from "@/lib/store";

interface RedFlagBannerProps {
  redFlags: RedFlag[];
  onDismiss?: (flagId: string) => void;
  className?: string;
}

export function RedFlagBanner({ redFlags, onDismiss, className }: RedFlagBannerProps) {
  const activeFlags = redFlags.filter(flag => flag.active);
  
  if (activeFlags.length === 0) return null;

  const criticalFlags = activeFlags.filter(flag => flag.severity === 'critical');
  const urgentFlags = activeFlags.filter(flag => flag.severity === 'urgent');
  
  const hasCritical = criticalFlags.length > 0;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 px-4 pt-4 ${className ?? ""}`}>
      <Alert
        className={`mx-auto max-w-5xl border-0 shadow-lg shadow-red-flag/30 ${
          hasCritical
            ? "bg-red-flag text-red-flag-foreground"
            : "bg-warning text-warning-foreground"
        }`}
      >
        <AlertTriangle className="h-6 w-6" />
        <div className="flex-1">
          <AlertTitle className="text-lg font-bold mb-2">
            {hasCritical ? "Critical red flags detected" : "Urgent red flags detected"}
          </AlertTitle>
          <AlertDescription className="space-y-2">
            {criticalFlags.map(flag => (
              <div key={flag.id} className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{flag.trigger}</div>
                  <div className="text-sm opacity-90">{flag.description}</div>
                </div>
                {onDismiss && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(flag.id)}
                    className="text-red-flag-foreground hover:bg-red-flag-foreground/20"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
            
            {urgentFlags.map(flag => (
              <div key={flag.id} className="flex items-start justify-between">
                <div>
                  <div className="font-semibold">{flag.trigger}</div>
                  <div className="text-sm opacity-90">{flag.description}</div>
                </div>
                {onDismiss && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(flag.id)}
                    className="text-warning-foreground hover:bg-warning-foreground/20"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </AlertDescription>
        </div>
        
        {hasCritical && (
          <div className="flex flex-col gap-2 ml-4">
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-flag-foreground text-red-flag hover:bg-red-flag-foreground/90"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call emergency services
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-red-flag-foreground text-red-flag hover:bg-red-flag-foreground/90"
            >
              Request urgent referral
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
}
