const express = require("express")
const router = express.Router()

const db = require("../models")

router.get("/", async (req, res) => {
  const { receiverId } = req.query

  if (!receiverId) {
    return res.status(400).json({ message: `receiverId is required` })
  }

  const messages = await db.chatMessage.find({ receiverId })
  res.status(200).json(messages)
})

module.exports = router
