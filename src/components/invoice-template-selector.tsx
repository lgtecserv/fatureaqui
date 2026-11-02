import { INVOICE_TEMPLATES, type InvoiceTemplateId } from "@/types";
import { Sparkles, Crown } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface InvoiceTemplateSelectorProps {
  selectedTemplate: InvoiceTemplateId;
  onSelectTemplate: (templateId: InvoiceTemplateId) => void;
  isPro?: boolean;
  className?: string;
}

export function InvoiceTemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  isPro = false,
  className = "",
}: InvoiceTemplateSelectorProps) {
  const navigate = useNavigate();

  const handleSelect = (tplId: InvoiceTemplateId, isTemplatePro: boolean, name: string) => {
    if (isTemplatePro && !isPro) {
      toast.info(`O modelo "${name}" é exclusivo do Plano Pro.`, {
        description: "Faça upgrade para personalizar e emitir todos os seus documentos neste modelo.",
        action: {
          label: "Ver Plano Pro",
          onClick: () => navigate({ to: "/painel/assinatura" }),
        },
      });
      return;
    }
    onSelectTemplate(tplId);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {INVOICE_TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          const isLocked = tpl.isPro && !isPro;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id, tpl.isPro, tpl.name)}
              className={`group inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20 scale-[1.02]"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
              }`}
              title={tpl.subtitle}
            >
              <span>{tpl.name}</span>
              {tpl.isPro && (
                <span
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : isLocked
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Crown className="w-2.5 h-2.5" />
                  PRO
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
