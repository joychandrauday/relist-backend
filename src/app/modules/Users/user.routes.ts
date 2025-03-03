// 3. Router
import express from 'express'
import { userController } from './user.controller'
const router = express.Router()

router.get('/', userController.gettingUsers)
router.get('/:id', userController.gettingSingleUser)
router.get('/single/:id', userController.gettingSingleUserById)
router.delete('/:id', userController.deleteUser)
router.put('/:id', userController.updateUser);


export const userRoutes = router

