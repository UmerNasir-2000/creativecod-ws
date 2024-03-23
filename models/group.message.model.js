const mongoose = require("mongoose")

const groupMessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
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
