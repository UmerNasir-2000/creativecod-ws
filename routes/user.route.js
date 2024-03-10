const express = require("express")
const router = express.Router()

const db = require("../models")

router.get("/", async (req, res) => {
  const users = await db.user.find()
  res.status(200).json(users)
})

router.get("/chat", async (req, res) => {
  const { receiverId } = req.query

  if (!receiverId) {
    return res.status(400).json({ message: `receiverId is required` })
  }

  const messages = await db.chatRequest
    .find({ receiverId, status: "accepted" })
    .populate({ path: "senderId", select: "name email" })
  res.status(200).json(messages)
})

module.exports = router
