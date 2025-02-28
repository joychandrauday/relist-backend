"use strict";
// 1. Sending requests to db from client
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const product_routes_1 = require("./app/modules/Products/product.routes");
const order_routes_1 = require("./app/modules/Orders/order.routes");
const user_routes_1 = require("./app/modules/Users/user.routes");
const payment_routes_1 = require("./app/modules/Payments/payment.routes");
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
    res.send('Hello World frpm stationary backend!!!');
});
//appllication routes
app.use('/api/v1/users', user_routes_1.userRoutes); // product routes
app.use('/api/v1/products', product_routes_1.productRoutes); // product routes
app.use('/api/v1/orders', order_routes_1.orderRoutes); // order routes
app.use('/api/v1/payment', payment_routes_1.paymentRoutes); // order routes
exports.default = app;
