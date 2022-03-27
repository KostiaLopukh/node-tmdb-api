import {Router} from 'express';
import {authController} from '../controllers/authController';
import {authMiddleware, tokenMiddleware} from "../middleware";
import {fileMiddleware} from "../middleware/fileMiddleware";

const router = Router();

router.post('/register', authMiddleware.isNotUserExist, authController.register);
router.post('/login', authMiddleware.isUserBodyValid, authMiddleware.isUserExist, authController.login);
router.post('/logout', authController.logout);

router.post('/update', authController.update);

router.post('/password/change', authController.changePassword);
router.post('/password/forgot', authMiddleware.isUserExist, authController.forgotPassword);
router.post('/password/forgot/set', authController.setPassword);

router.get('/activate/:token', authController.activate);

router.post('/sendMail', authController.sendEmailActivate);


router.post('/checkAuth', authController.checkAuth);
router.post('/refresh', tokenMiddleware.checkRefreshToken, authController.refresh);

router.post('/uploadAvatar',fileMiddleware.checkUserAvatar, authController.uploadAvatar);


export const authRouter = router;
