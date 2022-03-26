import express, {NextFunction, Request, Response} from "express";
import mongoose from "mongoose";
import {configs} from "./constants/configs";
import {apiRouter} from "./routes/apiRouter";
import {engine} from 'express-handlebars';
import path from "path";
import cors from 'cors';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', '.hbs');
app.engine('.hbs', engine({ defaultLayout: false }));
app.set('views', path.join(__dirname, 'static'));


const {PORT, MONGO_CONNECT_URL, CLIENT_URL} = configs;

app.use(cors({origin: CLIENT_URL}));
app.use(apiRouter);

// eslint-disable-next-line no-unused-vars
app.use('*', (err:any, req:Request, res:Response, next:NextFunction)=>{
    res.status(err.status || 500).json({
        message: err.message,
    });
});

app.listen(PORT, () => {
    mongoose.connect(MONGO_CONNECT_URL as string).then(() => console.log('DB connected'));
    console.log(`Listening PORT ${PORT}...`);
});

