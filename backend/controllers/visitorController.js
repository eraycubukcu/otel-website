import Visitor from "../models/Visitors.js";

export const recordVisit = async (req, res) => {
  try {
    // ip adresini alıyoruz
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // bu ip bugün siteye girmiş mi kontrolü
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingVisit = await Visitor.findOne({
      ip: ip,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // bugün girdiyse tekrar kaydetme
    if (existingVisit) {
      return res.status(200).json({ message: "Ziyaret zaten kayıtlı." });
    }

    const newVisit = new Visitor({ ip, userAgent });
    await newVisit.save();
    res.status(201).json({ message: "Ziyaret kaydedildi." });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getVisitorStats = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayVisitors = await Visitor.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    res.status(200).json({ totalVisitors, todayVisitors });
  } catch (error) {
    res.status(500).json(error);
  }
};
