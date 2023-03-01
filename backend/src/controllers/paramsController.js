import { paramsService } from '../services';

export const paramsController = {
    async getParams(req, res, next) {
        let result;

        try {
            result = await paramsService.getParams(req.headers);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}