import express from 'express';
import { NewsLetterController } from './newsletter.controller';

const router = express.Router();

router.post('/', NewsLetterController.addNewsLetter);
router.get('/', NewsLetterController.getNewsLetterAll);
router.get('/:email', NewsLetterController.getNewsLetterEmail);
router.delete('/:email', NewsLetterController.deleteNewsLetter);
router.post('/send-all', NewsLetterController.sendNewsLetterToAll);




export const NewsLetterRoutes = router;
