import express from "express";
import {
  createReservation,
  getAllReservations,
  getUserReservations,
  updateReservation,
  getRoomUnavailableDates,
  deleteReservation
} from "../controllers/reservationController.js";
import { verifyToken, verifyAdmin } from "../utils/verifyToken.js"; // Senin middleware dosyan

const router = express.Router();

router.post("/", verifyToken, createReservation);

router.get("/", verifyAdmin, getAllReservations);

router.get("/profile/reservations", verifyToken, getUserReservations);

router.put("/:id", verifyAdmin, updateReservation);

router.get("/room/:roomId", getRoomUnavailableDates);

router.delete("/:id", deleteReservation);

export default router;
