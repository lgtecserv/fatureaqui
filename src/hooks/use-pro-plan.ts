import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export function useProPlan() {
  const { user } = useAuth();

  // Fetch company
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch subscription
  const { data: subscription, isLoading: isLoadingSub } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch system settings for trial days
  const { data: settings } = useQuery({
    queryKey: ["system-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("system_settings")
        .select("*")
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const now = new Date();
  const trialDays = settings?.trial_days || 30;
  const trialExpiration = company?.created_at ? new Date(company.created_at) : new Date();
  if (company?.created_at) {
    trialExpiration.setDate(trialExpiration.getDate() + trialDays);
  }

  const validUntil = subscription?.valid_until ? new Date(subscription.valid_until) : null;
  const isSubActive =
    Boolean(
      subscription &&
      (subscription.status === "ativo" || subscription.status === "active") &&
      validUntil &&
      now <= validUntil
    );

  const isTrialActive = company?.created_at ? now <= trialExpiration : false;

  // A user is Pro if they have an active paid Pro subscription OR are in their trial period
  const isPro = isSubActive || isTrialActive;

  const expirationDate = isSubActive ? validUntil : (isTrialActive ? trialExpiration : null);
  const daysLeft = expirationDate
    ? Math.max(0, Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    isPro,
    isSubActive,
    isTrialActive,
    daysLeft,
    subscription,
    company,
    isLoading: isLoadingCompany || isLoadingSub,
  };
}
