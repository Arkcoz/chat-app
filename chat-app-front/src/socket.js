import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
    withCredentials: true,
    extraHeaders: {
        "Access-Control-Allow-Origin": "http://localhost:5173"
    }
});

export default socket;