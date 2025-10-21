import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Activity, BrainCircuit, AudioLines, ShieldAlert, Sparkle, Timer, ClipboardSignature } from "lucide-react";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
});

const featureCards = [
  {
    icon: Activity,
    title: "Real-time signal triage",
    description: "Surface vitals, context, and AI-noted anomalies without leaving the live conversation.",
    accent: "from-primary/60 via-transparent to-transparent",
  },
  {
    icon: BrainCircuit,
    title: "Reasoning snapshots",
    description: "On-device reasoning updates keep differentials, risk tiers, and next steps traceable.",
    accent: "from-secondary/60 via-transparent to-transparent",
  },
  {
    icon: ShieldAlert,
    title: "Escalation guardrails",
    description: "Safety rails log red flags, required documentation, and handoff readiness in one view.",
    accent: "from-accent/70 via-transparent to-transparent",
  },
  {
    icon: ClipboardSignature,
    title: "Structured note drafting",
    description: "Generate SOAP-ready notes anchored to the transcript trail and clinician edits.",
    accent: "from-success/60 via-transparent to-transparent",
  },
];

const workflowSteps = [
  { title: "Consent Capsule", detail: "Clinician and patient confirm participation with inline policy guidance." },
  { title: "Ambient Capture", detail: "Voice-led transcript with speaker tags, timestamps, and capture quality scores." },
  { title: "Case Synthesis", detail: "Vitals, ROS, and HPI surface as editable blocks with audit history." },
  { title: "AI Guidance", detail: "Evidence-linked suggestions and red-flag triggers appear for review before action." },
  { title: "Documentation", detail: "SOAP-ready note scaffolds ship with export-ready text and consistent formatting." },
];

const stackHighlights = [
  { label: "React 18 + Vite 5", detail: "Instant hydration of feature islands keeps critical flows responsive." },
  { label: "Tailwind motion kit", detail: "Custom tokens tuned for a nocturnal UI with high-contrast cards." },
  { label: "Framer Motion", detail: "Micro-interactions across hero, feature cards, and the flow timeline." },
  { label: "Lucide + token theming", detail: "Iconography styles through the shared gradient and color token system." },
];

