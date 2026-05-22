import {loginUserService, registerUserService} from "../services/auth.service";
import {Request, Response} from 'express';
import {AuthRequest} from "../middleware/auth.middleware";
import {asyncHandler} from "../utils/asyncHandler";

export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const {user, token} = await registerUserService(req.body);
    res.status(201).json({user, token});
});


export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const email = req.body.email;
    const password = req.body.password;

    const {user, token} = await loginUserService(email, password);

    res.status(200).json({user, token});

});

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    res.status(200).json({user: req.user});
}

