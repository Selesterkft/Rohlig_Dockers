import { datachangeService } from "../services/datachangeService";

export const datachangeController = {
    async importShipments(req, res, next) {
        const result = await datachangeService.importShipmentsFromFTP();
        res.status(200).json(result);
    },

    async exportStatuses(req, res, next) {
        const result = await datachangeService.exportStatuses(req.headers);
        res.status(200).json(result);
    }
}
