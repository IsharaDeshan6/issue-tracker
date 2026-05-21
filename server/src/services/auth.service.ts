import User from "../models/user.model";
import {generateToken} from "../utils/generateToken";
import bcrypt from "bcrypt";


export const registerUserService = async (userData: any) => {
    const existingUser = await User.findOne({email: userData.email});
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    const user = await User.create(userData);

    const token = generateToken(user._id.toString(), user.role);

    return {user, token};
}

export const loginUserService = async (email:string, password:string) => {

    const user  = await User.findOne({email});
    if (!user){
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        throw new Error('Invalid email or password');
    }

    const token  = generateToken(user._id.toString(), user.role);
    return {user, token };

}

