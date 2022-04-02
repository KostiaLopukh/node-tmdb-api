import {Request} from 'express';
import {IUser} from './interfaces';

// @ts-ignore
export interface IRequest extends Request {
    user?: IUser,
    files?:object,
}
