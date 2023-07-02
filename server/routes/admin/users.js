import {Router} from 'express';
import {auth,isAdmin} from '../../middleware/auth.js';

const router = Router();

import {getAllUsers, getSingleUser, updateUserToAdmin , deleteUser} from '../../controllers/admin/users.js';


router.get('/', auth, isAdmin, getAllUsers);
router.get('/:id', auth, isAdmin, getSingleUser);
router.put('/:id/admin', auth, isAdmin, updateUserToAdmin);
router.delete('/:id', auth, isAdmin, deleteUser);


export default router;