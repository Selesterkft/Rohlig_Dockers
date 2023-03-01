import { loginService } from '../services/loginService';

export const loginController = {
    async getLogin(req, res, next) {
        let result;

        try {
            result = await loginService();
            console.log('+++ loginTranspack.js (line: 9)',result);
            res.status(200).json(result);
        } catch (error) {
            console.log('12: ', error);
            next(error);
        }
    },
}