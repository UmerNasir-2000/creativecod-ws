const mongoose = require("mongoose")

const groupMemberSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["NORMAL", "MODERATOR", "ADMIN"],
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["APPROVED", "BLOCKED", "PENDING", "REJECTED"],
    },
    groupId: {
      type: mongoose.Schema.ObjectId,
      ref: "group",
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
)

const GroupMember =
  mongoose.models.groupMember ||
  mongoose.model("groupMember", groupMemberSchema)

module.exports = GroupMember
