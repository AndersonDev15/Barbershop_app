import { create } from "zustand";

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
}

const BFF_URL = import.meta.env.VITE_BFF_URL ?? "http://127.0.0.1:8090";

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${BFF_URL}/auth/status`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("auth/status response:", data); // ← agrega esto

      if (data.authenticated) {
        const infoRes = await fetch(`${BFF_URL}/userinfo`, {
          credentials: "include",
        });
        const info = await infoRes.json();
        console.log("userinfo response:", info); // ← agrega esto
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
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error("checkAuth error:", e); // ← agrega esto
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: () => {
    // El BFF inicia el flujo OAuth2 → redirige al Auth Server :9000
    window.location.href = `${BFF_URL}/oauth2/authorization/barberia-client`;
  },

  logout: async () => {
    try {
      await fetch(`${BFF_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
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
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          coverImageUrl: url,
        },
      });
    }
  },
}));
