import {Router} from 'express';
import {authRouter, userRouter} from './';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);


export const apiRouter = router;
