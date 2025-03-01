"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/Users/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const listing_route_1 = require("../modules/listings/listing.route");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const message_routes_1 = require("../modules/messages/message.routes");
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
    // {
    //    path: '/product',
    //    route: ProductRoutes,
    // },
    // {
    //    path: '/flash-sale',
    //    route: FlashSaleRoutes,
    // },
    // {
    //    path: '/order',
    //    route: OrderRoutes,
    // },
    // {
    //    path: '/coupon',
    //    route: CouponRoutes,
    // },
    // {
    //    path: '/ssl',
    //    route: SSLRoutes,
    // },
    // {
    //    path: '/review',
    //    route: ReviewRoutes,
    // },
    // {
    //    path: '/meta',
    //    route: MetaRoutes,
    // },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
