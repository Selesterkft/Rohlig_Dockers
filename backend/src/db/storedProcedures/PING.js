import { StoredProcedure } from '@selesterkft/sel-db';
import { db } from '../dbConnection';

export async function PING() {
  const storedProcedure = new StoredProcedure('EComm_PING');
  storedProcedure.addOutputParam('OUT_HTTP_Code', 'Int');
  storedProcedure.addOutputParam('OUT_HTTP_Message', 'NVarChar', '', {length: 'max'});

  const sqlResult = await db.callSP(storedProcedure);
  if (sqlResult.output.OUT_HTTP_Code !== 200) {
    const error = new Error(sqlResult.output.OUT_HTTP_Message);
    error.status = sqlResult.output.OUT_HTTP_Code;
    throw error;
  }

  return {
      dbConnection: true,
  };
}
