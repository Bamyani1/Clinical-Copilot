import { useState, useEffect } from "react";
import { Brain, TestTube, Pill, AlertTriangle, RefreshCw, CheckCircle2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVisitStore } from "@/lib/store";
import { createLLMProvider } from "@/lib/services/mock-llm";
import { useSettingsStore } from "@/lib/store";

export function SuggestionPanel() {
  const {
    caseData,
    differentials,
    workupSuggestions,
    medicationSuggestions,
    redFlags,
    setDifferentials,
    setWorkupSuggestions,
    setMedicationSuggestions,
    setRedFlags,
  } = useVisitStore();
  
  const { llmProvider } = useSettingsStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [llmService] = useState(() => createLLMProvider(llmProvider));
  const [acceptedItems, setAcceptedItems] = useState<{
    differentials: string[];
    workup: string[];
    medications: string[];
  }>({
    differentials: [],
    workup: [],
    medications: [],
  });

  // Auto-generate suggestions when case data changes significantly
  useEffect(() => {
    if (caseData.hpi?.chiefComplaint && Object.keys(caseData).length > 2) {
      generateSuggestions();
    }
  }, [caseData.hpi?.chiefComplaint, caseData.demographics?.age]);

  const generateSuggestions = async () => {
    if (!caseData.hpi?.chiefComplaint) return;
    
    setIsGenerating(true);
    try {
      const response = await llmService.generateReasoning({
        caseData,
        guidelines: [], // In real app, would fetch relevant guidelines
      });
      
      setDifferentials(response.differentials.map((diff, index) => ({
        id: `diff_${index}`,
        diagnosis: diff.diagnosis,
        confidence: diff.confidence,
        rationale: diff.rationale,
        guidelines: diff.guidelines,
      })));
      
      setWorkupSuggestions(response.workup.map((work, index) => ({
        id: `workup_${index}`,
        test: work.test,
        category: work.category,
        indication: work.indication,
        priority: work.priority,
        guidelines: work.guidelines,
      })));
      
      setMedicationSuggestions(response.medications.map((med, index) => ({
        id: `med_${index}`,
        drugClass: med.drugClass,
        indication: med.indication,
        contraindications: med.contraindications,
        requiresConfirmation: med.requiresConfirmation,
        guidelines: med.guidelines,
      })));
      
      setRedFlags(response.redFlags.map((flag, index) => ({
        id: `flag_${index}`,
        trigger: flag.trigger,
        description: flag.description,
        severity: flag.severity,
        active: flag.active,
      })));
      
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAcceptance = (category: keyof typeof acceptedItems, id: string) => {
    setAcceptedItems(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(item => item !== id)
        : [...prev[category], id]
    }));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-confidence-high border-confidence-high';
    if (confidence >= 0.4) return 'text-confidence-medium border-confidence-medium';
    return 'text-confidence-low border-confidence-low';
  };

  const getPriorityColor = (priority: 'urgent' | 'routine') => {
    return priority === 'urgent' ? 'text-red-flag' : 'text-muted-foreground';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Suggestions
          </div>
          <Button
            onClick={generateSuggestions}
            disabled={isGenerating || !caseData.hpi?.chiefComplaint}
            size="sm"
            variant="outline"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {!caseData.hpi?.chiefComplaint ? (
          <div className="flex items-center justify-center h-full text-center text-muted-foreground">
            <div>
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Add a chief complaint to generate suggestions.</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="differentials" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="differentials" className="text-xs">
                Differential
                {differentials.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {differentials.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="workup" className="text-xs">
                Workup
                {workupSuggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {workupSuggestions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="medications" className="text-xs">
                Meds
                {medicationSuggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {medicationSuggestions.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="differentials" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {differentials.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <AlertTriangle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No differential diagnoses yet.</p>
                    </div>
                  ) : (
                    differentials.map((diff) => (
                      <Card key={diff.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{diff.diagnosis}</h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getConfidenceColor(diff.confidence)}`}
                              >
                                {Math.round(diff.confidence * 100)}%
                              </Badge>
                              <Button
                                size="sm"
                                variant={acceptedItems.differentials.includes(diff.id) ? "default" : "outline"}
                                onClick={() => toggleAcceptance('differentials', diff.id)}
                              >
                                {acceptedItems.differentials.includes(diff.id) ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <Progress value={diff.confidence * 100} className="mb-2 h-1" />
                          <p className="text-xs text-muted-foreground">{diff.rationale}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="workup" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {workupSuggestions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <TestTube className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No workup suggestions yet.</p>
                    </div>
                  ) : (
                    workupSuggestions.map((workup) => (
                      <Card key={workup.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{workup.test}</h4>
                              <Badge
                                variant="outline"
                                className={`text-xs mt-1 ${getPriorityColor(workup.priority)}`}
                              >
                                {workup.priority} • {workup.category}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant={acceptedItems.workup.includes(workup.id) ? "default" : "outline"}
                              onClick={() => toggleAcceptance('workup', workup.id)}
                            >
                              {acceptedItems.workup.includes(workup.id) ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">{workup.indication}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="medications" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-3">
                  {medicationSuggestions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Pill className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No medication suggestions yet.</p>
                    </div>
                  ) : (
                    medicationSuggestions.map((med) => (
                      <Card key={med.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{med.drugClass}</h4>
                              {med.requiresConfirmation && (
                                <Badge variant="outline" className="text-xs mt-1 text-warning">
                                  Requires confirmation
                                </Badge>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant={acceptedItems.medications.includes(med.id) ? "default" : "outline"}
                              onClick={() => toggleAcceptance('medications', med.id)}
                              disabled={med.requiresConfirmation && !caseData.demographics?.age}
                            >
                              {acceptedItems.medications.includes(med.id) ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{med.indication}</p>
                          {med.contraindications && med.contraindications.length > 0 && (
                            <Alert className="mt-2">
                              <AlertTriangle className="h-3 w-3" />
                              <AlertDescription className="text-xs">
                                Contraindications: {med.contraindications.join(', ')}
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
