import Joi from 'joi';
import {regexp} from '../constants';

const {EMAIL_REGEXP, PASSWORD_REGEXP} = regexp;

export const userValidator = Joi.object({
    name: Joi.string(),
    email: Joi
        .string()
        .regex(EMAIL_REGEXP)
        .trim()
        .required(),
    password: Joi
        .string()
        .trim()
        .regex(PASSWORD_REGEXP)
        .required(),
});

