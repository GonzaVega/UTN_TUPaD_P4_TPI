import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsuarioAuth } from "../types/auth.types";
import { axiosInstance } from "../api/axiosInstance";

interface AuthState {
  user: UsuarioAuth | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<UsuarioAuth>;
  logout: () => Promise<void>;
  checkSession: () => Promise<UsuarioAuth | null>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const params = new URLSearchParams();
          params.append("username", email);
          params.append("password", password);

          await axiosInstance.post("/auth/token", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          });

          const meRes = await axiosInstance.get<UsuarioAuth>("/auth/me");
          set({ user: meRes.data, isLoading: false });
          return meRes.data;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
        } catch {
        } finally {
          set({ user: null, isLoading: false });
        }
      },

      checkSession: async () => {
        try {
          const res = await axiosInstance.get<UsuarioAuth>("/auth/me");
          set({ user: res.data, isLoading: false });
          return res.data;
        } catch {
          set({ user: null, isLoading: false });
          return null;
        }
      },

      clearSession: () => {
        set({ user: null, isLoading: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

