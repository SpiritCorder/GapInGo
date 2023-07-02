import UserSchema from '../model/User.js';
import bcryptjs from 'bcryptjs';

export const getUserProfile = async (req, res, next) => {

    try {
        const user = await UserSchema.findById(req.user._id).select(['_id', 'name', 'email', 'isAdmin', 'isEmailVerified']);
        res.status(200).json(user);
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}

export const updateUserProfile = async (req, res, next) => {

    try {
        const user = await UserSchema.findById(req.user._id);

        user.name = req.body.name ? req.body.name : user.name;
        user.email = req.body.email ? req.body.email : user.email;

        if(req.body.password) {
            // user wants to update the password
            const salt = await bcryptjs.genSalt(12);
            user.password = await bcryptjs.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        updatedUser.password = null;
        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } catch (err) {
        res.statusCode = 500;
        next(err);
    }
}