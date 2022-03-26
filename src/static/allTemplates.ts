import {emailActionsEnum} from '../constants';

export const allTemplates = {
    [emailActionsEnum.ACTIVATE_EMAIL]: {
        templateName: 'activateEmail',
        subject: 'Welcome!'
    },
    [emailActionsEnum.FORGOT_PASSWORD]: {
        templateName: 'forgotPassword',
        subject: 'We will help you to reset your password ^)'
    }
};
