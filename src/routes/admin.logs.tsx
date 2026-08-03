import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Activity, Building2, CreditCard, Settings2, CalendarDays, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useState } from "react";

export const Route = createFileRoute("/admin/logs")({
  component: AdminLogsPage,
});

type SystemLog = {
  id: string;
  event_type: string;
  description: string;
  user_id: string | null;
  created_at: string;
};

function AdminLogsPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["system-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_logs")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as SystemLog[];
    },
    // Refresh a cada 30 segundos automaticamente para ver logs em tempo real
    refetchInterval: 30000 
  });

  const getLogIcon = (eventType: string) => {
    if (eventType.includes("company")) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-8 ring-white"><Building2 className="h-5 w-5" /></div>;
    }
    if (eventType.includes("subscription")) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-white"><CreditCard className="h-5 w-5" /></div>;
    }
    if (eventType.includes("settings")) {
      return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 ring-8 ring-white"><Settings2 className="h-5 w-5" /></div>;
    }
    return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-8 ring-white"><Activity className="h-5 w-5" /></div>;
  };

  const getLogTitle = (eventType: string) => {
    switch (eventType) {
      case 'company_registered': return "Nova Empresa";
      case 'subscription_requested': return "Pedido de Subscrição";
      case 'subscription_approved': return "Subscrição Aprovada";
      case 'subscription_cancelled': return "Subscrição Expirada";
      case 'settings_updated': return "Configurações Alteradas";
      default: return "Evento de Sistema";
    }
  };

  const filteredLogs = logs?.filter(log => {
    const matchesFilter = filterType === "all" || log.event_type.includes(filterType);
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 p-4 sm:p-8 h-[100dvh] flex flex-col overflow-hidden">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Histórico de Atividade</h1>
          <p className="text-slate-500 mt-1">Registo de auditoria e logs do sistema global (Gerado Automaticamente).</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilterType("company")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === 'company' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Adesões
            </button>
            <button 
              onClick={() => setFilterType("subscription")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === 'subscription' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Subscrições
            </button>
            <button 
              onClick={() => setFilterType("settings")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === 'settings' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
            >
              Configurações
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Pesquisar nos logs..." 
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Timeline View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs?.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400">
                <Filter className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Sem registos</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Ainda não existem eventos no sistema que correspondam à sua pesquisa. Os logs são criados automaticamente pela base de dados.
              </p>
            </div>
          ) : (
            <div className="flow-root max-w-4xl mx-auto">
              <ul role="list" className="-mb-8">
                {filteredLogs?.map((log, logIdx) => (
                  <li key={log.id}>
                    <div className="relative pb-8">
                      {logIdx !== filteredLogs.length - 1 ? (
                        <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex items-start space-x-4">
                        <div className="relative px-1">
                          {getLogIcon(log.event_type)}
                        </div>
                        <div className="min-w-0 flex-1 py-1.5">
                          <div className="text-sm text-slate-500">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-slate-900">{getLogTitle(log.event_type)}</span>
                              <span className="whitespace-nowrap flex items-center gap-1.5 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                                <CalendarDays className="h-3 w-3" />
                                {format(new Date(log.created_at), "dd MMM yyyy 'às' HH:mm", { locale: pt })}
                              </span>
                            </div>
                            <p className="text-slate-700 mt-2 bg-slate-50/80 p-3 rounded-lg border border-slate-100 leading-relaxed">
                              {log.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
