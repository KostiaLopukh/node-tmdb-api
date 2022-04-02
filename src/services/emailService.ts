import nodemailer from 'nodemailer';
import EmailTemplates from 'email-templates';
import path from 'path';
import {configs} from '../constants';
import {allTemplates} from '../static/allTemplates';

const {NO_REPLY_EMAIL, NO_REPLY_PASSWORD} = configs;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NO_REPLY_EMAIL,
        pass: NO_REPLY_PASSWORD
    }
});

const templateParser = new EmailTemplates({
    views: {
        root: path.join(process.cwd(), 'src', 'static'),
        options: {
            extension: 'hbs',
        }
    }
});

const sendMail = async (email: string, emailAction: string, context: any) => {
    const templateInfo = allTemplates[emailAction];
    const html = await templateParser.render(templateInfo.templateName as string, context);

    return transporter.sendMail({
        from: 'No reply',
        to: email,
        subject: templateInfo.subject,
        html
    });
};

export const emailService = {
    sendMail,
};
