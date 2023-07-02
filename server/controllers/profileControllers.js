import UserSchema from '../model/User.js';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const getProfile = async (req, res, next) => {
    try {
        const profile = await UserSchema.findById(req.user._id).select('-password -emailToken -refreshToken').lean().exec();
        if(!profile) return res.status(404).json({message: 'Profile not found'});
        res.status(200).json({message: 'Success', profile});
    } catch (err) {
        next(err);
    }
}

export const updateProfile = async (req, res, next) => {
    const {firstName, lastName, email, countryDetails, city, zipCode, addressDetails, phoneNums} = req.body;

    if(!firstName || !lastName || !email || !countryDetails || !countryDetails.country || !countryDetails.isoCode || !countryDetails.phoneCode || !city || !zipCode || !phoneNums.regular || !phoneNums.international || !addressDetails || !addressDetails.address) {
        res.statusCode = 422;
        const error = new Error('Invalid input values, please provide values for required fields');
        next(error);
        return;
    }

    try {
        const user = await UserSchema.findById(req.user._id).exec();

        if(!user) return res.status(404).json({message: 'Profile not found'});

        // CHECK WHETHER THE USER IS TRYING TO UPDATE THEIR EMAIL TO A NEW EMAIL
        if(email.trim() !== user.email) {
            // USER IS TRYING TO UPDATE THEIR EMAIL TO A NEW ONE
            const duplicate = await UserSchema.findOne({email}).lean().exec();
            if(duplicate) return res.status(422).json({message: 'Email is already taken'});
        }

        const newUser = {
            firstName,
            lastName,
            email,
            countryDetails,
            city,
            zipCode,
            phone: phoneNums,
            addressDetails
        }

        // CHECK FOR PASSWORD UPDATE
        if(req.body.password.trim()) {
            const salt = await bcrypt.genSalt(12);
            newUser.password = await bcrypt.hash(req.body.password, salt);
        }

        // CHECK WHETHER THE USER IS TRYING TO UPDATE THEIR EMAIL TO A NEW EMAIL
        let isEmailUpdated = false;
        if(email.trim() !== user.email) {
            newUser.email = email;
            newUser.isEmailVerified = false;
            const emailToken = crypto.randomBytes(64).toString('hex');
            newUser.emailToken = emailToken;
            newUser.lastEmailVerificationSent = new Date();
            
            const msg = {
                to: email,
                from: 'elegantsolvent@gmail.com', // Use the email address or domain you verified above
                templateId: "d-43a47a91ff21417aa85004ca98d6adc2",
                dynamicTemplateData: {
                    link: `http://${req.headers.host}/api/auth/email-verification?token=${emailToken}`,
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
            isEmailUpdated = true;
        }

        await UserSchema.findByIdAndUpdate(user._id, newUser);

        res.status(200).json({message: 'Profile updated', isEmailUpdated})

    } catch (err) {
        next(err);
    }
}

export const resendEmailVerification = async (req, res, next) => {
    const authUser = req.user;

    // SEND THE EMAIL VERIFICATION TO THE USER
    try {
        const user = await UserSchema.findById(authUser._id);

        if(user.isEmailVerified) {
            return res.status(422).json({message: 'Email address already verified'});
        }

        const emailToken = crypto.randomBytes(64).toString('hex');
        user.emailToken = emailToken;
        user.lastEmailVerificationSent = new Date();

        await user.save();
        
        const msg = {
            to: authUser.email,
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
        res.status(200).json({message: 'Email verification resent successfully'});
    } catch (err) {
        next(err);
    }
}