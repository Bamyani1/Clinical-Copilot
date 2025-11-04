import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation(["index", "common"]);

  return (
    <>
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-primary-muted/40 bg-gradient-hero px-6 py-24 sm:px-12 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 right-16 h-72 w-72 rounded-full bg-primary/30 blur-[150px]" aria-hidden />
          <div className="absolute bottom-0 left-12 h-80 w-80 rounded-full bg-secondary/20 blur-[180px]" aria-hidden />
        </div>

        <div className="flex flex-col gap-6 text-left">
          <h1 className="max-w-[42ch] text-[2.9rem] font-semibold leading-[1.08] sm:text-[3.75rem]">
            {t("hero.title")}
          </h1>
          <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t("hero.description")}
          </p>
        </div>

        <div className="mt-12 flex">
          <Link to="/consent">
            <Button className="flex items-center gap-3 rounded-full bg-gradient-primary px-10 py-6 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-lg shadow-primary/40">
              {t("common:actions.startDemo")}
              <Sparkle className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="mt-10 flex justify-center">
        <div className="flex w-full max-w-3xl items-start gap-3 rounded-[var(--radius)] border border-border/60 bg-surface-strong/95 px-5 py-4 text-sm text-foreground shadow-inner shadow-accent/20 backdrop-blur">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-foreground">{t("disclaimer.text")}</p>
        </div>
      </div>
    </>
  );
};

export default Index;
