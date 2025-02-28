
import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router();
router.post('/login', authController.loginUser);
router.post('/register', authController.registeringUser);
router.post('/refreshtoken', authController.refreshToken);
router.post('/logout', authController.logoutUser);


export const AuthRoutes = router;
