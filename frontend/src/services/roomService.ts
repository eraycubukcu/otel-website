import api from "./api";

export type Room = {
  _id: string;
  title: string;
  category: string;
  price: number;
  capacity: string;
  size: string;
  description: string;
  image: string;
  features: string[];
};

export const roomService = {
  // tüm odaları getiriyor user ve admin için
  getAllRooms: async () => {
    const response = await api.get<Room[]>("/rooms");
    return response.data;
  },

  // id'ye göre oda getiriyor
  getRoomById: async (id: string) => {
    const response = await api.get<Room>(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (roomData: any) => {
    const response = await api.post("/rooms", roomData);
    return response.data;
  },

  updateRoom: async (roomData: any, id: string) => {
    const response = await api.post(`/rooms/${id}`, roomData);
    return response.data;
  },

  deleteRoom: async (id: string) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  },
};
