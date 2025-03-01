// 2.Router
import express from 'express';
import { productController } from './product.controller';

const router = express.Router()

router.post('/', productController.addingProduct)
router.get('/', productController.gettingProducts)
router.get('/:productId', productController.gettingProduct)
router.patch('/:productId', productController.updatingProduct)
router.delete('/:productId', productController.deletingProduct)

export const productRoutes = router