import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    variations: {
            name: {type: String},
            values: [
                {
                    val: {type: String},
                    qty: {type: Number},
                    price: {type: Number},
                    discount: {type: Number},
                    image: {type: Object}
                }
            ]
    }
    ,
    condition: {
        type: String,
        required: true,
        enum: ['Brand New', 'Open Box', 'Already Used']
    },
    recommendedSpecifications: {
        material: {type: String},
        brand: {type: String},
        country: {type: String},
        color: {type: String},
        itemType: {type: String}
    },
    customSpecifications: [
        {name: {type: String} , value: {type: String}}
    ],
    aboutDescription: {type: String},
    regularPrice: {type: Number, min: 0.00},
    regularQuantity: {type: Number, min: 0},
    discount: {type: Number, min: 0},
    images: {
        type: Array,
        default: []
    },
    detailedDescription: {
        type: String,
    },
    videoUrl: {type: String},
    shippingCountries: [
        {
            name: String,
            isoCode: String
        }
    ],
    countryShippingDetails: [
        {
            countryName: String,
            isoCode: String,
            shippingMethods: [
                {
                    id: String,
                    method: String,
                    isFreeShipping: Boolean,
                    shippingPrice: Number,
                    additionalShippingPrice: Number
                }
            ],
            tax: Number,
            vat: Number
        }
    ],
    handlingTime: {
        type: String,
        required: true
    },
    itemLocation: {
        country: {
            type: String,
            required: true
        },
        state: String
    },
    returns: {
        type: {
            type: String,
            required: true
        },
        returnShippingCostPaidBy: String
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]
}, {
    timestamps: true
});

export default mongoose.model('Product', ProductSchema);