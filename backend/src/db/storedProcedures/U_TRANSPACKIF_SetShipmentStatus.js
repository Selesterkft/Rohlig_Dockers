import { StoredProcedure } from '@selesterkft/sel-db';
import { db } from '../dbConnection';

export async function U_TRANSPACKIF_SetShipmentStatus(queryParams) {
    const storedProcedure = new StoredProcedure('U_TRANSPACKIF_SetShipmentStatus')

    storedProcedure.addParam('ORD_L_ID', 'int', queryParams.ORD_L_ID);
    storedProcedure.addParam('New_Status_ID', 'int', queryParams.New_Status_ID);
    storedProcedure.addOutputParam('OUT_HTTP_Code', 'int');
    storedProcedure.addOutputParam('OUT_HTTP_Message', 'NVarChar', '', { length: 'max' });

    const sqlResult = await db.callSP(storedProcedure);
    if (sqlResult.output.OUT_HTTP_Code !== 200) {
        const error = new Error(sqlResult.output.OUT_HTTP_Message);
        error.status = sqlResult.output.OUT_HTTP_Code;
        throw error;
    }

    return {
        columns: sqlResult.columns,
        data: sqlResult.recordset,
    };
}
