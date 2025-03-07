// 3. Router
import express from 'express'
import { userController } from './user.controller'
const router = express.Router()

router.get('/', userController.gettingUsers)
router.get('/:id', userController.gettingSingleUser)
router.get('/single/:id', userController.gettingSingleUserById)
router.delete('/:id', userController.deleteUser)
router.put('/:id', userController.updateUser);
router.post("/:id/wishlist", userController.addToWishlist);
router.delete("/:id/wishlist", userController.removeFromWishlist);


export const userRoutes = router

