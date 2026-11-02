import { INVOICE_TEMPLATES, type InvoiceTemplateId } from "@/types";
import { Crown, Check } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

interface InvoiceTemplateSelectorProps {
  selectedTemplate: InvoiceTemplateId;
  onSelectTemplate: (templateId: InvoiceTemplateId) => void;
  isPro?: boolean;
  className?: string;
  primaryColor?: string;
}

export function InvoiceTemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  isPro = false,
  className = "",
  primaryColor = "#02664D",
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
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {INVOICE_TEMPLATES.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          const isLocked = tpl.isPro && !isPro;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id, tpl.isPro, tpl.name)}
              className={`group relative flex flex-col shrink-0 items-center justify-between w-[92px] h-[106px] rounded-xl p-1.5 transition-all duration-200 border text-left select-none ${
                isSelected
                  ? "bg-primary/5 border-primary ring-2 ring-primary/30 shadow-sm scale-[1.02]"
                  : "bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground border-border hover:border-primary/40"
              }`}
              title={tpl.subtitle}
            >
              {/* Mini Invoice Preview Artwork */}
              <div className="w-full h-[62px] rounded-lg bg-white border border-border/70 p-1 flex flex-col justify-between overflow-hidden relative shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                {tpl.id === "classic" && (
                  <div className="w-full h-full flex flex-col justify-between">
                    <div 
                      className="h-2 w-full rounded-b-md flex items-center px-1 justify-between"
                      style={{ backgroundColor: `${primaryColor}30` }}
                    >
                      <div className="h-1 w-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <div className="h-0.5 w-4 bg-gray-400 rounded-full" />
                    </div>
                    <div className="space-y-0.5 px-0.5">
                      <div className="h-0.5 w-6 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <div className="h-0.5 w-full bg-gray-200 rounded" />
                      <div className="h-0.5 w-full bg-gray-200 rounded" />
                    </div>
                    <div className="flex justify-between items-center px-0.5 pt-0.5 border-t border-gray-100">
                      <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                      <div className="h-1 w-5 rounded" style={{ backgroundColor: primaryColor }} />
                    </div>
                  </div>
                )}

                {tpl.id === "corporate" && (
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="h-1.5 w-4 bg-gray-800 rounded-xs" />
                      <div className="h-1.5 w-6 rounded-xs" style={{ backgroundColor: primaryColor }} />
                    </div>
                    <div className="border border-gray-700 rounded-xs p-0.5 space-y-0.5 my-0.5">
                      <div className="h-1 bg-gray-800 rounded-xs w-full" />
                      <div className="h-0.5 bg-gray-200 rounded-xs w-full" />
                      <div className="h-0.5 bg-gray-200 rounded-xs w-full" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-1 w-3 bg-gray-300 rounded" />
                      <div className="h-1.5 w-5 rounded-xs" style={{ backgroundColor: primaryColor }} />
                    </div>
                    <div className="h-1 w-full rounded-xs" style={{ backgroundColor: primaryColor }} />
                  </div>
                )}

                {tpl.id === "modern" && (
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-2 bg-gray-800 rounded-xs" />
                      <div className="h-1 w-5 bg-gray-900 rounded" />
                    </div>
                    <div className="space-y-0.5 my-0.5">
                      <div className="h-1.5 bg-gray-900 rounded w-full" />
                      <div className="h-0.5 bg-gray-200 rounded w-full" />
                      <div className="h-0.5 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="flex justify-between items-end border-t border-gray-200 pt-0.5">
                      <div className="h-1 w-4 bg-gray-900 rounded" />
                      <div className="h-1.5 w-4 bg-gray-800 rounded" />
                    </div>
                  </div>
                )}

                {tpl.id === "geometric" && (
                  <div className="w-full h-full flex flex-col justify-between relative">
                    <div 
                      className="absolute top-0 right-0 w-8 h-2.5" 
                      style={{ 
                        backgroundColor: primaryColor,
                        clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)" 
                      }} 
                    />
                    <div className="h-1.5 w-3 bg-gray-800 rounded mt-0.5" />
                    <div className="border border-gray-700 rounded-xs p-0.5 space-y-0.5 my-0.5">
                      <div className="h-1 bg-[#1E2238] rounded-xs w-full" />
                      <div className="h-0.5 bg-gray-200 rounded-xs w-full" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-0.5 w-4 bg-gray-400 rounded" />
                      <div className="h-1.5 w-4 rounded-xs" style={{ backgroundColor: primaryColor }} />
                    </div>
                    <div 
                      className="h-1 w-5" 
                      style={{ 
                        backgroundColor: primaryColor,
                        clipPath: "polygon(0 0, 100% 0, 75% 100%, 0 100%)" 
                      }} 
                    />
                  </div>
                )}

                {tpl.id === "boutique" && (
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="h-1.5 w-5 bg-blue-950 rounded-xs font-black" />
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                    </div>
                    <div className="space-y-0.5 my-0.5 border-t border-b border-blue-950 py-0.5">
                      <div className="h-0.5 bg-gray-200 rounded w-full" />
                      <div className="h-0.5 bg-gray-200 rounded w-full" />
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[6px] italic font-serif text-blue-950">Obrigado</span>
                      <div className="h-1 w-4 bg-blue-950 rounded-xs" />
                    </div>
                  </div>
                )}

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-primary text-white flex items-center justify-center shadow">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                )}

                {/* Locked Pro Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-[0.5px] flex items-center justify-center">
                    <span className="text-[8px] bg-amber-500 text-white font-black px-1.5 py-0.2 rounded-full shadow flex items-center gap-0.5">
                      <Crown className="w-2 h-2" /> PRO
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Badge */}
              <div className="w-full flex items-center justify-between gap-1 mt-1 px-0.5">
                <span className={`text-[10px] font-bold truncate leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {tpl.name.split(" ")[0]}
                </span>
                {tpl.isPro && (
                  <span className="text-[8px] font-black text-amber-600 bg-amber-500/10 px-1 rounded">
                    PRO
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
