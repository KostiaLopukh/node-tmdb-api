import {config} from "dotenv";

config();

export const configs = {
    PORT: process.env.PORT,
    MONGO_CONNECT_URL: process.env.MONGO_CONNECT_URL,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_ACTION_SECRET: process.env.JWT_ACTION_SECRET as string,
    JWT_FORGOT_SECRET: process.env.JWT_FORGOT_SECRET as string,

    CLIENT_URL: process.env.CLIENT_URL,

    NO_REPLY_EMAIL:process.env.NO_REPLY_EMAIL,
    NO_REPLY_PASSWORD:process.env.NO_REPLY_PASSWORD,

    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_NAME: process.env.AWS_S3_NAME,
    AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
};
