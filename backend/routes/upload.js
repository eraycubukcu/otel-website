import express from "express";
import upload from "../config/cloudinary.js"; 

const router = express.Router();

router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenemedi." });
    }

    res.status(200).json({ 
        url: req.file.path,
        public_id: req.file.filename
    });
    
  } catch (error) {
    console.error("Upload Hatası:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

export default router;