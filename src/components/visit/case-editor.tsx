import { useState, useEffect, useCallback, useRef } from "react";
import { User, Heart, Pill, AlertCircle, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useVisitStore } from "@/lib/store";
import type { CaseData, TranscriptEntry } from "@/lib/types";
import { createReasoner } from "@/lib/services/mock-reasoner";
import { cn } from "@/lib/utils";

const parseOptionalNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

type Demographics = NonNullable<CaseData["demographics"]>;
type Vitals = NonNullable<CaseData["vitals"]>;
type HistoryOfPresentIllness = NonNullable<CaseData["hpi"]>;
type CaseListKey = {
  [Key in keyof CaseData]: CaseData[Key] extends string[] | undefined ? Key : never;
}[keyof CaseData];

export function CaseEditor() {
  const { caseData, updateCaseData, transcript } = useVisitStore();
  const [isExtracting, setIsExtracting] = useState(false);
  const [reasoner] = useState(() => createReasoner());
  const lastExtractionCountRef = useRef(0);

  const removalPillClass =
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const extractCaseFromTranscript = useCallback(
    async (entries: TranscriptEntry[]) => {
      if (entries.length === 0) {
        return;
      }

      setIsExtracting(true);
      try {
        const transcriptText = entries.map((entry) => `${entry.speaker}: ${entry.text}`).join("\n");
        const { caseData: currentCase, scenarioId: activeScenario } = useVisitStore.getState();
        const response = await reasoner.extractCase({
          transcript: transcriptText,
          existingCase: currentCase,
          scenarioId: activeScenario,
        });

        updateCaseData(response.caseData);
        lastExtractionCountRef.current = entries.length;
      } catch (error) {
        console.error("Failed to extract case data:", error);
      } finally {
        setIsExtracting(false);
      }
    },
    [reasoner, updateCaseData],
  );

  useEffect(() => {
    if (transcript.length === 0) {
      lastExtractionCountRef.current = 0;
      return;
    }
    if (transcript.length === lastExtractionCountRef.current) {
      return;
    }
    void extractCaseFromTranscript(transcript);
  }, [transcript, extractCaseFromTranscript]);

  const handleDemographicsChange = useCallback(
    <Field extends keyof Demographics>(field: Field, value: Demographics[Field]) => {
      updateCaseData({
        demographics: { ...(caseData.demographics ?? {}), [field]: value },
      });
    },
    [caseData.demographics, updateCaseData],
  );

  const handleVitalsChange = useCallback(
    <Field extends keyof Vitals>(field: Field, value: Vitals[Field]) => {
      updateCaseData({
        vitals: { ...(caseData.vitals ?? {}), [field]: value },
      });
    },
    [caseData.vitals, updateCaseData],
  );

  const handleHPIChange = useCallback(
    <Field extends keyof HistoryOfPresentIllness>(field: Field, value: HistoryOfPresentIllness[Field]) => {
      updateCaseData({
        hpi: { ...(caseData.hpi ?? {}), [field]: value },
      });
    },
    [caseData.hpi, updateCaseData],
  );

  const updateList = useCallback(
    <Key extends CaseListKey>(listName: Key, mutator: (current: string[]) => string[]) => {
      const current = (caseData[listName] ?? []) as string[];
      const next = mutator(current);
      updateCaseData({ [listName]: next } as Pick<CaseData, Key>);
    },
    [caseData, updateCaseData],
  );

  const addToList = useCallback(
    (listName: CaseListKey, value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      updateList(listName, (current) => (current.includes(trimmed) ? current : [...current, trimmed]));
    },
    [updateList],
  );

  const removeFromList = useCallback(
    (listName: CaseListKey, value: string) => {
      updateList(listName, (current) => current.filter((item) => item !== value));
    },
    [updateList],
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          Clinical Case Data
          {isExtracting && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Demographics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            Demographics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="age" className="text-xs">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Years"
                value={caseData.demographics?.age ?? ""}
                onChange={(e) => handleDemographicsChange("age", parseOptionalNumber(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="sex" className="text-xs">Sex</Label>
              <Select
                value={caseData.demographics?.sex ?? undefined}
                onValueChange={(value) => handleDemographicsChange("sex", value as Demographics["sex"])}
              >
                <SelectTrigger id="sex" className="h-8 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
        </div>

        <Separator />

        {/* Vital Signs */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Vital Signs
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="temp" className="text-xs">Temperature (°F)</Label>
              <Input
                id="temp"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={caseData.vitals?.temp ?? ""}
                onChange={(e) => handleVitalsChange("temp", parseOptionalNumber(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="hr" className="text-xs">Heart Rate</Label>
              <Input
                id="hr"
                type="number"
                placeholder="BPM"
                value={caseData.vitals?.hr ?? ""}
                onChange={(e) => handleVitalsChange("hr", parseOptionalNumber(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="bp" className="text-xs">Blood Pressure</Label>
              <Input
                id="bp"
                placeholder="120/80"
                value={caseData.vitals?.bp ?? ""}
                onChange={(e) => handleVitalsChange("bp", e.target.value as Vitals["bp"])}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="spo2" className="text-xs">SpO2 (%)</Label>
              <Input
                id="spo2"
                type="number"
                placeholder="98"
                value={caseData.vitals?.spo2 ?? ""}
                onChange={(e) => handleVitalsChange("spo2", parseOptionalNumber(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Chief Complaint & HPI */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            History of Present Illness
          </h3>
          <div>
            <Label htmlFor="cc" className="text-xs">Chief Complaint</Label>
          <Input
            id="cc"
            placeholder="Primary concern"
            value={caseData.hpi?.chiefComplaint ?? ""}
            onChange={(e) => handleHPIChange("chiefComplaint", e.target.value)}
            className="h-8 text-sm"
          />
          </div>
          <div>
            <Label htmlFor="onset" className="text-xs">Onset (days)</Label>
            <Input
              id="onset"
              type="number"
              placeholder="Days"
              value={caseData.hpi?.onsetDays ?? ""}
              onChange={(e) => handleHPIChange("onsetDays", parseOptionalNumber(e.target.value) as HistoryOfPresentIllness["onsetDays"])}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <Separator />

        {/* Allergies */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Allergies
          </h3>
          <div className="flex flex-wrap gap-1">
            {(caseData.allergies ?? []).map((allergy) => (
              <button
                key={allergy}
                type="button"
                onClick={() => removeFromList("allergies", allergy)}
                className={cn(
                  removalPillClass,
                  "border-transparent bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground",
                )}
                aria-label={`Remove allergy ${allergy}`}
              >
                <span>{allergy}</span>
                <span aria-hidden>✕</span>
              </button>
            ))}
          </div>
          <Input
            placeholder="Add allergy (press Enter)"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const { value } = e.currentTarget;
                addToList("allergies", value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>

        <Separator />

        {/* Current Medications */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Current Medications</h3>
          <div className="flex flex-wrap gap-1">
            {(caseData.medications ?? []).map((medication) => (
              <button
                key={medication}
                type="button"
                onClick={() => removeFromList("medications", medication)}
                className={cn(
                  removalPillClass,
                  "border-border/60 bg-background/80 text-foreground/80 hover:bg-destructive hover:text-destructive-foreground",
                )}
                aria-label={`Remove medication ${medication}`}
              >
                <span>{medication}</span>
                <span aria-hidden>✕</span>
              </button>
            ))}
          </div>
          <Input
            placeholder="Add medication (press Enter)"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const { value } = e.currentTarget;
                addToList("medications", value);
                e.currentTarget.value = "";
              }
            }}
          />
        </div>

        {/* Quick Extract Button */}
        <Button
          onClick={() => void extractCaseFromTranscript(transcript)}
          disabled={isExtracting || transcript.length === 0}
          variant="outline"
          size="sm"
          className="w-full"
        >
          {isExtracting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Extracting case data...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Extract from transcript
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
