import mongoose from "mongoose";

const HotelSettingsSchema = new mongoose.Schema(
  {
    // Site Görünümü
    siteTitle: { type: String, default: "MoonRose Otel" },
    siteDescription: {
      type: String,
      default: "Şehrin kalbinde konforlu konaklama.",
    },
    logo: { type: String, default: "" }, // Resim URL'i
    heroImages: {
      type: [String], // Sadece String'lerden oluşan bir dizi
      default: [],
    },
    // heroImage: { type: String },

    // İletişim
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },

    // Sosyal Medya
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },

    features: [
      {
        title: { type: String },
        description: { type: String },
        image: { type: String },
      },
    ],

    about: {
      type: String,
      required: true,
    },

    aboutImage: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("HotelSettings", HotelSettingsSchema);
