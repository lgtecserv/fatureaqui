import { useOnboarding } from "@/hooks/use-onboarding";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingChecklist() {
  const { data: onboarding, isLoading } = useOnboarding();

  if (isLoading || !onboarding || onboarding.isComplete) {
    return null; // Don't show if complete or loading
  }

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Configure a sua conta para começar
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete os passos abaixo para desbloquear a emissão de documentos com validade profissional.
            </p>
            
            {/* Progress Bar */}
            <div className="mt-6 flex items-center gap-4">
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000 ease-in-out"
                  style={{ width: `${onboarding.progress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-primary">
                {onboarding.progress}%
              </span>
            </div>
          </div>

          <div className="flex-1 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-6 lg:max-w-md">
            <div className="space-y-4">
              {onboarding.steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3">
                  {step.isComplete ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/30" />
                  )}
                  <div className="flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        step.isComplete ? "text-muted-foreground line-through" : "text-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                    {!step.isComplete && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                to="/painel/definicoes"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Completar Definições
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
