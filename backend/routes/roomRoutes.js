import express from "express";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
} from "../controllers/roomController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/")
    .get(getAllRooms)
    .post(protect, admin, createRoom);

router.route("/:id")
    .get(getRoomById)
    .delete(protect, admin, deleteRoom);

export default router;
