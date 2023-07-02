import OrderSchema from '../model/Order.js';


export const getCustomerOrders = async (req, res, next) => {

    try {
        const orders = await OrderSchema.find({customer: req.user._id}).select('-paymentDetails.sessionId -paymentDetails.paymentIntentId').lean().exec();
        res.status(200).json({message: 'success', orders});
    } catch(err) {
        console.log(err);
        res.satatusCode = 500;
        next(err);
    }
}

export const getCustomerOrder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const order = await OrderSchema.findById(id).lean().exec();
        if(!order) {
            res.statusCode = 404;
            const error = new Error('Order not found');
            next(error);
            return;
        }


        if(req.user._id.toString() !== order.customer.toString()) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        res.status(200).json({message: 'success', order});
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}


// @desc cancel an order
// @router PUT /api/orders/cancel
// @access PRIVATE (CUSTOMERS, ADMINS)

export const cancelOrder = async (req, res, next) => {
    const orderId = req.body.orderId;

    try {
        const order = await OrderSchema.findById(orderId).lean().exec();

        if(!order) return res.status(404).json({message: 'order not found'});

        // CHECK WHETHER THE LOGGED IN USER HAD BEEN CREATED THE ORDER
        if(order.customer.toString() !== req.user._id.toString()) return res.status(401).json({message: 'unauthorized'});

        // CHECK THE ORDER CANCELLATION TIME IS EXCEEDED
        const expierationTime = (new Date(order.createdAt).getTime() + 12 * 60 * 60 * 1000) + 2 * 60 * 1000;
        const currentTime = new Date().getTime();

        if(expierationTime < currentTime) return res.status(422).json({message: 'Order cancellation time is exceeded, so order cannot be canceled'});

        // ORDER CANCELLATION SUCCESS, SO CANCEL THE ORDER
        await OrderSchema.findOneAndUpdate({_id: orderId}, {'cancellationDetails.isCanceled': true, 'cancellationDetails.canceledDate': new Date()});

        res.status(200).json({message: 'order canceled successfully'});

    } catch (err) {
        next(err);
    }
}







// OLD CODE FOR CREATE A NEW ORDER && UPDATE ORDER PAYMENT INFO

export const createOrder = async (req, res, next) => {

    const userId = req.user._id;
    let {orderItems, shippingAddress, paymentMethod, total} = req.body;

    console.log(orderItems);

    shippingAddress = {
        address: shippingAddress.address.trim() !== '' ? shippingAddress.address.trim() : '',
        city: shippingAddress.city.trim() !== '' ? shippingAddress.city.trim() : '',
        postalCode: shippingAddress.postalCode.trim() !== '' ? shippingAddress.postalCode.trim() : '',
        country: shippingAddress.country.trim() !== '' ? shippingAddress.country.trim() : ''
    }

    if(
        orderItems.length === 0 ||
        shippingAddress.address === '' ||
        shippingAddress.city === '' ||
        shippingAddress.postalCode === '' ||
        shippingAddress.country === '' ||
        paymentMethod.trim() === ''
    ) {
        res.statusCode = 422;
        const error = new Error('Invalid values for some fields please enter valid information');
        next(error);
        return;
    }

    orderItems = orderItems.map(item => {
        return {
            product: item.id,
            price: item.price,
            qty: item.qty
        }
    });

    let order = {
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod.trim(),
        totalPrice: total
    }

    try {
       order = await OrderSchema.create(order); 
       res.status(201).json(order);
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}

export const updatePayment = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const order = await OrderSchema.findById(orderId);
        if(!order) {
            res.statusCode = 404;
            const error = new Error('Order Not Found');
            next(error);
            return;
        }

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResults = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }

        const updatedOrder = await order.save();
        res.status(201).json(updatedOrder);

    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}

