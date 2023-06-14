const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  }
});

app.get('/', (req, res) => {
  res.send('Chat Server is running');
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});

io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

