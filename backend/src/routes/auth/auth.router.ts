import {Router} from 'express';
import {RegisterHandler, LoginHandler, LogoutHandler, RefreshTokenHandler} from './auth.controller';
import requireAuth from '../../middlewares/requireAuth';

const router = Router();

router.post('/register', RegisterHandler);
router.post('/login', LoginHandler);
router.post('/refresh', RefreshTokenHandler);

router.get('/logout', requireAuth, LogoutHandler);

export default router;
