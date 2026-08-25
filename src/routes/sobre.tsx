import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { Building2, Code2, Users, Target, ArrowRight, ShieldCheck, Zap, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
  head: () => ({
    meta: [
      { title: "Sobre Nós | FatureAqui - Software de Faturação Moçambique" },
      { name: "description", content: "Conheça a história do FatureAqui e a equipa da LG Tecserv por trás do melhor software de faturação online certificado pela AT em Moçambique." },
    ],
  }),
});

function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 border-b border-border/40">
        <Link to="/">
          <img src="/logo.png" alt="FatureAqui" className="h-16 sm:h-[72px] object-contain" />
        </Link>
        <Link
          to="/painel"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition-opacity"
        >
          Entrar no painel <ArrowRight className="h-4 w-4" />
        </Link>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary/5 py-24 sm:py-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
              O futuro da faturação em Moçambique criado pela <span className="text-primary">LG Tecserv</span>
            </h1>
            <p className="mt-4 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Simplificamos a gestão do seu negócio com tecnologia de ponta, 100% legal e feita à medida das necessidades do empresário moçambicano.
            </p>
          </div>
        </section>

        {/* Nossa História */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                  Nossa História
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Nascemos para descomplicar a burocracia empresarial.
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    A <strong>LG Tecserv</strong> surgiu da observação de uma dor comum: pequenas e médias empresas perdiam demasiado tempo com tarefas administrativas complexas, folhas de cálculo confusas e softwares desatualizados.
                  </p>
                  <p>
                    Com o lançamento do <strong>Fature Aqui</strong>, decidimos mudar as regras do jogo. Criámos um ecossistema completo que não só emite faturas certificadas, mas que atua como o coração financeiro de milhares de negócios, garantindo controlo absoluto, de qualquer lugar, a qualquer hora.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10"></div>
                <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-4xl font-black text-primary">2026</div>
                      <div className="text-sm font-medium text-muted-foreground">Ano de Fundação</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-black text-primary">+500</div>
                      <div className="text-sm font-medium text-muted-foreground">Empresas Apoiadas</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-black text-primary">100%</div>
                      <div className="text-sm font-medium text-muted-foreground">Certificado na AT</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl font-black text-primary">24/7</div>
                      <div className="text-sm font-medium text-muted-foreground">Suporte Dedicado</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="py-24 bg-card border-y border-border">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Os Nossos Pilares</h2>
              <p className="mt-4 text-lg text-muted-foreground">Os princípios inegociáveis que guiam o desenvolvimento de todos os nossos produtos.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">Foco no Cliente</h3>
                <p className="text-muted-foreground leading-relaxed">Cada botão e cada funcionalidade é desenhada a pensar no conforto e sucesso do utilizador.</p>
              </div>

              <div className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">Segurança Total</h3>
                <p className="text-muted-foreground leading-relaxed">Os seus dados fiscais são o ativo mais importante. Aplicamos encriptação de nível bancário.</p>
              </div>

              <div className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">Inovação Rápida</h3>
                <p className="text-muted-foreground leading-relaxed">A tecnologia não para, e nós também não. Atualizações contínuas gratuitas.</p>
              </div>

              <div className="bg-background rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 mb-6 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-3">Parceria Local</h3>
                <p className="text-muted-foreground leading-relaxed">Conhecemos as regras de Moçambique. Somos parceiros tecnológicos do seu negócio.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 bg-background">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Faça parte desta revolução tecnológica</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/registro" className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95">
                Criar Conta Gratuita <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/contactos" className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-border bg-background px-8 text-base font-bold text-foreground shadow-sm transition-colors hover:bg-muted hover:border-foreground/20">
                Falar com a Equipa
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
