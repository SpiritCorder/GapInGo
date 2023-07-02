import ReviewSchema from '../model/Review.js';
import OrderSchema from '../model/Order.js';
import ProductSchema from '../model/Product.js';
import mongoose from 'mongoose';


export const createNewReview = async (req, res, next) => {
    const {orderId, productId, rating, comment} = req.body;

    try {
        const order = await OrderSchema.findById(orderId).lean().exec();

        if(!order) return res.status(404).json({message: 'order not found'});

        if(order.cancellationDetails.isCanceled) return res.status(422).json({message: 'order has been canceled already'});

        // CHECK WETHER THE ORDER BELONGS TO THE CUSTOMER
        if(order.customer.toString() !== req.user._id.toString()) return res.status(401).json({message: 'Unauthorized'});

        // CHECK WETHER FOR THIS PRODUCT OF THIS ORDER ALREADY IS THERE A REVIEW ?
        const duplicate = await ReviewSchema.findOne({reviewOrder: orderId, reviewProduct: productId}).lean().exec();

        if(duplicate) return res.status(422).json({message: 'already been reviewed'});

        // CREATE A NEW REVIEW
        const review = {
            rating: +rating,
            comment,
            reviewer: req.user._id,
            reviewProduct: productId,
            reviewOrder: orderId
        }

        // UPDATE THE PRODUCT RATINGS


    } catch (err) {
        
    }
}

























// OLD CODE FOR REVIEWS

// export const createNewReview = async (req, res, next) => {

//     const productId = req.params.productId;

//     // find whether the user already bought the product
//     try {
//         const alreadyBought = await OrderSchema.findOne({$and: [{user: req.user._id}, {"orderItems.product":  productId}]});
    
//         if(!alreadyBought) {
//             const error = new Error('Forbidden');
//             res.statusCode = 403;
//             next(error);
//             return;
//         }

//         // ensure the product still exists
//         const productExist = await ProductSchema.findById(productId);

//         if(!productExist) {
//             const error = new Error('Product not found');
//             res.statusCode = 404;
//             next(error);
//             return;
//         }

//         // check whether the user has already reviewed the product
//         const alreadyReviewed = await ReviewSchema.findOne({$and: [{reviewProduct: productId}, {reviewer: req.user._id}]});

//         if(alreadyReviewed) {
//             const error = new Error('You have already review the product');
//             res.statusCode = 401;
//             next(error);
//             return;
//         }

//         // create a new review
//         const {comment, rating} = req.body;
//         const newReview = {
//             rating: Number(rating),
//             comment,
//             reviewer: req.user._id,
//             reviewProduct: productId
//         }

//         const createdReview = await ReviewSchema.create(newReview);

//         // update product schema
//         productExist.reviews.push(createdReview._id);
//         productExist.numReviews = productExist.reviews.length;
        
//         const avgRating = await ReviewSchema.aggregate([
//             {$match: {reviewProduct: mongoose.Types.ObjectId(productId)}},
//             {$group: {_id: "$reviewProduct", average: {$avg: '$rating'}}}  
//         ]);

//         productExist.rating = avgRating[0].average;

//         await productExist.save();

//         res.status(201).json({
//             createdReview,
//             productRating: productExist.rating
//         });

//     } catch (err) {
//         next(err);
//     }

// }

// export const getReviewsForProduct = async (req, res, next) => {

//     const productId = req.params.productId;

//     try {
//         //const reviews = await ReviewSchema.find({reviewProduct: productId}).populate('reviewer');

        


//         res.status(200).json({
            
//             avgRating
//         });
//     } catch (err) {
//         next(err);
//     }
// }