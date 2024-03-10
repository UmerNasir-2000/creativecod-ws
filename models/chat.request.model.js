const mongoose = require("mongoose")

const chatRequestSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
)

const ChatRequest =
  mongoose.models.chatRequest ||
  mongoose.model("chatRequest", chatRequestSchema)

module.exports = ChatRequest
