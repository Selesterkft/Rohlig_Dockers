import { StoredProcedure } from '@selesterkft/sel-db';
import { db } from '../dbConnection';

export async function EComm_DATA_GET(queryParams) {
  const storedProcedure = new StoredProcedure('EComm_DATA_GET')

  const sqlTop = queryParams.top ?? 0;
  storedProcedure.addParam(
    'WhereQuery',
    'NVarChar',
    queryParams.sqlWhereQuery
  );
  storedProcedure.addParam('SELECT', 'NVarChar', queryParams.select, { length: 'max' });
  storedProcedure.addParam('TOP', 'Int', sqlTop);
  storedProcedure.addParam('FROM', 'NVarChar', queryParams.from, { length: 'max' });
  storedProcedure.addParam('WHERE', 'NVarChar', queryParams.where, { length: 'max' });
  storedProcedure.addParam('GROUP_BY', 'NVarChar', queryParams.groupby, { length: 'max' });
  storedProcedure.addParam('ORDER_BY', 'NVarChar', queryParams.orderby, { length: 'max' });
  storedProcedure.addParam('Lang', 'NVarChar', queryParams.language, { length: 10 });
  storedProcedure.addParam('PAGE_NO', 'Int', queryParams.pageNo);
  storedProcedure.addParam('ROWS_PER_PAGE', 'Int', queryParams.rowsperpage);

  storedProcedure.addOutputParam('OUT_HTTP_Code', 'Int');
  storedProcedure.addOutputParam('OUT_HTTP_Message', 'NVarChar', '', { length: 'max' });

  const sqlResult = await db.callSP(storedProcedure);
  return {
    columns: sqlResult.columns,
    data: sqlResult.recordset,
  };
}
