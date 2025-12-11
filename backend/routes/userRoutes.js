import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
} from "../controllers/userController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", verifyUser, getUser);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
