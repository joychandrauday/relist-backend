// 3. Controller

import { Request, Response } from 'express'
import { orderService } from './order.service'

// adding order to database
const addingOrder = async (req: Request, res: Response) => {
  const order = await orderService.addOrderToDB(
    req.ip as string,
    req.body
  );

  res.status(200).json({
    message: 'Orders Placed successfully',
    status: true,
    data: order,
  })
};
// getting orders from database
const gettingOrders = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const orders = await orderService.getOrders(startDate as string, endDate as string);
    res.status(200).json({
      message: 'Orders fetched successfully',
      status: true,
      data: orders,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error,
    })
  }
}
// getting orders from database
const gettingSingleOrder = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrderById(req.params.orderId);
    res.status(200).json({
      message: 'Order fetched successfully',
      status: true,
      data: orders,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error,
    })
  }
}
// calculating revenue
const calculatingRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await orderService.calculateRevenueService()
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: { 'totalRevenue': revenue },
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error calculating revenue',
      error,
    })
  }
}
// get single order

const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    const order = await orderService.getOrderById(orderId)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }
    res.status(200).json({
      message: 'Order fetched successfully',
      status: true,
      data: order,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error,
    })
  }
}
// get orders by user id 

const getOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId
    const orders = await orderService.getOrdersByUserId(userId)
    res.status(200).json({
      message: 'Orders fetched successfully',
      status: true,
      data: orders,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error,
    })
  }
}

// update order by id

const updateOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    const updatedOrder = req.body
    const order = await orderService.updateOrderInDB(orderId, updatedOrder)
    res.status(200).json({
      message: 'Order updated successfully',
      status: true,
      data: order,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error,
    })
  }
}

// update order status

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    const newOrderStatus = req.body.orderStatus
    const order = await orderService.updateOrderStatusInDB(orderId, newOrderStatus)
    res.status(200).json({
      message: 'Order status updated successfully',
      status: true,
      data: order,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error,
    })
  }
}



// delete order 

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId
    await orderService.deleteOrderFromDB(orderId)
    res.status(200).json({
      message: 'Order deleted successfully',
      status: true,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error,
    })
  }
}

const verifyPaymentControl = async (req: Request, res: Response) => {
  const order = await orderService.verifyPayment(
    req.query.sp_trxn_id as string
  );

  res.status(200).json({
    message: 'Payment verified successfully',
    status: true,
    data: order,
  });
};


// sending to routes
export const orderController = {
  addingOrder,
  calculatingRevenue,
  gettingOrders,
  getSingleOrder,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
  gettingSingleOrder,
  updateOrderById,
  verifyPaymentControl
}
