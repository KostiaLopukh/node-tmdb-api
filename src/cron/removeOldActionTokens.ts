import utc from 'dayjs/plugin/utc';
import {Action} from '../db';

const dayJs = require('dayjs');
dayJs.extend(utc);

export const removeOldActionToken = async () => {
    const previousMonths = dayJs.utc()
        .subtract(1, 'day');
    await Action.deleteMany({
        createdAt: {$gt: previousMonths}
    });
};
