import jwt from 'jsonwebtoken';
import UserSchema from '../model/User.js';

export const auth = async (req, res, next) => {
    const authHeaderVal = req.header("Authorization") || null;

    if(!authHeaderVal) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    const token = authHeaderVal.split(" ")[1];

    if(!token) {
        return res.status(401).json({message: 'Unauthorized'});
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, async (err, decode) => {
        if(err) return res.status(403).json({message: 'Forbidden'});

        const user = await UserSchema.findById(decode._id).select('-password -emailToken').lean().exec();
        req.user = user;
        next();
    });

}

export const isAdmin = (req, res, next) => {

    if(req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized'});
    }
}