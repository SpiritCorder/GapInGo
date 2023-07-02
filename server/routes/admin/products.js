import express from 'express';
const router = express.Router();

import {auth, isAdmin} from '../../middleware/auth.js';

import productsControllers from '../../controllers/admin/products.js';

router.use(auth, isAdmin);

router.route('/')
    .post(productsControllers.createNewProduct)

router.route('/images/:id')
    .put(productsControllers.createNewProductImageAndVariationUpdate)


    export default router;
