import { axiosInstance } from "../../../shared/api/axiosInstance";
import type { MessageResponse, UserCreatePayload, UserPublic } from "../types";

export const authApi = {
  register: async (payload: UserCreatePayload): Promise<UserPublic> => {
    const res = await axiosInstance.post<UserPublic>("/auth/register", payload);
    return res.data;
  },

  login: async (username: string, password: string): Promise<MessageResponse> => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    const res = await axiosInstance.post<MessageResponse>("/auth/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data;
  },

  logout: async (): Promise<MessageResponse> => {
    const res = await axiosInstance.post<MessageResponse>("/auth/logout");
    return res.data;
  },

  getMe: async (): Promise<UserPublic> => {
    const res = await axiosInstance.get<UserPublic>("/auth/me");
    return res.data;
  },
};

