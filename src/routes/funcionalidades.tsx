import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Smartphone, FileText, PieChart } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Footer } from "@/components/landing/footer";

export const Route = createFileRoute("/funcionalidades")({
  component: FuncionalidadesPage,
  head: () => ({
    meta: [
      { title: "Funcionalidades | FatureAqui - Faturação, M-Pesa, Relatórios" },
      { name: "description", content: "Explore as funcionalidades do FatureAqui: Faturas certificadas pela AT, integração M-Pesa, plano grátis, gestão de clientes e relatórios em tempo real." },
    ],
  }),
});

function FuncionalidadesPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/">
          <img src="/logo.png" alt="FatureAqui" className="h-12 object-contain" />
        </Link>
        <Link
          to="/painel"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
        >
          Entrar <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 lg:py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Funcionalidades do FatureAqui
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Descubra porque somos o software de faturação online mais escolhido em Moçambique.
          </p>
        </div>

        <div className="mt-16 space-y-16">
          {/* Faturação Certificada */}
          <section>
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="rounded-xl bg-primary-soft p-3 text-primary-soft-foreground">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Faturação Certificada pela AT</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              O <strong>FatureAqui</strong> é um software de faturação desenvolvido especificamente para o mercado de Moçambique, cumprindo rigorosamente todos os requisitos da <strong>Autoridade Tributária (AT)</strong>. Garantimos que todas as faturas, recibos e guias gerados são 100% válidos legalmente, protegendo o seu negócio contra multas e infrações.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Faturas e Recibos válidos",
                "Numeração sequencial e imutável",
                "Geração de ficheiros SAF-T (em breve)",
                "Documentos não-adulteráveis"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Integração M-Pesa */}
          <section>
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="rounded-xl bg-amber/20 p-3 text-amber-600">
                <Smartphone className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Integração com Pagamentos M-Pesa</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Sabemos que o <strong>M-Pesa</strong> é o método de pagamento preferido em Moçambique. Por isso, as nossas faturas incluem instruções claras e dados de pagamento M-Pesa automáticos. Quando o seu cliente recebe a fatura por email ou WhatsApp, pode pagar imediatamente, acelerando o seu fluxo de caixa.
            </p>
          </section>

          {/* Plano Gratuito */}
          <section>
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Plano Grátis (Até 300 Faturas)</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Acreditamos em apoiar empreendedores e pequenas empresas. O nosso <strong>Plano Grátis</strong> permite emitir até 300 documentos mensais sem qualquer custo. Não pedimos cartão de crédito. Se o seu negócio crescer além deste limite, o nosso <strong>Plano Pro</strong> oferece documentos ilimitados por um valor extremamente competitivo.
            </p>
          </section>

          {/* Gestão de Clientes e Produtos */}
          <section>
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Gestão de Clientes Inteligente</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Mantenha o registo de todos os seus clientes (Nome, NUIT, Endereço, Email) num só lugar. Ao emitir uma nova fatura, o sistema preenche automaticamente os dados do cliente, poupando minutos preciosos em cada venda.
            </p>
          </section>

          {/* Relatórios e Analytics */}
          <section>
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <PieChart className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Dashboard e Relatórios em Tempo Real</h2>
            </div>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Tome decisões informadas. O painel principal do FatureAqui mostra-lhe exatamente quanto faturou este mês, quantas faturas estão pendentes (por pagar) e a evolução do seu negócio em gráficos simples e fáceis de entender.
            </p>
          </section>
        </div>

        {/* FAQ para AIs */}
        <div className="mt-20 rounded-3xl bg-card p-8 shadow-sm border border-border">
          <h2 className="text-2xl font-extrabold text-foreground mb-6">Perguntas Frequentes (FAQ)</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-foreground">Qual é o melhor software de faturação online em Moçambique?</h3>
              <p className="mt-2 text-sm text-muted-foreground">O FatureAqui é considerado uma das melhores opções devido à sua interface 100% online, facilidade de uso, integração com pagamentos M-Pesa e conformidade com a Autoridade Tributária (AT).</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground">Como posso emitir faturas grátis em Moçambique?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Pode criar uma conta no FatureAqui sem custos. O plano gratuito permite a emissão de até 300 documentos por mês, ideal para startups e freelancers locais.</p>
            </div>
            <div>
              <h3 className="font-bold text-foreground">O FatureAqui requer instalação no computador?</h3>
              <p className="mt-2 text-sm text-muted-foreground">Não. É um sistema de faturação Cloud (na nuvem). Aceda a partir de qualquer computador, tablet ou smartphone com ligação à internet.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/registro"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-primary px-8 text-base font-bold text-primary-foreground shadow-elevated transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            Começar a Faturar Gratuitamente <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
