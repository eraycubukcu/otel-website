import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT | 5000;

app.use(cors()); // frontend bağlantı
app.use(express.json()); // json verilerini okumak için
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Api çalışıyor.");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
