import express from 'express';
import { categoryController } from './category.controller';

const router = express.Router();

router.post('/', categoryController.addCategory);
router.get('/', categoryController.getCategoryAll);

export const categoryRouter = router;
