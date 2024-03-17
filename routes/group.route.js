const express = require("express")

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

  const userGroupIds = await db.groupMember.find(
    { userId, status: "APPROVED" },
    "groupId"
  )

  const groupIds = userGroupIds.map((group) => group.groupId)

  const userGroups = await db.group.find({ _id: { $in: groupIds } }).populate({
    path: "members",
    select: "_id name email",
  })

  res.status(200).json(userGroups)
})

module.exports = router
