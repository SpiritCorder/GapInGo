import {Router} from 'express';

const router = Router();

import {auth} from '../middleware/auth.js'; 

import {register, login, getCurrentAuthUser, updateUserEmailVerificationStatus, refresh, logout} from '../controllers/auth.js';

router.post('/register', register);

router.post('/login', login);

router.get('/refresh', refresh);

router.get('/logout', logout);

router.get('/user', auth, getCurrentAuthUser);

router.get('/email-verification', updateUserEmailVerificationStatus);


export default router;