import {Request} from "express";
import {IUser} from "./interfaces";

export interface IRequest extends Request {
    user?: IUser
}
