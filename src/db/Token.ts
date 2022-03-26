import {model, Schema} from "mongoose";

const tokenSchema = new Schema({
    accessToken: {
        type: String,
        required: true,
        trim: true,

    },
    refreshToken: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        selected: false,
        ref: 'user'
    },
}, {timestamps: true});


export const Token = model('token', tokenSchema);
