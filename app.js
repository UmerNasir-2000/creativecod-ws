const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (_, res) => res.status(200).json({ message: `Hello, World!` }));

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => console.log('server running at http://localhost:3000'));

module.exports = server;