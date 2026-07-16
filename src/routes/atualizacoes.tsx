import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, Sparkles, Wrench, Rocket, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/atualizacoes")({
  component: AtualizacoesPage,
});

function AtualizacoesPage() {
  const changelog = [
    {
      version: "v1.5.0",
      date: "16 de Julho de 2026",
      type: "feature",
      title: "O Novo Motor de Notificações em Tempo Real",
      description: "Lançámos um sistema de notificações globais. Agora, os utilizadores recebem alertas instantâneos (com indicadores visuais na barra superior) sempre que um novo pagamento é aprovado, um ticket de suporte é respondido ou uma nova atualização de sistema entra em vigor.",
      icon: <Sparkles className="h-5 w-5 text-amber-500" />,
      colorClass: "bg-amber-500/10 border-amber-500/20"
    },
    {
      version: "v1.4.2",
      date: "13 de Julho de 2026",
      type: "improvement",
      title: "Duplo Sistema de Impostos (IVA & Retenção na Fonte)",
      description: "Implementámos a lógica complexa de impostos exigida pela Autoridade Tributária, permitindo aplicar em simultâneo a taxa de IVA (16%) e a Retenção na Fonte IRPS/IRPC diretamente nas faturas emitidas.",
      icon: <RefreshCcw className="h-5 w-5 text-blue-500" />,
      colorClass: "bg-blue-500/10 border-blue-500/20"
    },
    {
      version: "v1.3.0",
      date: "10 de Julho de 2026",
      type: "feature",
      title: "Integração M-Pesa e e-Mola Automática",
      description: "Acabaram-se os dias de verificar pagamentos manualmente. Integrámos gateways de pagamento mobile para que as suas faturas possam ser pagas via M-Pesa ou e-Mola, sendo o estado da fatura atualizado automaticamente no sistema.",
      icon: <Rocket className="h-5 w-5 text-primary" />,
      colorClass: "bg-primary/10 border-primary/20"
    },
    {
      version: "v1.1.5",
      date: "05 de Julho de 2026",
      type: "fix",
      title: "Otimização de Performance nos Relatórios",
      description: "Corrigimos lentidões ao gerar o mapa de impostos trimestral para contas com mais de 50.000 documentos emitidos. O PDF é agora gerado em menos de 2 segundos.",
      icon: <Wrench className="h-5 w-5 text-slate-500" />,
      colorClass: "bg-slate-500/10 border-slate-500/20"
    },
    {
      version: "v1.0.0",
      date: "01 de Junho de 2026",
      type: "launch",
      title: "Lançamento Oficial do Fature Aqui",
      description: "A revolução começou! A LG Tecserv abriu o Fature Aqui ao público moçambicano, oferecendo um software de faturação SaaS nativo na cloud e 100% em conformidade com as regras locais.",
      icon: <Rocket className="h-5 w-5 text-green-500" />,
      colorClass: "bg-green-500/10 border-green-500/20"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 border-b border-border/40">
        <Link to="/">
          <img src="/logo.png" alt="FatureAqui" className="h-16 sm:h-[72px] object-contain" />
        </Link>
        <Link
          to="/painel"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95"
        >
          Entrar no painel <ArrowRight className="h-4 w-4" />
        </Link>
      </header>
      
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12 md:py-24">
          <div className="text-center mb-20">
            <span className="text-sm font-bold uppercase tracking-wider text-primary mb-2 block">Changelog</span>
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl tracking-tight">Atualizações do Sistema</h1>
            <p className="mt-4 text-lg text-muted-foreground">Descubra as mais recentes funcionalidades, melhorias e correções feitas pela equipa da LG Tecserv.</p>
          </div>

          <div className="relative border-l-2 border-border/60 ml-4 md:ml-0 md:pl-0">
            <div className="space-y-16">
              {changelog.map((item, index) => (
                <div key={index} className="relative md:pl-12 pl-8">
                  {/* Timeline Node */}
                  <div className={`absolute -left-[17px] md:-left-[21px] top-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background ${item.colorClass.split(' ')[0]} shadow-sm`}>
                    {item.icon}
                  </div>

                  <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          {item.version}
                        </span>
                        <h2 className="text-xl font-bold text-foreground">{item.title}</h2>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-20 text-center bg-primary/5 rounded-3xl p-10 border border-primary/10">
            <h3 className="text-2xl font-bold text-foreground mb-4">Quer solicitar uma nova funcionalidade?</h3>
            <p className="text-muted-foreground mb-6">A nossa equipa ouve o mercado para definir as prioridades de desenvolvimento.</p>
            <Link to="/contactos" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Falar com os Desenvolvedores
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
