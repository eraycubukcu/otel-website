import api from "./api";
import type { Room } from "./roomService";

export type Reservation = {
  _id: string;
  user: {
    _id: string;
    name:string,
    surname:string,
    email: string;
  };
  room: Room; // Backend'de populate işlemi yapıldığı için tüm oda bilgisi gelir
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  guestNote?: string;
  createdAt: string;
};

// Rezervasyon Oluştururken Gönderilecek Veri Tipi
export type CreateReservationData = {
  room: string; // Sadece Room ID gönderiyoruz
  checkInDate: string | Date;
  checkOutDate: string | Date;
  totalPrice: number;
  guestNote?: string;
};

export const reservationService = {
  getAllReservations: async () => {
    const response = await api.get<Reservation[]>("/reservations");
    return response.data;
  },

  getUserReservation: async () => {
    const response = await api.get<Reservation[]>("/reservations/profile/reservations");
    return response.data;
  },

  getReservationById: async (id: string) => {
    const response = await api.get<Reservation[]>(`/reservations/${id}`);
    return response.data;
  },

  createReservation: async (data: CreateReservationData) => {
    const response = await api.post("/reservations", data);
    return response.data;
  },

  // durumunu güncelleme olayı admin için
  updateReservation: async (id: string, status: "confirmed" | "cancelled") => {
    const response = await api.put(`/reservations/${id}`, { status });
    return response.data;
  },

  deleteReservation: async (id: string) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
  },
};
