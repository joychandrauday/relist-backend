import { ITransaction } from "./transaction.interface";
import { transactionModel } from "./transaction.model";


const getPurchasesByUserId = async (userId: string) => {
    return await transactionModel.find({ buyerID: userId }).populate('itemID sellerID');
};

const getSalesByUserId = async (userId: string) => {
    return await transactionModel.find({ sellerID: userId }).populate('itemID buyerID');
};

const createTransaction = async (transactionData: ITransaction) => {
    return await transactionModel.create(transactionData);
};

const updateTransactionStatus = async (transactionId: string, status: 'pending' | 'completed') => {
    return await transactionModel.findByIdAndUpdate(transactionId, { status }, { new: true });
};

export default {
    getPurchasesByUserId,
    getSalesByUserId,
    createTransaction,
    updateTransactionStatus
};
