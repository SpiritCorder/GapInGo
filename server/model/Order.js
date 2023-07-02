import mongoose from 'mongoose';
import Increment from 'mongoose-sequence';

const AutoIncrement = Increment(mongoose);

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            productInfo: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                title: {type: String, required: true},
                unitPrice: {type: Number, required: true},
                hasVariation: {type: Boolean, required: true},
                variationId: String,
                image: String,
                description: String
            },
            totalPrice: {
                type: Number,
                required: true
            },
            qty: {
                type: Number,
                required: true,
                min: 1
            },
            shippingInfo: {
                method: {type: String, required: true},
                isFreeShipping: {type: Boolean, required: true},
                shippingPrice: Number,
                additionalShippingPrice: Number
            },
            returnsInfo: {
                isAccepted: {type: Boolean, required: true},
                maxDaysAccept: Number,
                shippingCostPaidBy: String
            },
            handlingTime: String,
            milestones: [
                {
                    milestone: {
                        type: String,
                        enum: ['item_payment_pending', 'item_paid', 'item_shipped', 'item_delivered']
                    },
                    date: Date
                }
            ],
            trackingDetails: {
                isTracked: {
                    type: Boolean,
                    default: false
                },
                trackingNumber: String,
                date: Date
            }
        }
    ],
    shippingDetails: {
        address: {
            country: {type: String, required: true},
            city: {type: String, required: true},
            state: String,
            addressLine1: {type: String, required: true},
            addressLine2: String,
            postalCode: {type: String, required: true}
        },
        name: String
    },
    billingDetails: {
        address: {
            country: {type: String, required: true},
            city: {type: String, required: true},
            state: String,
            addressLine1: {type: String, required: true},
            addressLine2: String,
            postalCode: {type: String, required: true}
        },
        email: String,
        name: String
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['paypal', 'stripe']
    },
    paymentDetails: {
        sessionId: {type: String, required: true},
        paymentIntentId: {type: String, required: true},
        isPaid: {type: Boolean, required: true},
        paidStatus: {
            type: String,
            enum: ['paid', 'awaiting_payment'],
            required: true
        },
        paidAt: {
            type: Date
        },
        paymentMethodTypes: [String]
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingCost: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true
    },
    orderMilestones: [
        {
            milestone: {
                type: String,
                enum: ['order_placed', 'order_payment_pending', 'order_paid', 'partially_shipped', 'shipped', 'partially_delivered', 'delivered']
            },
            milestoneDate: Date
        }
    ],
    cancellationDetails: {
        isCanceled: {
            type: Boolean,
            default: false
        },
        canceledDate: {
            type: Date
        }
    },
    refundDetails: {
        isRefunded: {
            type: Boolean,
            default: false
        },
        refundedType: {
            type: String,
            enum: ['full', 'partial']
        },
        refundedAmount: Number,
        refundedStatus: {
            type: String,
            enum: ['successful', 'pending']
        }
    },
    handledState: {
        state: {
            type: String,
            enum: ['unhandled', 'handled', 'completed'],
            default: 'unhandled'
        },
        date: {
            type: Date,
            default: new Date()
        }
    },
    isWatchListed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// PLUGIN AUTO INCREMENTOR
OrderSchema.plugin(AutoIncrement, {
    inc_field: 'orderId',
    id: 'OrderIds',
    start_seq: 200
})

export default mongoose.model('Order', OrderSchema);