import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export interface OnboardingStatus {
  isComplete: boolean;
  progress: number;
  steps: {
    id: string;
    title: string;
    description: string;
    isComplete: boolean;
  }[];
}

export function useOnboarding() {
  const { user } = useAuth();

  return useQuery<OnboardingStatus>({
    queryKey: ["onboarding", user?.id],
    queryFn: async () => {
      if (!user) {
        return {
          isComplete: false,
          progress: 0,
          steps: [],
        };
      }

      const { data: company, error } = await supabase
        .from("companies")
        .select("nuit, address, phone, logo_url")
        .eq("user_id", user.id)
        .single();

      if (error || !company) {
        return {
          isComplete: false,
          progress: 0,
          steps: [],
        };
      }

      const steps = [
        {
          id: "nuit",
          title: "onboarding.steps.nuit.title",
          description: "onboarding.steps.nuit.desc",
          isComplete: !!(company.nuit && company.nuit.trim().length > 0),
        },
        {
          id: "address",
          title: "onboarding.steps.address.title",
          description: "onboarding.steps.address.desc",
          isComplete: !!(company.address && company.address.trim().length > 0),
        },
        {
          id: "phone",
          title: "onboarding.steps.phone.title",
          description: "onboarding.steps.phone.desc",
          isComplete: !!(company.phone && company.phone.trim().length > 0),
        },
        {
          id: "logo",
          title: "onboarding.steps.logo.title",
          description: "onboarding.steps.logo.desc",
          isComplete: !!(company.logo_url && company.logo_url.trim().length > 0),
        },
      ];

      const completedSteps = steps.filter((step) => step.isComplete).length;
      const progress = Math.round((completedSteps / steps.length) * 100);
      const isComplete = progress === 100;

      return {
        isComplete,
        progress,
        steps,
      };
    },
    enabled: !!user,
  });
}
