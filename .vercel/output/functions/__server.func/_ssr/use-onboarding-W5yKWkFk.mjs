import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-onboarding-W5yKWkFk.js
function useOnboarding() {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["onboarding", user?.id],
		queryFn: async () => {
			if (!user) return {
				isComplete: false,
				progress: 0,
				steps: []
			};
			const { data: company, error } = await supabase.from("companies").select("nuit, address, phone, logo_url").eq("user_id", user.id).single();
			if (error || !company) return {
				isComplete: false,
				progress: 0,
				steps: []
			};
			const steps = [
				{
					id: "nuit",
					title: "Adicionar NUIT",
					description: "Obrigatório para emissão de documentos com validade fiscal.",
					isComplete: !!(company.nuit && company.nuit.trim().length > 0)
				},
				{
					id: "address",
					title: "Preencher Morada",
					description: "A morada física ou sede da sua empresa.",
					isComplete: !!(company.address && company.address.trim().length > 0)
				},
				{
					id: "phone",
					title: "Adicionar Contacto",
					description: "Telefone ou telemóvel da sua empresa.",
					isComplete: !!(company.phone && company.phone.trim().length > 0)
				},
				{
					id: "logo",
					title: "Logotipo da Empresa",
					description: "Dê uma imagem profissional aos seus documentos.",
					isComplete: !!(company.logo_url && company.logo_url.trim().length > 0)
				}
			];
			const completedSteps = steps.filter((step) => step.isComplete).length;
			const progress = Math.round(completedSteps / steps.length * 100);
			return {
				isComplete: progress === 100,
				progress,
				steps
			};
		},
		enabled: !!user
	});
}
//#endregion
export { useOnboarding as t };
