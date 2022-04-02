import {NextFunction, Response} from 'express';
import {User} from '../db';
import {IRequest} from '../interfaces/requestExtendedInterface';

class UserController {
    public async getByEmail(req: IRequest, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;
            const user = await User.findOne({email});

            res.json({user});
        } catch (e) {
            next(e);
        }
    }

}

export const userController = new UserController();
