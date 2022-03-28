import express, {NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import {engine} from 'express-handlebars';
import path from 'path';
import cors from 'cors';

import {configs} from './constants/configs';
import {apiRouter} from './routes/apiRouter';
import {ErrorHandler} from './errors/errorHandler';
import {startCron} from './cron';

const app = express();

app.use(fileUpload({}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cors({origin: _configureCors}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
}));

app.set('view engine', '.hbs');
app.engine('.hbs', engine({defaultLayout: false}));
app.set('views', path.join(__dirname, 'static'));

const {PORT, MONGO_CONNECT_URL, ALLOWED_ORIGIN} = configs;

app.use(apiRouter);

// eslint-disable-next-line no-unused-vars
app.use('*', (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
        message: err.message,
    });
});

app.listen(PORT, () => {
    mongoose.connect(MONGO_CONNECT_URL as string).then(() => console.log('DB connected'));
    startCron();
    console.log(`Listening PORT ${PORT}...`);
});

function _configureCors(origin: any, callback: any) {
    const whiteList = ALLOWED_ORIGIN.split(';');

    if (!whiteList.includes(origin)) {
        return callback(new ErrorHandler('CORS is not allowed', 400), false);
    }

    return callback(null, true);
}

