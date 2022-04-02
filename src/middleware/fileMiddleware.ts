import {IRequest} from '../interfaces/requestExtendedInterface';
import {NextFunction, Response} from 'express';
import {constants} from '../constants';
import {ErrorHandler} from '../errors/errorHandler';

const {PHOTOS_MIMETYPES, PHOTO_MAX_SIZE} = constants;

class FileMiddleware {
    public checkUserAvatar(req: IRequest, res: Response, next: NextFunction) {
        try {
            const {avatar}:any = req.files;
            if (!avatar) {
                next();
                return;
            }
            const { name, size, mimetype } = avatar;

            if (!PHOTOS_MIMETYPES.includes(mimetype)) {
                next(new ErrorHandler('Not supported format', 400));
            }
            if (size > PHOTO_MAX_SIZE) {
                next(new ErrorHandler(`File ${name} is too big`, 400));
            }

            next();
        } catch (e) {
            next(e);
        }
    }
}

export const fileMiddleware = new FileMiddleware();
