import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <img src="/logo.png" alt="FatureAqui" className="h-16 sm:h-[72px] object-contain" />
        <Link
          to="/painel"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
        >
          Entrar no painel <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-soft-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Certificado pela AT
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Software de <span className="text-primary">Facturação</span> e{" "}
            <span className="text-primary">Gestão</span> para Moçambique
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground">
            Pare de perder tempo com papelada e Excel. Fature em segundos e controle o seu negócio
            com clareza total — 100% online e com conformidade AT.
          </p>
          <Link
            to="/painel"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-amber px-7 text-sm font-bold text-amber-foreground shadow-elevated hover:opacity-95"
          >
            Ver o painel demo <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">Sem cartão · Activação imediata</p>
        </div>

        <div className="relative flex items-center justify-center">
          <img 
            src="/hero-image.png" 
            alt="Fature Aqui Software Dashboard" 
            className="w-full h-auto rounded-3xl border border-border shadow-2xl shadow-primary/20 object-contain"
          />
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
