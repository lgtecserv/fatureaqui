import { UserPlus, Settings, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HowItWorksSection() {
  const { t } = useTranslation();
  const steps = [
    {
      num: "01",
      title: t("how_it_works.steps.1.title"),
      desc: t("how_it_works.steps.1.desc"),
      icon: UserPlus,
    },
    {
      num: "02",
      title: t("how_it_works.steps.2.title"),
      desc: t("how_it_works.steps.2.desc"),
      icon: Settings,
    },
    {
      num: "03",
      title: t("how_it_works.steps.3.title"),
      desc: t("how_it_works.steps.3.desc"),
      icon: FileText,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            {t("how_it_works.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("how_it_works.subtitle")}
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
