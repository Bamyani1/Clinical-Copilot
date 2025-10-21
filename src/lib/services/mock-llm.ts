// Mock LLM provider for development and testing
import {
  LLMProvider,
  CaseExtractionRequest,
  CaseExtractionResponse,
  ReasoningRequest,
  ReasoningResponse,
  SafetyCheckRequest,
  SafetyCheckResponse,
  NoteGenerationRequest,
  NoteGenerationResponse,
} from '../types';

export class MockLLMProvider implements LLMProvider {
  name = 'mock';

  async extractCase(request: CaseExtractionRequest): Promise<CaseExtractionResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Extract key information from transcript using simple pattern matching
    const transcript = request.transcript.toLowerCase();
    
    const caseData: any = {
      demographics: {},
      vitals: {},
      allergies: [],
      medications: [],
      hpi: {},
      ros: [],
      exam: [],
    };

    // Extract age
    const ageMatch = transcript.match(/(\d+)\s*years?\s*old|age\s*(\d+)/);
    if (ageMatch) {
      caseData.demographics.age = parseInt(ageMatch[1] || ageMatch[2]);
    }

    // Extract chief complaint
    if (transcript.includes('sore throat')) {
      caseData.hpi.chiefComplaint = 'sore throat';
    } else if (transcript.includes('headache')) {
      caseData.hpi.chiefComplaint = 'headache';
    } else if (transcript.includes('burning') && transcript.includes('urinate')) {
      caseData.hpi.chiefComplaint = 'dysuria';
    }

    // Extract duration
    const durationMatch = transcript.match(/(\d+)\s*days?/);
    if (durationMatch) {
      caseData.hpi.onsetDays = parseInt(durationMatch[1]);
    }

    // Extract fever
    const feverMatch = transcript.match(/fever|temperature.*?(\d+\.?\d*)/);
    if (feverMatch) {
      caseData.hpi.features = [...(caseData.hpi.features || []), 'fever'];
      if (feverMatch[1]) {
        caseData.vitals.temp = parseFloat(feverMatch[1]);
      }
    }

    // Extract allergies
    if (transcript.includes('no allergies')) {
      caseData.allergies = ['NKDA'];
    } else if (transcript.includes('penicillin')) {
      caseData.allergies = ['penicillin'];
    }

    // Extract symptoms for ROS
    if (transcript.includes('no cough')) {
      caseData.ros.push('no cough');
    }
    if (transcript.includes('stuffy') || transcript.includes('congestion')) {
      caseData.ros.push('nasal congestion');
    }
    if (transcript.includes('swollen') && transcript.includes('neck')) {
      caseData.exam.push('lymphadenopathy');
    }

