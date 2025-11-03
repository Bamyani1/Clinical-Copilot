import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SCENARIO_IDS, type CaseData } from "@/lib/types";
import { createInsightEngine } from "@/lib/services/mock-insight-engine";
import { ensureI18n } from "@/lib/i18n";
import { useVisitStore } from "@/lib/store";

const Index = lazy(() => import("./pages/Index"));
const Consent = lazy(() => import("./pages/Consent"));
const Visit = lazy(() => import("./pages/Visit"));
const VisitComplete = lazy(() => import("./pages/VisitComplete"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const locale = useVisitStore((state) => state.locale);
  ensureI18n(locale);

  useEffect(() => {
    const engine = createInsightEngine();
    const preload = async () => {
      try {
        await Promise.all(
          SCENARIO_IDS.map((scenarioId) =>
            Promise.all([
              engine.extractCase({
                transcript: "",
                scenarioId,
                existingCase: undefined,
              }),
              engine.generateReasoning({
                caseData: {} as CaseData,
                scenarioId,
                guidelines: [],
              }),
            ]),
          ),
        );
      } catch (error) {
        console.warn("Scenario preload skipped:", error);
      }
    };

    void preload();
  }, []);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Suspense fallback={<div className="p-6 text-center text-muted-foreground">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/consent" element={<Consent />} />
              <Route path="/visit/:id" element={<Visit />} />
              <Route path="/visit/complete" element={<VisitComplete />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
