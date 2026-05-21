import {NextFunction, Request, Response} from "express";
import {IUser} from "../interfaces/user.interface";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as { id: string; role: string };

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                res.status(401).json({message: 'Not authorized, user not found'});
                return;
            }

            req.user = user;

            next();

        } catch (error) {
            console.error('Auth Middleware error', error);
            res.status(401).json({message: 'Not authorized, token failed or expired'});
            return;
        }
    }

    if (!token) {
        res.status(401).json({message: 'Not authorized, no token provided'});
        return;
    }

}
