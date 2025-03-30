/* eslint-disable @typescript-eslint/no-explicit-any */
// 4.service

import mongoose from 'mongoose';
import { userService } from '../Users/user.service';
import { IOrder } from './order.interface'
import { orderModel } from './order.model'
import { orderUtils } from './order.utils'
import { listingModel } from '../listings/listing.model';

interface newOrder {
  user: string,
  products: Array<{ productId: string, quantity: number, price: number, totalPrice: number }>,
  amount: number,
  shippingAddress: string,
  paymentStatus: string,
}
// create a new order
const addOrderToDB = async (
  client_ip: string,
  newOrder: newOrder
) => {
  const user = await userService.getSingleUser(newOrder.user)
  console.log(newOrder, 'new order');
  let order = await orderModel.create(newOrder);
  console.log(order, 'adding');
  const paymentDetails = {
    amount: order.amount,
    order_id: order._id,
    currency: "BDT",
    customer_name: user?.name,
    customer_email: user?.email, // optional
    customer_address: newOrder.shippingAddress,
    customer_phone: '01711111111',
    customer_city: 'user.city',
    client_ip,
  };

  const payment = await orderUtils.makePayment(paymentDetails) as { transactionStatus?: string; sp_order_id?: string };
  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        status: payment.transactionStatus,
      },
    });
  }

  return { order, payment };
};

// get all orders
const getOrders = async (startDate?: string, endDate?: string) => {
  const filter: any = {};

  if (startDate && endDate) {
    filter.orderDate = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const orders = await orderModel
    .find(filter)
    .populate('user', 'name email role')
    .populate({
      path: 'products.productId',
      select: 'name price featuredImages',
    });

  return orders;


}
// get single order

const getOrderById = async (orderId: string) => {
  const order = await orderModel.findById(orderId).populate('user', 'name email avatar').populate({
    path: 'products.productId',
    select: 'title price images',
  });
  return order
}


const getOrdersByUserId = async (userId: string) => {
  try {
    const orders = await orderModel
      .find({ user: new mongoose.Types.ObjectId(userId) })
      .populate('user', 'name email')
      .populate({
        path: 'products.productId',
        select: 'title price images',
      });

    return orders;
  } catch (error) {
    console.log(error);
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const getSingleOrderById = async (id: string) => {
  const order = await orderModel.findById(id)
  return order
}
// update order by orderId

const updateOrderInDB = async (orderId: string, newOrder: IOrder) => {
  const result = await orderModel.findByIdAndUpdate(orderId, newOrder, { new: true })
  return result
}
// update order status 

const updateOrderStatusInDB = async (orderId: string, newStatus: string) => {
  const result = await orderModel.findByIdAndUpdate(orderId, { orderStatus: newStatus }, { new: true })
  return result
}


// delete order 

const deleteOrderFromDB = async (orderId: string) => {
  const result = await orderModel.findByIdAndDelete(orderId)
  return result
}


const calculateRevenueService = async () => {
  const revenueResult = await orderModel.aggregate([
    {
      $group: {
        _id: null, // Group all documents together
        totalRevenue: { $sum: '$totalPrice' }, // Sum all totalPrice fields
      },
    },
  ])

  // Return totalRevenue or default to 0 if no orders
  return revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0
}


const verifyPayment = async (sp_trxn_id: string) => {
  const verifiedResponse = await orderUtils.verifyPayment(sp_trxn_id);

  if (verifiedResponse.length) {
    const updatedOrder = await orderModel.findOneAndUpdate(
      { "transaction.id": sp_trxn_id },
      {
        "transaction.code": verifiedResponse[0].sp_code,
        "transaction.message": verifiedResponse[0].sp_message,
        "transaction.status": verifiedResponse[0].transaction_status,
        "transaction.method": verifiedResponse[0].method,
        "transaction.bank_status": verifiedResponse[0].bank_status,
        "transaction.date_time": verifiedResponse[0].date_time,
        'paymentStatus':
          verifiedResponse[0].bank_status === "Success"
            ? "Paid"
            : verifiedResponse[0].bank_status === "Cancel"
              ? "Cancelled"
              : "Pending",
        'orderStatus': verifiedResponse[0].bank_status === "Success"
          ? "Processing"
          : verifiedResponse[0].bank_status === "Cancel"
            ? "Cancelled"
            : "Pending",
      },
      { new: true }
    ).populate('products.productId'); // Populate to get product details

    if (updatedOrder && verifiedResponse[0].bank_status === "Success") {
      for (const product of updatedOrder.products) {
        // Reduce the product quantity and update status if it reaches 0
        const updatedProduct = await listingModel.findByIdAndUpdate(
          product.productId._id,
          {
            $inc: { quantity: -product.quantity }, // Reduce stock
          },
          { new: true }
        );

        // If quantity is 0, set status to "sold"
        if (updatedProduct && updatedProduct.quantity <= 0) {
          await listingModel.findByIdAndUpdate(
            product.productId._id,
            { $set: { status: "sold" } }, // Update status
            { new: true }
          );
        }
      }
    }
  }
  return verifiedResponse;
};


// sending all to controller
export const orderService = {
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
}
