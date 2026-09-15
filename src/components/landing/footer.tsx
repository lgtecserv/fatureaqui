import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12 px-6">
      <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-4 lg:gap-12">
        <div className="md:col-span-1">
          <img src="/logo.png" alt="FatureAqui" className="h-10 object-contain mb-4" />
          <p className="text-sm text-muted-foreground mb-6">
            {t("footer.desc")}
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-foreground mb-4">{t("footer.product")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">{t("footer.features")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("footer.pricing")}</Link></li>
            <li><Link to="/atualizacoes" className="hover:text-primary transition-colors">{t("footer.updates")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-4">{t("footer.company")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/sobre" className="hover:text-primary transition-colors">{t("footer.about")}</Link></li>
            <li><Link to="/contactos" className="hover:text-primary transition-colors">{t("footer.contacts")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("footer.partners")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-4">{t("footer.legal")}</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/termos" className="hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
            <li><Link to="/privacidade" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
            <li><Link to="/rgpd" className="hover:text-primary transition-colors">{t("footer.gdpr")}</Link></li>
            <li><Link to="/docs/api" className="hover:text-primary transition-colors font-medium">{t("footer.api")}</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto max-w-6xl mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          {t("footer.produced")} <a href="https://www.lgtecserv.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">LG Tescserv</a>
        </p>
      </div>
    </footer>
  );
}
