import Room from "../models/Room.js";

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) res.status(404).json({ message: "Oda bulunamadı." });
    else res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Geçersiz Oda Id'si" });
  }
};

export const createRoom = async (req, res) => {
  const { title, category, price, capacity, size, description, image } =
    req.body;
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
    res.status(400).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: "Oda başarıyla silindi." });
    } else {
      res.status(404).json({ message: "Oda bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
