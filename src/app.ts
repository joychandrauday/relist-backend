// 1. Sending requests to db from client

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import router from './app/routes';
import os from "os";
import { StatusCodes } from "http-status-codes";
import globalErrorHandler from './app/modules/Utils/errorHandler';
import { Server } from 'socket.io';
import { createServer } from 'http';


const app: Application = express();
export const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3002", "https://re-list.vercel.app", "https://relistshop.vercel.app"], credentials: true }));


// Default route
app.get('/api/v1/', (req: Request, res: Response) => {
  res.send('Hello World from RELIST backend!!!');
});
app.get("/", (req: Request, res: Response) => {
  const currentDateTime = new Date().toISOString();
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const serverHostname = os.hostname();
  const serverPlatform = os.platform();
  const serverUptime = os.uptime();

  res.status(StatusCodes.OK).json({
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
      uptime: `${Math.floor(serverUptime / 60 / 60)} hours ${Math.floor(
        (serverUptime / 60) % 60
      )} minutes`,
    },
    developerContact: {
      email: "joychandraud@gmail.com",
      website: "joychandrauday.vercel.app",
    },
  });
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

app.use("/api/v1", router);

app.use(globalErrorHandler);


export default app;
