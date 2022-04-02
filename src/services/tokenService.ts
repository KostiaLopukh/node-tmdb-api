import jwt from 'jsonwebtoken';
import {ErrorHandler} from '../errors/errorHandler';
import {actionTokenTypeEnum, configs, tokenTypeEnum} from '../constants';
import {ITokens} from '../interfaces/tokenInterface';
// import {IUser} from "../interfaces/interfaces";

const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACTION_SECRET, JWT_FORGOT_SECRET} = configs;
const {ACTIVATE, FORGOT} = actionTokenTypeEnum;
const {ACCESS, REFRESH} = tokenTypeEnum;


class TokenService {
    public generateTokenPair(payload: any): ITokens {
        const {id} = payload;
        const accessToken = jwt.sign({id}, JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign({id}, JWT_REFRESH_SECRET, {expiresIn: '30d'});

        return {
            accessToken,
            refreshToken
        };
    }

    public async verifyToken(token: string, tokenType: string) {
        try {
            let secret = '';
            switch (tokenType) {
                case ACCESS:
                    secret = JWT_ACCESS_SECRET;
                    break;
                case REFRESH:
                    secret = JWT_REFRESH_SECRET;
                    break;
                default:
                    throw new ErrorHandler('Server error', 500);
            }
            return jwt.verify(token, secret);
        } catch (e) {
            throw new ErrorHandler('Not valid token', 401);
        }
    }

    public generateActionToken(tokenType: string): string {
        let secret = '';
        switch (tokenType) {
            case ACTIVATE:
                secret = JWT_ACTION_SECRET;
                break;
            case FORGOT:
                secret = JWT_FORGOT_SECRET;
                break;
            default:
                throw new ErrorHandler('Wrong token type', 500);
        }
        return jwt.sign({}, secret, {expiresIn: '30m'});
    }

    public async verifyActionToken(token: string, tokenType: string) {
        try {
            let secret = '';
            switch (tokenType) {
                case ACTIVATE:
                    secret = JWT_ACTION_SECRET;
                    break;
                case FORGOT:
                    secret = JWT_FORGOT_SECRET;
                    break;
                default:
                    throw new ErrorHandler('Server error', 500);
            }

            await jwt.verify(token, secret);
        } catch (e) {
            throw new ErrorHandler('Not valid token', 401);
        }
    }

}

export const tokenService = new TokenService();
