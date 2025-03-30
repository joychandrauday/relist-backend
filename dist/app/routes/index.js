"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/Users/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const listing_route_1 = require("../modules/listings/listing.route");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const message_routes_1 = require("../modules/messages/message.routes");
const order_routes_1 = require("../modules/Orders/order.routes");
const category_routes_1 = require("../modules/category/category.routes");
const flashSale_routes_1 = require("../modules/flashSell/flashSale.routes");
const newsletter_route_1 = require("../modules/newsletter/newsletter.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_routes_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: '/listings',
        route: listing_route_1.ListingRoutes,
    },
    {
        path: '/transactions',
        route: transaction_routes_1.TransactionRoutes,
    },
    {
        path: '/messages',
        route: message_routes_1.messageRouter,
    },
    {
        path: '/orders',
        route: order_routes_1.orderRoutes,
    },
    {
        path: '/category',
        route: category_routes_1.categoryRouter,
    },
    {
        path: '/flash-sale',
        route: flashSale_routes_1.FlashSaleRoutes,
    },
    {
        path: '/newsletter',
        route: newsletter_route_1.NewsLetterRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
