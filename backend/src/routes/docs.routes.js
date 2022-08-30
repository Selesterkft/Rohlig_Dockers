import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const cors = require('cors');

const router = express.Router();

router.use(cors());

const swaggerDocument = YAML.load('./openapi.yaml');

router.use(cors());

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router
