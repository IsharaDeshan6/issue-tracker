import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true, // Creates an index to prevent duplicate emails
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        profileImage: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

// Mongoose Pre-save hook to hash the password before saving it to the database
UserSchema.pre<IUser>('save', async function () {
    // If the password hasn't been changed (e.g., updating username only), don't re-hash it
    if (!this.isModified('password')) {
        return;
    }

    // Generate a salt with 10 rounds (standard security)
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
});

// Override the toJSON method so that whenever a user document is converted to JSON 
// (e.g. when sending res.json(user)), the password field is completely removed.
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
