const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    adminId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
)

const Group = mongoose.models.group || mongoose.model("group", groupSchema)

module.exports = Group
