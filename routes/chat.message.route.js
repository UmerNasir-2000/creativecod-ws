const express = require("express")
const router = express.Router()

const db = require("../models")

router.get("/", async (req, res) => {
  const { receiverId, senderId } = req.query

  if (!receiverId || !senderId) {
    return res.status(400).json({ message: `receiverId is required` })
  }

  const messages = await db.chatMessage.find({ receiverId, senderId })
  res.status(200).json(messages)
})

module.exports = router
