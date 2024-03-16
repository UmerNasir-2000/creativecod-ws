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

router.get(`/chatRequests/:receiverId`, async (req, res) => {
  const { receiverId } = req.params

  if (!receiverId) {
    return res.status(400).json({ message: `receiverId is required` })
  }

  const chatRequests = await db.chatRequest
    .find({ receiverId, status: "pending" })
    .populate({ path: "senderId", select: "_id name email" })

  res.status(200).json(chatRequests)
})

router.get(`/chatUsers/:user`, async (req, res) => {
  const { user } = req.params

  console.log(`user = `, user)
  if (!user) {
    return res.status(400).json({ message: `user is required` })
  }

  try {
    const chatUsers = await db.chatRequest
      .find({
        status: "accepted",
        $or: [{ receiverId: user }, { senderId: user }],
      })
      .populate({ path: "senderId", select: "_id name email" })
      .populate({ path: "receiverId", select: "_id name email" })

    const chatUsersFormatted = chatUsers.map((chatUser) => {
      let chat

      if (chatUser.senderId._id.toString() === user) {
        console.log(`chatUser.senderId._id = `, chatUser.receiverId.name)
        chat = chatUser.receiverId
      } else {
        chat = chatUser.senderId
      }

      return { ...chatUser._doc, chat }
    })

    res.status(200).json(chatUsersFormatted)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: `Internal server error` })
  }
})

module.exports = router
