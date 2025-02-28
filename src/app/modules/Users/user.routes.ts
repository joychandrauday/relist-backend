// 3. Router
import express from 'express'
import { userController } from './user.controller'
const router = express.Router()

router.get('/', userController.gettingUsers) // add order to db
router.get('/:id', userController.gettingSingleUser) // add order to db
router.get('/single/:id', userController.gettingSingleUserById) // add order to db
router.delete('/:id', userController.deleteUser) // add order to db
router.put('/:id', userController.updateUser);


export const userRoutes = router

