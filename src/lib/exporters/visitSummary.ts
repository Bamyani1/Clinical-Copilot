import type {
  CaseData,
  Differential,
  MedicationSuggestion,
  RedFlag,
  SoapNoteDraft,
  WorkupSuggestion,
} from "@/lib/types";
import type { TFunction } from "i18next";

type VisitSummaryParams = {
  t: TFunction<"visitComplete">;
  visitId: string | null;
  caseData: CaseData;
  differentials: Differential[];
  workupSuggestions: WorkupSuggestion[];
  medicationSuggestions: MedicationSuggestion[];
  redFlags: RedFlag[];
  soapNote?: SoapNoteDraft;
};

const joinList = (values: string[], fallback: string) => (values.length > 0 ? values.join(", ") : fallback);

const formatPregnancyStatus = (t: TFunction<"visitComplete">, value: boolean | undefined) => {
  if (value === true) return t("stats.pregnancy.yes");
  if (value === false) return t("stats.pregnancy.no");
  return t("stats.pregnancy.unknown");
};

const formatDuration = (t: TFunction<"visitComplete">, days?: number | null) => {
  if (days == null) {
    return t("summary.defaultValues.duration");
  }
  return t("overview.durationValue", { count: days });
};

export const buildVisitSummaryDocument = ({
  t,
  visitId,
  caseData,
  differentials,
  workupSuggestions,
  medicationSuggestions,
  redFlags,
  soapNote,
}: VisitSummaryParams) => {
  const defaults = t("summary.defaultValues", { returnObjects: true }) as Record<string, string>;
  const placeholder = t("summary.none");

  const resolvedVisitId = visitId ?? defaults.visitId;

  const headerLines = [t("summary.downloadTitle"), t("summary.visitId", { id: resolvedVisitId })];

  const demographicLines = [
    "",
    t("summary.sections.demographics"),
    t("summary.fields.age", {
      value: caseData.demographics?.age ?? defaults.age,
    }),
    t("summary.fields.sex", {
      value: caseData.demographics?.sex ?? defaults.sex,
    }),
    t("summary.fields.pregnant", {
      value: formatPregnancyStatus(t, caseData.demographics?.pregnant),
    }),
  ];

  const chiefComplaintLines = [
    "",
    t("summary.sections.chiefComplaint"),
    t("summary.fields.chief", {
      value: caseData.hpi?.chiefComplaint ?? defaults.chiefComplaint,
    }),
    t("summary.fields.duration", {
      value: formatDuration(t, caseData.hpi?.onsetDays ?? null),
    }),
  ];

  const keyFindingsLines = [
    "",
    t("summary.sections.keyFindings"),
    t("summary.fields.allergies", {
      value: joinList(caseData.allergies ?? [], defaults.allergies),
    }),
    t("summary.fields.exam", {
      value: joinList(caseData.exam ?? [], defaults.exam),
    }),
    t("summary.fields.labs", {
      value:
        caseData.labs && Object.keys(caseData.labs).length > 0
          ? Object.entries(caseData.labs)
              .map(([name, value]) => `${name}: ${value}`)
              .join("; ")
          : defaults.labs,
    }),
  ];

  const differentialLines =
    differentials.length > 0
      ? differentials.slice(0, 5).map((item, index) =>
          t("summary.differentialItem", {
            index: index + 1,
            diagnosis: item.diagnosis,
            confidence: Math.round(item.confidence * 100),
          }),
        )
      : [placeholder];

  const workupLines =
    workupSuggestions.length > 0
      ? workupSuggestions.slice(0, 5).map((item, index) =>
          t("summary.workupItem", {
            index: index + 1,
            test: item.test,
            priority: t(`insights.workup.priorities.${item.priority}`),
          }),
        )
      : [placeholder];

  const medicationLines =
    medicationSuggestions.length > 0
      ? medicationSuggestions.slice(0, 5).map((item, index) =>
          t("summary.medicationItem", {
            index: index + 1,
            drug: item.indication ? `${item.drugClass} — ${item.indication}` : item.drugClass,
          }),
        )
      : [placeholder];

  const redFlagLines =
    redFlags.filter((flag) => flag.active).length > 0
      ? redFlags
          .filter((flag) => flag.active)
          .map((flag) => t("summary.redFlagBullet", { description: flag.description }))
      : [placeholder];

  const soapLines: string[] = [];
  if (soapNote) {
    soapLines.push("");
    soapLines.push(t("summary.sections.soapNote"));
    soapLines.push(
      soapNote.subjective ? `${t("summary.soap.subjective")}\n${soapNote.subjective}` : `${t("summary.soap.subjective")} ${t("summary.soap.placeholder")}`,
    );
    soapLines.push("");
    soapLines.push(
      soapNote.objective ? `${t("summary.soap.objective")}\n${soapNote.objective}` : `${t("summary.soap.objective")} ${t("summary.soap.placeholder")}`,
    );
    soapLines.push("");
    soapLines.push(
      soapNote.assessment
        ? `${t("summary.soap.assessment")}\n${soapNote.assessment}`
        : `${t("summary.soap.assessment")} ${t("summary.soap.placeholder")}`,
    );
    soapLines.push("");
    soapLines.push(
      soapNote.plan ? `${t("summary.soap.plan")}\n${soapNote.plan}` : `${t("summary.soap.plan")} ${t("summary.soap.placeholder")}`,
    );
  }

  return [
    ...headerLines,
    ...demographicLines,
    ...chiefComplaintLines,
    ...keyFindingsLines,
    "",
    t("summary.sections.differentials"),
    ...differentialLines,
    "",
    t("summary.sections.workup"),
    ...workupLines,
    "",
    t("summary.sections.medications"),
    ...medicationLines,
    "",
    t("summary.sections.redFlags"),
    ...redFlagLines,
    ...soapLines,
  ].join("\n");
};

export const buildVisitSummaryFilename = (t: TFunction<"visitComplete">, visitId: string | null) => {
  const defaults = t("summary.defaultValues", { returnObjects: true }) as Record<string, string>;
  const resolvedVisitId = visitId ?? defaults.visitId;
  return t("export.filename", { id: resolvedVisitId });
};
