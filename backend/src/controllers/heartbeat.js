import { PING as sqlPing } from '../db/storedProcedures';
import { ftp } from '../ftp/ftpConnection';

export const heartbeat = async (req, res) => {
  const result = {
    heartbeat: true,
    version: '2022.09.26-01',
    dbConnection: false,
    ftpConnection: false,
    countOfStatusesInQuene: 'n/a',
  }
  try {
    const sqlResult = await sqlPing();
  
    result.dbConnection = true;
    result.countOfStatusesInQuene = sqlResult.countOfStatusesInQuene;
  } catch (error) {
    //Nothing to do
  }

  result.ftpConnection = await ftp.ping();

  res.json(result);
};
