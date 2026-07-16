import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-DqYihmFD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [session, setSession] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});
		return () => subscription.unsubscribe();
	}, []);
	const signIn = (0, import_react.useCallback)(async (email, password) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		return { error };
	}, []);
	const signUp = (0, import_react.useCallback)(async (email, password, fullName) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: { data: { full_name: fullName } }
		});
		return { error };
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		await supabase.auth.signOut();
	}, []);
	const updatePassword = (0, import_react.useCallback)(async (newPassword) => {
		const { error } = await supabase.auth.updateUser({ password: newPassword });
		return { error };
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			session,
			loading,
			signIn,
			signUp,
			signOut,
			updatePassword
		},
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (context === void 0) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { useAuth as n, AuthProvider as t };
