import logger from '@selesterkft/express-logger';
import { db, sqlConfig } from './db/dbConnection';
import app from "./app";

const PORT = process.env.PORT || 3000;

db.initiateConnection(sqlConfig);

app.listen(PORT, () => {
  logger.info(`App is listening on ${PORT}`);
});
