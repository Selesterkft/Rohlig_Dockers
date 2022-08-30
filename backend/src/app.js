import express from 'express';
import logger from '@selesterkft/express-logger';

const cors = require('cors');

import { api, docs, data, datachange, ftp } from './routes';
import errorHandler from './middlewares/error-handler';

const app = express();

app.use(logger.middleware());

app.use('/api', api);
app.use('/api-docs', docs);
app.use('/ftp', ftp);
app.use('/datachange', datachange);
app.use('/data', data);

app.use(errorHandler);

export default app;
