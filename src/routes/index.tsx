import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import GlassObject from "@/components/ui/glass-object";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
        <img src="/logo.png" alt="FatureAqui" className="h-10 sm:h-16 lg:h-[72px] object-contain shrink-0" />
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="max-[400px]:hidden">
            <LanguageSwitcher />
          </div>
          <Link to="/docs/api" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors hidden sm:block whitespace-nowrap">
            {t("nav.api")}
          </Link>
          <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap">
            {t("nav.login")}
          </Link>
          <Link
            to="/registro"
            className="inline-flex h-9 sm:h-10 items-center gap-1.5 sm:gap-2 rounded-full bg-primary px-4 sm:px-5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 whitespace-nowrap"
          >
            <span className="max-[400px]:hidden">{t("nav.register")}</span>
            <span className="min-[401px]:hidden">Criar</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> {t("hero.badges.certified")}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-primary">{t("hero.title_1")}</span> de{" "}
            <span className="text-primary">{t("hero.title_2")}</span> {t("hero.title_3")}
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <Link
            to="/registro"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-amber px-7 text-sm font-bold text-amber-foreground shadow-elevated hover:opacity-95"
          >
            {t("hero.cta")} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">{t("hero.no_card")}</p>
        </div>

        <div className="relative flex items-center justify-center min-h-[420px] lg:min-h-[520px]">
          {/* Ambient background glow */}
          <div className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-tr from-primary/15 via-emerald-500/10 to-transparent blur-3xl opacity-70 pointer-events-none" />

          <GlassObject 
            src="/hero-image.png" 
            className="w-full h-full min-h-[420px] lg:min-h-[520px]"
            autoRotate={true}
            autoRotateSpeed={0.5}
            orbit={true}
            highlight="#10b981"
            floatIntensity={0.6}
          />

          {/* Floating glassmorphic badges */}
          <div className="absolute top-4 -left-2 sm:-left-6 z-10 hidden sm:flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 shadow-xl backdrop-blur-md pointer-events-none">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-xs font-semibold text-foreground">
              {t("hero.badges.speed")} <span className="text-muted-foreground font-normal">· {t("hero.badges.speed_sub")}</span>
            </div>
          </div>

          <div className="absolute bottom-4 -right-2 sm:-right-6 z-10 hidden sm:flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 shadow-xl backdrop-blur-md pointer-events-none">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <div className="text-xs font-semibold text-foreground">
              {t("hero.badges.certified")} <span className="text-muted-foreground font-normal">· {t("hero.badges.certified_sub")}</span>
            </div>
          </div>
        </div>
      </main>

      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
