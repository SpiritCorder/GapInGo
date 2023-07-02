import {Router} from 'express';

const router = Router();

import {auth} from '../middleware/auth.js';
import {createNewReview} from '../controllers/reviews.js';

// create a new review
// private
router.post('/:productId', auth, createNewReview);

// get all reviews for a product
// public
// router.get('/:productId', getReviewsForProduct);





export default router;