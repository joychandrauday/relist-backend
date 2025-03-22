"use strict";
// 1. Sending requests to db from client
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const os_1 = __importDefault(require("os"));
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = __importDefault(require("./app/modules/Utils/errorHandler"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const app = (0, express_1.default)();
exports.server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: ["http://localhost:3000", "http://localhost:3002", "https://re-list.vercel.app", "https://relistshop.vercel.app"], credentials: true }));
// Default route
app.get('/api/v1/', (req, res) => {
    res.send('Hello World from RELIST backend!!!');
});
app.get("/", (req, res) => {
    const currentDateTime = new Date().toISOString();
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const serverHostname = os_1.default.hostname();
    const serverPlatform = os_1.default.platform();
    const serverUptime = os_1.default.uptime();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        message: "Welcome to RELIST",
        version: "1.0.0",
        clientDetails: {
            ipAddress: clientIp,
            accessedAt: currentDateTime,
        },
        serverDetails: {
            hostname: serverHostname,
            platform: serverPlatform,
            uptime: `${Math.floor(serverUptime / 60 / 60)} hours ${Math.floor((serverUptime / 60) % 60)} minutes`,
        },
        developerContact: {
            email: "joychandraud@gmail.com",
            website: "joychandrauday.vercel.app",
        },
    });
});
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
    console.log(onlineUsers);
    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        // Remove the user from the onlineUsers list on disconnect
        onlineUsers = onlineUsers.filter((id) => id !== socket.id);
        // Emit the updated online users list to all connected clients
        io.emit('onlineUsers', onlineUsers);
    });
});
app.use("/api/v1", routes_1.default);
app.use(errorHandler_1.default);
exports.default = app;
