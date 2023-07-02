import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export default async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/proshop");
    } catch(err) {
        console.log('Connection error');
        // console.log(err)
    }
}