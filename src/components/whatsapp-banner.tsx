import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function WhatsappBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has dismissed it before
    const isDismissed = localStorage.getItem("fatureaqui_hide_wa_banner");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("fatureaqui_hide_wa_banner", "true");
  };

  return (
    <div className="relative mb-6 flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-r from-[#25D366]/10 to-[#128C7E]/10 border border-[#25D366]/20 p-4 sm:flex-row sm:items-center sm:justify-between shadow-soft">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm">
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">
            {t("whatsapp.title")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("whatsapp.desc")}
          </p>
        </div>
      </div>
      
      <div className="flex w-full items-center gap-3 sm:w-auto">
        <a
          href="https://chat.whatsapp.com/HsqRdFKpM3TAp98i9HmkTn?s=sh&p=a&mlu=4"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#128C7E] sm:flex-none"
        >
          <MessageCircle className="h-4 w-4" /> {t("whatsapp.btn")}
        </a>
        <button
          onClick={handleDismiss}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          aria-label="Fechar banner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
