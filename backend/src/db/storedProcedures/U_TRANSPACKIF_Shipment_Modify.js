import { StoredProcedure } from '@selesterkft/sel-db';
import { db } from '../dbConnection';

export async function U_TRANSPACKIF_Shipment_Modify(queryParams) {
    const storedProcedure = new StoredProcedure('U_TRANSPACKIF_Shipment_Modify')
    storedProcedure.addParam('ORD_L_ID', 'int', queryParams.ord_l_id);
    storedProcedure.addParam('JSON', 'NVarChar', queryParams.json, { length: 'max' });
    storedProcedure.addParam('Response', 'int', queryParams.response);
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
