import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // geçerlilik süresi 30 gün olsun
  });
};

export const registerUser = async (req, res) => {
  const { name, surname, email, password, phone } = req.body;
  // console.log("Veri:", req.body);
  try {
    // kullanıcı var mı
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Bu e-posta zaten kullanılıyor." });
    }

    // şifreyi hashleme kısmı
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // kullanıcıyı oluştur
    const user = await User.create({
      name: name,
      surname: surname,
      email: email,
      password: hashedPassword,
      phone,
    });

    // başarılı ise kullanıcıyı ve token'i gönderiyorum.
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Geçersiz kullanıcı verisi." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Geçersiz e posta veya şifre" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
