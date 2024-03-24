const mongoose = require("mongoose")

const chatMessageSchema = new mongoose.Schema(
  {
    message: {
      content: { type: String, required: true },
      mimeType: { type: String, required: true }, // TEXT, RAW, IMAGE
      fileName: { type: String },
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    chatId: { type: String, required: true },
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
