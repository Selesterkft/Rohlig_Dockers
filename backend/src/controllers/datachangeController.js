import { datachangeService } from "../services/datachangeService";

export const datachangeController = {
    async importShipments(req, res, next) {
        const result = await datachangeService.importShipmentsFromFTP();
        res.status(200).json(result);
    }
}
