import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: String, // 2 yetişkin 1 çocuk şeklinde
      required: true,
    },
    size: {
      // kaç m'2 ise oda o kısım
      type: String,
      requred: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    // sonradan eklenebilir özellik kısmı
    features: {
      type: [String],
      default: [],
    },
    isAvailable: {
      // oda bakımda vs ise
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
