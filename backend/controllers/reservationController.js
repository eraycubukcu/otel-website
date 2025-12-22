import Reservation from "../models/Reservation.js";
import User from "../models/User.js";

export const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name surname email")
      .populate("room", "title price");

    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

export const createReservation = async (req, res, next) => {
  try {
    const { room, checkInDate, checkOutDate, totalPrice, guestNote } = req.body;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "Çıkış tarihi giriş tarihinden sonra olmalıdır." });
    }

    const existingReservation = await Reservation.findOne({
      room: room,
      status: { $ne: "cancelled" }, 
      $and: [
        { checkInDate: { $lt: end } }, 
        { checkOutDate: { $gt: start } } 
      ]
    });

    if (existingReservation) {
      return res.status(400).json({ 
        success: false, 
        message: "Üzgünüz, seçtiğiniz tarihlerde bu oda zaten dolu." 
      });
    }

    const newReservation = new Reservation({
      user: req.user.id,
      room,
      checkInDate: start,
      checkOutDate: end, 
      totalPrice,
      guestNote,
      status: "pending",
    });

    const savedReservation = await newReservation.save();

    res.status(201).json({
      success: true,
      message: "Rezervasyon talebiniz alındı.",
      data: savedReservation,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserReservations = async (req, res, next) => {
  try {
    // "title" yanına "image" ve "price" da ekledik
    const reservations = await Reservation.find({ user: req.user.id })
      .populate("room", "title image price"); 
      
    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

export const updateReservation = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updateReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Rezervasyon durumu güncellendi.",
      data: updateReservation,
    });
  } catch (err) {
    next(err);
  }
};

export const getRoomUnavailableDates = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const reservations = await Reservation.find({
      room: roomId,
      status: { $ne: "cancelled" },
    }).select("checkInDate checkOutDate");

    res.status(200).json(reservations);
  } catch (err) {
    next(err);
  }
};

export const deleteReservation = async (req, res, next) => {
  try {
    const reservationId = req.params.id;

    // Veritabanından sil
    const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ success: false, message: "Rezervasyon bulunamadı." });
    }

    res.status(200).json({
      success: true,
      message: "Rezervasyon başarıyla silindi."
    });
  } catch (err) {
    next(err);
  }
};