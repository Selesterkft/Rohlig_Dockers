import { datachangeService } from "../services/datachangeService";

export const datachangeController = {
    async importShipments(req, res, next) {
        try {
            const result = await datachangeService.importShipmentsFromFTP();
            res.status(200).json(result);
        } catch (error) {
            throw new Error('Internal error');
        }
    },

    async exportStatuses(req, res, next) {
        try {
            const result = await datachangeService.exportStatuses(req.headers);
            res.status(200).json(result);
        } catch (error) {
            throw new Error('Internal error');
        }
    }
}
