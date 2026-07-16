import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const faqs = [
    {
      q: "O Fature Aqui é certificado pela AT?",
      a: "Sim, a nossa plataforma cumpre rigorosamente todas as normas exigidas pela Autoridade Tributária de Moçambique. Todas as faturas geradas têm validade legal e fiscal."
    },
    {
      q: "Preciso de inserir o cartão de crédito para testar?",
      a: "Não. O plano gratuito é verdadeiramente gratuito e não lhe pedimos qualquer método de pagamento para começar a faturar."
    },
    {
      q: "O que acontece se eu ultrapassar as 5 faturas no plano grátis?",
      a: "O sistema irá alertá-lo que atingiu o limite mensal. A partir daí, poderá optar por fazer o upgrade para o Plano Pro para continuar a emitir documentos ilimitados."
    },
    {
      q: "Posso cancelar a minha subscrição a qualquer momento?",
      a: "Sim. Não exigimos qualquer fidelização. Se não estiver satisfeito ou não precisar mais do sistema, pode cancelar a renovação do seu plano com apenas um clique."
    },
    {
      q: "Os dados da minha empresa estão seguros?",
      a: "Totalmente. Utilizamos servidores na cloud com encriptação de ponta a ponta e backups diários para garantir que a sua informação financeira está sempre protegida."
    }
  ];

  return (
    <section className="py-24 bg-card border-t border-border">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tire todas as suas dúvidas antes de começar.
          </p>
        </div>

        <Accordion.Root type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <Accordion.Item 
              key={i} 
              value={`item-${i}`}
              className="overflow-hidden rounded-2xl border border-border bg-background transition-shadow focus-within:ring-2 focus-within:ring-primary/20 hover:shadow-sm"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="group flex flex-1 items-center justify-between p-6 text-left font-semibold text-foreground transition-all hover:text-primary [&[data-state=open]>svg]:rotate-180">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-hover:text-primary" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="px-6 pb-6 pt-0 leading-relaxed">
                  {faq.a}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
