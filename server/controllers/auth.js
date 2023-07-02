import UserSchema from '../model/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// @desc REGISTER A NEW USER
// @route POST /api/auth/register
// @access PUBLIC (Customer, Admin)

export const register = async (req, res, next) => {
    const {firstName, lastName, email, password, countryDetails, city, zipCode, phoneNums, addressDetails} = req.body;

    if(!firstName || !lastName || !email || !password || !countryDetails || !countryDetails.country || !countryDetails.isoCode || !countryDetails.phoneCode || !city || !zipCode || !phoneNums.regular || !phoneNums.international || !addressDetails || !addressDetails.address) {
        res.statusCode = 422;
        const error = new Error('Invalid input values, please enter correct details');
        next(error);
        return;
    }

    // checking wether user already exists within the given email
    try {
        const isExist = await UserSchema.findOne({email});
        if(isExist) {
            res.statusCode = 422;
            const error = new Error('User already exist with the email');
            next(error);
            return;
        }

        let user = {
            firstName,
            lastName,
            email,
            password,
            countryDetails,
            city,
            zipCode,
            phone: phoneNums,
            addressDetails
        }

        const salt = await bcryptjs.genSalt(12);
        user.password = await bcryptjs.hash(user.password, salt);

        // send an email to the user
        const emailToken = crypto.randomBytes(64).toString('hex');
        user.emailToken = emailToken;

        user = await UserSchema.create(user);

        // send an email to the user
        const msg = {
            to: user.email,
            from: 'elegantsolvent@gmail.com', // Use the email address or domain you verified above
            templateId: "d-43a47a91ff21417aa85004ca98d6adc2",
            dynamicTemplateData: {
                link: `http://${req.headers.host}/api/auth/email-verification?token=${user.emailToken}`,
                subject: "PROSHOP - Email Verification"
            },
            //text: `PROSHOP - Please verify your email address by copying the link and going to that link - http://${req.headers.host}/api/auth/email-verification?token=${user.emailToken}`,
            // html: `
            //     <strong>Please verify your email address : </strong>
            //     <br>
            //     <a href="http://${req.headers.host}/api/auth/email-verification?token=${user.emailToken}">Verify Email Address</a>
            // `,

        };

        await sgMail.send(msg);

        user.password = undefined;
       
        res.status(201).json({message: 'User Registration Success'});
          
    } catch (err) {
        console.log(err.message);
        res.statusCode = 500;
        next(err);
    }
}

// @desc LOGIN A USER
// @route POST /api/auth/login
// @access PUBLIC (Customer, Admin)

export const login = async (req, res, next) => {
    const {email, password} = req.body;

    if(email.trim() === "" || password.trim() === "") {
        res.statusCode = 422;
        const error = new Error('Both email and password are required');
        next(error);
        return; 
    }

    try {
        let user = await UserSchema.findOne({email}).exec();
        if(!user) {
            res.statusCode = 401;
            const error = new Error('User not found login failed');
            next(error);
            return;
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch) {
            res.statusCode = 401;
            const error = new Error('User not found login failed');
            next(error);
            return;
        }

        

        // sign jwt token
        const accessToken = jwt.sign({_id: user._id, isAdmin: user.isAdmin}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
        const refreshToken = jwt.sign({_id: user._id, isAdmin: user.isAdmin}, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn: '1d'});

        res.cookie('jwt', refreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});

        user.refreshToken = refreshToken;
        await user.save();

        // set founded user's password to NULL
        user.password = undefined;

        res.status(200).json({
            accessToken, 
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                isEmailVerified: user.isEmailVerified,
                countryInfo: user.countryDetails,
                city: user.city,
                zipCode: user.zipCode,
                phone: user.phone,
                address: user.addressDetails
            }
        });

    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}

// @desc GET A NEW ACCESS TOKEN
// @route GET /api/auth/refresh
// @access PUBLIC (Customer, Admin)

export const refresh = async (req, res, next) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const token = cookies.jwt;

    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decode) => {
        if(err) return res.status(403).json({message: 'Forbidden'});

        try {
            const user = await UserSchema.findById(decode._id).select('-password').lean().exec();
            if(!user) return res.status(403).json({message: 'Forbidden'});

            const accessToken = jwt.sign({_id: decode._id, isAdmin: decode.isAdmin}, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '5m'});
            res.status(200).json({
                message: 'Access token updated', 
                accessToken,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    isEmailVerified: user.isEmailVerified,
                    countryInfo: user.countryDetails,
                    city: user.city,
                    zipCode: user.zipCode,
                    phone: user.phone,
                    address: user.addressDetails
                }
            });

        } catch (err) {
            next(err);
        }

        
    })
}


// @desc LOGOUT USER
// @route GET /api/auth/logout
// @access PUBLIC (Customer, Admin)

export const logout = async (req, res, next) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.status(204).json({message: 'Logout success'});

    // if cookie exists, then clear the cookie
    res.clearCookie('jwt', {httpOnly: true, secure: true, sameSite: 'None'});
    res.status(200).json({message: 'Logout Success'});
}


export const getCurrentAuthUser = (req, res, next) => {
    res.status(200).json({user: {
        _id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        isEmailVerified: req.user.isEmailVerified,
        countryInfo: req.user.countryInfo,
        zipCode: req.user.zipCode,
        phone: req.user.phone,
        address: req.user.address
    }});
}

export const updateUserEmailVerificationStatus = async (req, res, next) => {
    const {token} = req.query;

    try {
        let user = await UserSchema.findOne({emailToken: token});

        if(!user) {
            const error = new Error('User Not Found');
            res.statusCode = 404;
            return next(error);
        }

        user.isEmailVerified = true;
        await user.save();
        res.redirect('http://localhost:3000/my-profile?email_verified=true');

    } catch (err) {
        next(err)
    }
}