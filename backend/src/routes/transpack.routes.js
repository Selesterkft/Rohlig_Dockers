import express from 'express';

const cors = require('cors');

import { verifyLocalSystem } from '../middlewares/verifyLocalSystem';
import { transpackController } from '../controllers';
import { loginController } from '../controllers/loginTranspack';

const router = express.Router();
router.use(cors());
router.use(express.json());
router.use(verifyLocalSystem);

router.get('/shipments', transpackController.shipmentSend);
router.put('/statuses', transpackController.shipmentStatus);
router.post('/login', loginController.getLogin)
export default router;
    