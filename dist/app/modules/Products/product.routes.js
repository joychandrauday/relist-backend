"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
// 2.Router
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
router.post('/', product_controller_1.productController.addingProduct);
router.get('/', product_controller_1.productController.gettingProducts);
router.get('/:productId', product_controller_1.productController.gettingProduct);
router.patch('/:productId', product_controller_1.productController.updatingProduct);
router.delete('/:productId', product_controller_1.productController.deletingProduct);
exports.productRoutes = router;
