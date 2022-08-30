import express from 'express';

const cors = require('cors');

import { verifyLocalSystem } from '../middlewares/verifyLocalSystem';
import { datachangeController } from '../controllers';

const router = express.Router();

router.use(cors());

router.use(express.json());

router.use(verifyLocalSystem);

router.get('/shipments', datachangeController.importShipments);

export default router;
