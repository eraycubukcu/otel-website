import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  getRoomBySlug
} from "../controllers/roomController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(getAllRooms)
    .post(protect, admin, createRoom);

// Detay sayfası için Slug rotası
router.get("/details/:slug", getRoomBySlug);

router.route("/:id")
    .get(getRoomById)
    .delete(protect, admin, deleteRoom);

export default router;