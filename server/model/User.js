import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    emailToken: {
        type: String,
    },
    lastEmailVerificationSent: Date,
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    refreshToken: String,
    countryDetails: {
        country: {
            type: String,
            required: true
        },
        isoCode: {
            type: String,
            required: true
        },
        phoneCode: {
            type: String,
            required: true
        },
        state: { 
            name: String,
            isoCode: String
        },
        city: {
            type: String
        }
    },
    city: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    phone: {
        regular: {
            type: String,
            required: true
        },
        international: {
            type: String,
            required: true
        },
    },
    addressDetails: {
        address: {
            type: String,
            required: true
        },
        apartment: {
            type: String
        }
    }
    
}, {
    timestamps: true
})

export default mongoose.model('User', UserSchema);

