import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();

// ✅ Route to create a new payment
router.post('/create-payment', paymentController.createPayment);

// ✅ Route to handle successful payment
router.post('/success-payment', paymentController.successPayment);

// ✅ Route to handle failed payment
router.post('/fail-payment', paymentController.failPayment);

// ✅ Route to handle canceled payment
router.post('/cancel-payment', paymentController.cancelPayment);

export const paymentRoutes = router;
