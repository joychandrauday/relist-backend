"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const newsletter_controller_1 = require("./newsletter.controller");
const router = express_1.default.Router();
router.post('/', newsletter_controller_1.NewsLetterController.addNewsLetter);
router.get('/', newsletter_controller_1.NewsLetterController.getNewsLetterAll);
router.get('/:email', newsletter_controller_1.NewsLetterController.getNewsLetterEmail);
router.delete('/:email', newsletter_controller_1.NewsLetterController.deleteNewsLetter);
router.post('/send-all', newsletter_controller_1.NewsLetterController.sendNewsLetterToAll);
exports.NewsLetterRoutes = router;
