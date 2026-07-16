import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { ArrowRight, Fingerprint, Trash2, DownloadCloud, FileX, BookOpen, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/rgpd")({
  component: RgpdPage,
});

function RgpdPage() {
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
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-24">
          <div className="text-center mb-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-sm">
              <Fingerprint className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl tracking-tight">O seu Controlo. Os seus Dados.</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Acreditamos na total transparência corporativa. Saiba quais são os seus direitos sobre os dados que confia à LG Tecserv e como exercê-los na plataforma Fature Aqui.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Direito ao Acesso</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Tem o direito de saber exatamente que informações pessoais a LG Tecserv detém sobre si e o seu negócio. No painel de administração do Fature Aqui, tem total visibilidade sobre o seu perfil, dados fiscais, configurações e registos de atividades (logs) gerados pela sua conta.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                <FileX className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Direito à Retificação</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Identificou um erro no nome da sua empresa, morada ou NUIT? Tem o direito (e o dever, por questões de faturação) de corrigir dados incompletos ou inexatos. Pode alterar a maioria das informações de perfil de forma autónoma diretamente no menu "Definições" do seu painel.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                <DownloadCloud className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Direito à Portabilidade</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Os dados do seu negócio pertencem-lhe. Oferecemos ferramentas para que possa exportar listas de clientes, relatórios de faturação e faturas/recibos em formatos legíveis e estruturados (como CSV, Excel ou PDF), caso necessite de os transferir para outro sistema contabilístico.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:shadow-md transition-shadow">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <Trash2 className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Direito ao Esquecimento</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Pode solicitar o encerramento definitivo da sua conta e a eliminação dos seus dados dos nossos servidores através da página de Contactos. 
                </p>
                <div className="mt-4 flex items-start gap-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">
                    <strong>Atenção legal:</strong> Conforme a legislação fiscal vigente em Moçambique, a LG Tecserv poderá ser obrigada a manter registos inalteráveis de faturas previamente emitidas pelo período determinado pela Autoridade Tributária, mesmo após a eliminação da sua conta pessoal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Como exercer os seus direitos?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Se pretender exercer qualquer um destes direitos ou tiver questões específicas sobre como tratamos a sua privacidade, a nossa equipa de proteção de dados está pronta para responder.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contactos" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Contactar o Suporte
              </Link>
              <Link to="/privacidade" className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background px-8 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-muted">
                Ler Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
