import { Link } from "@tanstack/react-router";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12 px-6">
      <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-4 lg:gap-12">
        <div className="md:col-span-1">
          <img src="/logo.png" alt="FatureAqui" className="h-10 object-contain mb-4" />
          <p className="text-sm text-muted-foreground mb-6">
            O software de faturação e gestão desenhado para simplificar a vida dos empreendedores em Moçambique.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-foreground mb-4">Produto</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Preços</Link></li>
            <li><Link to="/atualizacoes" className="hover:text-primary transition-colors">Atualizações</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-4">Empresa</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
            <li><Link to="/contactos" className="hover:text-primary transition-colors">Contactos</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Parceiros</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-4">Legal</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/termos" className="hover:text-primary transition-colors">Termos de Serviço</Link></li>
            <li><Link to="/privacidade" className="hover:text-primary transition-colors">Política de Privacidade</Link></li>
            <li><Link to="/rgpd" className="hover:text-primary transition-colors">RGPD</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mx-auto max-w-6xl mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          Sistema produzido pela <a href="https://www.lgtecserv.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary transition-colors">LG Tescserv</a>
        </p>
      </div>
    </footer>
  );
}
