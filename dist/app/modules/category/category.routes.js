"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.post('/', category_controller_1.categoryController.addCategory);
router.get('/', category_controller_1.categoryController.getCategoryAll);
router.put('/:id', category_controller_1.categoryController.updateCategory);
router.delete('/:id', category_controller_1.categoryController.deleteCategory);
exports.categoryRouter = router;
