import {Router} from 'express';

const router = Router();

import {getSingleProduct, getCartItems, getTopratedProducts, getAllProductsByCountry} from '../controllers/products.js';

router.get('/country/:isoCode', getAllProductsByCountry);

router.get('/top-rated', getTopratedProducts);

router.get('/:id', getSingleProduct);

router.post('/cart', getCartItems);





export default router;