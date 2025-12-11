import User from "../models/User.js";
import Reservation from "../models/Reservation.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        try {
          // Rezervasyonları çek (Hata olursa boş dizi kabul et)
          const reservations =
            (await Reservation.find({ user: user._id }).populate("room")) || [];

          // Toplam harcama (Güvenli hesaplama)
          const totalSpent = reservations.reduce((acc, curr) => {
            return acc + (curr.totalPrice || 0); // Fiyat yoksa 0 say
          }, 0);

          // Aktif rezervasyon kontrolü
          const activeRes = reservations.find((res) => {
            // Tarih geçerli mi kontrol et
            const checkOut = res.checkOutDate
              ? new Date(res.checkOutDate)
              : new Date(0);
            return res.status === "confirmed" && checkOut > new Date();
          });

          // Son ziyaret
          const lastVisit =
            reservations.length > 0
              ? reservations.sort(
                  (a, b) => new Date(b.checkOutDate) - new Date(a.checkOutDate)
                )[0].checkOutDate
              : null;

          return {
            _id: user._id,
            fullName: `${user.name || ""} ${user.surname || ""}`, // İsim yoksa boş string
            email: user.email,
            phone: user.phone || "-",
            status: activeRes ? "Konaklıyor" : "Ayrıldı",
            currentRoom: activeRes?.room?.title || null, // Room silinmişse null
            totalSpent: totalSpent,
            lastVisit: lastVisit,
            createdAt: user.createdAt,
          };
        } catch (innerError) {
          console.error(
            `Kullanıcı ID: ${user._id} işlenirken hata:`,
            innerError
          );
          // Bu kullanıcıda hata olsa bile diğerlerini etkilemesin
          return {
            _id: user._id,
            fullName: "Veri Hatası",
            email: user.email,
            status: "Bilinmiyor",
            totalSpent: 0,
            lastVisit: null,
          };
        }
      })
    );

    res.status(200).json(usersWithStats);
  } catch (err) {
    console.error("GENEL HATA:", err);
    // Frontend'e boş dizi dön ki sayfa patlamasın
    res.status(500).json({ message: err.message });
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kullanıcı silindi." });
  } catch (error) {
    next(error);
  }
};
