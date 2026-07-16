import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-2xl pointer-events-none" />
      
      <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Pronto para modernizar a sua faturação?
        </h2>
        <p className="mt-6 text-xl text-primary-foreground/90 max-w-2xl mx-auto">
          Junte-se a milhares de empreendedores moçambicanos que já abandonaram o Excel. Crie a sua conta gratuita hoje mesmo.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/painel"
            className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-amber-500 px-8 text-base font-bold text-white shadow-xl transition-all hover:bg-amber-600 hover:scale-105 hover:shadow-2xl"
          >
            Criar conta grátis agora <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-primary-foreground/70">
          Não é necessário cartão de crédito.
        </p>
      </div>
    </section>
  );
}
