import { CheckCircle2, FileText, Mail, PlusCircle, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentNumber: string;
  onDownload: () => void;
  onEmail: () => void;
  onNew: () => void;
}

export function SuccessModal({
  isOpen,
  onClose,
  documentNumber,
  onDownload,
  onEmail,
  onNew,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl text-center relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-muted text-muted-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h2 className="text-2xl font-black text-foreground mb-2">Sucesso!</h2>
        <p className="text-sm text-muted-foreground mb-8">
          O documento <strong className="text-foreground">{documentNumber}</strong> foi emitido e guardado com sucesso.
        </p>

        <div className="space-y-3">
          <button 
            type="button"
            onClick={onDownload}
            className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition"
          >
            <FileText className="h-4 w-4" /> Baixar PDF
          </button>
          
          <button 
            type="button"
            onClick={onEmail}
            className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted transition"
          >
            <Mail className="h-4 w-4" /> Enviar por Email
          </button>
          
          <button 
            type="button"
            onClick={onNew}
            className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-soft text-primary px-4 text-sm font-semibold hover:bg-primary-soft/80 transition"
          >
            <PlusCircle className="h-4 w-4" /> Criar Novo
          </button>
        </div>
      </div>
    </div>
  );
}
