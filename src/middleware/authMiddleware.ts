import {NextFunction, Request, Response} from "express";
import {User} from "../db";
import {ErrorHandler} from "../errors/errorHandler";
import {IRequest} from "../interfaces/requestExtendedInterface";
import {userValidator} from "../validators/userValidator";

class AuthMiddleware{
    public async isNotUserExist(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;
            const user = await User.findOne({email});
            if (user) {
                next(new ErrorHandler(`User with email "${email}" already exist`, 400));
                return;
            }
            next();
        } catch (e) {
            next(e);
        }
    }

    public async isUserExist(req: IRequest, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;
            const userFromDB = await User.findOne({email});
            if (!userFromDB) {
                next(new ErrorHandler(`Wrong email or password`, 404));
                return;
            }
            req.user = userFromDB;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async isUserBodyValid(req: Request, res: Response, next: NextFunction) {
        try {
            const {error} = userValidator.validate(req.body);
            if (error) {
                next(new ErrorHandler(error.message, 400));
                return;
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }

}

export const authMiddleware = new AuthMiddleware();
