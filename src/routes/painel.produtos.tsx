import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Package, Loader2, Edit, Trash2 } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { ProductModal } from "@/components/product-modal";
import { toast } from "sonner";

export const Route = createFileRoute("/painel/produtos")({
  component: ProdutosPage,
});

function ProdutosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
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
          product_categories ( name ),
          product_variants ( id, sku, price, min_stock_level, attributes, stock_inventory ( quantity ) )
        `)
        .eq("company_id", company.id)
        .order("name", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteProduct = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Artigo apagado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      toast.error(`Erro ao apagar: ${err.message}`);
    }
  });

  return (
    <>
      <Topbar
        title="Produtos e Serviços"
        subtitle="Catálogo de artigos, variantes e preços"
        actions={
          <button 
            onClick={() => { setProductToEdit(null); setIsModalOpen(true); }}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" /> Novo Artigo
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
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos por nome..."
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button 
            onClick={() => toast.info("Gestor de categorias em desenvolvimento para a próxima atualização.")}
            className="h-11 px-6 rounded-full border border-border bg-card text-sm font-medium hover:bg-muted shadow-soft"
          >
            Categorias
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
            <p>A carregar catálogo...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
            <Package className="mb-4 h-10 w-10 opacity-20" />
            <h3 className="text-lg font-semibold text-foreground">Catálogo Vazio</h3>
            <p className="mt-1 text-sm">Ainda não registou nenhum produto ou serviço.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-95"
            >
              <Plus className="h-4 w-4" /> Adicionar Produto
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Artigo</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4 text-center">Stock Total</th>
                    <th className="px-6 py-4">Variantes</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{p.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.description || "Sem descrição"}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {p.product_categories?.name || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {p.type === 'servico' ? 'Serviço' : 'Produto'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-foreground">
                        {p.type === 'servico' ? '—' : (
                          p.product_variants?.reduce((sum: number, variant: any) => {
                            const variantStock = variant.stock_inventory?.reduce((vs: number, stock: any) => vs + (Number(stock.quantity) || 0), 0) || 0;
                            return sum + variantStock;
                          }, 0) || 0
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {p.has_variants 
                          ? `${p.product_variants?.length || 0} variações` 
                          : p.product_variants?.[0] ? `${p.product_variants[0].price} MZN` : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => { setProductToEdit(p); setIsModalOpen(true); }}
                            className="p-2 rounded-lg hover:bg-muted text-slate-500 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm("Tem a certeza que deseja apagar este artigo?")) {
                                deleteProduct.mutate(p.id);
                              }
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
