import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, cubicBezier, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkle } from "lucide-react";

const Index = () => {
  const shouldReduceMotion = useReducedMotion();
  const easing = useMemo(() => cubicBezier(0.16, 1, 0.3, 1), []);

  const fadeIn = useCallback(
    (delay = 0): Variants =>
      shouldReduceMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.4, delay: Math.min(delay, 0.15) } },
          }
        : {
            initial: { opacity: 0, y: 32 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, delay, ease: easing },
            },
          },
    [shouldReduceMotion, easing],
  );

  return (
    <>
      <motion.section
        className="relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-hero px-6 py-24 sm:px-12 sm:py-28"
        initial="initial"
        animate="animate"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 right-16 h-72 w-72 rounded-full bg-primary/30 blur-[150px]" aria-hidden />
          <div className="absolute bottom-0 left-12 h-80 w-80 rounded-full bg-secondary/20 blur-[180px]" aria-hidden />
        </div>

        <motion.div variants={fadeIn(0)} className="flex flex-col gap-6 text-left">
          <motion.h1
            className="max-w-[42ch] text-[2.9rem] font-semibold leading-[1.08] sm:text-[3.75rem]"
            variants={fadeIn(0.08)}
          >
            AI-assisted diagnostic support and clinical documentation for primary care.
          </motion.h1>
          <motion.p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg" variants={fadeIn(0.12)}>
            Clinical Copilot analyzes patient encounters in real-time to generate differential diagnoses, recommend diagnostic workups, 
            and suggest evidence-based treatment options—empowering physicians with AI-driven clinical insights while maintaining complete control.
          </motion.p>
        </motion.div>

        <motion.div className="mt-12 flex" variants={fadeIn(0.18)}>
          <Link to="/consent">
            <Button className="group flex items-center gap-3 rounded-full bg-gradient-primary px-10 py-6 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-lg shadow-primary/40 transition hover:shadow-xl">
              Start Demo
              <Sparkle className="h-4 w-4 transition group-hover:rotate-6 group-hover:scale-110" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      <div className="mt-10 flex justify-center">
        <div className="flex w-full max-w-3xl items-start gap-3 rounded-[var(--radius)] border border-border/60 bg-surface-strong/95 px-5 py-4 text-sm text-foreground shadow-inner shadow-accent/20 backdrop-blur">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-foreground">
            Demo only—do not use this prototype for patient care, diagnosis, or treatment decisions. Data remains local and
            all outputs are simulated.
          </p>
        </div>
      </div>
    </>
  );
};

export default Index;
