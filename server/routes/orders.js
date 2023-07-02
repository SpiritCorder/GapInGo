import {Router} from 'express';

const router = Router();

import {auth} from '../middleware/auth.js';
import {getCustomerOrders, getCustomerOrder, cancelOrder} from '../controllers/orders.js';

router.use(auth);

router.route('/')
    .get(getCustomerOrders) // get all orders of a user

router.route('/cancel')
    .put(cancelOrder) // cancel an order

router.route('/:id')
    .get(getCustomerOrder) // get a single order of a user




// router.get('/:id', auth, getOrder);
// router.get('/', auth, getOrders);
// router.post('/', auth, createOrder);
// router.put('/:id/pay', auth, updatePayment);


export default router;