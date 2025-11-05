import { Router } from 'express';
import controllers from '../controllers';

const router = Router();

router.get('/api/health', controllers.health);
router.get('/api/entries', controllers.listEntries);
router.post('/api/entries', controllers.createEntry);

export default router;