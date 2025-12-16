import api from "./api";

export interface MessageData {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  sendMessage: async (data: ContactForm) => {
    const response = await api.post("/messages", data);
    return response.data;
  },

  getAllMessages: async () => {
    const response = await api.get<MessageData[]>("/messages");
    return response.data;
  },

  deleteMessage: async (id: string) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.put<MessageData>(`/messages/${id}/read`);
    return response.data;
  },
};
