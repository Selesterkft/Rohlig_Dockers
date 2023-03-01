import { rohligPlService } from "../services/rohligPlService";
    
export const rohligPlController = {
    async importShipments(req, res, next) {
        try {
            const result = await rohligPlService.importShipmentsFromFTP();
            res.status(200).json(result);
        } catch (error) {
            throw new Error('Internal error');
        }
    },

    async exportStatuses(req, res, next) {
        try {
            const result = await rohligPlService.exportStatuses(req.headers);
            res.status(200).json(result);
        } catch (error) {
            throw new Error('Internal error');
        }
    }
}
