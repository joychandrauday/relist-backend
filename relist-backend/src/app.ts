// 1. Sending requests to db from client

import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import router from './app/routes';
import os from "os";
import { StatusCodes } from "http-status-codes";


const app: Application = express();

// Middleware
// app.use(express.json());
// const allowedOrigins = [
//   'https://student-stationary-frontend.vercel.app',
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'http://localhost:5175',
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error('Not allowed by CORS'));
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//     credentials: true,
//   })
// );
// app.options('*', cors())
// app.use(bodyParser.json());
//parsers
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: ["http://localhost:5173", "https://student-stationary-frontend.vercel.app"], credentials: true }));


// Default route
app.get('/api/v1/', (req: Request, res: Response) => {
  res.send('Hello World from RELIST backend!!!');
});
app.get("/", (req: Request, res: Response, next: NextFunction) => {
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

app.use("/api/v1", router);




export default app;
