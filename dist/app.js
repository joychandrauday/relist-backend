"use strict";
// 1. Sending requests to db from client
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const os_1 = __importDefault(require("os"));
const http_status_codes_1 = require("http-status-codes");
const errorHandler_1 = __importDefault(require("./app/modules/Utils/errorHandler"));
const app = (0, express_1.default)();
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
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: ["http://localhost:5173", "https://student-stationary-frontend.vercel.app"], credentials: true }));
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
app.use("/api/v1", routes_1.default);
app.use(errorHandler_1.default);
exports.default = app;
