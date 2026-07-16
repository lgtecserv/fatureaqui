import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, ShieldCheck, Database, Lock, EyeOff, Link as LinkIcon, UserCheck } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  component: PrivacidadePage,
});

function PrivacidadePage() {
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
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl tracking-tight">Política de Privacidade</h1>
            <p className="mt-4 text-lg text-muted-foreground">O nosso compromisso inabalável com a proteção dos seus dados e dos seus clientes.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 items-start">
            {/* Sidebar Navigation */}
            <div className="hidden md:block sticky top-8 bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider">Índice</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#recolha" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Recolha de Dados</a></li>
                <li><a href="#uso" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Uso das Informações</a></li>
                <li><a href="#protecao" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Proteção e Retenção</a></li>
                <li><a href="#partilha" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Partilha de Dados</a></li>
                <li><a href="#externos" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Sites Externos</a></li>
                <li><a href="#consentimento" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> O Seu Consentimento</a></li>
              </ul>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/80 leading-relaxed">
                
                <section id="recolha" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><Database className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">1. Recolha de Informações</h2>
                  </div>
                  <p>A sua privacidade é um pilar fundamental do <strong>Fature Aqui</strong>. É política rigorosa da LG Tecserv respeitar a sua privacidade em relação a qualquer informação sua que possamos recolher durante a operação do sistema.</p>
                  <p>Recolhemos informações pessoais de forma transparente e apenas quando são estritamente necessárias para lhe fornecer o nosso serviço. Isto inclui o registo inicial da sua empresa, dados fiscais (como o NUIT), e os dados necessários para a emissão correta de faturas e processamento de pagamentos. Tudo é feito por meios justos e legais, com o seu pleno conhecimento e consentimento.</p>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="uso" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Como Utilizamos os seus Dados</h2>
                  <p>Os dados que recolhemos e armazenamos são utilizados única e exclusivamente para as seguintes finalidades operacionais:</p>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                      <strong className="text-foreground block mb-1">Operação da Conta</strong>
                      <span className="text-sm">Configurar e gerir a sua conta, permitindo a criação, emissão e arquivo das suas faturas e recibos.</span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                      <strong className="text-foreground block mb-1">Processamento Financeiro</strong>
                      <span className="text-sm">Processar as suas assinaturas e pagamentos de forma segura (ex: integrações seguras via M-Pesa / e-Mola).</span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                      <strong className="text-foreground block mb-1">Comunicação</strong>
                      <span className="text-sm">Envio de alertas do sistema, notificações de vencimento e respostas aos tickets de suporte técnico.</span>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                      <strong className="text-foreground block mb-1">Segurança e Prevenção</strong>
                      <span className="text-sm">Garantir a integridade da plataforma e prevenir tentativas de fraude ou acessos não autorizados.</span>
                    </div>
                  </div>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="protecao" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><Lock className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">3. Proteção e Retenção de Dados</h2>
                  </div>
                  <p>Retemos as informações recolhidas apenas pelo tempo exigido por lei (por exemplo, dados de faturação que devem ser mantidos para efeitos fiscais em Moçambique) ou pelo tempo necessário para lhe fornecer o serviço contínuo.</p>
                  <p>Os seus dados são guardados em servidores seguros, protegidos por tecnologia de encriptação moderna. Tomamos medidas preventivas robustas contra roubos, acesso não autorizado, divulgação, cópia ou modificação indevida da informação do seu negócio.</p>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="partilha" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><EyeOff className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">4. Partilha de Informações</h2>
                  </div>
                  <p>A LG Tecserv tem uma política estrita de <strong>não partilha e não comercialização</strong> dos seus dados. Não partilhamos informações de identificação pessoal ou financeira publicamente ou com terceiros (ex: empresas de marketing).</p>
                  <p>A única exceção a esta regra aplica-se aos dados de faturação e operações que, por lei, devem ser reportados ou auditados pela <strong>Autoridade Tributária de Moçambique</strong>, conforme as regras de certificação de software de faturação.</p>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="externos" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><LinkIcon className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">5. Ligações a Sites Externos</h2>
                  </div>
                  <p>O nosso sistema ou site corporativo pode conter pontualmente ligações para sites externos (por exemplo, documentação fiscal ou portais de parceiros) que não são operados por nós. Esteja ciente de que não temos controlo sobre o conteúdo dessas plataformas e não podemos aceitar qualquer responsabilidade pelas suas respetivas políticas de privacidade.</p>
                </section>

                <hr className="border-border/50 my-8" />

                <section id="consentimento" className="mb-12 scroll-mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary"><UserCheck className="h-5 w-5" /></div>
                    <h2 className="text-2xl font-bold text-foreground m-0">6. O Seu Consentimento e Controlo</h2>
                  </div>
                  <p>O utilizador é livre para recusar a nossa solicitação de informações pessoais, embora deva compreender que, sem certos dados (como o NUIT ou o Nome da Empresa), o sistema ficará impossibilitado de emitir faturas válidas, inviabilizando o fornecimento pleno do serviço.</p>
                  <p>O uso continuado do Fature Aqui será considerado como a sua aceitação ativa das nossas práticas de privacidade e do tratamento das suas informações pessoais. Caso pretenda acionar os seus direitos ao abrigo de normas equivalentes ao RGPD (como apagar dados ou solicitar uma cópia), consulte a nossa <Link to="/rgpd" className="text-primary hover:underline font-medium">Página de RGPD e Direitos dos Utilizadores</Link>.</p>
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
