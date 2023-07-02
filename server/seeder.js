import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import UserSchema from './model/User.js';
import ProductSchema from './model/Product.js';
import OrderSchema from './model/Order.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_PRODUCTION_URI)
    .then(conn => console.log('connected to db'))
    .catch(err => process.exit(1));

async function importData() {
    try {
        await OrderSchema.deleteMany();
        await UserSchema.deleteMany();
        await ProductSchema.deleteMany();

        const insertedUsers = await UserSchema.insertMany(users);
        const adminId = insertedUsers[0]._id;

        const sampleProducts = products.map(p => {
            return {
                ...p,
                user: adminId
            }
        })

        await ProductSchema.insertMany(sampleProducts);
        console.log('IMPORTED SUCCESFULLY!');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

async function destroyData() {
    try {
        await OrderSchema.deleteMany();
        await UserSchema.deleteMany();
        await ProductSchema.deleteMany();

        console.log('DESTROYED SUCCESFULLY!');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

if(process.argv[2] == '-d') {
    destroyData();
} else {
    importData();
}