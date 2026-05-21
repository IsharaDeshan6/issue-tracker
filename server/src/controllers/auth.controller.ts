import {loginUserService, registerUserService} from "../services/auth.service";
import {Request, Response} from 'express';
import {AuthRequest} from "../middleware/auth.middleware";

export const registerUser = async (req: Request, res: Response): Promise<void> => {

    try {
        const {user, token} = await registerUserService(req.body);
        res.status(201).json({user, token});

    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const {user, token} = await loginUserService(email, password);

        res.status(200).json({user, token});

    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    res.status(200).json({ user: req.user });
}

