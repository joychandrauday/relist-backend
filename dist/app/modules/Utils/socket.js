"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        credentials: true,
    }
});
exports.io = io;
let onlineUsers = [];
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
