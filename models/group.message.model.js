const mongoose = require("mongoose")

const groupMessageSchema = new mongoose.Schema(
  {
    message: {
      content: { type: String, required: true },
      mimeType: { type: String, required: true }, // TEXT, RAW, IMAGE
      fileName: { type: String },
    },
    groupId: {
      type: mongoose.Schema.ObjectId,
      ref: "group",
      required: true,
    },
    receiverIds: {
      type: [mongoose.Schema.ObjectId],
      ref: "groupMember",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
)

const GroupMessage =
  mongoose.models.groupMessage ||
  mongoose.model("groupMessage", groupMessageSchema)

module.exports = GroupMessage
