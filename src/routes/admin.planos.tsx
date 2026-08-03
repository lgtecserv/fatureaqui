import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, CreditCard, Building2, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/planos")({
  component: AdminPlanosPage,
});

function AdminPlanosPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    pro_price: 499.00,
    mpesa_number: "",
    mpesa_name: "",
    emola_number: "",
    emola_name: "",
    bank_nib: "",
    bank_name: "",
    bank_account: ""
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("id", "00000000-0000-0000-0000-000000000001")
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        pro_price: settings.pro_price || 499.00,
        mpesa_number: settings.mpesa_number || "",
        mpesa_name: settings.mpesa_name || "",
        emola_number: settings.emola_number || "",
        emola_name: settings.emola_name || "",
        bank_nib: settings.bank_nib || "",
        bank_name: settings.bank_name || "",
        bank_account: settings.bank_account || ""
      });
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (newData: typeof formData) => {
      const { error } = await supabase
        .from("system_settings")
        .update({
          ...newData,
          updated_at: new Date().toISOString()
        })
        .eq("id", "00000000-0000-0000-0000-000000000001");
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-settings"] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar as configurações. Verifique as suas permissões.");
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "pro_price" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Planos & Subscrições</h1>
        <p className="text-slate-500 mt-1">Configure o preço e os métodos de pagamento visíveis para as empresas.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Regras do Plano Pro
              </CardTitle>
              <CardDescription>O valor base para utilização do sistema sem limites.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="pro_price">Preço Mensal (MT)</Label>
                  <Input 
                    id="pro_price" 
                    name="pro_price" 
                    type="number" 
                    step="0.01" 
                    value={formData.pro_price} 
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">O cálculo automático do MRR usará este valor.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Dados do M-Pesa
              </CardTitle>
              <CardDescription>Esta informação aparecerá na página de pagamento do cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="mpesa_number">Número de Telemóvel (M-Pesa)</Label>
                  <Input 
                    id="mpesa_number" 
                    name="mpesa_number" 
                    placeholder="Ex: 840000000" 
                    value={formData.mpesa_number} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mpesa_name">Nome Titular (M-Pesa)</Label>
                  <Input 
                    id="mpesa_name" 
                    name="mpesa_name" 
                    placeholder="Nome registado no M-Pesa" 
                    value={formData.mpesa_name} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-red-600" />
                Dados do e-Mola
              </CardTitle>
              <CardDescription>Esta informação aparecerá na página de pagamento do cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="emola_number">Número de Telemóvel (e-Mola)</Label>
                  <Input 
                    id="emola_number" 
                    name="emola_number" 
                    placeholder="Ex: 860000000" 
                    value={formData.emola_number} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="emola_name">Nome Titular (e-Mola)</Label>
                  <Input 
                    id="emola_name" 
                    name="emola_name" 
                    placeholder="Nome registado no e-Mola" 
                    value={formData.emola_name} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Transferência Bancária
              </CardTitle>
              <CardDescription>Dados bancários para envio de comprovativos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="bank_name">Nome do Banco</Label>
                  <Input 
                    id="bank_name" 
                    name="bank_name" 
                    placeholder="Ex: Millennium BIM, BCI" 
                    value={formData.bank_name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bank_account">Número da Conta</Label>
                  <Input 
                    id="bank_account" 
                    name="bank_account" 
                    placeholder="Ex: 12345678" 
                    value={formData.bank_account} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bank_nib">NIB</Label>
                  <Input 
                    id="bank_nib" 
                    name="bank_nib" 
                    placeholder="Opcional" 
                    value={formData.bank_nib} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {updateMutation.isPending ? "A Guardar..." : "Guardar Configurações"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
