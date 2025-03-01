import express from 'express';
import { getUserMessages, sendMessage } from './message.controller';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:userId', getUserMessages);

export const messageRouter = router;
