import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage Motorunu Oluştur
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "otel_website", // Cloudinary'de oluşturulacak klasör adı
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // İzin verilen formatlar
  },
});

// 3. Multer'ı Hazırla
const upload = multer({ storage: storage });

export default upload;