    return {
      caseData,
      confidence: 0.85,
    };
  }

  async generateReasoning(request: ReasoningRequest): Promise<ReasoningResponse> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { caseData } = request;
    const chiefComplaint = caseData.hpi?.chiefComplaint;

    let response: ReasoningResponse = {
      differentials: [],
      workup: [],
      medications: [],
      redFlags: [],
    };

    // Generate reasoning based on chief complaint
    if (chiefComplaint === 'sore throat') {
      response = this.generateSoreThroatReasoning(caseData);
    } else if (chiefComplaint === 'headache') {
      response = this.generateHeadacheReasoning(caseData);
    } else if (chiefComplaint === 'dysuria') {
      response = this.generateUTIReasoning(caseData);
    } else {
      // Generic response
      response.differentials = [
        {
          diagnosis: 'Viral upper respiratory infection',
          confidence: 0.6,
          rationale: 'Common presentation in primary care setting.',
          guidelines: ['uri_cough'],
        },
      ];
    }

    return response;
  }

  private generateSoreThroatReasoning(caseData: any): ReasoningResponse {
    const hasExudate = caseData.exam?.includes('exudate');
    const hasLymphadenopathy = caseData.exam?.includes('lymphadenopathy');
    const hasFever = caseData.hpi?.features?.includes('fever') || caseData.vitals?.temp > 100.4;
    const noCough = caseData.ros?.includes('no cough');

    // Calculate Centor criteria
    const centorScore = [hasFever, noCough, hasLymphadenopathy, hasExudate].filter(Boolean).length;

    const differentials = [
      {
        diagnosis: 'Viral pharyngitis',
        confidence: centorScore <= 1 ? 0.8 : 0.4,
        rationale: `Most common cause of sore throat. Centor score: ${centorScore}/4. Lower scores favor viral etiology.`,
        guidelines: ['sore_throat'],
      },
      {
        diagnosis: 'Bacterial pharyngitis (Group A Strep)',
        confidence: centorScore >= 3 ? 0.7 : 0.3,
        rationale: `Centor score: ${centorScore}/4. Higher scores increase likelihood of bacterial infection.`,
        guidelines: ['sore_throat'],
      },
    ];

    if (centorScore >= 2) {
      differentials.push({
        diagnosis: 'Infectious mononucleosis',
        confidence: 0.2,
        rationale: 'Consider in young adults with prolonged symptoms and lymphadenopathy.',
        guidelines: ['sore_throat'],
      });
    }

    const workup = [];
    if (centorScore >= 2) {
      workup.push({
        test: 'Rapid strep test',
        category: 'lab' as const,
        indication: `Centor score ${centorScore} indicates intermediate probability of strep`,
        priority: 'routine' as const,
        guidelines: ['sore_throat'],
      });
    }

    const medications = [];
    if (centorScore >= 3) {
      medications.push({
        drugClass: 'Penicillin or Amoxicillin',
        indication: 'First-line antibiotic for Group A Strep pharyngitis',
        contraindications: ['Penicillin allergy'],
        requiresConfirmation: true,
        guidelines: ['sore_throat'],
      });
    }

    return {
      differentials,
      workup,
      medications,
      redFlags: [],
    };
  }

  private generateHeadacheReasoning(caseData: any): ReasoningResponse {
    const suddenOnset = caseData.hpi?.features?.includes('sudden onset');
    const worstHeadache = caseData.hpi?.features?.includes('worst headache ever');
    const hasVomiting = caseData.ros?.includes('vomiting');
    const visionChanges = caseData.ros?.includes('vision changes');

    const redFlags = [];
    if (suddenOnset || worstHeadache) {
      redFlags.push({
        trigger: 'thunderclap_headache',
        description: 'Sudden onset severe headache requires immediate evaluation for subarachnoid hemorrhage',
        severity: 'critical' as const,
        active: true,
      });
    }

    const differentials = [
      {
        diagnosis: 'Tension-type headache',
        confidence: redFlags.length === 0 ? 0.7 : 0.2,
        rationale: 'Most common primary headache disorder',
        guidelines: ['headache'],
      },
      {
        diagnosis: 'Migraine',
        confidence: hasVomiting ? 0.6 : 0.3,
        rationale: 'Associated nausea/vomiting supports migraine diagnosis',
        guidelines: ['headache'],
      },
    ];

    if (redFlags.length > 0) {
      differentials.unshift({
        diagnosis: 'Secondary headache (concerning)',
        confidence: 0.8,
        rationale: 'Red flag features require urgent evaluation',
        guidelines: ['headache'],
      });
    }

    const workup = redFlags.length > 0 ? [
      {
        test: 'Urgent neurology consultation',
        category: 'referral' as const,
        indication: 'Red flag headache requires immediate specialist evaluation',
        priority: 'urgent' as const,
        guidelines: ['headache'],
      },
      {
        test: 'Head CT or MRI',
        category: 'imaging' as const,
        indication: 'Rule out intracranial pathology',
        priority: 'urgent' as const,
        guidelines: ['headache'],
      },
    ] : [];

    return {
      differentials,
      workup,
      medications: [],
      redFlags,
    };
  }

  private generateUTIReasoning(caseData: any): ReasoningResponse {
    const differentials = [
      {
        diagnosis: 'Uncomplicated urinary tract infection',
        confidence: 0.8,
        rationale: 'Classic symptoms of dysuria and urinary frequency in otherwise healthy patient',
        guidelines: ['uti_dysuria'],
      },
      {
        diagnosis: 'Urethritis',
        confidence: 0.3,
        rationale: 'Consider sexually transmitted causes in sexually active patients',
        guidelines: ['uti_dysuria'],
      },
    ];

    const workup = [
      {
        test: 'Urinalysis',
        category: 'lab' as const,
        indication: 'Confirm UTI diagnosis',
        priority: 'routine' as const,
        guidelines: ['uti_dysuria'],
      },
      {
        test: 'Urine culture',
        category: 'lab' as const,
        indication: 'Identify organism and sensitivities',
        priority: 'routine' as const,
        guidelines: ['uti_dysuria'],
      },
    ];

    const medications = [
      {
        drugClass: 'Nitrofurantoin',
        indication: 'First-line antibiotic for uncomplicated UTI',
        contraindications: ['Renal insufficiency', 'G6PD deficiency'],
        requiresConfirmation: true,
        guidelines: ['uti_dysuria'],
      },
      {
        drugClass: 'Trimethoprim-sulfamethoxazole',
        indication: 'Alternative first-line antibiotic for UTI',
        contraindications: ['Sulfa allergy', 'High local resistance'],
        requiresConfirmation: true,
        guidelines: ['uti_dysuria'],
      },
    ];

    return {
      differentials,
      workup,
      medications,
      redFlags: [],
    };
  }

  async checkSafety(request: SafetyCheckRequest): Promise<SafetyCheckResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const { caseData, medicationClass } = request;
    const age = caseData.demographics?.age;
    const allergies = caseData.allergies || [];
    const pregnant = caseData.demographics?.pregnant;
    const lactating = caseData.demographics?.lactating;

    const contraindications: string[] = [];
    const requiredConfirmations: string[] = [];
    const warnings: string[] = [];

    // Check age-related contraindications
    if (age && age < 18 && medicationClass.toLowerCase().includes('quinolone')) {
      contraindications.push('Age < 18 years (quinolone contraindicated)');
    }

    // Check allergy contraindications
    if (allergies.includes('penicillin') && medicationClass.toLowerCase().includes('penicillin')) {
      contraindications.push('Penicillin allergy');
    }

    if (allergies.includes('sulfa') && medicationClass.toLowerCase().includes('sulfamethoxazole')) {
      contraindications.push('Sulfa allergy');
    }

    // Pregnancy/lactation checks
    if (pregnant) {
      if (medicationClass.toLowerCase().includes('nitrofurantoin')) {
        warnings.push('Avoid nitrofurantoin in late pregnancy');
      }
      requiredConfirmations.push('Pregnancy status confirmed');
    }

    if (lactating) {
      requiredConfirmations.push('Lactation status confirmed');
    }

    // Renal function checks
    if (!caseData.labs?.creatinine) {
      requiredConfirmations.push('Renal function assessment');
    }

    return {
      safe: contraindications.length === 0,
      contraindications,
      requiredConfirmations,
      warnings,
    };
  }

  async generateNote(request: NoteGenerationRequest): Promise<NoteGenerationResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { caseData, acceptedSuggestions } = request;

    const subjective = this.generateSubjective(caseData);
    const objective = this.generateObjective(caseData);
    const assessment = this.generateAssessment(caseData, acceptedSuggestions.differentials);
    const plan = this.generatePlan(acceptedSuggestions);

    const soapNote = {
      subjective,
      objective,
      assessment,
      plan,
    };

    const patientSummary = this.generatePatientSummary(caseData, acceptedSuggestions);

    return {
      soapNote,
      patientSummary,
    };
  }

  private generateSubjective(caseData: any): string {
    const age = caseData.demographics?.age;
    const sex = caseData.demographics?.sex;
    const cc = caseData.hpi?.chiefComplaint;
    const duration = caseData.hpi?.onsetDays;
    const features = caseData.hpi?.features || [];
    const ros = caseData.ros || [];

    let subjective = '';
    
    if (age && sex) {
      subjective += `${age}-year-old ${sex === 'M' ? 'male' : 'female'} presents with `;
    } else {
      subjective += 'Patient presents with ';
    }

    if (cc && duration) {
      subjective += `${cc} for ${duration} day${duration > 1 ? 's' : ''}. `;
    } else if (cc) {
      subjective += `${cc}. `;
    }

    if (features.length > 0) {
      subjective += `Associated symptoms include ${features.join(', ')}. `;
    }

    if (ros.length > 0) {
      subjective += `Review of systems notable for ${ros.join(', ')}. `;
    }

    const allergies = caseData.allergies || [];
    if (allergies.length > 0) {
      subjective += `Allergies: ${allergies.join(', ')}. `;
    }

    return subjective.trim();
  }

  private generateObjective(caseData: any): string {
    let objective = '';

    const vitals = caseData.vitals || {};
    if (Object.keys(vitals).length > 0) {
      objective += 'Vital signs: ';
      if (vitals.temp) objective += `T ${vitals.temp}°F `;
      if (vitals.hr) objective += `HR ${vitals.hr} `;
      if (vitals.bp) objective += `BP ${vitals.bp} `;
      if (vitals.rr) objective += `RR ${vitals.rr} `;
      if (vitals.spo2) objective += `SpO2 ${vitals.spo2}% `;
      objective += '\n\n';
    }

    const exam = caseData.exam || [];
    if (exam.length > 0) {
      objective += `Physical examination: ${exam.join(', ')}. `;
    }

    return objective.trim();
  }

  private generateAssessment(caseData: any, acceptedDifferentials: string[]): string {
    const age = caseData.demographics?.age;
    const sex = caseData.demographics?.sex;

    let assessment = '';
    
    if (age && sex) {
      assessment += `${age}-year-old ${sex === 'M' ? 'male' : 'female'} with `;
    } else {
      assessment += 'Patient with ';
    }

    if (acceptedDifferentials.length > 0) {
      assessment += acceptedDifferentials.join(', consideration of ') + '.';
    } else {
      assessment += 'presenting symptoms as described.';
    }

    return assessment;
  }

  private generatePlan(acceptedSuggestions: any): string {
    let plan = '';

    if (acceptedSuggestions.workup?.length > 0) {
      plan += 'Diagnostic workup:\n';
      acceptedSuggestions.workup.forEach((test: string, index: number) => {
        plan += `${index + 1}. ${test}\n`;
      });
      plan += '\n';
    }

    if (acceptedSuggestions.medications?.length > 0) {
      plan += 'Medications:\n';
      acceptedSuggestions.medications.forEach((med: string, index: number) => {
        plan += `${index + 1}. ${med} (specific dosing per clinical guidelines)\n`;
      });
      plan += '\n';
    }

    plan += 'Follow-up: Return if symptoms worsen or persist beyond expected timeframe.\n';
    plan += 'Patient counseled on condition and treatment plan.';

    return plan.trim();
  }

  private generatePatientSummary(caseData: any, acceptedSuggestions: any): string {
    const cc = caseData.hpi?.chiefComplaint || 'your symptoms';
    
    let summary = `You came in today because of ${cc}. `;
    
    if (acceptedSuggestions.differentials?.length > 0) {
      const primaryDx = acceptedSuggestions.differentials[0];
      summary += `Based on your symptoms and examination, this appears to be ${primaryDx}. `;
    }

    if (acceptedSuggestions.medications?.length > 0) {
      summary += `We are prescribing medication to help treat this condition. `;
      summary += `Please take your medication exactly as directed. `;
    }

    if (acceptedSuggestions.workup?.length > 0) {
      summary += `We have ordered some tests to help confirm the diagnosis. `;
    }

    summary += `Please return to the clinic if your symptoms get worse or if you develop new concerning symptoms. `;
    summary += `If you have any questions about your treatment, please call our office.`;

    return summary;
  }
}

// Factory function to create LLM provider based on settings
export function createLLMProvider(provider: string): LLMProvider {
  switch (provider) {
    case 'mock':
      return new MockLLMProvider();
    // Add other providers here when implemented
    default:
      return new MockLLMProvider();
  }
}