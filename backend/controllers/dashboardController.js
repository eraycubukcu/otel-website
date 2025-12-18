import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {

  try {
    let stats = {
      totalIncome: 0,
      activeReservationsCount: 0,
      totalGuests: 0,
      occupancyRate: 0,
      totalRooms: 0,
      occupiedRooms: 0
    };
    let recentBookings = [];

    try {
      const totalRooms = await Room.countDocuments();

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

    try {
      const incomeResult = await Reservation.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
      ]);
      stats.totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

      stats.activeReservationsCount = await Reservation.countDocuments({
        status: { $in: ["booked", "checkedIn", "confirmed"] }
      });

      stats.totalGuests = await User.countDocuments({
        $or: [{ isAdmin: false }, { role: "user" }]
      });

    } catch (e) {
      console.error("❌ İstatistik Hatası:", e.message);
    }

    try {
      recentBookings = await Reservation.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("userId", "name email")
        .populate("user", "name email")
        .populate("roomId", "title")
        .populate("room", "title");

      
    } catch (e) {
      console.error("❌ Son Rezervasyonlar Hatası:", e.message);
    }

    // Frontend'e gönder
    res.status(200).json({
      stats,
      recentBookings
    });

  } catch (err) {
    console.error("🔥 GENEL SERVER HATASI:", err);
    next(err);
  }
};