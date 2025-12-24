import mongoose from "mongoose";
import slugify from "slugify"; 

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // Başlıklar benzersiz olmalı
    },
    slug: {
      type: String,
      unique: true,
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
      type: String, 
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roomSchema.pre("validate", function () {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: "tr",
      trim: true
    });
  }
});

const Room = mongoose.model("Room", roomSchema);
export default Room;