import { loginService } from '../services/loginService';

export const loginController = {
    async getLogin(req, res, next) {
        let result;

        try {
            result = await loginService();
            res.status(200).json(result);
        } catch (error) {
            console.log('12: ', error);
            next(error);
        }
    },
}