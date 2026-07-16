import { ShieldCheck, Zap, BarChart3, Cloud } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Certificação AT",
      description: "Cumprimento rigoroso das normas fiscais da Autoridade Tributária de Moçambique. O seu negócio está sempre legal.",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Emissão em Segundos",
      description: "Crie faturas, recibos e guias ultra-rápidas. Pare de perder horas em folhas de cálculo do Excel.",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Controlo Total",
      description: "Dashboard inteligente com relatórios automáticos. Saiba sempre quem lhe deve e qual é a saúde da sua empresa.",
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "100% Cloud e Seguro",
      description: "Aceda de qualquer lugar, no computador ou no telemóvel. Os seus dados são guardados em segurança absoluta.",
      icon: Cloud,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
  ];

  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Tudo o que precisa para gerir o seu negócio.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A Fature Aqui oferece as ferramentas essenciais para simplificar a sua faturação, poupar tempo e focar-se no crescimento da sua empresa.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="relative rounded-2xl border border-border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}>
                <f.icon className={`h-6 w-6 ${f.color}`} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
