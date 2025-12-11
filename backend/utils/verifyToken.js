import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(createError(401, "Token bulunamadı!"));
  }

  const SECRET_KEY = process.env.JWT_SECRET || process.env.JWT;

  if (!SECRET_KEY) {
    console.error("HATA: .env dosyasında JWT_SECRET veya JWT tanımlı değil!");
    return next(createError(500, "Sunucu Hatası: Gizli anahtar bulunamadı."));
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Doğrulama Hatası:", err.message);
      return next(createError(403, "Token geçersiz!"));
    }
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "Yetkiniz yok!"));
    }
  });
};
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return next(createError(403, `Yetkisiz işlem! Sizin rolünüz: ${req.user.role || "YOK"}`));
    }
  });
};