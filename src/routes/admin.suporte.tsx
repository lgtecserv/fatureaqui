import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, MessageSquare, Clock, CheckCircle2, Send, ArrowLeft, Search, Building2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export const Route = createFileRoute("/admin/suporte")({
  component: AdminSuportePage,
});

type Ticket = {
  id: string;
  subject: string;
  status: string;
  created_at: string;
  user_id: string;
  company?: { name: string, email: string };
};

type Message = {
  id: string;
  message: string;
  user_id: string;
  created_at: string;
};

function AdminSuportePage() {
  const queryClient = useQueryClient();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeTicket]);

  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: async () => {
      const { data: ticketsData, error: ticketsError } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (ticketsError) throw ticketsError;

      if (!ticketsData || ticketsData.length === 0) return [];

      // Get companies info for the users who opened tickets
      const userIds = [...new Set(ticketsData.map(t => t.user_id))];
      const { data: companies, error: compError } = await supabase
        .from("companies")
        .select("user_id, name, email")
        .in("user_id", userIds);

      if (compError) throw compError;

      return ticketsData.map((t: any) => ({
        ...t,
        company: companies?.find(c => c.user_id === t.user_id) || { name: 'Desconhecida', email: '' }
      })) as Ticket[];
    }
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

  const replyMutation = useMutation({
    mutationFn: async (msgText: string) => {
      if (!msgText.trim()) return;
      // Get current user id (admin)
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Não autenticado");

      const { error } = await supabase
        .from("ticket_messages")
        .insert([{ 
          ticket_id: activeTicket?.id, 
          user_id: authData.user.id, 
          message: msgText 
        }]);
      if (error) throw error;

      // Update ticket status to "em_progresso" if it was "aberto"
      if (activeTicket?.status === 'aberto') {
        await supabase.from("tickets").update({ status: 'em_progresso' }).eq('id', activeTicket.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket-messages", activeTicket?.id] });
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      setNewMessage("");
    },
    onError: () => toast.error("Erro ao enviar mensagem.")
  });

  const closeTicketMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("tickets")
        .update({ status: 'fechado' })
        .eq('id', activeTicket?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tickets"] });
      toast.success("Ticket marcado como resolvido!");
      if (activeTicket) setActiveTicket({ ...activeTicket, status: 'fechado' });
    }
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || replyMutation.isPending) return;
    replyMutation.mutate(newMessage);
  };

  const filteredTickets = tickets?.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aberto': return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10"><Clock className="h-3 w-3"/> Aberto (Novo)</span>;
      case 'em_progresso': return <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-800 ring-1 ring-inset ring-yellow-600/20"><MessageSquare className="h-3 w-3"/> A Responder</span>;
      case 'fechado': return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20"><CheckCircle2 className="h-3 w-3"/> Resolvido</span>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 p-8 h-screen flex flex-col overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Suporte / Tickets</h1>
          <p className="text-slate-500 mt-1">Pedidos de ajuda e suporte técnico das empresas.</p>
        </div>
        
        {!activeTicket && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Procurar ticket ou empresa..." 
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex">
        {activeTicket ? (
          /* TICKET CHAT VIEW */
          <div className="flex-1 flex flex-col w-full">
            <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTicket(null)} 
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{activeTicket.subject}</h2>
                  <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Building2 className="h-4 w-4" /> {activeTicket.company?.name}
                    </span>
                    <span>•</span>
                    {getStatusBadge(activeTicket.status)}
                  </div>
                </div>
              </div>
              
              {activeTicket.status !== 'fechado' && (
                <button 
                  onClick={() => closeTicketMutation.mutate()}
                  disabled={closeTicketMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {closeTicketMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  Marcar como Resolvido
                </button>
              )}
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
                messages?.map((msg) => {
                  const isAdmin = msg.user_id !== activeTicket.user_id;
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 ${
                        isAdmin 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-white border border-slate-200 text-slate-900 shadow-sm rounded-tl-none'
                      }`}>
                        {!isAdmin && <div className="text-xs font-bold text-slate-500 mb-1">{activeTicket.company?.name}</div>}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        <div className={`mt-2 text-[10px] font-medium ${isAdmin ? 'text-primary-foreground/70' : 'text-slate-400'}`}>
                          {format(new Date(msg.created_at), "dd MMM, HH:mm", { locale: pt })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {activeTicket.status !== 'fechado' ? (
              <div className="border-t border-slate-100 bg-white p-4">
                <form onSubmit={handleReplySubmit} className="flex gap-3">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escreva a resposta para o cliente..."
                    className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || replyMutation.isPending}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                  >
                    {replyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="hidden sm:inline">Responder</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="border-t border-slate-100 bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500 font-medium">Este ticket foi marcado como resolvido e fechado.</p>
              </div>
            )}
          </div>
        ) : (
          /* TICKETS LIST VIEW */
          <div className="w-full h-full overflow-y-auto">
            {loadingTickets ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTickets?.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-8">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sem tickets</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Não existem tickets abertos ou não encontramos nenhum resultado para a sua pesquisa.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/80 text-slate-500 sticky top-0 border-b border-slate-200 backdrop-blur-sm z-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Empresa / Cliente</th>
                    <th className="px-6 py-4 font-semibold w-1/2">Assunto do Ticket</th>
                    <th className="px-6 py-4 font-semibold">Estado</th>
                    <th className="px-6 py-4 font-semibold text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets?.map(ticket => (
                    <tr 
                      key={ticket.id} 
                      onClick={() => setActiveTicket(ticket)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{ticket.company?.name}</div>
                        <div className="text-xs text-slate-500">{ticket.company?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 group-hover:text-primary transition-colors truncate max-w-md">
                          {ticket.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500">
                        {format(new Date(ticket.created_at), "dd MMM yyyy", { locale: pt })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
