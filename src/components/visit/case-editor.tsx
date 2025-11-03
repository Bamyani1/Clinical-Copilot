import { useState, useEffect, useCallback, useRef } from "react";
import { User, Heart, Pill, AlertCircle, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useVisitStore } from "@/lib/store";
import type { CaseData, TranscriptEntry } from "@/lib/types";
import { createInsightEngine, FixtureLoadError, type ScenarioFixtureFallback } from "@/lib/services/mock-insight-engine";
import { cn } from "@/lib/utils";
import type { CaseFixture } from "@/fixtures/types";
import { useTranslation } from "react-i18next";

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
  const { caseData, updateCaseData, transcript, setScenario } = useVisitStore();
  const { t } = useTranslation("visit");
  const [isExtracting, setIsExtracting] = useState(false);
  const [insightEngine] = useState(() => createInsightEngine());
  const lastExtractionCountRef = useRef(0);
  const [fixtureStatus, setFixtureStatus] = useState<{ tone: "warning" | "error"; message: string } | null>(null);

  const removalPillClass =
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  const extractCaseFromTranscript = useCallback(
    async (entries: TranscriptEntry[]) => {
      if (entries.length === 0) {
        return;
      }

      setIsExtracting(true);
      setFixtureStatus(null);
      try {
        const transcriptText = entries.map((entry) => `${entry.speaker}: ${entry.text}`).join("\n");
        const { caseData: currentCase, scenarioId: activeScenario } = useVisitStore.getState();
        const response = await insightEngine.extractCase({
          transcript: transcriptText,
          existingCase: currentCase,
          scenarioId: activeScenario,
        });

        updateCaseData(response.caseData);
        setFixtureStatus(null);
        lastExtractionCountRef.current = entries.length;
      } catch (error) {
        console.error("Failed to extract case data:", error);
        if (error instanceof FixtureLoadError) {
          if (error.fallback) {
            const fallback = error.fallback as ScenarioFixtureFallback<CaseFixture>;
            const currentScenario = useVisitStore.getState().scenarioId;
            if (currentScenario !== fallback.scenarioId) {
              setScenario(fallback.scenarioId);
            }
            updateCaseData(fallback.fixture.caseData);
            setFixtureStatus({
              tone: "warning",
              message: t("caseEditor.status.fallback", { id: error.identifier, fallbackId: fallback.scenarioId }),
            });
          } else {
            setFixtureStatus({
              tone: "error",
              message: t("caseEditor.status.missing"),
            });
          }
          lastExtractionCountRef.current = entries.length;
          return;
        }
        setFixtureStatus({
          tone: "error",
          message: t("caseEditor.status.unexpected"),
        });
        lastExtractionCountRef.current = entries.length;
      } finally {
        setIsExtracting(false);
      }
    },
    [insightEngine, updateCaseData, setScenario, t],
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
    <Card className="flex h-full min-h-0 flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          {t("caseEditor.title")}
          {isExtracting && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 space-y-6 overflow-y-auto">
        {fixtureStatus && (
          <Alert
            variant={fixtureStatus.tone === "error" ? "destructive" : "default"}
            className="border-dashed border-border/60 bg-background/80"
          >
            <AlertCircle className="h-4 w-4" aria-hidden />
            <AlertDescription>{fixtureStatus.message}</AlertDescription>
          </Alert>
        )}
        {/* Demographics */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("caseEditor.sections.demographics")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="age" className="text-xs">{t("caseEditor.fields.age.label")}</Label>
              <Input
                id="age"
                type="number"
                placeholder={t("caseEditor.fields.age.placeholder")}
                value={caseData.demographics?.age ?? ""}
                onChange={(e) => handleDemographicsChange("age", parseOptionalNumber(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="sex" className="text-xs">{t("caseEditor.fields.sex.label")}</Label>
              <Select
                value={caseData.demographics?.sex ?? undefined}
                onValueChange={(value) => handleDemographicsChange("sex", value as Demographics["sex"])}
              >
                <SelectTrigger id="sex" className="h-8 text-sm">
                  <SelectValue placeholder={t("caseEditor.fields.sex.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">{t("caseEditor.fields.sex.options.male")}</SelectItem>
                  <SelectItem value="F">{t("caseEditor.fields.sex.options.female")}</SelectItem>
                  <SelectItem value="Other">{t("caseEditor.fields.sex.options.other")}</SelectItem>
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
            {t("caseEditor.sections.vitals")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="temp" className="text-xs">{t("caseEditor.fields.temperature.label")}</Label>
              <Input
                id="temp"
                type="number"
                step="0.1"
                placeholder={t("caseEditor.fields.temperature.placeholder")}
                value={caseData.vitals?.temp ?? ""}
                onChange={(e) => handleVitalsChange("temp", parseOptionalNumber(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="hr" className="text-xs">{t("caseEditor.fields.heartRate.label")}</Label>
              <Input
                id="hr"
                type="number"
                placeholder={t("caseEditor.fields.heartRate.placeholder")}
                value={caseData.vitals?.hr ?? ""}
                onChange={(e) => handleVitalsChange("hr", parseOptionalNumber(e.target.value))}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="bp" className="text-xs">{t("caseEditor.fields.bloodPressure.label")}</Label>
              <Input
                id="bp"
                placeholder={t("caseEditor.fields.bloodPressure.placeholder")}
                value={caseData.vitals?.bp ?? ""}
                onChange={(e) => handleVitalsChange("bp", e.target.value as Vitals["bp"])}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="spo2" className="text-xs">{t("caseEditor.fields.spo2.label")}</Label>
              <Input
                id="spo2"
                type="number"
                placeholder={t("caseEditor.fields.spo2.placeholder")}
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
            {t("caseEditor.sections.hpi")}
          </h3>
          <div>
            <Label htmlFor="cc" className="text-xs">{t("caseEditor.fields.chiefComplaint.label")}</Label>
            <Input
              id="cc"
              placeholder={t("caseEditor.fields.chiefComplaint.placeholder")}
              value={caseData.hpi?.chiefComplaint ?? ""}
              onChange={(e) => handleHPIChange("chiefComplaint", e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="onset" className="text-xs">{t("caseEditor.fields.onset.label")}</Label>
            <Input
              id="onset"
              type="number"
              placeholder={t("caseEditor.fields.onset.placeholder")}
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
            {t("caseEditor.sections.allergies")}
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
                aria-label={t("caseEditor.fields.removeAllergy", { value: allergy })}
              >
                <span>{allergy}</span>
                <span aria-hidden>✕</span>
              </button>
            ))}
          </div>
          <Input
            placeholder={t("caseEditor.fields.addAllergy")}
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
          <h3 className="font-semibold text-sm">{t("caseEditor.sections.medications")}</h3>
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
                aria-label={t("caseEditor.fields.removeMedication", { value: medication })}
              >
                <span>{medication}</span>
                <span aria-hidden>✕</span>
              </button>
            ))}
          </div>
          <Input
            placeholder={t("caseEditor.fields.addMedication")}
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

      </CardContent>
    </Card>
  );
}
