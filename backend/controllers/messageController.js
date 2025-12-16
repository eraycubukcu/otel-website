import Message from "../models/Message.js";

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json({
      success: true,
      message: "Mesajınız başarıyla iletildi.",
      data: savedMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    res.status(200).json("Mesaj silindi.");
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    next(error);
  }
};
