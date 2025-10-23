import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { Activity, BrainCircuit, AudioLines, ShieldAlert, Timer, ClipboardSignature } from "lucide-react";

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
});

const heroHighlights = [
  {
    title: "Problem Focus",
    detail: "Primary care teams forfeit hours to documentation and compliance overhead, eroding capacity and patient rapport.",
  },
  {
    title: "Who We Serve",
    detail: "Clinician-led groups that want ambient capture, structured notes, and audit-ready evidence without surrendering oversight.",
  },
  {
    title: "Why Us Now",
    detail: "Clinical Copilot delivers transparent reasoning trails and safety guardrails that slot into existing visit rhythms.",
  },
];

const featureCards = [
  {
    icon: Activity,
    title: "Ambient Intake Console",
    description: "Captures conversation, vitals, and context in real time so clinicians can stay patient-facing.",
    accent: "from-primary/55 via-transparent to-transparent",
  },
  {
    icon: BrainCircuit,
    title: "Reasoning Ledger",
    description: "Summarizes hypotheses and confidence scores with clear audit trails for downstream sign-off.",
    accent: "from-accent/50 via-transparent to-transparent",
  },
  {
    icon: ShieldAlert,
    title: "Safety Governance Layer",
    description: "Monitors escalation triggers, prerequisites, and policy obligations without interrupting the visit.",
    accent: "from-warning/45 via-transparent to-transparent",
  },
  {
    icon: ClipboardSignature,
    title: "Documentation Studio",
    description: "Generates structured notes that align with reimbursement templates and clinician edits.",
    accent: "from-success/45 via-transparent to-transparent",
  },
];

const workflowSteps = [
  { title: "Orientation", detail: "Clinician and patient align on participation and privacy boundaries before capture begins." },
  { title: "Capture & Context", detail: "Ambient audio, vitals, and quick-tap observations stream into a single structured record." },
  { title: "Synthesis Loop", detail: "The system proposes differentials and data gaps while the clinician validates in-line." },
  { title: "Guidance Review", detail: "Safety signals, suggested workups, and medication drafts surface with transparent rationale." },
  { title: "Documentation Handoff", detail: "A reconciled, export-ready note is staged for clinician approval and downstream systems." },
];

const About = () => {
  return (
    <div className="space-y-24">
      <motion.section
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-hero px-6 py-20 sm:px-12 sm:py-28"
        initial="initial"
        animate="animate"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-16 h-64 w-64 rounded-full bg-primary/30 blur-[140px]" aria-hidden />
          <div className="absolute bottom-0 left-12 h-72 w-72 rounded-full bg-secondary/20 blur-[160px]" aria-hidden />
        </div>

        <motion.div variants={fadeIn(0)} className="flex flex-col gap-6 text-left">
          <Badge className="w-fit border border-primary-muted/40 bg-primary-soft/30 text-[11px] uppercase tracking-[0.28em] text-primary-foreground/80 backdrop-blur">
            Executive briefing
          </Badge>
          <motion.h1
            className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl"
            variants={fadeIn(0.08)}
          >
            Clinical Copilot brings ambient intelligence to frontline clinics.
          </motion.h1>
          <motion.p className="max-w-2xl text-base text-muted-foreground sm:text-lg" variants={fadeIn(0.12)}>
            This overview summarizes the product thesis, operating model, and delivery roadmap for the Clinical Copilot
            lab. Our mandate is to return time to clinicians, prove safety first, and deliver an audit-ready record of AI
            assistance.
          </motion.p>
        </motion.div>

        <motion.div className="mt-10 grid gap-4 sm:grid-cols-3" variants={fadeIn(0.18)}>
          {heroHighlights.map((item) => (
            <div
              key={item.title}
              className="rounded-[var(--radius)] border border-border/60 bg-background/50 px-5 py-4 text-sm text-muted-foreground shadow-sm shadow-primary/10 backdrop-blur transition hover:border-primary-muted/60 hover:text-foreground"
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-subtle">{item.title}</p>
              <p className="mt-3 leading-relaxed">{item.detail}</p>
            </div>
          ))}
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
              className="rounded-[var(--radius-md)] border border-border/60 bg-surface/80 px-5 py-4 shadow-sm shadow-primary/20 backdrop-blur"
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
            Four pillars supporting accountable care
          </motion.h2>
          <motion.p className="max-w-xl text-base text-muted-foreground sm:text-lg" variants={fadeIn(0.08)}>
            The platform is structured around operational pillars that align to a practice leader’s scorecard—efficiency,
            decision quality, safety compliance, and documentation accuracy.
          </motion.p>
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            variants={fadeIn(0.14)}
          >
            {featureCards.map((card) => (
              <motion.div
                key={card.title}
                className="relative overflow-hidden rounded-[var(--radius)] border border-border/60 bg-surface/70 p-6 shadow-md shadow-primary/15 transition hover:-translate-y-1 hover:border-primary-muted hover:shadow-lg backdrop-blur"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-50`} />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft/20 text-primary">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-6 text-xl font-semibold text-foreground">{card.title}</h3>
                <p className="relative mt-3 text-sm text-muted-foreground">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="flex h-full flex-col justify-between gap-6 rounded-[var(--radius)] border border-secondary/40 bg-secondary/10 p-6 shadow-lg shadow-secondary/30 backdrop-blur"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 text-secondary">
            <AudioLines className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">Signal Stack</span>
          </div>
          <p className="text-lg font-semibold text-foreground">
            Engineered for clinics that need dependable latency, local-first controls, and full visibility into how AI
            suggestions are produced and reviewed.
          </p>
          <ul className="space-y-3 text-sm text-secondary-foreground/80">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
              <span>Motion layers respect accessibility preferences, pausing rich animations whenever reduced motion is enabled.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
              <span>Zustand data partitions isolate PHI from transient inference context for easier compliance audits.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary" />
              <span>Every reasoning artifact version is retained until clinicians accept or reject it, preserving accountability.</span>
            </li>
          </ul>
        </motion.div>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-border/60 bg-surface/70 p-8 shadow-md shadow-primary/10 backdrop-blur sm:p-12">
        <motion.div
          className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="max-w-lg space-y-4">
            <motion.h2 className="text-3xl font-semibold sm:text-4xl" variants={fadeIn(0)}>
              End-to-end operating sequence
            </motion.h2>
            <motion.p className="text-base text-muted-foreground sm:text-lg" variants={fadeIn(0.06)}>
              A five-phase cadence ensures the system remains predictable. Each milestone is gated by clinician review so
              oversight is never ceded to automation.
            </motion.p>
          </div>
          <motion.div
            className="flex items-center gap-3 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-xs uppercase tracking-[0.28em]"
            variants={fadeIn(0.12)}
          >
            <Timer className="h-4 w-4 text-primary" />
            <span>Sequenced delivery path</span>
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
              className="relative rounded-[var(--radius)] border border-border/60 bg-background/40 p-5 shadow-sm shadow-primary/10"
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

      <section />
    </div>
  );
};

export default About;
