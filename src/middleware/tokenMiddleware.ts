import {NextFunction, Response} from 'express';
import {constants, tokenTypeEnum} from '../constants';
import {ErrorHandler} from '../errors/errorHandler';
import {tokenService} from '../services';
import {Token, User} from '../db';
import {IRequest} from '../interfaces/requestExtendedInterface';

const {AUTHORIZATION} = constants;

class TokenMiddleware {
    public async checkRefreshToken(req: IRequest, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.get(AUTHORIZATION);
            if (!refreshToken) {
                next(new ErrorHandler('No token', 400));
                return;
            }

            // @ts-ignore
            const {id} = await tokenService.verifyToken(refreshToken, tokenTypeEnum.REFRESH);
            const tokenPairFromDB = await Token.findOne({refreshToken});

            if (!tokenPairFromDB) {
                next(new ErrorHandler('Token not valid', 400));
                return;
            }
            const userFromDB = await User.findOne({id});
            if (!userFromDB) {
                next(new ErrorHandler('Token not valid', 400));
                return;
            }

            next();
        } catch (e) {
            next(e);
        }
    }

}

export const tokenMiddleware = new TokenMiddleware();
