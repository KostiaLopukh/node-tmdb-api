import {model, Schema} from 'mongoose';

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
        default: 'https://tmdb2.s3.amazonaws.com/user/62406502df507b5db72cbfa1/b2cd337a-ab7f-48e9-8872-e0ca8c770342.png',
        required: false,
    }
}, {timestamps: true});

export const User = model('user', userSchema);
