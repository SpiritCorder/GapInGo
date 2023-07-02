import ProductSchema from '../../model/Product.js';

// @desc   create a new product
// @route  POST /api/admin/products
// @access Private (Admin Only)

const createNewProduct = async (req, res, next) => {
    const {
        title, 
        subTitle, 
        variations, 
        condition, 
        recommendedSpecifications, 
        customSpecifications, 
        aboutDescription, 
        regularPrice,
        regularQuantity,
        discount,
        detailedDescription,
        videoUrl,
        shippingCountries,
        countryShippingDetails,
        handlingTime,
        itemLocation,
        returns
    } = req.body;

    // validate product data
    if(
        !title.trim() ||
        !subTitle.trim() ||
        !condition.trim() ||
        +regularPrice < 0 ||
        +discount < 0 ||
        +regularQuantity < 0
    ) {
        return res.status(400).json({message: 'Invalid Inputs'});
    }

    // check if no variations, then price and quantity must be there
    if(variations <= 0 && (+regularPrice <= 0 || +regularQuantity <= 0)) {
        return res.status(400).json({message: 'Product has no variations, so please enter valid price and quantity'});
    }

    // variations.variations = variations.variations.map(v => {
    //     return {
    //         ...v,
    //         qty: +v.qty,
    //         price: +v.price,
    //         discount: +v.discount
    //     }
    // })

    // validate shippingCountries and countryShippingDetails have same length
    if(shippingCountries.length !== countryShippingDetails.length) {
        return res.status(400).json({message: 'Please make sure shipping details entered for every selected country'});
    }

    // handling time validation
    if(handlingTime === '') return res.status(400).json({message: 'Handling time is required'});

    // check for item location
    if(!itemLocation.country) return res.status(400).json({message: 'Item location is required'});

    // check for returns
    if(!returns.type || (returns.type !== 'not-accepted' && !returns.returnShippingCostPaidBy)) {
        return res.status(400).json({message: 'Return details are wrong'});
    }

    // convert countryShipping details to proper form
    const updatedCountryShippingDetails = countryShippingDetails.map(item => {
        const newShippingMethods = item.shippingMethods.map(method => {
            if(method.isFreeShipping) {
                return {
                    ...method,
                    shippingPrice: 0,
                    additionalShippingPrice: 0
                }
            }
            return method;
        })
        item.shippingMethods = newShippingMethods;
        return item;
    })

    console.log(updatedCountryShippingDetails);

    const product = {
        user: req.user._id,
        title, 
        subTitle, 
        condition, 
        recommendedSpecifications, 
        customSpecifications, 
        aboutDescription, 
        regularPrice,
        regularQuantity,
        discount,
        detailedDescription,
        videoUrl,
        shippingCountries,
        countryShippingDetails: updatedCountryShippingDetails,
        handlingTime,
        itemLocation,
        returns
    }

    try {
        const newProduct = await ProductSchema.create(product);

        res.status(201).json({message: 'Product created success', product: newProduct});
    } catch (err) {
        next(err);
    }

}




// @desc   update images and variations after creating of new product
// @route  PUT /api/admin/products/images/:id
// @access Private (Admin Only)


const createNewProductImageAndVariationUpdate = async (req, res, next) => {
    const productId = req.params.id;

    try {
        const product = await ProductSchema.findById(productId).lean().exec();

        if(!product) return res.status(404).json({message: 'Product not found'});

        const {images, variations} = req.body;

        variations.values = variations.values.map(v => {
            return {
                ...v,
                qty: +v.qty,
                price: +v.price,
                discount: +v.discount
            }
        })

        console.log(variations);

        await ProductSchema.findOneAndUpdate({_id: productId}, {images, variations});

        res.status(200).json({message: 'Product images updated'});

    } catch (err) {
        next(err);
    }
}

export default {
    createNewProduct,
    createNewProductImageAndVariationUpdate
}