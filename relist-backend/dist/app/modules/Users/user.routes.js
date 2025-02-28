"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
// 3. Router
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post('/register', user_controller_1.userController.registeringUser); // add order to db
router.post('/login', user_controller_1.userController.loginUser); // add order to db
router.get('/', user_controller_1.userController.gettingUsers); // add order to db
router.get('/:id', user_controller_1.userController.gettingSingleUser); // add order to db
router.get('/single/:id', user_controller_1.userController.gettingSingleUserById); // add order to db
router.delete('/:id', user_controller_1.userController.deleteUser); // add order to db
router.patch('/:id', user_controller_1.userController.updateUser);
exports.userRoutes = router;
