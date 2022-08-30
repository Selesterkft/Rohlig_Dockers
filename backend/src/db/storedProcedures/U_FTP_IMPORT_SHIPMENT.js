import { StoredProcedure } from '@selesterkft/sel-db';
import { db } from '../dbConnection';

export async function U_FTP_IMPORT_SHIPMENT(FtpTransactId, OrigFileName, Data) {
  const storedProcedure = new StoredProcedure('U_FTP_IMPORT_SHIPMENT');
  storedProcedure.addParam('FTP_TransactId', 'Int', FtpTransactId);
  storedProcedure.addParam('OrigFileName', 'NVarChar', OrigFileName, {length: 255});
  storedProcedure.addParam('Data', 'NVarChar', Data, {length: 'max'});
  storedProcedure.addOutputParam('OUT_FileId', 'Int');
  storedProcedure.addOutputParam('OUT_OrdId', 'Int');
  storedProcedure.addOutputParam('OUT_HTTP_Code', 'Int');
  storedProcedure.addOutputParam('OUT_HTTP_Message', 'NVarChar', '', {length: 'max'});

  const sqlResult = await db.callSP(storedProcedure);
  if (sqlResult.output.OUT_HTTP_Code !== 200) {
    return {
      result: sqlResult.output.OUT_HTTP_Code,
      message: sqlResult.output.OUT_HTTP_Message,
    }
  }

  return {
      result: sqlResult.output.OUT_HTTP_Code,
      fileId: sqlResult.output.OUT_FileId,
      OrdId: sqlResult.output.OUT_OrdId,
      NOC: sqlResult.output.OUT_NOC,
  };
}
