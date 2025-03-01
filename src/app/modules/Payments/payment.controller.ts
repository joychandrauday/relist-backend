import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';

// ✅ Create a new payment
const createPayment = async (req: Request, res: Response) => {
  try {
    const { paymentInfo } = req.body;
    const transactionId = crypto.randomBytes(10).toString('hex');

    const initiateData = {
      store_id: process.env.SSL_STORE_ID || '',
      store_passwd: process.env.SSL_STORE_PASS || '',
      total_amount: paymentInfo.amount || '5000',
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${process.env.SERVER_URL}/api/v1/payments/success`,
      fail_url: `${process.env.SERVER_URL}/api/v1/payments/fail`,
      cancel_url: `${process.env.SERVER_URL}/api/v1/payments/cancel`,
      cus_name: paymentInfo.name,
      cus_email: paymentInfo.email || 'premiumSubscription@mail.com',
      cus_add1: paymentInfo.address || 'Dhaka',
      cus_city: paymentInfo.city || 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: paymentInfo.phone || '01711111111',
      shipping_method: 'NO',
      product_name: 'premiumSubscription',
      product_category: 'Subscription',
      product_profile: 'General',
      multi_card_name: 'mastercard,visacard,amexcard',
    };

    // Send request to SSLCommerz API
    const response = await axios.post(
      'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
      new URLSearchParams(initiateData).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (response.status === 200) {
      res.status(200).json({
        message: 'Payment processed successfully',
        status: true,
        data: response.data.GatewayPageURL,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment initiation failed',
        data: response.data,
      });
    }
  } catch (error) {
    console.error('Error during payment initiation:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing the payment request',
      error: (error as Error).message || error,
    });
  }
};

// ✅ Handle successful payment
const successPayment = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: 'Payment successful',
      status: true,
      data: req.body,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error processing successful payment',
      error: (error as Error).message || error,
    });
  }
};

// ✅ Handle failed payment
const failPayment = async (req: Request, res: Response) => {
  try {
    res.status(400).json({
      success: false,
      message: 'Payment failed',
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing failed payment',
      error: (error as Error).message || error,
    });
  }
};

// ✅ Handle canceled payment
const cancelPayment = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: 'Payment canceled successfully',
      status: true,
      data: req.body,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing canceled payment',
      error: (error as Error).message || error,
    });
  }
};

// ✅ Export payment controller
export const paymentController = {
  createPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
