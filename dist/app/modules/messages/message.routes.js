"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("./message.controller");
const router = express_1.default.Router();
router.post('/', message_controller_1.messageController.sendMessage);
router.post('/users', message_controller_1.messageController.getUserSidebarController);
router.get('/:userId/:recieverId', message_controller_1.messageController.getUserMessages);
router.post('/user', message_controller_1.messageController.getUserSidebarSingleController);
exports.messageRouter = router;
