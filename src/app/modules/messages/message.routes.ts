import express from 'express';
import { messageController } from './message.controller';

const router = express.Router();

router.post('/', messageController.sendMessage);
router.post('/users', messageController.getUserSidebarController as unknown as express.RequestHandler)
router.get('/:userId/:recieverId', messageController.getUserMessages);
router.post('/user', messageController.getUserSidebarSingleController as unknown as express.RequestHandler);

export const messageRouter = router;
