const mongoose = require("mongoose")

const chatMessageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
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

const ChatMessage =
  mongoose.models.chatMessage ||
  mongoose.model("chatMessage", chatMessageSchema)

module.exports = ChatMessage
