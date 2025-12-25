import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dashboardRoute from "./routes/dashboardRoutes.js";
import settingsRouter from "./routes/settingsRoutes.js";
import { fileURLToPath } from "url";
import uploadRoute from "./routes/upload.js";
import path from "path";
import sitemapRoute from "./routes/sitemapRoute.js";
import visitorRouter from "./routes/visitorsRoutes.js";

dotenv.config();
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT | 5000;

// canlıya alındığında kullanıcının gerçek ip'sini almaya devam etmesi için kullanılır
// app.set('trust proxy', 1); 


app.use(cors()); // frontend bağlantı
app.use(express.json()); // json verilerini okumak için
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(sitemapRoute);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/settings", settingsRouter);
app.use("/api/visitors", visitorRouter);

app.get("/", (req, res) => {
  res.send("Api çalışıyor.");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
