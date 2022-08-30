import { dataService } from '../services';

export const dataController = {
    async getData(req, res, next) {
        let result;

        try {
            result = await dataService.getData(req.headers);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
}
