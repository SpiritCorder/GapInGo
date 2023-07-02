import ProductSchema from '../model/Product.js';

export const getAllProductsByCountry = async (req, res, next) => {

    const {keyword} = req.query;

    const isoCode = req.params.isoCode;

    try {

        // let products;
        // if(keyword && keyword.trim()) {
        //     // search products using keyword
        //     const query = {
        //         $or: [
        //             {name: {$regex: keyword, $options: 'i'}},
        //             {description: {$regex: keyword, $options: 'i'}},
        //             {brand: {$regex: keyword, $options: 'i'}},
        //             {category: {$regex: keyword, $options: 'i'}},
        //         ]
        //     }
        //     products = await ProductSchema.find(query);
        // } else {
        //     products = await ProductSchema.find();
        // }

        const products = await ProductSchema.find({"shippingCountries.isoCode": isoCode}).lean().exec();

        res.status(200).json(products);
    } catch (err) {
        res.statusCode = 500;
        const error = new Error('Server error');
        next(error)
    }
}

export const getSingleProduct = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await ProductSchema.findById(productId);
        if(!product) {
            res.statusCode = 404;
            const error = new Error('product not found');
            next(error);
            return;
        }
        res.status(200).json(product);
    }catch(err) {
        res.statusCode = 500;
        next(err);
    }
}

// get top rated products
// public

export const getTopratedProducts = async (req, res, next) => {

    try {
        const products = await ProductSchema.find({}).sort({rating: -1}).limit(3);
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }

}

export const getCartItems = async (req, res, next) => {
    const {items} = req.body; // array of cart items _id's

    try {
        const queryStr = items.map(id => {
            return {
                _id: id,
                stockCount: {$gt: 0}
            }
        });
        const cartItems = await ProductSchema.find({$or: queryStr})
        res.status(200).json(cartItems);
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}