const About = () => {
  return (
    <div className="space-y-24">
      <motion.section
        className="relative overflow-hidden rounded-[52px] border border-primary-muted/40 bg-gradient-hero px-6 py-20 sm:px-12 sm:py-28"
        initial="initial"
        animate="animate"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-16 h-64 w-64 rounded-full bg-primary/30 blur-[140px]" aria-hidden />
          <div className="absolute bottom-0 left-12 h-72 w-72 rounded-full bg-secondary/20 blur-[160px]" aria-hidden />
        </div>

        <motion.div variants={fadeIn(0)} className="flex flex-col gap-6 text-left">
          <Badge className="w-fit border border-primary-muted/40 bg-primary-soft/30 text-[11px] uppercase tracking-[0.28em] text-primary-foreground/80 backdrop-blur">
            Experimental clinical cockpit
          </Badge>
          <motion.h1
            className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl"
            variants={fadeIn(0.08)}
          >
            Build a dependable AI copilot for every primary care visit.
          </motion.h1>
          <motion.p className="max-w-2xl text-base text-muted-foreground sm:text-lg" variants={fadeIn(0.12)}>
            Navigate a neon-dark workspace engineered for clarity under clinical pressure. Every module is tuned for
            multimodal capture, rapid reasoning review, and clinician-led oversight.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
          variants={fadeIn(0.18)}
        >
          <Link to="/consent">
            <Button className="group flex items-center gap-3 rounded-full bg-gradient-primary px-8 py-6 text-sm font-semibold uppercase tracking-[0.24em] text-background shadow-lg shadow-primary/40 transition hover:shadow-xl">
              Run Live Simulation
              <Sparkle className="h-4 w-4 transition group-hover:rotate-6 group-hover:scale-110" />
            </Button>
          </Link>
          <Link to="/visit/demo">
            <Button
              variant="outline"
              className="rounded-full border-border/70 bg-background/40 px-8 py-6 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground hover:border-secondary hover:text-secondary"
            >
              Open Workspace
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3"
          variants={fadeIn(0.26)}
        >
          {[
            { label: "Simulated scenarios", value: "11 ready-to-run cases" },
            { label: "Safety interceptors", value: "19 red flag triggers" },
            { label: "Latency budget", value: "< 80ms UI response" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border/60 bg-surface/80 px-5 py-4 shadow-sm shadow-primary/20 backdrop-blur"
            >
              <span className="text-[11px] uppercase tracking-[0.28em] text-subtle">{item.label}</span>
              <p className="mt-2 text-lg font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div className="space-y-6" initial="initial" whileInView="animate" viewport={{ once: true }}>
          <motion.h2 className="text-3xl font-semibold sm:text-4xl" variants={fadeIn(0)}>
            Modules engineered for ambient clarity
          </motion.h2>
          <motion.p className="max-w-xl text-base text-muted-foreground sm:text-lg" variants={fadeIn(0.08)}>
            Each card mirrors a live slice of the workspace. Hover to preview microstates—powered by Framer Motion for
            smooth transitions across transcript, reasoning, and documentation panes.
          </motion.p>
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={fadeIn(0.14)}
          >
            {featureCards.map((card) => (
              <motion.div
                key={card.title}
                className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/70 p-6 shadow-md shadow-primary/15 transition hover:-translate-y-1 hover:border-primary-muted hover:shadow-lg backdrop-blur"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-50`} />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft/20 text-primary">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-6 text-xl font-semibold text-foreground">{card.title}</h3>
                <p className="relative mt-3 text-sm text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-secondary/40 bg-secondary/10 p-6 shadow-lg shadow-secondary/30 backdrop-blur"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 text-secondary">
            <AudioLines className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">Signal Stack</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            Built to stress-test ambient AI workflows on everyday hardware. Works offline, keeps only safe subsets, and
            maintains clinician overrides at every stage.
          </p>
          <ul className="space-y-3 text-sm text-secondary-foreground/80">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
              <span>WebGL overlays pause when reduced motion is enabled—managed through feature flags.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
              <span>Zustand slices per feature keep visit data scoped and easy to swap.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
              <span>All reasoning cards reconcile into editable, auditable case data.</span>
            </li>
          </ul>
        </motion.div>
      </section>

      <section className="rounded-[44px] border border-border/60 bg-surface/70 p-8 shadow-md shadow-primary/10 backdrop-blur sm:p-12">
        <motion.div
          className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-lg space-y-4">
            <motion.h2 className="text-3xl font-semibold sm:text-4xl" variants={fadeIn(0)}>
              Clinical flow, choreographed
            </motion.h2>
            <motion.p className="text-base text-muted-foreground sm:text-lg" variants={fadeIn(0.06)}>
              The visit maps to a motion-driven timeline. Each checkpoint lights up when requirements are satisfied,
              keeping the clinician anchored while the AI handles the heavy lifting.
            </motion.p>
          </div>
          <motion.div
            className="flex items-center gap-3 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-xs uppercase tracking-[0.28em]"
            variants={fadeIn(0.12)}
          >
            <Timer className="h-4 w-4 text-primary" />
            <span>Five gated phases</span>
          </motion.div>
        </motion.div>

        <motion.ol
          className="mt-10 grid gap-6 lg:grid-cols-5"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {workflowSteps.map((step, index) => (
            <motion.li
              key={step.title}
              className="relative rounded-3xl border border-border/60 bg-background/40 p-5 shadow-sm shadow-primary/10"
              variants={fadeIn(index * 0.05)}
            >
              <span className="text-[11px] uppercase tracking-[0.28em] text-subtle">Phase {index + 1}</span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{step.detail}</p>
              {index < workflowSteps.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-primary-muted/40 to-transparent lg:block" />
              )}
            </motion.li>
          ))}
        </motion.ol>
      </section>

      <section className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/40 p-6 shadow-md shadow-primary/10 backdrop-blur"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 className="text-2xl font-semibold" variants={fadeIn(0)}>
            Tech stack twists
          </motion.h2>
          <motion.p className="text-sm text-muted-foreground" variants={fadeIn(0.06)}>
            Inspired by modern app patterns, this Vite-based sandbox layers motion and theming tools for a distinct,
            performant aesthetic.
          </motion.p>
          <motion.ul className="space-y-3 text-sm text-muted-foreground/90" variants={fadeIn(0.12)}>
            {stackHighlights.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-6 rounded-full bg-primary" />
                <div>
                  <p className="text-foreground">{item.label}</p>
                  <p className="text-muted-foreground">{item.detail}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-dashed border-border/60 bg-surface/60 p-8 shadow-inner shadow-primary/5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          viewport={{ once: true }}
        >
          <Disclaimer variant="prominent" className="border-0 bg-transparent text-left text-sm text-muted-foreground" />
        </motion.div>
      </section>
    </div>
  );
};

export default About;
