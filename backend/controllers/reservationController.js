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

    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res
        .status(400)
        .json({ message: "Çıkış tarihi giriş tarihinden sonra olmalıdır." });
    }

    // todo : seçilen tarihlerde odanın dolu olup olmama kontrolu eklenecek

    const newReservation = new Reservation({
      user : req.user.id,
      room,
      checkInDate,
      checkOutDate,
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
