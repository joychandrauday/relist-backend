import express from 'express';
import { messageController } from './message.controller';

const router = express.Router();

router.post('/', messageController.sendMessage);
router.get('/:userId', messageController.getUserMessages);

export const messageRouter = router;
