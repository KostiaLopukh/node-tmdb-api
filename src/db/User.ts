import {model, Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        selected: false,
    },
    phone: {
        type: String,
        required: true,
    },
    isActivated:{
        type:Boolean,
        default: false,
        required: true,
    },
    avatar: {
        type:String,
    }

}, {timestamps: true});

export const User = model('user', userSchema);
