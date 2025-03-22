import express from 'express';
import { categoryController } from './category.controller';

const router = express.Router();

router.post('/', categoryController.addCategory);
router.get('/', categoryController.getCategoryAll);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);



export const categoryRouter = router;
