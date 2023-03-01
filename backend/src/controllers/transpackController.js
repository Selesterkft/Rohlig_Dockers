import { transpackService } from '../services/transpackService';

export const transpackController = {
    async shipmentStatus(req, res, next) {
        let result;
        try {
            result = await transpackService.shipmentStatus(req.headers);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async shipmentSend(req, res, next) {
        let result;
        try {
            result = await transpackService.shipmentSend(req.headers);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
