import mongoose from "mongoose";
import dotenv from "dotenv";
import Room from "./models/Room.js"; // Model yolunun doğru olduğundan emin ol

dotenv.config();

const seedRooms = async () => {
  try {
    // 1. Veritabanına Bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Bağlantısı Başarılı");

    // 2. Mevcut Odaları Temizle (Çakışma olmasın)
    await Room.deleteMany();
    console.log("Eski odalar silindi...");

    // 3. Yeni Test Odası Ekle (Resim internetten, dosya yükleme derdi yok)
    const testRoom = new Room({
      title: "Test Kral Dairesi",
      // Slug'ı elle yazmıyoruz, model otomatik oluşturacak
      category: "suite",
      price: 5000,
      capacity: "2 Yetişkin, 2 Çocuk",
      size: "85 m²",
      description: "Bu oda script ile otomatik eklenmiştir. Test amaçlıdır.",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1000&auto=format&fit=crop",
      isAvailable: true,
      features: ["Wifi", "Jakuzi", "Manzara"]
    });

    await testRoom.save();
    
    console.log("✅ YENİ ODA BAŞARIYLA EKLENDİ!");
    console.log("Oluşan Slug:", testRoom.slug);
    
    process.exit();
  } catch (error) {
    console.error("HATA:", error);
    process.exit(1);
  }
};

seedRooms();