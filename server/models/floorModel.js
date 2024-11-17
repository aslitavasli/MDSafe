import mongoose from "mongoose";

const floorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    library: {
      type: mongoose.Schema.Types.ObjectId, // Change type to ObjectId
      ref: "Library", // Reference the Library model
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    sublocation: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Floor = mongoose.model("floor", floorSchema);
