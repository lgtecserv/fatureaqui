import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/topbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { ArrowRightLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SuccessModal } from "@/components/success-modal";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/painel/transferencias")({
  component: TransferenciasPage,
});

function TransferenciasPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [variantId, setVariantId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { data: company } = useQuery({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("companies").select("id").eq("user_id", user.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: warehouses = [] } = useQuery({
    queryKey: ["warehouses", company?.id],
    queryFn: async () => {
      if (!company) return [];
      const { data } = await supabase.from("warehouses").select("*").eq("company_id", company.id).eq("is_active", true);
      return data || [];
    },
    enabled: !!company,
  });

  // Fetch available stock in the selected source warehouse
  const { data: availableStock = [] } = useQuery({
    queryKey: ["stock_inventory", company?.id, fromWarehouse],
    queryFn: async () => {
      if (!company || !fromWarehouse) return [];
      const { data } = await supabase
        .from("stock_inventory")
        .select(`
          quantity,
          variant_id,
          batch_id,
          product_variants ( sku, products ( name ) ),
          product_batches ( batch_number, expiry_date )
        `)
        .eq("company_id", company.id)
        .eq("warehouse_id", fromWarehouse)
        .gt("quantity", 0);
      return data || [];
    },
    enabled: !!company && !!fromWarehouse,
  });

  const transferMutation = useMutation({
    mutationFn: async () => {
      if (!fromWarehouse || !toWarehouse || !variantId || !quantity) {
        throw new Error(t("transfers.msg_req_fields"));
      }
      if (fromWarehouse === toWarehouse) {
        throw new Error(t("transfers.msg_same_wh"));
      }
      
      const qty = parseFloat(quantity);
      if (isNaN(qty) || qty <= 0) throw new Error(t("transfers.msg_qty_gt_zero"));

      const selectedStock = availableStock.find(s => s.variant_id === variantId && (s.batch_id === batchId || (!s.batch_id && !batchId)));
      if (!selectedStock || selectedStock.quantity < qty) {
        throw new Error(t("transfers.msg_insufficient_stock"));
      }

      // 1. Deduct from origin
      const batchCondition = batchId ? `batch_id.eq.${batchId}` : `batch_id.is.null`;
      
      const { error: errorOut } = await supabase
        .from("stock_inventory")
        .update({ quantity: selectedStock.quantity - qty, last_updated_at: new Date().toISOString() })
        .eq("warehouse_id", fromWarehouse)
        .eq("variant_id", variantId)
        .or(batchId ? `batch_id.eq.${batchId}` : `batch_id.is.null`);

      if (errorOut) throw errorOut;

      // 2. Add to destination
      // First check if destination exists
      const { data: destStock } = await supabase
        .from("stock_inventory")
        .select("quantity")
        .eq("warehouse_id", toWarehouse)
        .eq("variant_id", variantId)
        .or(batchId ? `batch_id.eq.${batchId}` : `batch_id.is.null`)
        .single();

      if (destStock) {
        await supabase
          .from("stock_inventory")
          .update({ quantity: destStock.quantity + qty, last_updated_at: new Date().toISOString() })
          .eq("warehouse_id", toWarehouse)
          .eq("variant_id", variantId)
          .or(batchId ? `batch_id.eq.${batchId}` : `batch_id.is.null`);
      } else {
        await supabase
          .from("stock_inventory")
          .insert([{
            company_id: company!.id,
            warehouse_id: toWarehouse,
            variant_id: variantId,
            batch_id: batchId || null,
            quantity: qty
          }]);
      }

      // 3. Record Movement
      const { error: moveError } = await supabase
        .from("stock_movements")
        .insert([{
          company_id: company!.id,
          variant_id: variantId,
          batch_id: batchId || null,
          from_warehouse_id: fromWarehouse,
          to_warehouse_id: toWarehouse,
          type: "TRANSFER",
          quantity: qty,
          reference_doc_type: "manual_transfer"
        }]);
        
      if (moveError) throw moveError;

      return true;
    },
    onSuccess: () => {
      setIsSuccessModalOpen(true);
      setVariantId("");
      setBatchId("");
      setQuantity("");
      queryClient.invalidateQueries({ queryKey: ["stock_inventory"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || t("transfers.msg_error"));
    }
  });

  return (
    <div className="pb-20">
      <Topbar
        title={t("transfers.title")}
        subtitle={t("transfers.subtitle")}
      />

      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-soft space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("transfers.origin")}</label>
              <select 
                value={fromWarehouse} 
                onChange={e => {
                  setFromWarehouse(e.target.value);
                  setVariantId("");
                  setBatchId("");
                }} 
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">{t("transfers.select")}</option>
                {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} ({w.type})</option>)}
              </select>
            </div>
            
            <ArrowRightLeft className="h-6 w-6 text-muted-foreground shrink-0 mt-6 hidden sm:block" />
            
            <div className="w-full space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("transfers.destination")}</label>
              <select 
                value={toWarehouse} 
                onChange={e => setToWarehouse(e.target.value)} 
                className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">{t("transfers.select")}</option>
                {warehouses.map(w => <option key={w.id} value={w.id} disabled={w.id === fromWarehouse}>{w.name} ({w.type})</option>)}
              </select>
            </div>
          </div>

          {fromWarehouse && (
            <div className="pt-6 border-t border-border space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("transfers.product_batch")}</label>
                <select 
                  value={`${variantId}|${batchId}`} 
                  onChange={e => {
                    const [vId, bId] = e.target.value.split('|');
                    setVariantId(vId);
                    setBatchId(bId || "");
                  }} 
                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="|">{t("transfers.select_product")}</option>
                  {availableStock.map((s, idx) => (
                    <option key={idx} value={`${s.variant_id}|${s.batch_id || ""}`}>
                      {s.product_variants?.products?.name} 
                      {s.product_batches?.batch_number ? ` (${t("transfers.batch_label")} ${s.product_batches.batch_number})` : ''} 
                      - {s.quantity} {t("transfers.available")}
                    </option>
                  ))}
                </select>
              </div>

              {variantId && (
                <div className="space-y-2 w-1/3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("transfers.quantity")}</label>
                  <input 
                    type="number" 
                    min="0.01" 
                    step="0.01" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)} 
                    className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          <div className="pt-6">
            <button
              onClick={() => transferMutation.mutate()}
              disabled={transferMutation.isPending || !fromWarehouse || !toWarehouse || !variantId || !quantity}
              className="w-full flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-50"
            >
              {transferMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t("transfers.confirm")}
            </button>
          </div>

        </div>
      </div>
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        title={t("transfers.success_title")} 
        message={t("transfers.success_msg")} 
      />
    </div>
  );
}
