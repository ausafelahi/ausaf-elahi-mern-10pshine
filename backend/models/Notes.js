const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "#008080",
    },
  },
  {
    timestamps: true,
  },
);

noteSchema.index({ title: "text", content: "text", tags: "text" });
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, isPinned: 1, updatedAt: -1 });

module.exports = mongoose.model("Notes", noteSchema);
