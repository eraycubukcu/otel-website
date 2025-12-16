import express from "express";
import {
  getAllMessages,
  createMessage,
  deleteMessage,
  markAsRead,
} from "../controllers/messageController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", createMessage);

router.get("/", verifyAdmin, getAllMessages);
router.put("/:id/read", verifyAdmin, markAsRead);
router.delete("/:id", verifyAdmin, deleteMessage);

export default router;