import express from 'express';

const cors = require('cors');

import { verifyLocalSystem } from '../middlewares/verifyLocalSystem';
import { rohligPlController } from '../controllers';

const router = express.Router();
router.use(cors());
router.use(express.json());
router.use(verifyLocalSystem);

router.get('/shipments', rohligPlController.importShipments);
router.put('/statuses', rohligPlController.exportStatuses);

export default router;
