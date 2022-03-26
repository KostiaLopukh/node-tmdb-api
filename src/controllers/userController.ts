import {NextFunction, Request, Response} from "express";
import {User} from "../db";

class UserController{
    public async getByEmail(req:Request, res:Response, next:NextFunction){
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
