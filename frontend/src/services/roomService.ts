import api from "./api";

export interface Room {
  _id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  capacity: string;
  size: string;
  description: string;
  image: string;
  features?: string[];
  isAvailable: boolean;
}

export const roomService = {
  getAllRooms: async () => {
    const response = await api.get<Room[]>("/rooms");
    return response.data;
  },

  getRoomById: async (id: string) => {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  getRoomBySlug: async (slug: string) => {
    // Backend'de tanımladığımız /details/:slug rotasına istek atar
    const response = await api.get<Room>(`/rooms/details/${slug}`);
    return response.data;
  },

  createRoom: async (roomData: Partial<Room>) => {
    const response = await api.post("/rooms", roomData);
    return response.data;
  },
  
  // Güncelleme fonksiyonu (AdminRooms'da kullanılıyor olabilir)
    updateRoom: async (id: string, roomData: Partial<Room>) => {
    // Backend'de update rotası henüz yoksa hata verebilir, şimdilik dursun
    // const response = await api.put(`/rooms/${id}`, roomData);
    // return response.data;
    throw new Error("Güncelleme özelliği henüz backend'de aktif değil.");
  },

  deleteRoom: async (id: string) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  }
};