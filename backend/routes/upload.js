import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Depolama Ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // backend/uploads klasörüne kaydet
  },
  filename: (req, file, cb) => {
    // Çakışmayı önlemek için tarih + orijinal isim
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenemedi." });
    }
    
    // Resmin tam erişim adresini oluştur
    // Backend portun 5000 ise:
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;