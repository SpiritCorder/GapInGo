import {Router} from 'express';

const router = Router();

import {auth} from '../middleware/auth.js';
import {getUserProfile, updateUserProfile} from '../controllers/users.js';

router.get('/profile', auth, getUserProfile);

router.put('/profile', auth, updateUserProfile);



export default router;



