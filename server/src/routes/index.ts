import { Router } from 'express';
import { someControllerFunction } from '../controllers';

const router = Router();

router.get('/api/some-endpoint', someControllerFunction);

export default router;