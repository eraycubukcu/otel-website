import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    // Varsayılan istatistikler
    let stats = {
      totalIncome: 0,
      activeReservationsCount: 0,
      totalGuests: 0,
      occupancyRate: 0,
      totalRooms: 0,
      occupiedRooms: 0
    };

    // 1. DOLULUK ORANI HESAPLAMA
    try {
      const totalRooms = await Room.countDocuments();
      
      // Dolu odalar: Giriş yapmış veya rezervasyonu onaylanmış olanlar
      const occupiedRooms = await Reservation.countDocuments({
        status: { $in: ["checkedIn", "booked", "confirmed"] }
      });
      
      stats.totalRooms = totalRooms;
      stats.occupiedRooms = occupiedRooms;

      if (totalRooms > 0) {
        stats.occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
      }
    } catch (e) {
      console.error("Doluluk Oranı Hatası:", e.message);
    }

    // 2. GELİR VE DİĞER SAYIMLAR
    try {
      // Toplam Gelir
      const incomeResult = await Reservation.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]);
      stats.totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

      // Aktif Rezervasyon Sayısı
      stats.activeReservationsCount = await Reservation.countDocuments({
        status: { $in: ["booked", "checkedIn", "confirmed"] }
      });

      // Toplam Üye Sayısı
      stats.totalGuests = await User.countDocuments({
        $or: [{ isAdmin: false }, { role: "user" }]
      });

    } catch (e) {
      console.error("❌ İstatistik Hatası:", e.message);
    }

    // HATA VEREN "populate" KISMI TAMAMEN SİLİNDİ.
    
    // Frontend'e sadece stats gönderiyoruz
    res.status(200).json({
      stats
    });

  } catch (err) {
    console.error("🔥 GENEL SERVER HATASI:", err);
    next(err);
  }
};