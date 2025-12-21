import api from "./api";

export const settingsService = {
  // Mevcut ayarları getir
  getHotelSettings: async () => {
    const response = await api.get("/settings");
    return response.data;
  },

  // Genel Güncelleme (Başlık, Logo, Telefon vb. standart alanlar için)
  updateHotelSettings: async (data: any) => {
    const response = await api.put("/settings", data);
    return response.data;
  },

  // --- YENİ: Slider Resim Yönetimi ---

  // Galeriye Yeni Resim Ekle (Backend'de $push çalıştırır)
  addSliderImage: async (imageUrl: string) => {
    // Backend controller'daki 'newSlideImage' kontrolünü tetikler
    const response = await api.put("/settings", { newSlideImage: imageUrl });
    return response.data;
  },

  // Galeriden Resim Sil (Backend'de $pull çalıştırır)
  removeSliderImage: async (imageUrl: string) => {
    // Backend controller'daki 'removeSlideImage' kontrolünü tetikler
    const response = await api.put("/settings", { removeSlideImage: imageUrl });
    return response.data;
  },
  
  // -----------------------------------

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