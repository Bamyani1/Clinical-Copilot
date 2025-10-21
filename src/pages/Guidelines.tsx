import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, Tag, Calendar, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Disclaimer } from "@/components/ui/disclaimer";

// Mock clinical guidelines data
const mockGuidelines = [
  {
    id: "1",
    key: "sore_throat",
    title: "Acute Pharyngitis (Sore Throat) Management",
    category: "Upper Respiratory",
    version: "2.1",
    updatedAt: "2024-01-15",
    summary: "Evidence-based approach to diagnosing and treating acute pharyngitis, including Centor criteria and antibiotic decision-making.",
    content: `# Acute Pharyngitis Management

## Overview
Acute pharyngitis is one of the most common presentations in primary care. Most cases are viral, but identifying bacterial causes (particularly Group A Strep) is important for appropriate treatment.

## Red Flags
- Severe difficulty swallowing with drooling
- Muffled voice or "hot potato" voice
- High fever with toxic appearance
- Respiratory distress
- Unilateral tonsillar swelling

## Centor Criteria
Score 1 point for each:
- Fever (>100.4°F)
- Absence of cough
- Tender anterior cervical lymphadenopathy
- Tonsillar exudate or swelling

**Interpretation:**
- 0-1 points: Viral likely, no testing needed
- 2-3 points: Consider rapid strep test
- 4 points: Strong suspicion for strep, consider empiric treatment

## First-Line Treatment
**Viral (most common):**
- Supportive care
- Pain management with acetaminophen or ibuprofen
- Throat lozenges, warm salt water gargles

**Bacterial (confirmed strep):**
- Penicillin V 500mg PO BID x 10 days
- Alternative: Amoxicillin 875mg PO BID x 10 days
- PCN allergy: Azithromycin 500mg day 1, then 250mg daily x 4 days`
  },
  {
    id: "2",
    key: "uti_dysuria",
    title: "Urinary Tract Infection in Adults",
    category: "Genitourinary",
    version: "1.8",
    updatedAt: "2024-02-01",
    summary: "Diagnosis and treatment of uncomplicated UTI in non-pregnant adults, including antibiotic selection and resistance considerations.",
    content: `# Adult UTI Management

## Clinical Presentation
**Classic symptoms:**
- Dysuria (burning urination)
- Urinary frequency
- Urinary urgency
- Suprapubic pain

## Red Flags
- Fever >100.4°F (suggests pyelonephritis)
- Flank pain
- Nausea/vomiting
- Signs of sepsis

## Diagnostic Approach
**Urinalysis findings suggestive of UTI:**
- Positive leukocyte esterase
- Positive nitrites
- >10 WBC/hpf
- Bacteria present

**Urine culture indicated if:**
- Pregnant
- Male patient
- Recurrent UTI
- Complicated UTI
- Treatment failure

## First-Line Antibiotics (Uncomplicated)
1. **Nitrofurantoin** 100mg PO BID x 5 days
   - Avoid if CrCl <30
2. **Trimethoprim-sulfamethoxazole** 160/800mg PO BID x 3 days
   - Check local resistance rates
3. **Fosfomycin** 3g PO single dose
   - Good option for resistance`
  },
  {
    id: "3",
    key: "headache",
    title: "Primary Headache Evaluation",
    category: "Neurology",
    version: "2.0",
    updatedAt: "2024-01-20",
    summary: "Systematic approach to headache evaluation, red flag identification, and management of primary headache disorders.",
    content: `# Headache Evaluation

## Red Flags (SNOOP)
- **S**ystemic symptoms (fever, weight loss)
- **N**eurologic symptoms or signs
- **O**nset sudden or severe
- **O**lder age (>50) with new headache
- **P**attern change or progression

## Secondary Headache Red Flags
- Thunderclap headache (subarachnoid hemorrhage)
- Headache with fever and neck stiffness (meningitis)
- New headache in patient >50 years
- Headache with focal neurologic deficits
- Headache worse with Valsalva
- Headache with papilledema

## Primary Headache Types
**Tension-type headache:**
- Bilateral, pressing/tightening quality
- Mild to moderate intensity
- Not aggravated by routine activity

**Migraine:**
- Unilateral, pulsating quality
- Moderate to severe intensity
- Aggravated by routine activity
- Associated with nausea/vomiting or photophobia/phonophobia

## Acute Treatment
**Tension-type:**
- Acetaminophen 1000mg or
- Ibuprofen 600mg or
- Naproxen 500mg

**Migraine:**
- NSAIDs (if mild-moderate)
- Triptans (if moderate-severe)
- Avoid opioids`
  }
];

export default function Guidelines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGuideline, setSelectedGuideline] = useState<typeof mockGuidelines[0] | null>(null);

  const categories = Array.from(new Set(mockGuidelines.map(g => g.category)));

  const filteredGuidelines = mockGuidelines.filter(guideline => {
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || guideline.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedGuideline) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="sm" onClick={() => setSelectedGuideline(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to guidelines
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-lg font-bold">{selectedGuideline.title}</h1>
                <p className="text-sm text-muted-foreground">Version {selectedGuideline.version} • Updated {selectedGuideline.updatedAt}</p>
              </div>
            </div>
          </div>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap font-mono text-sm bg-card p-6 rounded-lg border">
              {selectedGuideline.content}
            </div>
          </div>
          <Disclaimer className="mt-8" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Guidelines List */}
        <div className="grid gap-4">
          {filteredGuidelines.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No guidelines found.</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredGuidelines.map((guideline) => (
              <Card
                key={guideline.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedGuideline(guideline)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{guideline.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{guideline.summary}</p>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {guideline.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Updated {guideline.updatedAt}
                    </div>
                    <div>Version {guideline.version}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Disclaimer className="mt-8" />
      </main>
    </div>
  );
}
