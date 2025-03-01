// 4.payment.service

import { IPayment } from './payment.interface'
import { paymentModel } from './payment.model'

// Create a new payment
const addPaymentToDB = async (payment: IPayment) => {
  const result = await paymentModel.create(payment)
  return result
}

// Retrieve all payments
const getPayments = async () => {
  const payments = await paymentModel.find()
  return payments
}

// Get a single payment by ID
const getPaymentById = async (paymentId: string) => {
  const payment = await paymentModel.findById(paymentId).populate('user', 'name email')
  return payment
}

// Update payment status



// Export all functions
export const paymentService = {
  addPaymentToDB,
  getPayments,
  getPaymentById,
}
