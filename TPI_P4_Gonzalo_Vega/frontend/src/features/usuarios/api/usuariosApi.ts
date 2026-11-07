import { axiosInstance } from "../../../shared/api/axiosInstance";
import type { UserPublic } from "../../auth/types";

export const usuariosApi = {
  getAll: async (): Promise<UserPublic[]> => {
    const res = await axiosInstance.get<UserPublic[]>("/admin/usuarios");
    return res.data;
  },

  activar: async (id: number): Promise<UserPublic> => {
    const res = await axiosInstance.post<UserPublic>(
      `/admin/usuarios/${id}/activar`
    );
    return res.data;
  },

  desactivar: async (id: number): Promise<UserPublic> => {
    const res = await axiosInstance.post<UserPublic>(
      `/admin/usuarios/${id}/desactivar`
    );
    return res.data;
  },
};

