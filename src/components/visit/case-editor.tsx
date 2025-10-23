import { useState, useEffect } from "react";
import { User, Heart, Pill, AlertCircle, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useVisitStore, CaseData } from "@/lib/store";
import { createLLMProvider } from "@/lib/services/mock-llm";
import { useSettingsStore } from "@/lib/store";

export function CaseEditor() {
  const { caseData, updateCaseData, transcript } = useVisitStore();
  const { llmProvider } = useSettingsStore();
  const [isExtracting, setIsExtracting] = useState(false);
  const [llmService] = useState(() => createLLMProvider(llmProvider));

  // Auto-extract case data when transcript updates
  useEffect(() => {
    if (transcript.length > 0 && transcript.length % 3 === 0) { // Extract every 3 new entries
      extractCaseFromTranscript();
    }
  }, [transcript.length]);

  const extractCaseFromTranscript = async () => {
    if (transcript.length === 0) return;
    
    setIsExtracting(true);
    try {
      const transcriptText = transcript.map(entry => `${entry.speaker}: ${entry.text}`).join('\n');
      const response = await llmService.extractCase({
        transcript: transcriptText,
        existingCase: caseData,
      });
      
      updateCaseData(response.caseData);
    } catch (error) {
      console.error('Failed to extract case data:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDemographicsChange = (field: string, value: any) => {
    updateCaseData({
      demographics: { ...caseData.demographics, [field]: value }
    });
  };

  const handleVitalsChange = (field: string, value: any) => {
    updateCaseData({
      vitals: { ...caseData.vitals, [field]: value }
    });
  };

  const handleHPIChange = (field: string, value: any) => {
    updateCaseData({
      hpi: { ...caseData.hpi, [field]: value }
    });
  };

  const addToList = (listName: keyof CaseData, value: string) => {
    if (!value.trim()) return;
    const currentList = caseData[listName] as string[] || [];
    if (!currentList.includes(value.trim())) {
      updateCaseData({
        [listName]: [...currentList, value.trim()]
      });
    }
  };

  const removeFromList = (listName: keyof CaseData, value: string) => {
    const currentList = caseData[listName] as string[] || [];
    updateCaseData({
      [listName]: currentList.filter(item => item !== value)
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
                value={caseData.demographics?.age || ''}
                onChange={(e) => handleDemographicsChange('age', parseInt(e.target.value) || undefined)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="sex" className="text-xs">Sex</Label>
              <Select
                value={caseData.demographics?.sex || ''}
                onValueChange={(value) => handleDemographicsChange('sex', value)}
              >
                <SelectTrigger className="h-8 text-sm">
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
          
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pregnant"
                checked={caseData.demographics?.pregnant || false}
                onCheckedChange={(checked) => handleDemographicsChange('pregnant', checked)}
              />
              <Label htmlFor="pregnant" className="text-xs">Pregnant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lactating"
                checked={caseData.demographics?.lactating || false}
                onCheckedChange={(checked) => handleDemographicsChange('lactating', checked)}
              />
              <Label htmlFor="lactating" className="text-xs">Lactating</Label>
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
                value={caseData.vitals?.temp || ''}
                onChange={(e) => handleVitalsChange('temp', parseFloat(e.target.value) || undefined)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="hr" className="text-xs">Heart Rate</Label>
              <Input
                id="hr"
                type="number"
                placeholder="BPM"
                value={caseData.vitals?.hr || ''}
                onChange={(e) => handleVitalsChange('hr', parseInt(e.target.value) || undefined)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="bp" className="text-xs">Blood Pressure</Label>
              <Input
                id="bp"
                placeholder="120/80"
                value={caseData.vitals?.bp || ''}
                onChange={(e) => handleVitalsChange('bp', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="spo2" className="text-xs">SpO2 (%)</Label>
              <Input
                id="spo2"
                type="number"
                placeholder="98"
                value={caseData.vitals?.spo2 || ''}
                onChange={(e) => handleVitalsChange('spo2', parseInt(e.target.value) || undefined)}
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
              value={caseData.hpi?.chiefComplaint || ''}
              onChange={(e) => handleHPIChange('chiefComplaint', e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="onset" className="text-xs">Onset (days)</Label>
            <Input
              id="onset"
              type="number"
              placeholder="Days"
              value={caseData.hpi?.onsetDays || ''}
              onChange={(e) => handleHPIChange('onsetDays', parseInt(e.target.value) || undefined)}
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
            {(caseData.allergies || []).map((allergy, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeFromList('allergies', allergy)}
              >
                {allergy} ✕
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add allergy (press Enter)"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addToList('allergies', e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        <Separator />

        {/* Current Medications */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Current Medications</h3>
          <div className="flex flex-wrap gap-1">
            {(caseData.medications || []).map((med, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeFromList('medications', med)}
              >
                {med} ✕
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add medication (press Enter)"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addToList('medications', e.currentTarget.value);
                e.currentTarget.value = '';
              }
            }}
          />
        </div>

        {/* Quick Extract Button */}
        <Button
          onClick={extractCaseFromTranscript}
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
