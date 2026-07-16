import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, MessageSquare, Clock, CheckCircle2, Paperclip, Send, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export const Route = createFileRoute("/painel/suporte")({
  component: PainelSuportePage,
});

type Ticket = {
  id: string;
  subject: string;
  status: string;
  created_at: string;
};

type Message = {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
  attachment_url: string | null;
};

function PainelSuportePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeTicket]);

  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ["my-tickets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Ticket[];
    },
    enabled: !!user,
  });

  const { data: messages, isLoading: loadingMessages } = useQuery({
    queryKey: ["ticket-messages", activeTicket?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", activeTicket?.id)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!activeTicket?.id,
  });

  const createTicketMutation = useMutation({
    mutationFn: async () => {
      if (!newSubject.trim() || !newMessage.trim()) throw new Error("Assunto e mensagem são obrigatórios.");

      // 1. Create ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .insert([{ subject: newSubject, user_id: user?.id, status: 'aberto' }])
        .select()
        .single();

      if (ticketError) throw ticketError;

      // 2. Create initial message
      const { error: msgError } = await supabase
        .from("ticket_messages")
        .insert([{ 
          ticket_id: ticketData.id, 
          user_id: user?.id, 
          message: newMessage 
        }]);

      if (msgError) throw msgError;
      return ticketData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      setIsCreating(false);
      setNewSubject("");
      setNewMessage("");
      setActiveTicket(data);
      toast.success("Ticket criado com sucesso! O suporte responderá em breve.");
    },
    onError: (e: any) => {
      toast.error(e.message || "Erro ao criar ticket.");
    }
  });

  const replyMutation = useMutation({
    mutationFn: async (msgText: string) => {
      if (!msgText.trim()) return;
      const { error } = await supabase
        .from("ticket_messages")
        .insert([{ 
          ticket_id: activeTicket?.id, 
          user_id: user?.id, 
          message: msgText 
        }]);
      if (error) throw error;
      
      // Update ticket status to open if it was closed
      if (activeTicket?.status === 'fechado') {
        await supabase.from("tickets").update({ status: 'aberto' }).eq('id', activeTicket.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", activeTicket?.id] });
      queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
      setNewMessage("");
    },
    onError: () => toast.error("Erro ao enviar mensagem.")
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || replyMutation.isPending) return;
    replyMutation.mutate(newMessage);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto': return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10"><Clock className="h-3 w-3"/> Aberto</span>;
      case 'em_progresso': return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20"><MessageSquare className="h-3 w-3"/> Em Resolução</span>;
      case 'fechado': return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"><CheckCircle2 className="h-3 w-3"/> Resolvido</span>;
      default: return null;
    }
  };

  return (
    <>
      <Topbar title="Suporte" subtitle="Precisa de ajuda? Fale com a nossa equipa." />

      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 h-[calc(100vh-80px)] flex flex-col">
        {/* CREATE TICKET VIEW */}
        {isCreating ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft flex-1 overflow-y-auto">
            <button 
              onClick={() => setIsCreating(false)} 
              className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Abrir Novo Ticket de Suporte</h2>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Assunto</label>
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Ex: Erro ao emitir fatura"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Descreva o seu problema detalhadamente</label>
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Olá, estou a tentar emitir um documento mas..."
                  className="min-h-[150px] w-full resize-y rounded-xl border border-slate-200 bg-white p-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="pt-4 flex items-center gap-3">
                <button 
                  onClick={() => createTicketMutation.mutate()}
                  disabled={createTicketMutation.isPending || !newSubject.trim() || !newMessage.trim()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {createTicketMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Enviar Pedido
                </button>
              </div>
            </div>
          </div>
        ) : activeTicket ? (
          /* TICKET CHAT VIEW */
          <div className="rounded-2xl border border-border bg-card shadow-soft flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setActiveTicket(null);
                    queryClient.invalidateQueries({ queryKey: ["my-tickets"] });
                  }} 
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{activeTicket.subject}</h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>Aberto a {format(new Date(activeTicket.created_at), "dd 'de' MMMM", { locale: pt })}</span>
                    <span>•</span>
                    {getStatusBadge(activeTicket.status)}
                  </div>
                </div>
              </div>
            </div>

            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/30"
            >
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : (
                messages?.map((msg, i) => {
                  const isMe = msg.user_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 ${
                        isMe 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-900 shadow-sm rounded-tl-none'
                      }`}>
                        {!isMe && <div className="text-xs font-bold text-primary mb-1">Equipa de Suporte</div>}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <div className={`mt-2 text-[10px] font-medium ${isMe ? 'text-primary-foreground/70' : 'text-slate-400'}`}>
                          {format(new Date(msg.created_at), "HH:mm")}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-100 bg-white p-4">
              <form onSubmit={handleReplySubmit} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva a sua mensagem..."
                  className="h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || replyMutation.isPending}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-1" />}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* TICKETS LIST VIEW */
          <div className="flex-1 flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Os meus pedidos</h2>
              <button 
                onClick={() => setIsCreating(true)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> Novo Ticket
              </button>
            </div>

            <div className="flex-1 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              {loadingTickets ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : tickets?.length === 0 ? (
                <div className="flex h-60 flex-col items-center justify-center text-center px-4">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Nenhum ticket de suporte</h3>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Ainda não abriu nenhum pedido de ajuda. Se tiver alguma dúvida ou encontrar um problema, estamos aqui para ajudar.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {tickets?.map(ticket => (
                    <button 
                      key={ticket.id}
                      onClick={() => setActiveTicket(ticket)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-slate-50/80"
                    >
                      <div className="min-w-0 pr-4">
                        <h4 className="truncate text-sm font-bold text-slate-900">{ticket.subject}</h4>
                        <p className="mt-1 text-xs text-slate-500">
                          Atualizado a {format(new Date(ticket.created_at), "dd MMM yyyy", { locale: pt })}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(ticket.status)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
