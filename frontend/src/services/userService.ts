import api from "./api";

export type UserData = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "Konaklıyor" | "Ayrıldı";
  currentRoom: string | null;
  totalSpent: number;
  lastVisit: string | null;
  createdAt: string;
};

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<UserData[]>("/users");
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
