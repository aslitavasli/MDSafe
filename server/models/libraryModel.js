import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export const Library = mongoose.model("library", librarySchema);
