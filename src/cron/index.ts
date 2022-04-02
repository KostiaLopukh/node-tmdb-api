import cron from 'node-cron';
import {removeOldActionToken} from './removeOldActionTokens';

export const startCron = () => {
    cron.schedule('0 0 1 * *', async () => {
        await removeOldActionToken();
    });

};
