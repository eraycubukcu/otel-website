import express from "express";
import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";
import Room from "../models/Room.js"; // Room modelini içe aktar

const router = express.Router();

let sitemap; // Cache mekanizması (Sürekli veritabanını yormamak için)

router.get("/sitemap.xml", async (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");

  try {
    const hostname = "http://localhost:5173"; 

    const smStream = new SitemapStream({ hostname });
    const pipeline = smStream.pipe(createGzip());

    // 1. Statik Sayfalar (Elle eklediğimiz sabit sayfalar)
    smStream.write({ url: "/", changefreq: "daily", priority: 1.0 }); // Anasayfa
    smStream.write({ url: "/rooms", changefreq: "daily", priority: 0.8 }); // Odalar Listesi
    smStream.write({ url: "/contact", changefreq: "monthly", priority: 0.5 }); // İletişim (varsa)
    smStream.write({ url: "/about", changefreq: "monthly", priority: 0.3 }); // İletişim (varsa)

    // 2. Dinamik Sayfalar (Veritabanından gelen odalar)
    const rooms = await Room.find({}); // Tüm odaları çek

    rooms.forEach((room) => {
      // Eğer slug yoksa hata vermesin diye kontrol
      if (room.slug) {
        smStream.write({
          url: `/reservation/${room.slug}`, // Frontend'deki detay URL yapısı
          changefreq: "weekly",
          priority: 0.7,
          lastmod: room.updatedAt, // Son güncellenme tarihi
        });
      }
    });

    // Akışı bitir
    smStream.end();

    // XML'i oluştur ve gönder
    streamToPromise(pipeline).then((sm) => res.send(sm));
    
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

export default router;