import {auth, isAdmin} from '../../middleware/auth.js';

import {Router} from 'express';

const router = Router();

router.use(auth, isAdmin);

import {getAllOrders, getSingleOrder, updateTrackingNumber, updateHandledStatus} from '../../controllers/admin/orders.js';

router.route('/')
    .get(getAllOrders) // get all order details

router.route('/:id')
    .get(getSingleOrder) // get single order details

router.route('/update/tracking-number')
    .put(updateTrackingNumber) // update traking number of an order item

router.route('/update/handled-status')
    .put(updateHandledStatus) // update traking number of an order item



export default router;