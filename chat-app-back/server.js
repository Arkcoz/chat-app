const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Express routes
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests only from this origin
    methods: ["GET", "POST"],
    credentials: true // Allow credentials like cookies
  }));
  
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173', // Allow WebSocket connections only from this origin
      methods: ["GET", "POST"],
      credentials: true // Allow credentials like cookies
    }
  });

const PORT = process.env.PORT || 4000;

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('chat message', (msg) => {
    console.log(`Received message from client: ${msg}`);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
