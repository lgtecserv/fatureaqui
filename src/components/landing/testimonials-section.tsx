import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TestimonialsSection() {
  const { t } = useTranslation();
  const testimonials = [
    {
      name: "João Silva",
      role: t("testimonials.items.1.role"),
      content: t("testimonials.items.1.content"),
      rating: 5,
    },
    {
      name: "Ana Macamo",
      role: t("testimonials.items.2.role"),
      content: t("testimonials.items.2.content"),
      rating: 5,
    },
    {
      name: "Carlos Tamele",
      role: t("testimonials.items.3.role"),
      content: t("testimonials.items.3.content"),
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-card border-y border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            {t("testimonials.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("testimonials.subtitle")}
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
