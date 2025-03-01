"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const router = express_1.default.Router();
router.get('/purchases/:userId', transaction_controller_1.transactionController.getPurchases);
router.get('/sales/:userId', transaction_controller_1.transactionController.getSales);
router.post('/', transaction_controller_1.transactionController.createTransaction);
router.put('/:id', transaction_controller_1.transactionController.updateTransaction);
exports.TransactionRoutes = router;
