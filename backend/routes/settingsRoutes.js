import express from "express";
import { getHotelSettings, updateHotelSettings, changePassword } from "../controllers/settingsController.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/", getHotelSettings);
router.put("/", verifyAdmin, updateHotelSettings);
router.post("/change-password", verifyAdmin, changePassword);

export default router;