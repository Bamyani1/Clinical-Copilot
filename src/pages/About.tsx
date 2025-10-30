import { Cpu, Handshake, ShieldCheck } from "lucide-react";

const operatingPrinciples = [
  {
    title: "Physician-centered design",
    icon: ShieldCheck,
    points: [
      "Every AI recommendation requires explicit physician review and approval before implementation.",
      "Critical alerts and red-flag warnings are surfaced immediately for clinician assessment.",
      "Complete audit trails ensure full accountability and transparency in clinical decision-making.",
    ],
  },
  {
    title: "Evidence-based intelligence",
    icon: Cpu,
    points: [
      "Differential diagnoses are generated using clinical guidelines and evidence-based protocols.",
      "Treatment recommendations are aligned with current best practices and medical standards.",
      "Continuous learning from clinical outcomes improves diagnostic accuracy over time.",
    ],
  },
  {
    title: "Patient privacy first",
    icon: Handshake,
    points: [
      "Informed consent is required before any AI assistance begins in the clinical workflow.",
      "Patients maintain full control over their data with the ability to opt out at any time.",
      "All patient information is protected with enterprise-grade security and HIPAA compliance.",
    ],
  },
];

const workflowSteps = [
  { title: "Patient Consent", detail: "Secure informed consent process ensures both patient and physician understand and agree to AI-assisted care documentation." },
  { title: "Ambient Capture", detail: "Voice recognition captures the natural patient-physician conversation along with vital signs and examination findings in real-time." },
  { title: "AI Analysis", detail: "Advanced algorithms analyze clinical data to generate differential diagnoses, identify diagnostic gaps, and recommend evidence-based workups." },
  { title: "Clinical Review", detail: "Physicians review AI-generated insights including safety alerts, diagnostic recommendations, and treatment options with full clinical context." },
  { title: "Documentation", detail: "System generates comprehensive clinical notes ready for EHR integration, requiring only physician review and electronic signature." },
];

const About = () => {
  return (
    <div className="flex w-full flex-col gap-24 sm:gap-28">
      {/* Hero */}
      <section className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/45 bg-surface px-8 py-24 shadow-lg shadow-primary/8 transition-all duration-500 hover:border-primary-muted/60 hover:shadow-xl hover:shadow-primary/12 sm:px-12 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" aria-hidden />
        </div>
        
        <div className="relative flex max-w-3xl flex-col gap-8 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/75">Clinical Copilot</p>
          <h1 className="text-[2.75rem] font-semibold leading-[1.05] text-foreground sm:text-[3.4rem]">
            Intelligent clinical assistant for primary care physicians.
          </h1>
          <div className="max-w-[62ch] border-l border-primary-muted/60 pl-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Clinical Copilot combines ambient voice capture with advanced AI to support clinical decision-making in real-time.
            Our platform generates differential diagnoses, recommends appropriate workups, and suggests evidence-based treatments—all
            while maintaining complete physician oversight and ensuring patient privacy throughout the care journey.
          </div>
        </div>
      </section>

      {/* Operating principles */}
      <section className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-to-br from-surface via-surface to-primary-soft/5 px-8 py-20 shadow-lg shadow-primary/8 transition-all duration-500 hover:border-primary-muted/55 hover:shadow-xl hover:shadow-primary/12 sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-primary/8 blur-3xl" aria-hidden />
        </div>
        
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:items-start">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/75">Core Values</p>
            <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">How we build trust</h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Clinical Copilot is built on three fundamental principles that ensure safe, effective, and ethical AI assistance
              in clinical practice—prioritizing physician expertise, evidence-based medicine, and patient privacy at every step.
            </p>
            <div className="hidden h-px w-24 bg-primary-muted/60 lg:block" />
          </div>

          <div className="grid gap-10">
            {operatingPrinciples.map((principle) => (
              <div key={principle.title} className="group/item relative pl-12 transition-transform duration-300 hover:translate-x-1">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent transition-all duration-300 group-hover/item:from-primary/60 group-hover/item:via-primary/30" aria-hidden />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary text-white shadow-sm transition-all duration-300 group-hover/item:scale-105">
                      <principle.icon className="h-5 w-5 transition-transform duration-300 group-hover/item:scale-110" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground transition-colors duration-300 group-hover/item:text-primary">{principle.title}</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground/85">
                    {principle.points.map((point) => (
                      <li key={point} className="flex gap-3 leading-relaxed">
                        <span className="mt-0.5 text-primary">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-surface px-8 py-20 transition-all duration-500 hover:border-primary-muted/55 sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-secondary/8 blur-3xl" aria-hidden />
        </div>
        
        <div className="relative space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/75">Clinical Workflow</p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Seamless integration into your practice</h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Clinical Copilot follows a structured five-phase workflow designed to support physicians throughout the patient encounter.
            Each phase includes built-in checkpoints that ensure physician oversight while streamlining documentation and decision support.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="group/step relative overflow-hidden rounded-lg border border-border/40 bg-background/60 transition-all duration-300 hover:border-primary/40 hover:bg-background/80"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/60 to-primary/20 transition-all duration-300" />
                <div className="flex gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-all duration-300 group-hover/step:bg-primary/20">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground/75">
                      Phase {index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-foreground transition-colors duration-300 group-hover/step:text-primary">
                      {step.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
