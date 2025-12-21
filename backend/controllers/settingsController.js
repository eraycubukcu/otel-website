import HotelSettings from "../models/HotelSettings.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Ayarları Getir (Yoksa oluşturur)
export const getHotelSettings = async (req, res, next) => {
  try {
    let settings = await HotelSettings.findOne();
    if (!settings) {
      settings = await HotelSettings.create({});
    }
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
};

// Ayarları Güncelle (AKILLI GÜNCELLEME)
export const updateHotelSettings = async (req, res, next) => {
  try {
    // 1. Gelen veriyi parçalara ayırıyoruz
    // newSlideImage: Frontend'den "slider'a ekle" isteği gelirse
    // removeSlideImage: Frontend'den "slider'dan sil" isteği gelirse
    // ...otherSettings: Başlık, logo, telefon gibi standart güncellemeler
    const { newSlideImage, removeSlideImage, ...otherSettings } = req.body;

    let updateQuery = {};

    // 2. Hangi işlemin yapılacağına karar ver
    if (newSlideImage) {
      // Diziye yeni resim ekle ($push)
      updateQuery = { $push: { heroImages: newSlideImage } };
    } 
    else if (removeSlideImage) {
      // Diziden resmi çıkar ($pull)
      updateQuery = { $pull: { heroImages: removeSlideImage } };
    } 
    else {
      // Standart ayarları güncelle ($set)
      // (Örn: siteTitle değiştiyse, eski heroImages dizisine dokunmadan sadece başlığı günceller)
      updateQuery = { $set: otherSettings };
    }

    // 3. Veritabanı işlemini yap
    const updatedSettings = await HotelSettings.findOneAndUpdate(
      {}, 
      updateQuery,
      { new: true, upsert: true }
    );

    res.status(200).json(updatedSettings);
  } catch (err) {
    next(err);
  }
};

// Şifre Değiştir
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mevcut şifre yanlış." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Şifre başarıyla güncellendi." });
  } catch (err) {
    next(err);
  }
};