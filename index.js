const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://adamkwolff:Fflow0667%21%21@cluster0.rdhbyts.mongodb.net/cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
  .then(() => console.log('Database connected!'))
  .catch(err => console.log(err));

const MessageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', MessageSchema);


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

  Message.find()
    .then((messages) => {
      socket.emit('previous messages', messages);
    })
    .catch((err) => {
      console.log(err);
    });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('chat message', (msg, sender) => {
    const message = new Message({ content: msg, sender: sender });
    message.save()
      .then(() => {
        io.emit('chat message', msg, sender);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});



