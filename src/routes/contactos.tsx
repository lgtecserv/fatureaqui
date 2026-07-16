import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/landing/footer";
import { Mail, Phone, MapPin, Send, ArrowRight, Globe, Clock } from "lucide-react";

export const Route = createFileRoute("/contactos")({
  component: ContactosPage,
});

function ContactosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
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
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-wider text-primary mb-2 block">Suporte & Contactos</span>
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl lg:text-6xl tracking-tight">
              Estamos aqui para ajudar o seu negócio a crescer
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Tem alguma dúvida sobre os nossos planos, necessita de suporte técnico ou quer conhecer melhor o Fature Aqui? A equipa da LG Tecserv está pronta para responder.
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-5 items-start mt-20">
            {/* Informações de Contacto */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                  <Globe className="w-32 h-32 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-8 relative z-10">Fale Connosco</h2>
                
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Telefone</h3>
                      <p className="text-muted-foreground mt-1 hover:text-primary transition-colors cursor-pointer">
                        +258 86 100 005
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Email</h3>
                      <p className="text-muted-foreground mt-1 hover:text-primary transition-colors cursor-pointer">
                        contato@lgtecserv.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Website</h3>
                      <p className="text-muted-foreground mt-1 hover:text-primary transition-colors cursor-pointer">
                        <a href="https://www.lgtecserv.com" target="_blank" rel="noopener noreferrer">
                          www.lgtecserv.com
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Localização</h3>
                      <p className="text-muted-foreground mt-1 leading-relaxed">
                        Maputo - Matola <br/>
                        (Malhampsene em frente a N4)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 border-t border-border/50">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">Horário</h3>
                      <p className="text-muted-foreground mt-1">
                        Segunda a Sexta: 08:00 - 17:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário de Contacto */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-3">Envie-nos uma Mensagem</h2>
                  <p className="text-muted-foreground">Preencha o formulário abaixo e entraremos em contacto o mais breve possível.</p>
                </div>
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-semibold text-foreground">Nome Completo</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 text-sm transition-all hover:bg-background focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" 
                        placeholder="Como gostaria de ser chamado?" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-foreground">Endereço de Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 text-sm transition-all hover:bg-background focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" 
                        placeholder="seu@email.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-semibold text-foreground">Assunto</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 text-sm transition-all hover:bg-background focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10" 
                      placeholder="Sobre o que quer falar?" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-foreground">Mensagem</label>
                    <textarea 
                      id="message" 
                      rows={5} 
                      className="w-full rounded-xl border border-input bg-background/50 px-4 py-3.5 text-sm transition-all hover:bg-background focus:bg-background focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none" 
                      placeholder="Descreva detalhadamente como podemos ajudar..."
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="flex w-full md:w-auto md:min-w-[200px] h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95">
                    <Send className="h-5 w-5" />
                    Enviar Mensagem
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
