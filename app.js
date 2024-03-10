require("dotenv").config()

const express = require("express")
const { createServer } = require("node:http")
const { Server } = require("socket.io")
const cors = require("cors")

const connectToMongo = require("./database")

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: { origin: "*" }, path: "/socket.io" })

app.use(cors({ origin: "*" }))
app.use(express.json())

app.get("/", (_, res) => res.status(200).json({ message: `Hello, World!` }))

io.on("connection", (socket) => {
  // console.log(socket.client.conn)
  console.log("a user connected")

  io.emit("connection", {
    someProperty: "some value",
    otherProperty: "other value",
  })
})

io.emit("connection", {
  someProperty: "some value",
  otherProperty: "other value",
})

io.on("qw", (socket) => {
  console.log("a qw connected")
})

server.listen(5000, () => {
  connectToMongo()
  console.log("server running at http://localhost:3000")
})

module.exports = server
