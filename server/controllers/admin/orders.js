import OrderSchema from '../../model/Order.js';

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await OrderSchema.find().sort({createdAt: -1}).lean().exec();

        res.status(200).json({message: 'success', orders});
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}

export const getSingleOrder = async (req, res, next) => {

    const orderId = req.params.id;

    try {
        const order = await OrderSchema.findById(orderId).populate('customer', '-password -emailToken -refreshToken').lean().exec();

        if(!order) return res.status(404).json({message: 'order not found'});

        res.status(200).json({message: 'success', order});
    } catch (err) {
        next(err);
    }
}


export const updateTrackingNumber = async (req, res, next) => {
    const {orderId, orderItemId, trackingNumber} = req.body;

    if(!orderId || !orderItemId || !trackingNumber) return res.status(422).json({message: 'Invalid inputs'});

    try {
        const order = await OrderSchema.findById(orderId).lean().exec();

        if(!order) return res.status(404).json({message: 'order not found'});

        const orderItem = order.orderItems.find(item => item._id.toString() === orderItemId.toString());

        if(!orderItem) return res.status(404).json({message: 'no order item found'});

        const newOrderItems = order.orderItems.map(item => {
            if(item._id.toString() === orderItemId.toString()) {
                item.trackingDetails.isTracked = true;
                item.trackingDetails.trackingNumber = trackingNumber;
                item.trackingDetails.date = new Date();

                const alreadyShipped = item.milestones.find(m => m.milestone === 'item_shipped');
                if(alreadyShipped) {
                    item.milestones = item.milestones.map(m => {
                        if(m.milestone === 'item_shipped') {
                            return {...m, date: new Date()}
                        }
                        return m;
                    })
                } else {
                    item.milestones.push({milestone: 'item_shipped', date: new Date()})
                }
                return item;
            }
            return item;
        })

        // update order milestone when update item tracking number
        let orderMilestones = [...order.orderMilestones];

        if(order.orderItems.length === 1 && orderMilestones.find(m => m.milestone === 'shipped')) {
            // only one order item
            orderMilestones = orderMilestones.map(m => {
                if(m.milestone === 'shipped') {
                    return {...m, milestoneDate: new Date()}
                }
                return m;
            })
           
        } else if(order.orderItems.length === 1 && !orderMilestones.find(m => m.milestone === 'shipped')) {
            orderMilestones.push({milestone: 'shipped', milestoneDate: new Date()});

        } else {
            const filteredOrderItems = order.orderItems.filter(item => item._id.toString() !== orderItemId.toString());

            if(filteredOrderItems.every(item => item.trackingDetails.isTracked)) {

                // every item has been tracked, so update the order milestone as shipped
                const shippingMilestone = orderMilestones.find(m => m.milestone === 'partially_shipped');

                if(shippingMilestone) {
                    orderMilestones = orderMilestones.map(m => {
                        if(m.milestone === 'partially_shipped') {
                            return {
                                milestone: 'shipped',
                                milestoneDate: new Date()
                            }
                        }
                        return m;
                    })
                } else {
                    orderMilestones.push({milestone: 'shipped', milestoneDate: new Date()});
                }

            } else {

                const shippingMilestone = orderMilestones.find(m => m.milestone === 'partially_shipped');
                if(shippingMilestone) {
                    orderMilestones = orderMilestones.map(m => {
                        if(m.milestone === 'partially_shipped') {
                            return {...m, milestoneDate: new Date()}
                        }
                    })
                } else {
                    orderMilestones.push({milestone: 'partially_shipped', milestoneDate: new Date()});
                }
            }
        }

        await OrderSchema.findOneAndUpdate({_id: orderId}, {orderItems: newOrderItems, orderMilestones});

        res.status(200).json({message: 'tracking number updated'});

    } catch (err) {
        next(err);
    }
}

// @desc update order handled status
// @route PUT /api/admin/orders/update/handled-status
// @access PRIVATE (ONLY ADMINS)

export const updateHandledStatus = async (req, res, next) => {
    const {orderId, handledStatus} = req.body;

    if(!orderId || !handledStatus) return res.status(422).json({message: 'invalid inputs'});

    try {
        const order = await OrderSchema.findById(orderId).lean().exec();

        if(!order) return res.status(404).json({message: 'order not found'});

        await OrderSchema.findOneAndUpdate({_id: orderId}, {'handledState.state': handledStatus, 'handledState.date': new Date()});

        res.status(200).json({message: 'handled status updated'});
    } catch (err) {
        next(err);
    }
}