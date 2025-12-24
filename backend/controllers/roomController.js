import Room from "../models/Room.js";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Oda bulunamadı." });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Geçersiz Oda ID" });
  }
};

export const getRoomBySlug = async (req, res) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug });
    if (!room) return res.status(404).json({ message: "Oda bulunamadı." });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRoom = async (req, res) => {
  // Frontend'den gelen verileri al
  const { title, category, price, capacity, size, description, image } = req.body;

  try {
    const room = new Room({
      title,
      category,
      price,
      capacity,
      size,
      description,
      image,
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    console.error("ODA EKLEME HATASI:", error); // Hatayı terminale yazdır
    // Eğer aynı isimde oda varsa özel mesaj dön
    if (error.code === 11000) {
      return res.status(400).json({ message: "Bu isimde bir oda zaten mevcut." });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      await room.deleteOne();
      res.status(200).json({ message: "Oda başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Oda bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};