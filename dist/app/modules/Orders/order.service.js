"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// 4.service
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
exports.orderService = void 0;
const user_service_1 = require("../Users/user.service");
const order_model_1 = require("./order.model");
const order_utils_1 = require("./order.utils");
// create a new order
const addOrderToDB = (client_ip, newOrder) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getSingleUserById(newOrder.user);
    let order = yield order_model_1.orderModel.create(newOrder);
    const paymentDetails = {
        amount: order.amount,
        order_id: order._id,
        currency: "BDT",
        customer_name: user === null || user === void 0 ? void 0 : user.name,
        customer_email: user === null || user === void 0 ? void 0 : user.email, // optional
        customer_address: newOrder.shippingAddress,
        customer_phone: '01711111111',
        customer_city: 'user.city',
        client_ip,
    };
    const payment = yield order_utils_1.orderUtils.makePayment(paymentDetails);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                status: payment.transactionStatus,
            },
        });
    }
    return { order, payment };
});
// get all orders
const getOrders = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (startDate && endDate) {
        filter.orderDate = {
            $gte: new Date(startDate), // বড় বা সমান
            $lte: new Date(endDate), // ছোট বা সমান
        };
    }
    const orders = yield order_model_1.orderModel
        .find(filter)
        .populate('user', 'name email')
        .populate('products.productId', 'name price featuredImages');
    return orders;
});
// get single order
const getOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.orderModel.findById(orderId).populate('user', 'name,email');
    return order;
});
// get order by userId
const getOrdersByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.orderModel.find({ user: userId }).populate('user', 'name email').populate('products.productId', 'name ');
    return orders;
});
const getSingleOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.orderModel.findById(id);
    return order;
});
// update order by orderId
const updateOrderInDB = (orderId, newOrder) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.orderModel.findByIdAndUpdate(orderId, newOrder, { new: true });
    return result;
});
// update order status 
const updateOrderStatusInDB = (orderId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.orderModel.findByIdAndUpdate(orderId, { orderStatus: newStatus }, { new: true });
    return result;
});
// delete order 
const deleteOrderFromDB = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.orderModel.findByIdAndDelete(orderId);
    return result;
});
const calculateRevenueService = () => __awaiter(void 0, void 0, void 0, function* () {
    const revenueResult = yield order_model_1.orderModel.aggregate([
        {
            $group: {
                _id: null, // Group all documents together
                totalRevenue: { $sum: '$totalPrice' }, // Sum all totalPrice fields
            },
        },
    ]);
    // Return totalRevenue or default to 0 if no orders
    return revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
});
const verifyPayment = (sp_trxn_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedResponse = yield order_utils_1.orderUtils.verifyPayment(sp_trxn_id);
    if (verifiedResponse.length) {
        const res = yield order_model_1.orderModel.findOneAndUpdate({ "transaction.id": sp_trxn_id }, {
            "transaction.code": verifiedResponse[0].sp_code,
            "transaction.message": verifiedResponse[0].sp_message,
            "transaction.status": verifiedResponse[0].transaction_status,
            "transaction.method": verifiedResponse[0].method,
            "transaction.bank_status": verifiedResponse[0].bank_status,
            "transaction.date_time": verifiedResponse[0].date_time,
            'paymentStatus': verifiedResponse[0].bank_status == "Success"
                ? "Paid"
                : verifiedResponse[0].bank_status == "Cancel"
                    ? "Cancelled"
                    : "Pending",
        });
        console.log(res);
    }
    return verifiedResponse;
});
// sending all to controller
exports.orderService = {
    addOrderToDB,
    calculateRevenueService,
    getOrders,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatusInDB,
    // updateEstimatedDeliveryDateInDB,
    updateOrderInDB,
    deleteOrderFromDB,
    verifyPayment,
    getSingleOrderById
};
