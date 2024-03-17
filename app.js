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
    })

    io.to(data.groupId).emit("group-message-receive", message)
  })
})

server.listen(5000, () => {
  connectToMongo()
  console.log("server running at http://localhost:5000")
})

// module.exports = server
