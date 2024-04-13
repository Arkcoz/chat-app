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

// Generate a random identifier for each user
function generateRandomNumericId(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let connectedUsers = 0;

io.on('connection', (socket) => {
    console.log('New client connected');
    connectedUsers++;

    io.emit('user count', connectedUsers);

    // Send a welcome message with the random identifier 
    const username = `Guest-${generateRandomNumericId(6)}`;

    socket.emit('username', username);

    socket.emit('chat message', {
        user: 'Me',
        text: 'Welcome to the chat!',
        time: new Date().toLocaleTimeString(),
        special: true
    });

    // Send a message to all clients when a new user joins the chat
    socket.broadcast.emit('chat message', {
        user: username,
        text: `${username} has joined the chat!`,
        time: new Date().toLocaleTimeString(),
        special: true // Special messages are displayed in a different way
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
        connectedUsers--;
        io.emit('user count', connectedUsers);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});