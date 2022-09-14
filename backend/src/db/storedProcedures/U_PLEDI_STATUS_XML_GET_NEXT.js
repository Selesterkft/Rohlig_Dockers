import { StoredProcedure } from '@selesterkft/sel-db';
import { db } from '../dbConnection';

export async function U_PLEDI_STATUS_XML_GET_NEXT() {
  const storedProcedure = new StoredProcedure('U_PLEDI_STATUS_XML_GET_NEXT');
  storedProcedure.addOutputParam('OUT_XML', 'NVarChar', '', {length: 'max'});
  storedProcedure.addOutputParam('OUT_EDI_Communications_Files_ID', 'Int');
  storedProcedure.addOutputParam('OUT_FileName', 'NVarChar', '', {length: 'max'});
  storedProcedure.addOutputParam('OUT_ShipmentReference', 'NVarChar', '', {length: 'max'});
  storedProcedure.addOutputParam('OUT_HTTP_Code', 'Int');
  storedProcedure.addOutputParam('OUT_HTTP_Message', 'NVarChar', '', {length: 'max'});

  const sqlResult = await db.callSP(storedProcedure);
  if (sqlResult.output.OUT_HTTP_Code !== 200) {
    const error = new Error(sqlResult.output.OUT_HTTP_Message);
    error.status = sqlResult.output.OUT_HTTP_Code;
    throw error;
  }

  return {
      xml: sqlResult.output.OUT_XML,
      fileId: sqlResult.output.OUT_EDI_Communications_Files_ID,
      fileName: sqlResult.output.OUT_FileName,
      shipmentReference: sqlResult.output.OUT_ShipmentReference,
  };
}
