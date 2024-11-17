import mongoose from "mongoose";

const sublocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    libraryid: {
      type: mongoose.Schema.Types.ObjectId, // Change type to ObjectId
      ref: "Library", // Reference the Library model
      required: false,
    },
  },

  {
    timestamps: true,
  }
);

export const Sublocation = mongoose.model("sublocation", sublocationSchema);
