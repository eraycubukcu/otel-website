import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT | 5000;

app.use(cors()); // frontend bağlantı
app.use(express.json()); // json verilerini okumak için

app.get("/", (req, res) => {
  res.send("calısıyor.");
});

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
