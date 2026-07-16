import { Star } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "João Silva",
      role: "Sócio-Gerente, JS Serviços",
      content: "Desde que aderimos à Fature Aqui, a nossa gestão financeira transformou-se. A emissão de faturas é tão rápida que até parece mentira. E o melhor de tudo: estamos 100% legais com a AT.",
      rating: 5,
    },
    {
      name: "Ana Macamo",
      role: "Freelancer",
      content: "Excelente plataforma! Muito intuitiva e o facto de poder aceder pelo telemóvel e enviar o PDF direto para o cliente salvou-me imenso tempo. Recomendo vivamente a qualquer empreendedor.",
      rating: 5,
    },
    {
      name: "Carlos Tamele",
      role: "Diretor Comercial, AutoMoc",
      content: "O sistema de controlo de dívidas e os relatórios automáticos deram-nos uma visão clara do nosso negócio. O suporte técnico também é muito rápido e prestativo.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            O que os nossos clientes dizem
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Milhares de empresas em Moçambique confiam no Fature Aqui todos os dias.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div key={i} className="flex flex-col justify-between rounded-2xl border border-border bg-background p-8 shadow-sm">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{t.content}"</p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
