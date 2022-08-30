import express from 'express';
import { dataController } from '../controllers';

const cors = require('cors');

import { verifyLocalSystem } from '../middlewares/verifyLocalSystem';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(verifyLocalSystem);

router.get('/', dataController.getData);

export default router;
