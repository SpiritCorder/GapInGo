import {Router} from 'express';

import {auth} from '../middleware/auth.js';
import {getProfile, updateProfile, resendEmailVerification} from '../controllers/profileControllers.js';

const router = Router();

router.use(auth);

router.route('/')
    .get(getProfile) // get profile data
    .put(updateProfile) // update profile with given data

router.route('/resend-email-verification')
    .get(resendEmailVerification);




export default router;