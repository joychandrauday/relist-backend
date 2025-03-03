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
router.get('/', user_controller_1.userController.gettingUsers);
router.get('/:id', user_controller_1.userController.gettingSingleUser);
router.get('/single/:id', user_controller_1.userController.gettingSingleUserById);
router.delete('/:id', user_controller_1.userController.deleteUser);
router.put('/:id', user_controller_1.userController.updateUser);
exports.userRoutes = router;
