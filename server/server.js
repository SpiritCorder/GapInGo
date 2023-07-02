import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';

import {pageNotFound, errorHandler} from './middleware/error.js';

import productRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import checkoutRoutes from './routes/checkout.js';
import profileRoutes from './routes/profile.js';

import adminOrderRoutes from './routes/admin/orders.js';
import adminUserRoutes from './routes/admin/users.js';
import adminProductRoutes from './routes/admin/products.js';

dotenv.config();

// connectDB();
mongoose.connect("mongodb://127.0.0.1:27017/proshop")
    .then(conn => console.log('Connected to mongodb'))
    .catch(() => console.log('db connection error'))

const app = express();

// log request data using morgan
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cookieParser());

// setting cors headers
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT']);
//     res.setHeader('Access-Control-Allow-Headers', ['Content-Type', 'Authorization']);

//     next();
// });

// body parser middleware
app.use((req, res, next) => {
    if(req.url == '/api/checkout/payment-success-webhook') {
        next();
    } else {
        express.json({limit: '50mb'})(req, res, next)
    }
});
// app.use(express.json({limit: '50mb'}));



// api routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/profile', profileRoutes);

// admin routes
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/products', adminProductRoutes);

// config route to get paypal client id
app.get('/api/config/paypal', (req, res, next) => res.json(process.env.PAYPAL_CLIENT_ID));


const dirname = path.resolve();


// set react app build folder as a static folder in production
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(dirname, 'client/build')));

    app.get('*', (req, res, next) => res.sendFile(path.resolve(dirname, 'client', 'build', 'index.html')));
}


// page not found middleware
app.use(pageNotFound);

// error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server is running'));

// // check the DB connection success
// mongoose.connection.once('open', () => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`SERVER IS RUNNING IN ${process.env.NODE_ENV} ON PORT ${PORT}`));
// })

// // check the DB connection failure
// mongoose.connection.on('error', err => {
//     console.log(err);
// })



