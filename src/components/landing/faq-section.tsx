import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FaqSection() {
  const { t } = useTranslation();
  const faqs = [
    {
      q: t("faq.q1.q"),
      a: t("faq.q1.a")
    },
    {
      q: t("faq.q2.q"),
      a: t("faq.q2.a")
    },
    {
      q: t("faq.q3.q"),
      a: t("faq.q3.a")
    },
    {
      q: t("faq.q4.q"),
      a: t("faq.q4.a")
    },
    {
      q: t("faq.q5.q"),
      a: t("faq.q5.a")
    },
    {
      q: t("faq.q6.q"),
      a: t("faq.q6.a")
    }
  ];

  return (
    <section className="py-24 bg-card border-t border-border">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            {t("faq.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("faq.subtitle")}
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
