import { Check, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function PricingSection() {
  const { data: settings } = useQuery({
    queryKey: ["system-settings-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("pro_price")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    }
  });

  // Formata o preço vindo da base de dados (ex: 1500 -> 1.500 MT)
  const proPrice = settings?.pro_price 
    ? new Intl.NumberFormat("pt-MZ").format(settings.pro_price) + " MT"
    : "1.500 MT"; // Fallback se estiver carregando

  const plans = [
    {
      name: "Gratuito",
      price: "0 MT",
      period: "/mês",
      description: "Ideal para começar e testar a plataforma.",
      features: [
        { name: "Até 5 faturas mensais", included: true },
        { name: "Até 10 clientes", included: true },
        { name: "Documentos em PDF", included: true },
        { name: "Certificação AT", included: true },
        { name: "Apoio ao cliente prioritário", included: false },
        { name: "Gestão de inventário", included: false },
      ],
      cta: "Começar Grátis",
      popular: false,
    },
    {
      name: "Plano Pro",
      price: proPrice,
      period: "/mês",
      description: "A solução completa para pequenas e médias empresas.",
      features: [
        { name: "Faturas ilimitadas", included: true },
        { name: "Clientes ilimitados", included: true },
        { name: "Documentos em PDF", included: true },
        { name: "Certificação AT", included: true },
        { name: "Apoio ao cliente prioritário", included: true },
        { name: "Gestão de inventário", included: true },
      ],
      cta: "Testar o Pro",
      popular: true,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Preços simples e transparentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Escolha o plano que melhor se adapta às necessidades do seu negócio. Cancele ou altere quando quiser.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {plans.map((p, i) => (
            <div 
              key={i} 
              className={`relative flex flex-col rounded-3xl p-8 shadow-xl ${
                p.popular ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-card border border-border"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                  Mais Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className={`text-xl font-bold ${p.popular ? "text-primary-foreground" : "text-foreground"}`}>
                  {p.name}
                </h3>
                <p className={`mt-2 text-sm ${p.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {p.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tabular-nums tracking-tight">
                    {p.price}
                  </span>
                  <span className={`text-sm font-medium ${p.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {p.period}
                  </span>
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    {f.included ? (
                      <Check className={`h-5 w-5 shrink-0 ${p.popular ? "text-primary-foreground" : "text-primary"}`} />
                    ) : (
                      <X className={`h-5 w-5 shrink-0 ${p.popular ? "text-primary-foreground/40" : "text-muted-foreground/40"}`} />
                    )}
                    <span className={`text-sm ${f.included ? (p.popular ? "text-primary-foreground" : "text-foreground") : (p.popular ? "text-primary-foreground/60" : "text-muted-foreground")}`}>
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/painel"
                className={`flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-all hover:opacity-90 ${
                  p.popular 
                    ? "bg-white text-primary hover:bg-gray-50" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
