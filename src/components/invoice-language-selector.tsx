import React from "react";
import type { InvoiceLanguage } from "@/lib/invoice-translations";
import { Globe } from "lucide-react";

interface InvoiceLanguageSelectorProps {
  language: InvoiceLanguage;
  onLanguageChange: (lang: InvoiceLanguage) => void;
  className?: string;
  primaryColor?: string;
}

const LANGUAGES: { id: InvoiceLanguage; label: string; flag: string; name: string }[] = [
  { id: "pt", label: "PT", flag: "🇲🇿", name: "Português" },
  { id: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { id: "zh", label: "ZH", flag: "🇨🇳", name: "中文 (Chinese)" },
  { id: "es", label: "ES", flag: "🇪🇸", name: "Español" },
];

export function InvoiceLanguageSelector({
  language,
  onLanguageChange,
  className = "",
  primaryColor = "#02664D",
}: InvoiceLanguageSelectorProps) {
  return (
    <div className={`inline-flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/80 ${className}`}>
      <span className="text-[11px] font-semibold text-muted-foreground px-2 flex items-center gap-1 select-none">
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Idioma do Documento:</span>
      </span>
      <div className="flex items-center gap-1">
        {LANGUAGES.map((item) => {
          const isActive = language === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onLanguageChange(item.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                isActive
                  ? "text-white shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              }`}
              style={isActive ? { backgroundColor: primaryColor } : undefined}
              title={item.name}
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
