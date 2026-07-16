import { UserPlus, Settings, FileText } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Crie a sua conta",
      desc: "Registo gratuito e sem compromisso em menos de 1 minuto.",
      icon: UserPlus,
    },
    {
      num: "02",
      title: "Configure os dados",
      desc: "Insira os dados da sua empresa, adicione o logótipo e os seus primeiros clientes.",
      icon: Settings,
    },
    {
      num: "03",
      title: "Comece a faturar",
      desc: "Gere faturas profissionais em PDF prontas a enviar para os seus clientes.",
      icon: FileText,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Simples do início ao fim
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Desenhámos a Fature Aqui para ser a plataforma mais intuitiva do mercado. Em 3 passos você está pronto para faturar.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 relative">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[2px] bg-border border-dashed border-2" />
          
          {steps.map((s, i) => (
            <div key={i} className="relative text-center z-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ring-4 ring-background">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">
                <span className="text-primary mr-2 font-black">{s.num}.</span>
                {s.title}
              </h3>
              <p className="mt-3 text-muted-foreground px-4">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
