import {model, Schema} from "mongoose";
import {actionTokenTypeEnum} from '../constants';

const tokenSchema = new Schema({
    actionToken: {
        type: String,
        required:true,
        trim:true,
    },
    tokenType: {
        type: String,
        required: true,
        enum: Object.values(actionTokenTypeEnum),
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        selected: false,
        ref:'user'
    },
}, {timestamps: true});

export const Action = model('action', tokenSchema);
