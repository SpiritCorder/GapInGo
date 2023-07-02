import UserSchema from '../../model/User.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserSchema.find().select('-password -emailToken -refreshToken').lean().exec();
        res.status(200).json({message: 'success', users});
    } catch (err) {
        next(err);
    }
}

export const getSingleUser = async (req, res, next) => {
    const {id} = req.params;

    try {
        const user = await UserSchema.findById(id).select(['_id', 'name', 'email', 'isAdmin']);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req, res, next) => {
    const {id} = req.params;

    try {
        const user = await UserSchema.findById(id);
        if(!user) {
            res.statusCode = 404;
            const error = new Error('User not found delete failed');
            next(error);
            return;
        }

        await user.remove();
        res.status(200).json('User removed successfully');
    } catch (err) {
        next(err);
    }
}

// /api/admin/users/:id/admin?admin= PUT
export const updateUserToAdmin = async (req, res, next) => {
    const {id} = req.params;
    const {admin} = req.query;

    try {
        const user = await UserSchema.findById(id);
        if(!user) {
            res.statusCode = 404;
            const error = new Error('User not found update failed');
            next(error);
            return;
        }

        user.isAdmin = admin === 'true' ? true : false;
        const updatedUser = await user.save();
        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } catch (err) {
        next(err);
    }
}