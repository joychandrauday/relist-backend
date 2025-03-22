import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        credentials: true,
    }
});

let onlineUsers: unknown[] = [];

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    // Listen for the "userLoggedIn" event
    socket.on('userLoggedIn', (userId) => {
        console.log(`User with ID ${userId} logged in`);

        // Add user to online users list (or perform any other action)
        onlineUsers.push(userId);

        // Emit the updated online users list to all connected clients
        io.emit('onlineUsers', onlineUsers);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);

        // Remove the user from the onlineUsers list on disconnect
        onlineUsers = onlineUsers.filter((id) => id !== socket.id);

        // Emit the updated online users list to all connected clients
        io.emit('onlineUsers', onlineUsers);
    });
});

// Start the server
server.listen(5000, () => {
    console.log("Socket.IO server is running on port 5000");
});

export { io, app, server };
