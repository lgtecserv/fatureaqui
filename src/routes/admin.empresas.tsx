import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Search, Building2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/admin/empresas")({
  component: AdminEmpresasPage,
});

function AdminEmpresasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: companies, isLoading } = useQuery({
    queryKey: ["admin-companies"],
    queryFn: async () => {
      const { data: comps, error: compError } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });

      if (compError) throw compError;
      if (!comps || comps.length === 0) return [];

      const userIds = comps.map(c => c.user_id);

      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("*")
        .in("user_id", userIds);

      if (subsError) throw subsError;

      return comps.map(comp => {
        const subscription = subs?.find(s => s.user_id === comp.user_id);
        return {
          ...comp,
          subscription
        };
      });
    }
  });

  const filteredCompanies = companies?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nuit.includes(searchTerm) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão de Empresas</h1>
          <p className="text-slate-500 mt-1">Controlo de inquilinos e estado das subscrições.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Procurar por nome, NUIT ou email..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Empresas Registadas ({companies?.length || 0})</CardTitle>
          <CardDescription>Lista de todas as empresas que utilizam o FatureAqui.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCompanies?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
              <Building2 className="mb-4 h-12 w-12 text-slate-300" />
              <p className="text-lg font-medium text-slate-900">Nenhuma empresa encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Empresa</th>
                    <th className="px-4 py-3 font-medium">Contacto</th>
                    <th className="px-4 py-3 font-medium">Plano Atual</th>
                    <th className="px-4 py-3 font-medium">Válido Até (30 Dias)</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredCompanies?.map((comp) => {
                    const expired = isExpired(comp.subscription?.valid_until);
                    
                    return (
                      <tr key={comp.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-medium text-slate-900">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white overflow-hidden">
                              {comp.logo_url ? (
                                <img src={comp.logo_url} alt={comp.name} className="h-full w-full object-contain" />
                              ) : (
                                <Building2 className="h-5 w-5 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <div>{comp.name}</div>
                              <div className="text-xs text-slate-500 font-normal">NUIT: {comp.nuit || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          <div>{comp.email}</div>
                          <div className="text-xs text-slate-500">{comp.phone}</div>
                        </td>
                        <td className="px-4 py-4">
                          {comp.subscription?.plan_type === 'pro' ? (
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                              Pro
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                              Free / Trial
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {comp.subscription?.valid_until ? (
                            <span className={expired ? "text-red-600 font-medium flex items-center gap-1.5" : ""}>
                              {expired && <AlertCircle className="h-3.5 w-3.5" />}
                              {new Date(comp.subscription.valid_until).toLocaleDateString("pt-PT")}
                            </span>
                          ) : (
                            <span className="text-slate-400">Sem data</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {comp.subscription?.status === 'pending' ? (
                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                              Aguardando Pagamento
                            </span>
                          ) : expired ? (
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                              Expirado (Cortado)
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              Ativo
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
