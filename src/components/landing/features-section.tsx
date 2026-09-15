import { ShieldCheck, Zap, BarChart3, Cloud } from "lucide-react";
import FlameWrap from "@/components/ui/flame-wrap";
import { useTranslation } from "react-i18next";

export function FeaturesSection() {
  const { t } = useTranslation();
  const features = [
    {
      title: t("features.items.at.title"),
      description: t("features.items.at.desc"),
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      flameColor: [0.05, 0.65, 0.4] as [number, number, number],
    },
    {
      title: t("features.items.speed.title"),
      description: t("features.items.speed.desc"),
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-100",
      flameColor: [0.95, 0.5, 0.1] as [number, number, number],
    },
    {
      title: t("features.items.control.title"),
      description: t("features.items.control.desc"),
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-100",
      flameColor: [0.1, 0.4, 0.9] as [number, number, number],
    },
    {
      title: t("features.items.cloud.title"),
      description: t("features.items.cloud.desc"),
      icon: Cloud,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      flameColor: [0.3, 0.2, 0.8] as [number, number, number],
    },
  ];

  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <FlameWrap 
              key={i}
              color={f.flameColor}
              radius={16} // rounded-2xl is 1rem = 16px
              intensity={0.4}
              height={100}
              spread={12}
            >
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20 h-full">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            </FlameWrap>
          ))}
        </div>
      </div>
    </section>
  );
}
