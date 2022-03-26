import {Router} from 'express';
import {userController} from "../controllers/userController";

const router = Router();

router.post('/', userController.getByEmail);

export const userRouter = router;
