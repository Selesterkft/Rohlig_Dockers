import { EComm_DATA_GET } from "../db/storedProcedures";

export const dataService = {
    async getData(queryParams) {
        return await EComm_DATA_GET(queryParams);
    },
}
