import { Router } from 'express';
import { FlashSaleController } from './flashSale.controller';
import { verifyToken } from '../Utils/authMiddleware';

const router = Router();

router.get('/', FlashSaleController.getActiveFlashSalesService)

router.post(
    '/',
    verifyToken,
    FlashSaleController.createFlashSale
)
router.delete("/remove/:productId", FlashSaleController.removeFromFlashSaleController);

export const FlashSaleRoutes = router;
