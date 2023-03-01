import { U_TRANSPACKIF_Get_Params } from "../db/storedProcedures";

export const paramsService = {
    async getParams(queryParams) {
        return await U_TRANSPACKIF_Get_Params(queryParams);
    },
}