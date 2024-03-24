require("dotenv").config()

const express = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const cors = require("cors")

const db = require("./models")
const connectToMongo = require("./database")

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: { origin: "*" }, path: "/socket.io" })

app.use(cors({ origin: "*" }))
app.use(express.json())

app.use("/users", require("./routes/user.route"))
app.use("/chatMessages", require("./routes/chat.message.route"))
app.use("/groups", require("./routes/group.route"))

app.get("/", (_, res) => res.status(200).json({ message: `Hello, World!` }))

io.on("connection", (socket) => {
  console.log("a user connected")

  socket.on(`send-message`, async (data) => {
    console.log(`send-message`)
    console.log(data)
    const chatMessage = await db.chatMessage.create({
      ...data,
    })
    io.emit(`receive-message`, chatMessage)
  })

  socket.on(`join-room`, (data) => {
    console.log(`join-room`)
    console.log(data)
    socket.join(data.groupId)
  })

  socket.on("group-message", async (data) => {
    console.log("group-chat-message")
    console.log(data)

    const groupMembers = await db.groupMember.find({
      groupId: data.groupId,
      userId: { $ne: data.senderId },
      status: "APPROVED",
    })

    const receiverIds = groupMembers.map((member) => member.userId)

    const message = await db.groupMessage.create({
      text: data.text,
      groupId: data.groupId,
      receiverIds,
      senderId: data.senderId,
      senderName: data.senderName,
    })

    io.to(data.groupId).emit("group-message-receive", message)
  })

  socket.on("block-user", async (data) => {
    console.log("block-user")
    console.log(data)

    const blockedChat = await db.chatRequest.findById(data?.chatId)
    blockedChat.status = data?.status
    blockedChat.blockedBy = data?.userId

    await blockedChat.save()

    console.log(blockedChat)

    io.emit("block-user-receive", blockedChat)
  })

  socket.on("unblock-user", async (data) => {
    console.log("unblock-user")
    console.log(data)

    const blockedChat = await db.chatRequest.findById(data?.chatId)
    blockedChat.status = data?.status
    blockedChat.blockedBy = null

    await blockedChat.save()

    console.log(blockedChat)

    io.emit("unblock-user-receive", blockedChat)
  })

  socket.on(`remove-user`, async (data) => {
    console.log(`remove-user`)
    console.log(data)

    const groupMember = await db.groupMember.findByIdAndDelete(data.memberId)

    console.log("groupMember :>> ", groupMember)

    const updatedGroup = await db.group.findByIdAndUpdate(
      data?.groupId,
      { $pull: { members: data?.memberId } },
      { new: true }
    )

    console.log("updatedGroup :>> ", updatedGroup)

    io.emit(`remove-member-receive`, {
      groupId: data.groupId,
      userId: data.memberId,
      groupTitle: updatedGroup.title,
    })
  })

  socket.on(`exit-group`, async (data) => {
    console.log("data :>> ", data)
    console.log(`inside exit group`)

    const groupMember = await db.groupMember.findOne({
      groupId: data?.groupId,
      userId: data?.userId,
    })

    console.log("groupMember :>> ", groupMember)

    if (groupMember) {
      const deletedGroupMember = await db.groupMember.findByIdAndDelete(
        groupMember._id
      )
      const updatedGroup = await db.group.findByIdAndUpdate(
        data?.groupId,
        { $pull: { members: groupMember._id } },
        { new: true }
      )
    }

    io.emit(`exit-group-receive`, {
      groupId: data?.groupId,
      userId: data?.userId,
    })
  })
})

server.listen(5000, () => {
  connectToMongo()
  console.log("server running at http://localhost:5000")
})

// module.exports = server
