import {NextFunction, Request, Response} from "express";
import {Action, Token, User} from "../db";
import {emailService, passwordService, tokenService} from "../services";
import {IUser} from "../interfaces/interfaces";
import {actionTokenTypeEnum, configs, constants, emailActionsEnum, tokenTypeEnum} from '../constants';

import {ErrorHandler} from "../errors/errorHandler";
import {IRequest} from "../interfaces/requestExtendedInterface";
import {s3Service} from "../services/s3Service";

const {ACTIVATE, FORGOT} = actionTokenTypeEnum;
const {FORGOT_PASSWORD, ACTIVATE_EMAIL} = emailActionsEnum;
const {ACCESS} = tokenTypeEnum;
const {CLIENT_URL} = configs;
const {AUTHORIZATION} = constants;

class AuthController {
    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const {name, email, password, phone, gender} = req.body;
            const hashedPassword = await passwordService.hash(password);
            const user = await User.create({name, email, password: hashedPassword, phone, gender});
            const tokens = tokenService.generateTokenPair({id: user._id});
            await Token.create({...tokens, user: user._id});
            const activationToken = tokenService.generateActionToken(ACTIVATE);
            await Action.create({actionToken: activationToken, tokenType: ACTIVATE, user: user._id});

            await emailService.sendMail(email, ACTIVATE_EMAIL, {name, activationToken});
            res.json({user, ...tokens});
        } catch (e) {
            next(e);
        }
    }

    public async login(req: IRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user as Partial<IUser>;
            const {password} = req.body;

            const {password: hashedPassword} = user as Partial<IUser>;

            const isMatched = await passwordService.compare(password, hashedPassword as string);
            if (!isMatched) {
                throw new ErrorHandler('Wrong email or password', 404);
            }

            const tokens = tokenService.generateTokenPair({id: user._id});

            await Token.create({...tokens, user: user._id});

            res.json({...tokens, user: req.user});
        } catch (e) {
            next(e);
        }
    }

    public async sendEmailActivate(req: Request, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;
            const {name, _id} = await User.findOne({email});

            if (!name) {
                next(new ErrorHandler('Wrong email', 401));
            }

            const activationToken = tokenService.generateActionToken(ACTIVATE);
            await Action.create({actionToken: activationToken, tokenType: ACTIVATE, user: _id});

            await emailService.sendMail(email, ACTIVATE_EMAIL, {name, activationToken});

            res.end();
        } catch (e) {
            next(e);
        }
    }

    public async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const {token} = req.params;
            const userDB = await Action.findOne({actionToken: token}).populate('user');
            console.log(userDB);

            const {actionToken, user} = await Action.findOne({actionToken: token}).populate('user');

            if (!actionToken) {
                throw new ErrorHandler('Wrong token', 404);
            }
            await tokenService.verifyActionToken(token, ACTIVATE);
            await User.updateOne({email: user.email}, {isActivated: true});

            res.redirect(`${CLIENT_URL}/account`);
        } catch (e) {
            next(e);
        }
    }

    public async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.get(AUTHORIZATION);
            await Token.deleteOne({accessToken});

            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    public async checkAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.get(AUTHORIZATION);

            await tokenService.verifyToken(accessToken as string, ACCESS);

            res.status(200).json('Checked successfully');
        } catch (e) {
            next(e);
        }

    }


    public async refresh(req: IRequest, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.get(AUTHORIZATION);
            if (!refreshToken) {
                throw new Error('Token not exist');
            }

            // @ts-ignore
            const {id} = await tokenService.verifyToken(refreshToken, 'refresh');

            await Token.deleteOne({refreshToken});

            const tokenPair = tokenService.generateTokenPair({id});

            await Token.create({...tokenPair, user: id});

            res.json({...tokenPair});
        } catch (e) {
            next(e);
        }
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        try {
            const {data} = req.body;
            const user = await User.findOne({email: data.email});
            if (!user) {
                next(new ErrorHandler('Not valid email', 401));
                return;
            }
            await User.updateOne({email: data.email}, {...data});
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    public async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.get(AUTHORIZATION);
            if (!token) {
                next(new ErrorHandler('Wrong token', 401));
                return;
            }
            await tokenService.verifyToken(token, ACCESS);

            const {oldPassword, newPassword} = req.body;
            const {user} = await Token.findOne({accessToken: token})
                .populate('user');

            const isMatched = await passwordService.compare(oldPassword, user.password);
            if (!isMatched) {
                next(new ErrorHandler('Wrong password', 403));
            }

            const hashedNewPassword = await passwordService.hash(newPassword);
            await User.updateOne({_id: user._id}, {password: hashedNewPassword});

            res.json('Password changed');
        } catch (e) {
            next(e);
        }
    }

    public async forgotPassword(req: IRequest, res: Response, next: NextFunction) {
        try {
            const {_id, name, email} = req.user as IUser;

            const actionToken = tokenService.generateActionToken(FORGOT);
            await Action.create({actionToken, tokenType: FORGOT, user: _id});

            await emailService.sendMail(email, FORGOT_PASSWORD, {name, actionToken});

            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    public async setPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.get(AUTHORIZATION);

            const {newPassword} = req.body;
            const hashedPassword = await passwordService.hash(newPassword);

            if (!token) {
                next(new ErrorHandler('Invalid token', 401));
                return;
            }

            await tokenService.verifyActionToken(token, FORGOT);

            const {user} = await Action.findOne({token}).populate('user');

            await User.updateOne({email: user.email}, {password: hashedPassword});
            await Action.deleteOne({actionToken: token});

            await Token.deleteMany({user: user._id});

            res.json('Password changed');
        } catch (e) {
            next(e);
        }
    }

    public async uploadAvatar(req: IRequest, res: Response, next: NextFunction) {
        try {
            const {email} = req.body;
            const user = await User.findOne({email});

            const {avatar}: any = req.files;

            const uploadInfo: any = await s3Service.uploadImage(avatar, 'user', user._id.toString());
            await User.updateOne({email}, {avatar: uploadInfo.location}, {new: true});

            res.json(uploadInfo);

        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
