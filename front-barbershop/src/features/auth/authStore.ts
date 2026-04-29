import { create } from "zustand";
import api from "../../lib/api";

export type UserRole = "ROLE_CLIENTE" | "ROLE_BARBERO" | "ROLE_BARBERIA";

export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  roles: UserRole[];
  given_name: string;
  family_name: string;
  phone_number: string;
  isGoogleUser: boolean;
  coverImageUrl?: string;
  barberShopName?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Consulta al BFF si hay sesión activa
  checkAuth: () => Promise<void>;
  // Redirige al BFF para iniciar el flujo OAuth2
  login: () => void;
  // Cierra sesión en el BFF
  logout: () => Promise<void>;
  // Helper: retorna true si el usuario tiene alguno de los roles indicados
  hasRole: (roles: UserRole[]) => boolean;
  // Actualiza la imagen de portada del usuario/barbería
  setCoverImageUrl: (url: string) => void;
  // Actualiza el nombre de la barbería
  setBarberShopName: (name: string) => void;
}
const BFF_URL = import.meta.env.VITE_BFF_URL;

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get("/auth/status");

      if (data.authenticated) {
        const { data: info } = await api.get("/userinfo");

        let barberShopName = undefined;

        if (info.roles.includes("ROLE_BARBERIA")) {
          try {
            const { data: meData } = await api.get("/auth/me");
            barberShopName = meData.barberShopName;
          } catch (e) {
            console.error("Error fetching shop name:", e);
          }
        }

        set({
          user: {
            sub: info.sub,
            name: info.name,
            email: info.email,
            roles: info.roles,
            given_name: info.given_name ?? "",
            family_name: info.family_name ?? "",
            phone_number: info.phone_number ?? "",
            isGoogleUser: info.is_google_user ?? false,
            coverImageUrl: info.coverImageUrl,
            barberShopName,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error("checkAuth error:", e);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: () => {
    window.location.href = `${import.meta.env.VITE_BFF_URL}/oauth2/authorization/barberia-client`;
  },

  logout: async () => {
    try {
      await api.post("/logout");
    } finally {
      set({ user: null, isAuthenticated: false });
      window.location.href = "/";
    }
  },

  hasRole: (roles: UserRole[]) => {
    const userRoles = get().user?.roles ?? [];
    return roles.some((r) => userRoles.includes(r));
  },

  setCoverImageUrl: (url: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, coverImageUrl: url } : null,
    }));
  },

  setBarberShopName: (name: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, barberShopName: name } : null,
    }));
  },
}));
