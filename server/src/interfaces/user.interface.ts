import {Document} from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}
