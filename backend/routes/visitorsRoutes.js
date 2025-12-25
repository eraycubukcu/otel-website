import express from "express";
import {
  getVisitorStats,
  recordVisit,
} from "../controllers/visitorController.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/", recordVisit);
router.get("/stats", verifyAdmin, getVisitorStats);

// router.get("/", async (req, res) => {
//   try {
//     const visitors = await Visitor.find().sort({ createdAt: -1 }); // En son giren en üstte
//     res.status(200).json(visitors);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


export default router;
