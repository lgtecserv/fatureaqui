import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Package, Loader2, Edit, Trash2, Tag, Wrench, Box } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { ProductModal } from "@/components/product-modal";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { MT } from "@/lib/format";

export const Route = createFileRoute("/painel/produtos")({
  component: ProdutosPage,
});

function ProdutosPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "servico" | "produto">("all");
  const [productToEdit, setProductToEdit] = useState<any>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: company } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (!company) return [];
      setCompanyId(company.id);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_variants ( id, sku, price )
        `)
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.product_variants?.[0]?.sku && p.product_variants[0].sku.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === "all") return true;
    return p.type === filterType;
  });

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Artigo/Serviço removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["variants_with_stock"] });
      queryClient.invalidateQueries({ queryKey: ["all_items_catalog"] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao eliminar: ${err.message}`);
    }
  });

  const countServicos = products.filter(p => p.type === "servico").length;
  const countProdutos = products.filter(p => p.type === "produto").length;

  return (
    <>
      <Topbar
        title="Artigos & Serviços"
        subtitle="Catálogo simplificado de produtos e serviços para faturação e cotações"
        actions={
          <button 
            onClick={() => { setProductToEdit(null); setIsModalOpen(true); }}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Novo Artigo / Serviço
          </button>
        }
      />

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        companyId={companyId} 
        initialData={productToEdit}
      />

      <div className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6">
        
        {/* Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por nome, descrição ou código..."
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-full border border-border self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filterType === "all"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setFilterType("servico")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                filterType === "servico"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Wrench className="h-3.5 w-3.5" /> Serviços ({countServicos})
            </button>
            <button
              onClick={() => setFilterType("produto")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                filterType === "produto"
                  ? "bg-card text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Box className="h-3.5 w-3.5" /> Produtos ({countProdutos})
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">A carregar catálogo de artigos e serviços...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground shadow-soft">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">O seu catálogo está vazio</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md">
              Registe os serviços que presta ou produtos que vende (ex: Criação de Website, Consultoria, Ar-condicionado) para emitir faturas num só clique.
            </p>
            <button 
              onClick={() => { setProductToEdit(null); setIsModalOpen(true); }}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> Adicionar Primeiro Artigo/Serviço
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border p-8">
            <p className="text-sm font-medium">Nenhum artigo ou serviço encontrado para &quot;{searchQuery}&quot;.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-muted-foreground font-semibold border-b border-border text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5">Nome / Descrição</th>
                    <th className="px-6 py-3.5">Código / Ref.</th>
                    <th className="px-6 py-3.5">Tipo</th>
                    <th className="px-6 py-3.5">Unidade</th>
                    <th className="px-6 py-3.5 text-right">Preço Unitário</th>
                    <th className="px-6 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((p) => {
                    const variant = p.product_variants?.[0];
                    const price = variant?.price || 0;
                    const sku = variant?.sku || "—";
                    const unit = p.unit_of_measure || "un";

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground">{p.name}</div>
                          {p.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 max-w-md">
                              {p.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          {sku}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            p.type === 'servico'
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/50"
                              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50"
                          }`}>
                            {p.type === 'servico' ? <Wrench className="h-3 w-3" /> : <Box className="h-3 w-3" />}
                            {p.type === 'servico' ? "Serviço" : "Produto"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-foreground">
                          <span className="bg-muted px-2 py-1 rounded-md text-muted-foreground uppercase">
                            {unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-black tabular text-foreground text-sm">
                          {MT(price)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => { setProductToEdit(p); setIsModalOpen(true); }}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Tem a certeza que deseja eliminar "${p.name}"?`)) {
                                  deleteProduct.mutate(p.id);
                                }
                              }}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-border p-4 bg-muted/10 text-xs text-muted-foreground flex items-center justify-between">
              <span>A exibir {filteredProducts.length} de {products.length} artigos e serviços</span>
              <span className="italic">Prontos para serem faturados em segundos</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
