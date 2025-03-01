// 3. Router
import express from 'express'
import { orderController } from './order.controller'

const router = express.Router()

router.post('/', orderController.addingOrder) // add order to db
router.get('/', orderController.gettingOrders) // getting orders
router.get('/single/:orderId', orderController.gettingSingleOrder) // getting orders
router.get('/:userId', orderController.getOrdersByUserId) // getting orders
router.patch('/:orderId', orderController.updateOrderStatus) // getting orders
router.patch('/update/:orderId', orderController.updateOrderById) // getting orders
router.get('/verify/payment', orderController.verifyPaymentControl) // calculating revenue
router.delete('/:orderId', orderController.deleteOrder) // calculating revenue
router.get('/revenue', orderController.calculatingRevenue) // calculating revenue

export const orderRoutes = router
