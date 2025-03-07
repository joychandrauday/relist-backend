"use strict";
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
const transaction_model_1 = require("./transaction.model");
const getPurchasesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_model_1.transactionModel.find({ buyerID: userId }).populate('itemID sellerID orderID');
});
const getSalesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_model_1.transactionModel.find({ sellerID: userId }).populate('itemID sellerID orderID buyerID');
});
const createTransaction = (transactionData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_model_1.transactionModel.create(transactionData);
});
const updateTransactionStatus = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield transaction_model_1.transactionModel.findByIdAndUpdate(transactionId, { status }, { new: true });
});
exports.default = {
    getPurchasesByUserId,
    getSalesByUserId,
    createTransaction,
    updateTransactionStatus
};
