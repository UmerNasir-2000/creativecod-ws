const express = require("express")
const mongoose = require("mongoose")

const router = express.Router()

const db = require("../models")

router.get(`/messages/:groupId`, async (req, res) => {
  const { groupId } = req.params

  if (!groupId) {
    return res.status(400).json({ message: `groupId is required` })
  }

  const groupMessages = await db.groupMessage.find({ groupId })

  res.status(200).json(groupMessages)
})

router.get("/:userId", async (req, res) => {
  const { userId } = req.params

  if (!userId) {
    return res.status(400).json({ message: `userId is required` })
  }

  const userGroupIds = await db.groupMember.find({ userId, status: "APPROVED" })

  const groupIds = userGroupIds.map((group) => group.groupId)

  const userGroups = await db.group.find({ _id: { $in: groupIds } }).populate({
    path: "members",
    populate: {
      path: "userId",
      select: "name email",
    },
  })

  console.log(JSON.stringify(userGroups, null, 2))

  res.status(200).json(userGroups)
})

module.exports = router
