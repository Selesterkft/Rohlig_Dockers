import { ftpService } from "../services/ftpService";

export const ftpController = {
    async cd(req, res, next) {
        try {
            const result = await ftpService.cd(req.headers.path);
            res.status(200).json(result);
        } catch (error) {
            const err = new Error('Invalid path');
            err.status = 404;
            next(err);
        }
    }
}
