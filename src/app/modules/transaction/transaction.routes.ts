import express from 'express';
import { transactionController } from './transaction.controller';

const router = express.Router();

router.get('/purchases/:userId', transactionController.getPurchases);
router.get('/sales/:userId', transactionController.getSales);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);

export const TransactionRoutes = router;
