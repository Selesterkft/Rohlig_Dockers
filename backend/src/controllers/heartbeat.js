import { PING as sqlPing } from '../db/storedProcedures';
import { ftp } from '../ftp/ftpConnection';
import { db, sqlConfig } from '../db/dbConnection';

export const heartbeat = async (req, res) => {
  let connected = false;
  const result = {
    heartbeat: true,
    version: '2022.09.26-01',
    dbConnection: false,
    ftpConnection: false,
    countOfStatusesInQuene: 'n/a',
  }
  try {
    db.initiateConnection(sqlConfig);
    connected = true;

    const sqlResult = await sqlPing();

    result.dbConnection = true;
    result.countOfStatusesInQuene = sqlResult.countOfStatusesInQuene;
  } catch (error) {
    //Nothing to do
  }

  if (connected) {
    db.dropConnection();
    connected = false;
  }

  result.ftpConnection = await ftp.ping();

  res.json(result);
};
