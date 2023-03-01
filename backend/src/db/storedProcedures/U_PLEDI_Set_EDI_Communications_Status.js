import { StoredProcedure } from '@selesterkft/sel-db';
import { db } from '../dbConnection';

export async function U_PLEDI_Set_EDI_Communications_Status(params) {
    const storedProcedure = new StoredProcedure('U_PLEDI_Set_EDI_Communications_Status');
    storedProcedure.addParam('EDI_Communications_Files_ID', 'Int', params.fileId);
    storedProcedure.addParam('Send_Status', 'NVarChar', params.result.status, { length: '50' });
    storedProcedure.addParam('Send_Status_Remarks', 'NVarChar', params.result.message, { length: 'max' });

    await db.callSP(storedProcedure);

    return {};
}
