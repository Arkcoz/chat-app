const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
}));

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 4000;

// Générer un identifiant aléatoire pour chaque utilisateur
function generateRandomNumericId(length) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

io.on('connection', (socket) => {
    console.log('New client connected');

    // Send a welcome message with the random identifier 
    const username = `Guest-${generateRandomNumericId(6)}`;
    socket.emit('chat message', {
        user: username,
        text: 'Welcome to the chat!',
        time: new Date().toLocaleTimeString()
    });

    // Envoyer un message à tous les clients lorsqu'un nouvel utilisateur rejoint le chat
    socket.broadcast.emit('chat message', {
      user: username,
      text: `${username} has joined the chat!`,
      time: new Date().toLocaleTimeString(),
      special: true // Ajouter un indicateur pour un style spécial
    });

    socket.on('chat message', (msg) => {
        console.log(`Received message from ${username}: ${msg.text}`);
        const currentTime = new Date().toLocaleTimeString();
        io.emit('chat message', {
            user: username,
            text: msg.text,
            time: currentTime
        });
    });

    socket.on('disconnect', () => {
        console.log(`User ${username} disconnected`);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});