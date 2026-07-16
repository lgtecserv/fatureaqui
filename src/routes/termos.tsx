import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, Scale, ShieldAlert, FileText, Settings, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/termos")({
  component: TermosPage,
});

function TermosPage() {
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
      
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
              <Scale className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl tracking-tight">Termos de Serviço</h1>
            <p className="mt-4 text-lg text-muted-foreground">Última atualização: Julho de 2026</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 items-start">
            {/* Sidebar Navigation */}
            <div className="hidden md:block sticky top-8 bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">Índice</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#aceitacao" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Aceitação</a></li>
                <li><a href="#licenca" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Licença de Uso</a></li>
                <li><a href="#responsabilidades" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Responsabilidades</a></li>
                <li><a href="#limitacoes" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Limitações</a></li>
                <li><a href="#precisao" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Precisão dos Dados</a></li>
                <li><a href="#alteracoes" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Alterações</a></li>
              </ul>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
                
                <section id="aceitacao" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><FileText className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">1. Aceitação dos Termos</h2>
                  </div>
                  <p>Ao aceder e utilizar o software <strong>Fature Aqui</strong>, desenvolvido e gerido pela <strong>LG Tecserv</strong>, o utilizador concorda expressamente em ficar vinculado a estes Termos de Serviço, bem como a todas as leis e regulamentos aplicáveis. Concorda que é o único responsável pelo cumprimento das leis locais de Moçambique, nomeadamente no que diz respeito às obrigações fiscais perante a Autoridade Tributária. Se não concordar com algum destes termos, está expressamente proibido de usar ou aceder a este sistema.</p>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="licenca" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><Settings className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">2. Licença de Uso</h2>
                  </div>
                  <p>É concedida permissão para o uso da plataforma Fature Aqui como software como serviço (SaaS), mediante o pagamento da respetiva assinatura (quando aplicável ao seu plano). Esta é a concessão de uma licença de utilização temporária e não transferível, e não uma transferência de título. Sob esta licença, o utilizador <strong>não pode</strong>:</p>
                  <ul className="list-none space-y-3 mt-4 pl-0">
                    <li className="flex items-start gap-2 bg-destructive/5 text-destructive-foreground p-3 rounded-lg border border-destructive/10"><ArrowRight className="h-5 w-5 text-destructive shrink-0" /> <span>Modificar, copiar ou aceder indevidamente ao código-fonte da aplicação;</span></li>
                    <li className="flex items-start gap-2 bg-destructive/5 text-destructive-foreground p-3 rounded-lg border border-destructive/10"><ArrowRight className="h-5 w-5 text-destructive shrink-0" /> <span>Tentar descompilar, fazer engenharia reversa ou explorar vulnerabilidades no Fature Aqui;</span></li>
                    <li className="flex items-start gap-2 bg-destructive/5 text-destructive-foreground p-3 rounded-lg border border-destructive/10"><ArrowRight className="h-5 w-5 text-destructive shrink-0" /> <span>Remover quaisquer direitos de autor ou outras notações de propriedade intelectual (como marcas de água em planos gratuitos);</span></li>
                    <li className="flex items-start gap-2 bg-destructive/5 text-destructive-foreground p-3 rounded-lg border border-destructive/10"><ArrowRight className="h-5 w-5 text-destructive shrink-0" /> <span>Transferir a sua conta de faturação para outra entidade sem aviso prévio e legal.</span></li>
                  </ul>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="responsabilidades" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><ShieldAlert className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">3. Responsabilidades e Obrigações Fiscais</h2>
                  </div>
                  <p>O Fature Aqui é uma ferramenta tecnológica que facilita a emissão de faturas e recibos. No entanto:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
                    <li>A veracidade dos dados inseridos, faturas emitidas, valores e clientes registados é da <strong>inteira e exclusiva responsabilidade do utilizador</strong>.</li>
                    <li>O utilizador garante que tem o direito legal de emitir faturas em nome da empresa registada no sistema.</li>
                    <li>A LG Tecserv atua apenas como prestadora do software e <strong>não se responsabiliza</strong> por evasão fiscal, declarações incorretas ou multas aplicadas pela Autoridade Tributária devido ao mau uso do sistema pelo utilizador.</li>
                  </ul>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="limitacoes" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Limitações de Responsabilidade</h2>
                  <p>Em nenhum caso a LG Tecserv ou os seus fornecedores de infraestrutura serão responsáveis por quaisquer danos, incluindo, sem limitação:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground/70">
                    <li>Danos por perda de dados devido a ataques informáticos ou eventos de força maior;</li>
                    <li>Perda de lucros ou interrupção de negócios decorrentes da incapacidade técnica momentânea do sistema.</li>
                  </ul>
                  <p className="mt-4">Trabalhamos com servidores de alta disponibilidade (uptime de 99.9%), mas não podemos garantir a inexistência absoluta de falhas no fornecimento de internet ou de serviços de terceiros.</p>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="precisao" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Precisão dos Materiais</h2>
                  <p>Os materiais exibidos no site e sistema podem incluir erros técnicos ou tipográficos involuntários. A LG Tecserv reserva-se o direito de fazer alterações e correções nos materiais contidos na plataforma a qualquer momento, sem aviso prévio obrigatório, embora tentemos sempre notificar os nossos clientes sobre atualizações maiores.</p>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="alteracoes" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><RefreshCcw className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">6. Modificações dos Termos</h2>
                  </div>
                  <p>A LG Tecserv pode rever e alterar estes Termos de Serviço a qualquer momento. Ao continuar a utilizar o sistema após tais modificações, o utilizador concorda tacitamente em ficar vinculado à versão mais atualizada e publicada nesta mesma página.</p>
                </section>

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
