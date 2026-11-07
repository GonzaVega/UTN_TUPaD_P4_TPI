import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserPublic } from "../features/auth/types";
import { axiosInstance } from "../shared/api/axiosInstance";

interface AuthState {
  usuario: UserPublic | null;
  cargando: boolean;
  login: (username: string, password: string) => Promise<UserPublic>;
  logout: () => Promise<void>;
  checkSession: () => Promise<UserPublic | null>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username: string, password: string) => {
        set({ cargando: true });
        try {
          const params = new URLSearchParams();
          params.append("username", username);
          params.append("password", password);

          await axiosInstance.post("/auth/token", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          // Obtener datos del perfil con la cookie HttpOnly recién establecida
          const meRes = await axiosInstance.get<UserPublic>("/auth/me");
          set({ usuario: meRes.data, cargando: false });
          return meRes.data;
        } catch (error) {
          set({ cargando: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch {
          // Ignorar error al cerrar sesión
        } finally {
          set({ usuario: null, cargando: false });
        }
      },

      checkSession: async () => {
        try {
          const res = await axiosInstance.get<UserPublic>("/auth/me");
          set({ usuario: res.data, cargando: false });
          return res.data;
        } catch {
          set({ usuario: null, cargando: false });
          return null;
        }
      },

      clearSession: () => {
        set({ usuario: null, cargando: false });
      },
    }),
    {
      name: "foodstore-auth",
      partialize: (state) => ({ usuario: state.usuario }),
    }
  )
);

