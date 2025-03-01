/* eslint-disable @typescript-eslint/no-explicit-any */
// 4.service

import { userService } from '../Users/user.service';
import { IOrder } from './order.interface'
import { orderModel } from './order.model'
import { orderUtils } from './order.utils'

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
  const user = await userService.getSingleUserById(newOrder.user)
  let order = await orderModel.create(newOrder);

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
      $gte: new Date(startDate), // বড় বা সমান
      $lte: new Date(endDate),   // ছোট বা সমান
    };
  }

  const orders = await orderModel
    .find(filter)
    .populate('user', 'name email')
    .populate('products.productId', 'name price featuredImages');
  return orders
}
// get single order

const getOrderById = async (orderId: string) => {
  const order = await orderModel.findById(orderId).populate('user', 'name,email')
  return order
}

// get order by userId

const getOrdersByUserId = async (userId: string) => {
  const orders = await orderModel.find({ user: userId }).populate('user', 'name email').populate('products.productId', 'name ')
  return orders
}
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
    const res = await orderModel.findOneAndUpdate(
      { "transaction.id": sp_trxn_id },
      {
        "transaction.code": verifiedResponse[0].sp_code,
        "transaction.message": verifiedResponse[0].sp_message,
        "transaction.status": verifiedResponse[0].transaction_status,
        "transaction.method": verifiedResponse[0].method,
        "transaction.bank_status": verifiedResponse[0].bank_status,
        "transaction.date_time": verifiedResponse[0].date_time,
        'paymentStatus':
          verifiedResponse[0].bank_status == "Success"
            ? "Paid"
            : verifiedResponse[0].bank_status == "Cancel"
              ? "Cancelled"
              : "Pending",
      },
      // {
      //   'paymentStatus': verifiedResponse[0].bank_status == "Success"
      //     ? "Paid"
      //     : verifiedResponse[0].bank_status == "Cancel"
      //       ? "Cancelled"
      //       : "Pending",
      // }
    );
    console.log(res);
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
