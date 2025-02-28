"use strict";
// 3. Controller
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
// adding order to database
const addingOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderService.addOrderToDB(req.ip, req.body);
    res.status(200).json({
        message: 'Orders Placed successfully',
        status: true,
        data: order,
    });
});
// getting orders from database
const gettingOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        const orders = yield order_service_1.orderService.getOrders(startDate, endDate);
        res.status(200).json({
            message: 'Orders fetched successfully',
            status: true,
            data: orders,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error,
        });
    }
});
// getting orders from database
const gettingSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.orderService.getOrderById(req.params.orderId);
        res.status(200).json({
            message: 'Order fetched successfully',
            status: true,
            data: orders,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error,
        });
    }
});
// calculating revenue
const calculatingRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenue = yield order_service_1.orderService.calculateRevenueService();
        res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: { 'totalRevenue': revenue },
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error calculating revenue',
            error,
        });
    }
});
// get single order
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const order = yield order_service_1.orderService.getOrderById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        res.status(200).json({
            message: 'Order fetched successfully',
            status: true,
            data: order,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error,
        });
    }
});
// get orders by user id 
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const orders = yield order_service_1.orderService.getOrdersByUserId(userId);
        res.status(200).json({
            message: 'Orders fetched successfully',
            status: true,
            data: orders,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error,
        });
    }
});
// update order by id
const updateOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const updatedOrder = req.body;
        const order = yield order_service_1.orderService.updateOrderInDB(orderId, updatedOrder);
        res.status(200).json({
            message: 'Order updated successfully',
            status: true,
            data: order,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error,
        });
    }
});
// update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const newOrderStatus = req.body.orderStatus;
        const order = yield order_service_1.orderService.updateOrderStatusInDB(orderId, newOrderStatus);
        res.status(200).json({
            message: 'Order status updated successfully',
            status: true,
            data: order,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error,
        });
    }
});
// delete order 
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        yield order_service_1.orderService.deleteOrderFromDB(orderId);
        res.status(200).json({
            message: 'Order deleted successfully',
            status: true,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error,
        });
    }
});
const verifyPaymentControl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderService.verifyPayment(req.query.sp_trxn_id);
    res.status(200).json({
        message: 'Payment verified successfully',
        status: true,
        data: order,
    });
});
// sending to routes
exports.orderController = {
    addingOrder,
    calculatingRevenue,
    gettingOrders,
    getSingleOrder,
    getOrdersByUserId,
    updateOrderStatus,
    deleteOrder,
    gettingSingleOrder,
    updateOrderById,
    verifyPaymentControl
};
