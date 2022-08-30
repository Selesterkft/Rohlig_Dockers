import express from 'express';

const cors = require('cors');

import { verifyLocalSystem } from '../middlewares/verifyLocalSystem';
import { ftpController } from '../controllers';

const router = express.Router();

router.use(cors());

router.use(express.json());

router.use(verifyLocalSystem);

router.put('/pwd', ftpController.cd);

export default router;
