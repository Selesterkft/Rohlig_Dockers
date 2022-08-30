import { PING as sqlPing } from '../db/storedProcedures';
import { ftp } from '../ftp/ftpConnection';

export const heartbeat = async (req, res) => {
  const result = {
    heartbeat: true,
    version: '2022.08.28-01',
    dbConnection: false,
    ftpConnection: false,
  }
  try {
    await sqlPing();
    result.dbConnection = true
  } catch (error) {
    //Nothing to do
  }

  result.ftpConnection = await ftp.ping();

  res.json(result);
};
