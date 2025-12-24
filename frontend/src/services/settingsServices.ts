import api from "./api";

// --- TİP TANIMLARI ---
export interface Feature {
  _id?: string;
  title: string;
  description: string;
  image: string;
}

export interface SiteSettings {
  _id?: string;
  siteTitle?: string;
  siteDescription?: string;
  logo?: string;
  heroImage?: string;   // Tekil resim desteği
  heroImages?: any[];   // Çoklu slider
  features?: Feature[]; // Özellik kartları
  email?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
}

export const settingsService = {
  getHotelSettings: async () => {
    const response = await api.get<SiteSettings>("/settings");
    return response.data;
  },

  updateHotelSettings: async (data: Partial<SiteSettings>) => {
    const response = await api.put("/settings", data);
    return response.data;
  },

  addSliderImage: async (imageUrl: string) => {
    const response = await api.put("/settings", { newSlideImage: imageUrl });
    return response.data;
  },

  removeSliderImage: async (imageUrl: string) => {
    const response = await api.put("/settings", { removeSlideImage: imageUrl });
    return response.data;
  },

  changePassword: async (passwords: any) => {
    const response = await api.post("/settings/change-password", passwords);
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