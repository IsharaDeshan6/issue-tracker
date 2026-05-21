import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
    // 1. Define the Payload (what data we embed inside the token)
    const payload = { id: userId, role };

    // 2. Sign the token using our secret key, and set it to expire in 1 day
    // The exclamation mark tells TypeScript we guarantee JWT_SECRET exists in our environment
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1d',
    });
};
