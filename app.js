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
})

server.listen(5000, () => {
  connectToMongo()
  console.log("server running at http://localhost:5000")
})

// module.exports = server
